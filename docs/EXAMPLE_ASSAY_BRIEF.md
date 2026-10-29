# Crosstalk Check: draft bioassay development brief

Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08

## TrkB + mGluR5

This is a synthetic-model planning aid, not a validated protocol. All numerical parameters are illustrative.

## Question to resolve

Can you interrupt cooperation without silencing either receptor?

## Discriminating readouts

Proximal G-protein activity plus PLC/calcium dynamics.

## Candidate perturbation

Proposed local gate on the cooperative contribution, not a validated TrkB–mGluR5 switch.

## Current control behavior

Readout: Free active effector. Current A-only AUC change: 0.0%; B-only change: 0.0%. These are simulated contrasts, not acceptance criteria.

## Required matched conditions

Neither input, A only, B only, and A+B under both the reference and intervention schedules. Keep receptor abundance, reporter expression, stimulation, acquisition, and cell context matched where possible.

## Sampling logic

Measure before the gate changes, during its response, and after reopening or washout. Resolve proximal activity and the downstream readout separately; do not carry these illustrative model-minute values directly into a biological protocol.

## Orthogonal controls

Include input without switch, a binding-defective payload, reporter/actuator interference controls, and an independently established positive control. These technical controls are not simulated and must be specified experimentally.

## Before a mechanistic claim

Verify that the intended connection changed, check each receptor's independent proximal response, establish whole-system recovery kinetics, and test a second perturbation. Set equivalence margins and biological replication using empirical assay variability.

## Known model omissions

Not a calcium oscillator, synaptic-plasticity model, or fit to the paper. A represents receptor activity, not glutamate concentration; mGluR5 can contribute constitutively.

## Evidence boundary

BDNF/TrkB and mGluR5 cooperate through G-protein inputs to PLC-β; direct heteromerization was not required in the reported model. ([Lao-Peregrin et al. · Cell Reports](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)).

## Plate status

36 assigned wells, 3 technical replicates, seed 26708. Export the separate plate CSV for assignments.

## Reproducible configuration

```json
{
  "description": "Data-Rich, Insight-Poor CCLXVII / 99 Small Problems 08. Synthetic model.",
  "parameters": {
    "receptor_a_on": 1.2,
    "receptor_a_off": 0.6,
    "receptor_b_on": 1,
    "receptor_b_off": 0.5,
    "branch_a_on": 2,
    "branch_a_off": 0.9,
    "branch_b_on": 1.5,
    "branch_b_off": 0.7,
    "direct_a": 0.12,
    "direct_b": 0.12,
    "cooperation": 3,
    "transactivation": 0,
    "shared_pool": false,
    "pool_a_basal": 0,
    "transactivation_via_memory": false,
    "gate_mode": "edge",
    "gate_leak": 0.02,
    "switch_tau_open": 0.3,
    "switch_tau_close": 0.3,
    "effector_basal": 0,
    "effector_off": 0.7,
    "feedback_gain": 0.8,
    "feedback_tau": 4,
    "memory_on": 0,
    "memory_tau": 8,
    "memory_gain": 0,
    "priming_gain": 0,
    "memory_inhibition": 0,
    "live_inhibition": 0,
    "sensor_total": 0,
    "sensor_on": 3,
    "sensor_off": 1,
    "sensor_bound_deactivation": 0.7,
    "reporter_tau": 0.7,
    "recorder_on": 0.08
  },
  "protocol": {
    "a": {
      "segments": [
        {
          "start": 2,
          "end": 26,
          "level": 1
        }
      ]
    },
    "b": {
      "segments": [
        {
          "start": 2,
          "end": 26,
          "level": 1
        }
      ]
    },
    "switch": {
      "baseline": 1,
      "segments": [
        {
          "start": 10,
          "end": 20,
          "level": 0
        }
      ]
    }
  },
  "simulation": {
    "duration": 40,
    "dt": 0.1
  }
}
```
