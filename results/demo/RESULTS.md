# Crosstalk Check: reproducible synthetic results

Data-Rich, Insight-Poor · No. CCLXVII / 99 Small Problems · Installment 08. These are model outputs, not experimental estimates.

## Connection versus hub

- Edge gate, interaction-AUC change: 8.7057 model units·min.
- Edge gate, A-only AUC change: 1.603e-12.
- Hub gate, A-only AUC change: 1.9650.

The selective-gate result is built into the stated topology and is a verification of the model, not biological evidence that such a selective reagent exists.

## Readout interpretation

The measurement-artifact figure compares free signal under sensor loading and apparent persistence under different reporter lags. The sweep is conditional sensitivity analysis, not uncertainty estimation.

## Reproduction

Run `crosstalk demo --output results/demo`. The manifest records software versions, all parameters, and contrast metrics; each trajectory has a CSV and JSON metadata file. No random seed is needed.
