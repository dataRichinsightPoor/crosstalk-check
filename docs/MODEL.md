# Crosstalk Check: mathematical specification

Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08

## Purpose and parameter provenance

This is a deterministic, well-mixed, phenomenological forward model for testing assay interpretation. Every kinetic constant, gain, capacity, input level, and timing preset is illustrative; no parameter has been fitted to the receptor studies.

Time is expressed in model minutes and activities are normalized. That convention does not imply that a 10-minute model pulse reproduces an experimental 10-minute pulse, especially for gene regulation or protein-stability examples that involve much longer biological timescales.

The scientific sources motivate possible mechanisms, not the equations or numerical values used here. Each case states what has been abstracted or omitted.

## States

| Symbol | CSV field | Definition |
|---|---|---|
| \(a,b\) | `receptor_a`, `receptor_b` | Normalized active receptor or input-node fractions. |
| \(x,z\) | `branch_a`, `branch_b` | Independent branch activities, or allocations of one shared pool when `shared_pool=true`. |
| \(s\) | `switch_open` | Open conformational fraction. |
| \(e\) | `effector_free` | Free active effector fraction. |
| \(c\) | `sensor_bound` | Sensor-bound active effector, normalized to total effector. |
| \(f\) | `feedback` | Delayed feedback state driven by free effector. |
| \(m\) | `memory` | A-dependent permissive, inhibitory, or relay state; its interpretation depends on the preset. |
| \(y\) | `reporter` | Reversible, first-order filtered readout. |
| \(h\) | `recorder` | Irreversible accumulated record. |

All states are nonnegative and bounded by one. Additionally, \(e+c\le1\), \(c\le S_T\), and, in shared-pool mode, \(x+z\le1\); \(S_T\) can exceed one because it is normalized to total effector rather than total sensor.

## Inputs and switch

Inputs \(u_A(t)\), \(u_B(t)\), and \(u_S(t)\) are piecewise-constant levels in \([0,1]\). Segments override a baseline on half-open intervals \([t_{\mathrm{start}},t_{\mathrm{end}})\), and overlapping segments within one signal are rejected.

\[
\frac{ds}{dt}=\frac{u_S-s}{\tau_s},
\quad
\tau_s=
\begin{cases}
\tau_{\mathrm{open}},&u_S\ge s\\
\tau_{\mathrm{close}},&u_S<s
\end{cases},
\qquad
g=\ell+(1-\ell)s.
\]

Here \(\ell\) is residual leak, not a measured protein-switch property. This first-order relaxation is a coarse-grained conformational gate; it does not model chromophore chemistry, detailed balance, sequence design, or an inferred conformational energy landscape.

The functional gate depends on `gate_mode`:

| Mode | \(g_E\), connection factor | \(g_H\), whole-effector factor | \(g_A\), A-allocation factor |
|---|---:|---:|---:|
| `edge` | \(g\) | 1 | 1 |
| `hub` | 1 | \(g\) | 1 |
| `allocation` | 1 | 1 | \(g\) |
| `none` | 1 | 1 | 1 |

The connection factor multiplies all modeled connection terms: cooperative output, A-to-B relay, priming, and inhibitory modulation. If a custom configuration enables several of these at once, one edge gate affects all of them; it is not an independently addressable gate for each connection.

## Receptor activation and indirect relay

\[
\frac{da}{dt}=k_{a+}u_A(1-a)-k_{a-}a,
\]

\[
\frac{db}{dt}=\left[k_{b+}u_B+k_Tg_Er\right](1-b)-k_{b-}b.
\]

The relay variable \(r\) is \(a\) by default and \(m\) when `transactivation_via_memory=true`. Even with \(r=a\), this is a lumped causal relay and must not be interpreted as direct physical receptor contact or direct transphosphorylation.

## Independent branches or finite-pool competition

\[
\frac{dx}{dt}=g_A(k_{x+}a+k_{\mathrm{basal},x})V_x-k_{x-}x,
\qquad
\frac{dz}{dt}=k_{z+}bV_z-k_{z-}z.
\]

For independent branches, \(V_x=1-x\) and \(V_z=1-z\). For the shared-pool case, \(V_x=V_z=1-x-z\), so A and B compete for the same available capacity.

The ligand-independent allocation parameter \(k_{\mathrm{basal},x}\) allows a sequestration analogue. In shared-pool mode the signaling contributions are \(X=xa\) and \(Z=zb\), so pool occupancy alone does not generate signaling from an inactive receptor; in independent mode \(X=x\), \(Z=z\).

The shared-pool case can represent an abstract common adaptor or receptor subunit. It is not a claim that Gαq and Gαi are interchangeable members of one physical pool.

## Feedback and history

\[
\frac{df}{dt}=\frac{e-f}{\tau_f},
\qquad
\frac{dm}{dt}=k_mX(1-m)-\frac{m}{\tau_m}.
\]

Memory is produced only by the A contribution. It can increase the cooperative term, prime B, inhibit B, or provide a delayed relay, according to the parameters; using one variable for these alternatives is a deliberate abstraction, not a molecular assertion.

## Effector drive

\[
D=
\frac{
d_0+w_AX+
\dfrac{w_BZ(1+P g_Em)}{1+T g_Em+L g_EX}
C g_EXZ(1+M m)
}{
1+F f
}.
\]

The parameter correspondence is:

- **\(d_0\):** `effector_basal`.
- **\(w_A,w_B\):** `direct_a`, `direct_b`.
- **\(C\):** `cooperation`.
- **\(P\):** `priming_gain`, which can enhance B after A has subsided.
- **\(T\):** `memory_inhibition`, which represents an inhibitory history.
- **\(L\):** `live_inhibition`, which permits acute A-dependent suppression of B.
- **\(M\):** `memory_gain`, which modifies simultaneous cooperation.
- **\(F\):** `feedback_gain`.

All these parameters are nonnegative. Priming and inhibition can coexist in a custom configuration, and their balance is a hypothesis rather than an estimate.

## Explicit sensor binding and effector conservation

\[
J_{\mathrm{bind}}=k_{\mathrm{on}}(S_T-c)e,
\qquad
J_{\mathrm{unbind}}=k_{\mathrm{off}}c,
\]

\[
\frac{de}{dt}
=g_HD(1-e-c)-k_de-J_{\mathrm{bind}}+J_{\mathrm{unbind}},
\]

\[
\frac{dc}{dt}
=J_{\mathrm{bind}}-J_{\mathrm{unbind}}-k_{d,c}c.
\]

Bound-effector deactivation returns effector to the inactive pool and releases sensor. Free sensor is \(S_T-c\), free active effector is \(e\), and inactive effector is \(1-e-c\).

The model assumes the bound effector does not drive the downstream feedback or reporter while bound. This is a deliberately perturbing reader model, not a claim that all biosensors completely occlude signaling.

## Reversible reporter and irreversible recorder

\[
\frac{dy}{dt}=\frac{e-y}{\tau_y},
\qquad
\frac{dh}{dt}=k_he(1-h).
\]

The reporter can lag behind the biological signal. The recorder cannot reset and will retain a history of activity even after \(e\) has returned toward baseline.

The plotted recorder is an abstract accumulated record, not a simulation of the chemistry or capture efficiency of a particular proximity-labeling assay.

## Interaction analysis

For each intervention state or schedule, the model runs neither input, A only, B only, and both. These are control interventions on the stimulation inputs, not receptor knockouts.

\[
I(t)=Y_{AB}(t)-Y_A(t)-Y_B(t)+Y_0(t),
\qquad
\Delta I(t)=I_{\mathrm{reference}}(t)-I_{\mathrm{intervention}}(t).
\]

The UI reports the trapezoidal integral of \(\Delta I\), and the percentage AUC change for A-only and B-only responses. The latter is not estimable when the reference AUC is zero, so the UI reports `n/a` rather than an arbitrary percentage.

This is an additive contrast on a selected readout scale. A finite, saturating effector pool can generate a negative interaction even with all connection terms disabled; a test explicitly verifies this property.

## Initial conditions and numerics

States start at zero, except the switch-open fraction, which starts at the switch command at time zero. There is no automatic steady-state pre-equilibration, so a nonzero baseline allocation or stimulation begins building at time zero; Python additionally accepts a validated custom initial state.

The Python reference uses SciPy `solve_ivp`, DOP853, with default `rtol=1e-8`, `atol=1e-10`, and maximum step 0.25 min. The browser uses RK4 with a parameter-dependent maximum step constrained by rate and capacity scales; both solvers split integration at every stimulation discontinuity.

Output sampling is not the solver step size. The browser samples at 0.1 model min, while the Python default is 0.05 min; each JSON export states the requested sampling interval.

Neither engine clips invalid states into range. Both check nonnegativity, unit bounds, sensor capacity, effector capacity, and the shared-pool invariant; configurations exceeding browser workload or stiffness bounds fail explicitly.

Cross-engine fixtures use tight-tolerance Python trajectories across all 18 examples. A maximum absolute state discrepancy below \(2\times10^{-5}\) is required by the browser-engine tests.

## What would be needed for a calibrated receptor model

A calibrated extension would require explicit molecular species, appropriate compartment and receptor-abundance measurements, identifiable rate parameters, physiological input units, suitable observation models, and held-out perturbation data. It would also require distinguishing occupancy, conformation, coupling, trafficking, and functional output rather than fitting them to one generic signal.

Matching the simulator to a single downstream time course would not uniquely determine the mechanism. The present tool is intended to help choose the discriminating experiment before attempting such a fit.
