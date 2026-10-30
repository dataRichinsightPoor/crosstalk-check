# Crosstalk Check: verification inventory

## User-facing acceptance criteria

The deliverable is a refined receptor-stimulation tool in GitHub, branded as Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08. It includes many receptor systems while distinguishing literature-backed observations from illustrative model assumptions and proposed tool extensions.

## Browser flows to verify

- **Library:** All 18 examples load; search and family filtering work; no-result state is intelligible; selection changes the title, model, evidence, and limitations.
- **Stimulation:** Simultaneous, ordered, pulsed, and custom inputs rerun; invalid intervals produce a visible error; correcting an interval recovers.
- **Gate:** All four targets and five commands work; leakage and opening/closing controls update results.
- **Measurement:** All six readouts render; reporter lag and sensor loading update the trajectories.
- **Mechanism controls:** Cooperation, relay, feedback, priming, and inhibitory-memory controls update parameters and rerun.
- **Inspection:** Proximal/timing panels and the eight-condition table open and contain the appropriate outputs.
- **Evidence:** Every example contains source, mapping, omissions, and a proposed discriminating assay; a representative external link opens correctly.
- **Sweep:** The 25-condition calculation produces a table and downloadable data with its fixed timing disclosed.
- **Exports:** CSV, SVG, JSON, and import are exercised; exported JSON runs in Python.
- **Bioassay development:** Case-specific guidance, randomized 96-well layout, technical-control distinction, capacity errors, plate CSV, and Markdown brief are verified.
- **Responsive behavior:** Desktop, 375-pixel mobile, and desktop-to-mobile-to-desktop resizing show no horizontal page overflow; controls remain usable.
- **Off-happy paths:** Empty search, invalid timing, malformed configuration, unknown parameter, and zero-reference AUC are handled without fabricated values.
- **Runtime:** No uncaught browser errors; numerical engine rejects invalid or unstable configurations rather than clipping outputs.

## Numerical verification

The Python suite tests analytical receptor and switch trajectories, discontinuity handling, capacities, mechanism controls, measurement effects, convergence, and every preset. The JavaScript suite compares 18 independent DOP853 reference fixtures and tests validation and gate behavior.

The browser UI suite is in `tests/ui.spec.mjs`. Desktop and mobile captures are stored in `docs/screenshots/`; the exported chart, assay brief, and browser-to-Python configuration are also retained as inspectable examples.

## Verified behavior

All 18 library entries were selected through the browser and checked for updated titles, trajectories, and evidence boundaries. Four gate targets, five command schedules, six readouts, slider changes, invalid timing and recovery, shared-pool controls, and the explicit-connection null were exercised.

Configuration export/import retained the same model result and locked imported timing until explicitly replaced. The exported JSON also ran in Python, and the source-paper link opened its intended destination.

The default plate assigned 36 unique wells with three technical replicates per condition while reserving the perimeter. The capacity check rejected an overfilled interior-only design; unassigned and technical-control wells remained explicitly identified.

Desktop and 375-pixel mobile views were inspected, including resize-back behavior and horizontal-overflow checks. No uncaught browser exceptions were observed in these verification flows.

## Public deployment verification

The public GitHub Pages site loaded and completed its eight-condition numerical checks. Its plate planner generated the expected 36 assigned wells with seed 26708 and three technical replicates; no uncaught browser errors were collected during this flow.

The initial public [numerical verification workflow](https://github.com/dataRichinsightPoor/crosstalk-check/actions/runs/40976526705) and [Pages deployment workflow](https://github.com/dataRichinsightPoor/crosstalk-check/actions/runs/40976526948) both completed successfully. The local full suite comprises 52 Python tests, 23 JavaScript numerical/plate tests, and six browser UI tests.
