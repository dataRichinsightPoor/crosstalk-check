from dataclasses import replace
import json
from pathlib import Path

import numpy as np
import pytest

from crosstalk.model import INDEX, STATES, Parameters, Protocol, Segment, Signal, simulate, validate_state
from crosstalk.experiments import factorial, interaction, pulse
from crosstalk.cli import load_config


@pytest.mark.parametrize("kwargs", [
    {"gate_leak": 1.1}, {"feedback_tau": 0}, {"cooperation": -1},
    {"shared_pool": 1}, {"transactivation_via_memory": 1},
    {"direct_a": float("nan")}, {"gate_mode": "unknown"},
])
def test_invalid_parameters(kwargs):
    with pytest.raises(ValueError):
        Parameters(**kwargs)


def test_signal_boundaries():
    s = Signal(.1, (Segment(2, 4, .7), Segment(4, 5, .5)))
    assert s(1.9) == .1 and s(2) == .7 and s(4) == .5 and s(5) == .1
    with pytest.raises(ValueError):
        Signal(0, (Segment(1, 4, 1), Segment(3, 5, 0)))


def test_unknown_fields_rejected():
    with pytest.raises(ValueError):
        Parameters.from_dict({"cooperaton": 3})
    with pytest.raises(ValueError):
        Protocol.from_dict({"unknown": {}})


def test_no_stimulus_no_signal():
    r = simulate(duration=5)
    assert np.max(np.abs(r.values[:, [i for i in range(11) if i != 4]])) == 0


def test_receptor_matches_analytic_solution():
    p = Parameters()
    r = simulate(p, Protocol(a=Signal(1)), duration=8, dt=.1)
    expected = p.receptor_a_on / (p.receptor_a_on + p.receptor_a_off) * (
        1 - np.exp(-(p.receptor_a_on + p.receptor_a_off) * r.t))
    np.testing.assert_allclose(r["receptor_a"], expected, atol=1e-8)


def test_switch_matches_exponential():
    p = Parameters(switch_tau_close=2)
    y0 = np.zeros(11)
    y0[4] = 1
    r = simulate(p, Protocol(switch=Signal(0)), duration=8, initial=y0)
    np.testing.assert_allclose(r["switch_open"], np.exp(-r.t / 2), atol=1e-9)


def test_short_pulse_not_missed():
    r = simulate(protocol=Protocol(a=Signal(0, (Segment(1, 1.01, 1),))), duration=2, dt=.01, max_step=1)
    assert r["receptor_a"].max() > .01


def test_output_includes_final_non_grid_time():
    r = simulate(duration=1.03, dt=.1)
    assert r.t[-1] == 1.03 and np.all(np.diff(r.t) > 0)


def test_rejects_invalid_initial_state():
    y = np.zeros(11)
    y[5:7] = [.8, .8]
    with pytest.raises(ValueError):
        simulate(Parameters(sensor_total=1), initial=y)


@pytest.mark.parametrize("pool", [False, True])
@pytest.mark.parametrize("sensor", [0, .5, 3])
def test_capacity_invariants(pool, sensor):
    p = Parameters(shared_pool=pool, sensor_total=sensor, pool_a_basal=.2)
    r = simulate(p, Protocol(pulse(), pulse()), duration=35)
    validate_state(r.values, p)
    assert np.all(np.diff(r["recorder"]) >= -1e-10)


def test_edge_gate_preserves_independent_responses():
    p = Parameters(gate_leak=0)
    opened, closed = factorial(p, 1, duration=15, dt=.2), factorial(p, 0, duration=15, dt=.2)
    for label in ("A", "B"):
        np.testing.assert_allclose(opened[label]["effector_free"], closed[label]["effector_free"], atol=1e-8)
    assert np.trapezoid(interaction(opened), opened["AB"].t) > np.trapezoid(interaction(closed), closed["AB"].t)
    np.testing.assert_allclose(opened["AB"]["branch_a"], closed["AB"]["branch_a"], atol=1e-8)


def test_hub_gate_reduces_single_input():
    p = Parameters(gate_mode="hub", gate_leak=0)
    opened, closed = factorial(p, 1, duration=12), factorial(p, 0, duration=12)
    assert opened["A"]["effector_free"].max() > .01
    assert closed["A"]["effector_free"].max() < 1e-12


def test_saturating_output_can_have_interaction_without_connection():
    r = factorial(Parameters(cooperation=0, feedback_gain=0), duration=15)
    assert interaction(r).min() < -.001
    np.testing.assert_allclose(r["A"]["receptor_a"], r["AB"]["receptor_a"], atol=1e-9)


def test_transactivation_without_b_ligand():
    p = Parameters(transactivation=1, cooperation=0, gate_leak=0)
    protocol = Protocol(a=pulse())
    opened = simulate(p, protocol, duration=15)
    closed = simulate(p, replace(protocol, switch=Signal(0)), duration=15)
    assert opened["receptor_b"].max() > .2
    assert closed["receptor_b"].max() == 0


def test_shared_pool_competition_and_release():
    p = Parameters(shared_pool=True, cooperation=0, gate_mode="allocation", gate_leak=0)
    pair = Protocol(pulse(), pulse())
    together = simulate(p, pair, duration=15)
    released = simulate(p, replace(pair, switch=Signal(0)), duration=15)
    assert released["branch_b"][-1] > together["branch_b"][-1]
    np.testing.assert_allclose(released["receptor_a"], together["receptor_a"], atol=1e-8)


def test_sensor_changes_free_signal_not_only_measurement():
    protocol = Protocol(pulse(), pulse())
    bare = simulate(Parameters(), protocol, duration=15)
    loaded = simulate(Parameters(sensor_total=2), protocol, duration=15)
    assert loaded["sensor_bound"].max() > .1
    assert loaded["effector_free"][-1] < bare["effector_free"][-1]


def test_priming_and_tolerance_signs():
    protocol = Protocol(pulse(1, 5), pulse(8, 14))
    base = Parameters(cooperation=0, direct_a=0, direct_b=.5, memory_on=.8, memory_tau=20)
    normal = simulate(base, protocol, duration=20)
    primed = simulate(replace(base, priming_gain=5), protocol, duration=20)
    tolerant = simulate(replace(base, memory_inhibition=5), protocol, duration=20)
    assert primed["effector_free"].max() > normal["effector_free"].max() > tolerant["effector_free"].max()


def test_solver_convergence():
    p = Parameters(sensor_total=.6, feedback_gain=3)
    protocol = Protocol(pulse(), pulse(), Signal(1, (Segment(5, 9, 0),)))
    a = simulate(p, protocol, duration=15, dt=.1)
    b = simulate(p, protocol, duration=15, dt=.1, rtol=1e-11, atol=1e-13, max_step=.04)
    np.testing.assert_allclose(a.values, b.values, atol=2e-7)


ROOT = Path(__file__).resolve().parents[1]
CASES = json.loads((ROOT / "web/cases.json").read_text())


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_every_case_has_valid_parameters_and_evidence(case):
    p = Parameters.from_dict(case["parameters"])
    assert case["source"].startswith("https://")
    assert all(case[k] for k in ("evidence", "mapping", "omissions", "switch", "readout"))
    r = simulate(p, Protocol(pulse(), pulse()), duration=12, dt=.2)
    validate_state(r.values, p)


@pytest.mark.parametrize("path", sorted((ROOT / "examples").glob("*.json")))
def test_example_configs(path):
    p, protocol, settings = load_config(path)
    r = simulate(p, protocol, **settings)
    assert len(r.t) > 100
