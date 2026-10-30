# Crosstalk Check v0.1.0

Data-Rich, Insight-Poor · No. CCLXVII

99 Small Problems · Installment 08

The first public MIT-licensed release combines an interactive receptor-crosstalk workbench with a Python reference model and literature-grounded assay-development guidance. All numerical parameters are illustrative rather than experimentally fitted.

## Included

- **Interactive model:** Eighteen literature-linked examples spanning GPCRs, RTKs, cytokine receptors, adhesion, and innate immune signaling, including explicitly labeled engineered comparators and proposed extensions.
- **Intervention and measurement controls:** Stimulation order, connection versus shared-output gating, switch leak and recovery, reporter lag, sensor sequestration, factorial comparisons, and sensitivity analysis.
- **Bioassay planning:** Case-specific experimental briefs and reproducible randomized 96-well drafts with optional unsimulated technical controls.
- **Reproducibility:** CSV trajectories, SVG plots, Python-compatible JSON import/export, model equations, reference results, and automated numerical and browser verification.
- **Companion writing:** “Interrupt the Connection, Not the Cell,” a development guide for all eighteen projects, and a broader literature synthesis. The writing distinguishes demonstrated tools from new adaptations and frontier proposals.

## Use and limitations

Open the [live model](https://datarichinsightpoor.github.io/crosstalk-check/) or inspect the [code](https://github.com/dataRichinsightPoor/crosstalk-check). The [article](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/ARTICLE.md), [project guide](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/PROJECT_GUIDE.md), and [MIT license](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/LICENSE) are included in the repository.

This is a research prototype, not a clinically validated model or a protein-design engine. Numerical verification establishes solver and interface behavior, not biological validity, receptor-specific kinetics, or the performance of a proposed switch construct.
