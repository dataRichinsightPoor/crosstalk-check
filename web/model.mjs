// Browser/Node numerical engine. Python DOP853 is the independent reference.
// Inputs are normalized stimulation levels, not drug concentrations.
export const STATES = ["receptor_a", "receptor_b", "branch_a", "branch_b",
  "switch_open", "effector_free", "sensor_bound", "feedback", "memory",
  "reporter", "recorder"];

export function signalAt(signal, t) {
  for (const s of signal.segments || []) if (s.start <= t && t < s.end) return s.level;
  return signal.baseline ?? 0;
}

export function validate(p, protocol, duration, dt) {
  if (!(Number.isFinite(duration) && duration > 0 && duration <= 1000)) throw Error("Duration must be between 0 and 1000.");
  if (!(Number.isFinite(dt) && dt > 0 && duration / dt <= 20000)) throw Error("Invalid output time step.");
  for (const [key, value] of Object.entries(p)) {
    if (["shared_pool", "transactivation_via_memory"].includes(key)) {
      if (typeof value !== "boolean") throw Error(`${key} must be boolean.`);
    } else if (key !== "gate_mode" && (!Number.isFinite(value) || value < 0)) {
      throw Error(`${key} must be finite and nonnegative.`);
    }
  }
  if (!["edge", "hub", "allocation", "none"].includes(p.gate_mode)) throw Error("Unknown gate mode.");
  if (p.gate_leak > 1) throw Error("Leak must be between 0 and 1.");
  for (const k of ["switch_tau_open", "switch_tau_close", "feedback_tau", "memory_tau", "reporter_tau"])
    if (!(p[k] > 0)) throw Error(`${k} must be positive.`);
  for (const [name, signal] of Object.entries(protocol)) {
    const b = signal.baseline ?? 0;
    if (!Number.isFinite(b) || b < 0 || b > 1) throw Error(`${name}: invalid baseline.`);
    const segments = [...(signal.segments || [])].sort((a, b) => a.start - b.start);
    segments.forEach((s, i) => {
      if (![s.start, s.end, s.level].every(Number.isFinite) || s.start < 0 || s.end <= s.start ||
        s.level < 0 || s.level > 1 || (i && s.start < segments[i - 1].end)) throw Error(`${name}: invalid or overlapping intervals.`);
    });
  }
}

export function derivative(state, p, ua, ub, target) {
  const [a, b, x, z, s, e, c, f, m, y, h] = state;
  const g = p.gate_leak + (1 - p.gate_leak) * s;
  const edge = p.gate_mode === "edge" ? g : 1;
  const hub = p.gate_mode === "hub" ? g : 1;
  const alloc = p.gate_mode === "allocation" ? g : 1;
  const trans = p.transactivation * edge * (p.transactivation_via_memory ? m : a);
  const avA = p.shared_pool ? 1 - x - z : 1 - x;
  const avB = p.shared_pool ? 1 - x - z : 1 - z;
  const xa = p.shared_pool ? x * a : x, zb = p.shared_pool ? z * b : z;
  const drive = (p.effector_basal + p.direct_a * xa +
    p.direct_b * zb * (1 + p.priming_gain * edge * m) /
    (1 + p.memory_inhibition * edge * m + p.live_inhibition * edge * xa) +
    p.cooperation * edge * xa * zb * (1 + p.memory_gain * m)) / (1 + p.feedback_gain * f);
  const bind = p.sensor_on * (p.sensor_total - c) * e, unbind = p.sensor_off * c;
  const tau = target >= s ? p.switch_tau_open : p.switch_tau_close;
  return [
    p.receptor_a_on * ua * (1 - a) - p.receptor_a_off * a,
    (p.receptor_b_on * ub + trans) * (1 - b) - p.receptor_b_off * b,
    alloc * (p.branch_a_on * a + p.pool_a_basal) * avA - p.branch_a_off * x,
    p.branch_b_on * b * avB - p.branch_b_off * z,
    (target - s) / tau,
    hub * drive * (1 - e - c) - p.effector_off * e - bind + unbind,
    bind - unbind - p.sensor_bound_deactivation * c,
    (e - f) / p.feedback_tau,
    p.memory_on * xa * (1 - m) - m / p.memory_tau,
    (e - y) / p.reporter_tau,
    p.recorder_on * e * (1 - h)
  ];
}

function rk4(y, h, p, input) {
  const k1 = derivative(y, p, ...input);
  const k2 = derivative(y.map((v, i) => v + h * k1[i] / 2), p, ...input);
  const k3 = derivative(y.map((v, i) => v + h * k2[i] / 2), p, ...input);
  const k4 = derivative(y.map((v, i) => v + h * k3[i]), p, ...input);
  return y.map((v, i) => v + h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6);
}

export function simulate(p, protocol, duration = 40, dt = .1) {
  validate(p, protocol, duration, dt);
  const fastest = Math.max(
    p.receptor_a_on + p.receptor_a_off, p.receptor_b_on + p.receptor_b_off + p.transactivation,
    p.branch_a_on + p.pool_a_basal + p.branch_a_off + p.branch_b_on + p.branch_b_off,
    p.direct_a + p.direct_b * (1 + p.priming_gain) + p.cooperation * (1 + p.memory_gain) +
      p.effector_off + p.sensor_on * (p.sensor_total + 1) + p.sensor_off + p.sensor_bound_deactivation,
    p.memory_on + 1 / p.memory_tau, 1 / p.switch_tau_open, 1 / p.switch_tau_close,
    1 / p.feedback_tau, 1 / p.reporter_tau, p.recorder_on
  );
  const maxStep = Math.min(.03, .15 / Math.max(1, fastest));
  if (duration / maxStep > 2_000_000) throw Error("Parameters are too stiff for the browser; use the Python reference.");
  const times = [], values = [];
  let y = Array(11).fill(0);
  y[4] = signalAt(protocol.switch, 0);
  const boundaries = [...new Set([0, duration, ...Object.values(protocol).flatMap(
    s => (s.segments || []).flatMap(v => [v.start, v.end]).filter(v => v > 0 && v < duration)
  )])].sort((a, b) => a - b);
  let current = 0, boundaryIndex = 1;
  const count = Math.ceil(duration / dt);
  for (let i = 0; i <= count; i++) {
    const targetTime = Math.min(i * dt, duration);
    while (current < targetTime - 1e-12) {
      const end = Math.min(targetTime, boundaries[boundaryIndex]);
      const h = Math.min(maxStep, end - current);
      if (h < 1e-12) { current = end; boundaryIndex++; continue; }
      const midpoint = current + h / 2;
      y = rk4(y, h, p, [signalAt(protocol.a, midpoint), signalAt(protocol.b, midpoint), signalAt(protocol.switch, midpoint)]);
      current += h;
      if (Math.abs(current - boundaries[boundaryIndex]) < 1e-11) { current = boundaries[boundaryIndex]; boundaryIndex++; }
    }
    if (!y.every(Number.isFinite) || Math.min(...y) < -1e-6 || Math.max(...y) > 1 + 1e-6 ||
      y[5] + y[6] > 1 + 1e-6 || y[6] > p.sensor_total + 1e-6 ||
      (p.shared_pool && y[2] + y[3] > 1 + 1e-6)) throw Error("Numerical or mass-balance check failed.");
    times.push(targetTime); values.push([...y]);
  }
  return {t: times, values, p, protocol, solver: {method: "RK4", maxStep, outputDt: dt}};
}

export const series = (r, name) => r.values.map(row => row[STATES.indexOf(name)]);
export function auc(t, y) {
  let sum = 0;
  for (let i = 1; i < t.length; i++) sum += (t[i] - t[i - 1]) * (y[i] + y[i - 1]) / 2;
  return sum;
}

export function factorial(p, protocol, duration = 40, dt = .1) {
  return Object.fromEntries([["none", false, false], ["A", true, false], ["B", false, true], ["AB", true, true]].map(
    ([label, a, b]) => [label, simulate(p, {...protocol, a: a ? protocol.a : {baseline: 0}, b: b ? protocol.b : {baseline: 0}}, duration, dt)]
  ));
}

export function contrast(results, name) {
  const i = STATES.indexOf(name);
  return results.AB.t.map((_, j) =>
    results.AB.values[j][i] - results.A.values[j][i] - results.B.values[j][i] + results.none.values[j][i]);
}

export function runPair(p, protocol, duration = 40, dt = .1) {
  const reference = factorial(p, {...protocol, switch: {baseline: 1}}, duration, dt);
  const gated = factorial(p, protocol, duration, dt);
  return {reference, gated};
}
