"""Controlled synthetic comparisons and scale-specific interaction contrasts."""

from dataclasses import replace

import numpy as np

from .model import Parameters, Protocol, Result, Segment, Signal, simulate


def pulse(start: float = 2, end: float = 22, level: float = 1) -> Signal:
    return Signal(segments=(Segment(start, end, level),))


def preset(name: str) -> Parameters:
    if name == "coincidence":
        return Parameters()
    if name == "transactivation":
        return Parameters(
            cooperation=0, transactivation=1.5, direct_a=0.02, direct_b=0.8,
        )
    if name == "competition":
        return Parameters(
            cooperation=0, shared_pool=True, direct_a=0.12, direct_b=0.8,
        )
    if name == "independent":
        return Parameters(cooperation=0)
    raise ValueError(f"unknown preset: {name}")


def factorial(
    p: Parameters, switch_level: float = 1, duration: float = 40,
    dt: float = 0.05, stimulus: Signal | None = None,
) -> dict[str, Result]:
    stimulus = stimulus or pulse(end=min(22, duration * 0.7))
    off = Signal()
    return {
        label: simulate(
            p, Protocol(stimulus if a else off, stimulus if b else off,
                        Signal(baseline=switch_level)),
            duration=duration, dt=dt,
        )
        for label, a, b in (("none", False, False), ("A", True, False),
                            ("B", False, True), ("AB", True, True))
    }


def interaction(results: dict[str, Result], readout: str = "effector_free") -> np.ndarray:
    if set(results) != {"none", "A", "B", "AB"}:
        raise ValueError("factorial results require none, A, B, AB")
    reference = results["AB"].t
    if any(not np.array_equal(r.t, reference) for r in results.values()):
        raise ValueError("factorial trajectories must have identical time grids")
    return results["AB"][readout] - results["A"][readout] - results["B"][readout] + results["none"][readout]


def contrast_summary(opened: dict[str, Result], closed: dict[str, Result]) -> dict[str, float]:
    t = opened["AB"].t
    if not np.array_equal(t, closed["AB"].t):
        raise ValueError("open/closed comparisons require identical time grids")
    out = {}
    for readout in ("effector_free", "reporter"):
        io, ic = interaction(opened, readout), interaction(closed, readout)
        out[f"{readout}_interaction_auc_open"] = float(np.trapezoid(io, t))
        out[f"{readout}_interaction_auc_closed"] = float(np.trapezoid(ic, t))
        out[f"{readout}_delta_interaction_auc"] = float(np.trapezoid(io - ic, t))
        for label in ("A", "B"):
            out[f"{readout}_{label}_auc_difference"] = float(
                np.trapezoid(opened[label][readout] - closed[label][readout], t)
            )
    return out


def gate_sweep(
    p: Parameters, size: int = 7, duration: float = 30, dt: float = 0.15,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """A conditional two-parameter sweep, not a confidence interval."""
    if not isinstance(size, int) or not 2 <= size <= 40:
        raise ValueError("sweep size must be an integer between 2 and 40")
    leaks = np.linspace(0, 0.5, size)
    closing = np.geomspace(0.05, 10, size)
    a = b = pulse(2, 24)
    reference = simulate(p, Protocol(a, b), duration, dt)
    mask = (reference.t >= 10) & (reference.t <= 20)
    ref_auc = np.trapezoid(reference["effector_free"][mask], reference.t[mask])
    values = np.empty((size, size))
    for i, tau in enumerate(closing):
        for j, leak in enumerate(leaks):
            pp = replace(p, gate_leak=float(leak), switch_tau_close=float(tau))
            gated = simulate(
                pp, Protocol(a, b, Signal(1, (Segment(10, 20, 0),))), duration, dt,
            )
            auc = np.trapezoid(gated["effector_free"][mask], gated.t[mask])
            values[i, j] = 100 * (1 - auc / ref_auc) if ref_auc > 0 else np.nan
    return leaks, closing, values
