"""A bounded ODE model with explicit interventions and measurement dynamics.

All rate constants are illustrative. Time is in minutes; activities are
dimensionless. See docs/MODEL.md for equations, assumptions, and limitations.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, fields
from typing import Any

import numpy as np
from scipy.integrate import solve_ivp

STATES = (
    "receptor_a",
    "receptor_b",
    "branch_a",
    "branch_b",
    "switch_open",
    "effector_free",
    "sensor_bound",
    "feedback",
    "memory",
    "reporter",
    "recorder",
)
INDEX = {name: i for i, name in enumerate(STATES)}


def _finite(name: str, value: float, lo: float = 0, hi: float | None = None) -> None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be a finite number")
    if not np.isfinite(value) or value < lo or (hi is not None and value > hi):
        raise ValueError(f"{name} must be finite and in [{lo}, {hi or 'infinity'}]")


@dataclass(frozen=True)
class Segment:
    start: float
    end: float
    level: float

    def __post_init__(self) -> None:
        _finite("start", self.start)
        _finite("end", self.end)
        _finite("level", self.level, 0, 1)
        if self.end <= self.start:
            raise ValueError("segment end must be greater than start")


@dataclass(frozen=True)
class Signal:
    """Piecewise-constant levels; segments override baseline on [start, end)."""

    baseline: float = 0.0
    segments: tuple[Segment, ...] = ()

    def __post_init__(self) -> None:
        _finite("baseline", self.baseline, 0, 1)
        segments = tuple(sorted(self.segments, key=lambda x: x.start))
        if any(b.start < a.end for a, b in zip(segments, segments[1:])):
            raise ValueError("signal segments may touch but must not overlap")
        object.__setattr__(self, "segments", segments)

    def __call__(self, t: float) -> float:
        for segment in self.segments:
            if segment.start <= t < segment.end:
                return segment.level
        return self.baseline

    @property
    def boundaries(self) -> tuple[float, ...]:
        return tuple(v for s in self.segments for v in (s.start, s.end))

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Signal:
        unknown = set(data) - {"baseline", "segments"}
        if unknown:
            raise ValueError(f"unknown signal fields: {sorted(unknown)}")
        return cls(
            baseline=data.get("baseline", 0),
            segments=tuple(Segment(**s) for s in data.get("segments", [])),
        )


@dataclass(frozen=True)
class Protocol:
    a: Signal = Signal()
    b: Signal = Signal()
    switch: Signal = Signal(baseline=1)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Protocol:
        unknown = set(data) - {"a", "b", "switch"}
        if unknown:
            raise ValueError(f"unknown protocol fields: {sorted(unknown)}")
        return cls(
            a=Signal.from_dict(data.get("a", {})),
            b=Signal.from_dict(data.get("b", {})),
            switch=Signal.from_dict(data.get("switch", {"baseline": 1})),
        )


@dataclass(frozen=True)
class Parameters:
    receptor_a_on: float = 1.2
    receptor_a_off: float = 0.6
    receptor_b_on: float = 1.0
    receptor_b_off: float = 0.5
    branch_a_on: float = 2.0
    branch_a_off: float = 0.9
    branch_b_on: float = 1.5
    branch_b_off: float = 0.7
    direct_a: float = 0.12
    direct_b: float = 0.12
    cooperation: float = 3.0
    transactivation: float = 0.0
    shared_pool: bool = False
    pool_a_basal: float = 0.0
    transactivation_via_memory: bool = False
    gate_mode: str = "edge"
    gate_leak: float = 0.02
    switch_tau_open: float = 0.3
    switch_tau_close: float = 0.3
    effector_basal: float = 0.0
    effector_off: float = 0.7
    feedback_gain: float = 0.8
    feedback_tau: float = 4.0
    memory_on: float = 0.0
    memory_tau: float = 8.0
    memory_gain: float = 0.0
    priming_gain: float = 0.0
    memory_inhibition: float = 0.0
    live_inhibition: float = 0.0
    sensor_total: float = 0.0
    sensor_on: float = 3.0
    sensor_off: float = 1.0
    sensor_bound_deactivation: float = 0.7
    reporter_tau: float = 0.7
    recorder_on: float = 0.08

    def __post_init__(self) -> None:
        for name in ("shared_pool", "transactivation_via_memory"):
            if not isinstance(getattr(self, name), bool):
                raise ValueError(f"{name} must be a boolean")
        if self.gate_mode not in {"edge", "hub", "allocation", "none"}:
            raise ValueError("gate_mode must be edge, hub, allocation, or none")
        for field in fields(self):
            if field.name not in {"shared_pool", "transactivation_via_memory", "gate_mode"}:
                _finite(field.name, getattr(self, field.name))
        if self.gate_leak > 1:
            raise ValueError("gate_leak must be in [0, 1]")
        for name in (
            "switch_tau_open", "switch_tau_close", "feedback_tau",
            "memory_tau", "reporter_tau",
        ):
            if getattr(self, name) <= 0:
                raise ValueError(f"{name} must be positive")

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Parameters:
        unknown = set(data) - {field.name for field in fields(cls)}
        if unknown:
            raise ValueError(f"unknown parameter fields: {sorted(unknown)}")
        return cls(**data)


def rhs(
    _t: float,
    state: np.ndarray,
    p: Parameters,
    input_a: float,
    input_b: float,
    switch_target: float,
) -> np.ndarray:
    a, b, x, z, s, e, c, f, m, y, h = state
    gate = p.gate_leak + (1 - p.gate_leak) * s
    edge = gate if p.gate_mode == "edge" else 1.0
    hub = gate if p.gate_mode == "hub" else 1.0
    allocation = gate if p.gate_mode == "allocation" else 1.0
    trans = p.transactivation * edge * (m if p.transactivation_via_memory else a)
    available_a = 1 - x - z if p.shared_pool else 1 - x
    available_b = 1 - x - z if p.shared_pool else 1 - z
    xa, zb = (x * a, z * b) if p.shared_pool else (x, z)
    drive = (
        p.effector_basal + p.direct_a * xa
        + p.direct_b * zb * (1 + p.priming_gain * edge * m)
        / (1 + p.memory_inhibition * edge * m + p.live_inhibition * edge * xa)
        + p.cooperation * edge * xa * zb * (1 + p.memory_gain * m)
    ) / (1 + p.feedback_gain * f)
    binding = p.sensor_on * (p.sensor_total - c) * e
    unbinding = p.sensor_off * c
    tau = p.switch_tau_open if switch_target >= s else p.switch_tau_close
    return np.array([
        p.receptor_a_on * input_a * (1 - a) - p.receptor_a_off * a,
        (p.receptor_b_on * input_b + trans) * (1 - b) - p.receptor_b_off * b,
        allocation * (p.branch_a_on * a + p.pool_a_basal) * available_a - p.branch_a_off * x,
        p.branch_b_on * b * available_b - p.branch_b_off * z,
        (switch_target - s) / tau,
        hub * drive * (1 - e - c) - p.effector_off * e - binding + unbinding,
        binding - unbinding - p.sensor_bound_deactivation * c,
        (e - f) / p.feedback_tau,
        p.memory_on * xa * (1 - m) - m / p.memory_tau,
        (e - y) / p.reporter_tau,
        p.recorder_on * e * (1 - h),
    ])


@dataclass
class Result:
    t: np.ndarray
    values: np.ndarray
    parameters: Parameters
    protocol: Protocol
    solver: dict[str, Any]

    def __getitem__(self, name: str) -> np.ndarray:
        return self.values[:, INDEX[name]]

    def matrix(self) -> tuple[list[str], np.ndarray]:
        inputs = np.array([
            [self.protocol.a(t), self.protocol.b(t), self.protocol.switch(t)]
            for t in self.t
        ])
        gate = self.parameters.gate_leak + (
            1 - self.parameters.gate_leak
        ) * self["switch_open"]
        return (
            ["time_min", *STATES, "input_a", "input_b", "switch_target", "gate"],
            np.column_stack([self.t, self.values, inputs, gate]),
        )

    def summary(self) -> dict[str, float]:
        out = {}
        for name in ("effector_free", "reporter", "recorder", "branch_a", "branch_b"):
            values = self[name]
            out[f"{name}_auc"] = float(np.trapezoid(values, self.t))
            out[f"{name}_peak"] = float(values.max())
            out[f"{name}_final"] = float(values[-1])
        return out

    def metadata(self) -> dict[str, Any]:
        return {
            "parameters": asdict(self.parameters),
            "protocol": asdict(self.protocol),
            "duration_min": float(self.t[-1]),
            "solver": self.solver,
            "summary": self.summary(),
            "warning": "Synthetic illustrative forward simulation; not fitted or biologically validated.",
        }


def validate_state(state: np.ndarray, p: Parameters, tolerance: float = 1e-7) -> None:
    state = np.asarray(state)
    if state.shape[-1] != len(STATES) or not np.isfinite(state).all():
        raise ValueError(f"state must contain {len(STATES)} finite components")
    if np.min(state) < -tolerance:
        raise ValueError("negative state outside numerical tolerance")
    if np.max(state) > 1 + tolerance:
        raise ValueError("state exceeds unit capacity")
    if np.any(state[..., INDEX["sensor_bound"]] > p.sensor_total + tolerance):
        raise ValueError("bound sensor exceeds total sensor")
    if np.any(
        state[..., INDEX["effector_free"]] + state[..., INDEX["sensor_bound"]]
        > 1 + tolerance
    ):
        raise ValueError("effector mass balance exceeds total capacity")
    if p.shared_pool and np.any(
        state[..., INDEX["branch_a"]] + state[..., INDEX["branch_b"]] > 1 + tolerance
    ):
        raise ValueError("shared transducer allocation exceeds pool capacity")


def simulate(
    parameters: Parameters | None = None,
    protocol: Protocol | None = None,
    duration: float = 40.0,
    dt: float = 0.05,
    initial: np.ndarray | None = None,
    rtol: float = 1e-8,
    atol: float = 1e-10,
    max_step: float = 0.25,
) -> Result:
    """Integrate separately at every input discontinuity; never clip states."""
    p = parameters or Parameters()
    protocol = protocol or Protocol()
    for name, value in (
        ("duration", duration), ("dt", dt), ("rtol", rtol),
        ("atol", atol), ("max_step", max_step),
    ):
        _finite(name, value)
        if value <= 0:
            raise ValueError(f"{name} must be positive")
    if duration / dt > 1_000_000:
        raise ValueError("requested output exceeds one million time steps")
    t = np.arange(0, duration, dt)
    if len(t) and np.isclose(t[-1], duration, rtol=0, atol=1e-12):
        t[-1] = duration
    else:
        t = np.append(t, duration)
    y = np.zeros(len(STATES)) if initial is None else np.array(initial, dtype=float)
    if initial is None:
        y[INDEX["switch_open"]] = protocol.switch(0)
    if y.shape != (len(STATES),):
        raise ValueError(f"initial state must have shape ({len(STATES)},)")
    validate_state(y, p)
    output = np.empty((len(t), len(STATES)))
    output[0] = y
    boundaries = sorted({
        0.0, duration,
        *(v for signal in (protocol.a, protocol.b, protocol.switch)
          for v in signal.boundaries if 0 < v < duration),
    })
    evaluations = 0
    for left, right in zip(boundaries, boundaries[1:]):
        midpoint = (left + right) / 2
        inputs = (protocol.a(midpoint), protocol.b(midpoint), protocol.switch(midpoint))
        solution = solve_ivp(
            rhs, (left, right), y, args=(p, *inputs),
            method="DOP853", rtol=rtol, atol=atol,
            dense_output=True, max_step=min(max_step, right - left),
        )
        if not solution.success:
            raise RuntimeError(f"ODE solver failed: {solution.message}")
        mask = (t > left) & (t <= right)
        output[mask] = solution.sol(t[mask]).T
        y = solution.y[:, -1]
        evaluations += solution.nfev
    validate_state(output, p, tolerance=max(1e-7, 20 * atol))
    return Result(
        t, output, p, protocol,
        {"method": "DOP853", "rtol": rtol, "atol": atol,
         "max_step": max_step, "output_dt": dt, "rhs_evaluations": evaluations,
         "input_segments": len(boundaries) - 1},
    )
