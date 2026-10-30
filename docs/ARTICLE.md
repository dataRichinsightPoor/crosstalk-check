# Interrupt the Connection, Not the Cell

Data-Rich, Insight-Poor · No. CCLXVII

99 Small Problems · Installment 08

Ermelinda Damko

Two receptor inputs produce a larger signal together. A perturbation reduces it. That can be the beginning of a crosstalk experiment, but it is not yet an explanation. The useful question is what the perturbation interrupted: a receptor, a connection between pathways, a shared signaling resource, or the measurement itself.

[Crosstalk Check](https://datarichinsightpoor.github.io/crosstalk-check/) turns that distinction into an interactive assay-development problem. Its eighteen literature-linked examples let the user vary stimulation order, intervention timing, switch leakage, reporter lag, and sensor loading before drafting a controlled experiment. The parameters are deliberately synthetic. The tool is not a collection of fitted receptor models, and no slider position specifies a protein sequence that will work.

Open the [interactive model](https://datarichinsightpoor.github.io/crosstalk-check/) or inspect the [GitHub code](https://github.com/dataRichinsightPoor/crosstalk-check). The [model equations and assumptions](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/MODEL.md), [eighteen-project development guide](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/PROJECT_GUIDE.md), and [MIT license](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/LICENSE) accompany this article.

The accompanying engineering question is more ambitious: can a conformational protein switch make one contribution to signaling independently addressable? The answer is promising, but uneven. Designed switches already provide conditional access to functional motifs and useful measurements of endogenous signaling; a general-purpose, reversible switch for any receptor connection is not established by those demonstrations ([Langan et al., Nature, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6733528/); [Zhang et al., Nature Biotechnology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). The practical opportunity lies in choosing the smallest new engineering task that makes the biological alternatives distinguishable.

## The interaction may be nowhere near the receptors

TrkB and mGluR5 provide an instructive starting point. In the reported system, BDNF-dependent TrkB signaling cooperated with mGluR5 through G-protein contributions to PLC-β, producing calcium oscillations and enhanced MAPK signaling; the evidence did not require direct receptor heteromerization or glutamate binding to mGluR5 ([Lao-Peregrin et al., Cell Reports](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). A constitutively active contribution from the GPCR could therefore matter even when no GPCR agonist had been added ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)).

This changes both the intervention and the controls. Separating two receptor molecules would not necessarily interrupt their cooperation at a shared effector. Inhibiting that effector would reduce the response, but it would not identify which receptor supplied the decisive contribution. And “no glutamate” would not be an adequate definition of “no mGluR5 activity.”

The first design decision should therefore be a causal one. Is the proposed interaction an A-to-B activation relay, cooperative input to an enzyme, competition for a finite component, spatial organization, or a persistent state created by earlier stimulation? Each explanation predicts a different result when one input is interrupted after the other has already begun.

For this article, a connection-selective intervention means an intervention that tests a specified dependency while leaving enough of the surrounding system intact to interpret the result. It does not mean that both single-input responses must always remain unchanged. A shared-resource experiment deliberately changes one receptor’s access to a component; its distinguishing evidence is reciprocal redistribution, not perfect preservation of that receptor’s output.

## What de novo design adds, and what it does not

The strongest foundation is not a single spectacular structure. It is a set of experimentally demonstrated ways to couple recognition to function, together with explicit boundaries on their portability.

### A cage can make a motif conditional

LOCKR uses competition between an intramolecular latch and an external key to expose a functional sequence. The original work demonstrated key-dependent binding, degradation, and localization control across specific biochemical, yeast, and mammalian implementations; it did not establish that any folded signaling domain could simply be inserted into the latch ([Langan et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC6733528/)).

That makes a compact, independently validated interaction motif a sensible first payload. A large catalytic domain is a different engineering problem: conditional recruitment or localization may be more tractable than trying to bury its entire active surface. In either case, the initial experiment should test the accessible payload without the switch. A payload that broadly suppresses signaling does not become connection-selective when hidden inside a better cage.

Kinase-responsive LOCKR variants extend the principle, but the experimental distinctions matter. Woodall and colleagues demonstrated key-dependent ITAM phosphorylation in vitro, and separately demonstrated kinase-responsive outputs including split-GFP in cells; the ITAM experiment was not a demonstration of switch-controlled T-cell activation ([Woodall et al., Nature Structural & Molecular Biology, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8601088/)). The cellular PKA-responsive split-GFP output was much slower than conventional acute kinase reporters, so it should not be substituted for a real-time phosphorylation measurement without measuring its response function ([Woodall et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8601088/)).

There is also a causal distinction between an externally commanded switch and one driven by the pathway under investigation. The latter may be an excellent reader or feedback element, but its input is not independent of the biological state. I would establish externally controlled perturbation first, then ask whether endogenous activity can usefully control the same output.

### A switch can be a reader before it is an actuator

Ras-LOCKR is the most direct precedent for the assay problem considered here. Its Ras-GTP recognition module shifts a designed cage–latch equilibrium, permitting a FRET readout of endogenous Ras activity; compartment-targeted versions resolved different responses in stimulated Jurkat cells ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)).

The experimental comparison deserves precision. The paper reported Golgi Ras responses under CD3/CD28 stimulation and plasma-membrane responses under CD3/ICAM-1 stimulation, rather than a universally matched experiment in which LFA-1 was the only altered variable ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). That is a strong reason to measure local Ras in a new TCR–integrin study, and an equally strong reason to control the costimulation and adhesion context explicitly.

The reader itself still needs a burden test. Ras-LOCKR contains a Ras-binding domain; the authors tested effects on ERK signaling in their system while acknowledging the possibility of buffering other Ras-dependent processes ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). The useful expression window is therefore the range in which signal can be detected without materially changing the biological comparison, not the expression level that gives the brightest image.

### A designed motion is not yet a receptor controller

Two-state hinge proteins provide a more geometrically explicit design foundation: two folded domains adopt distinct relative arrangements, and effector binding shifts their conformational populations. Structural, spectroscopic, and competition experiments established switching and reversibility at the protein level, but not a working mammalian receptor-geometry assay ([Praetorius et al., Science, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10697137/)).

Switchable assemblies subsequently coupled hinge motion to changes in oligomeric state or assembly shape. Some ring transitions took hours under the tested conditions, and the proposed use of an inducible homodimer to control cell-surface receptors remained an application prospect rather than a cellular demonstration ([Pillai et al., Nature, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/)).

These are valuable starting points for an extracellular geometry project. They are not evidence that a receptor can already be toggled between signaling geometries on a seconds-scale clock. The development sequence should proceed from fixed configurations to a switchable purified construct, then to receptor engagement and signaling in cells. Each transition adds a new constraint.

### New binding modules do not remove the functional screen

Recent de novo GPCR miniproteins substantially expand the supply of receptor-recognition modules, but binding, efficacy, and conditional control remain separate properties. In the MRGPRX1 examples, improved calcium-assay potency did not translate into equivalent potency and efficacy in the less-amplified proximal G-protein and arrestin assays; the authors also cautioned that choosing an active or inactive receptor structure does not by itself specify agonist or antagonist behavior ([Muratspahić et al., Nature, 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)).

GEMs, the designed GPCR exoframe modulators, address a different opportunity: modulation through the transmembrane surface rather than the orthosteric site. The D1R study reported distinct allosteric pharmacologies, but the accessible primary evidence reviewed here does not establish externally commanded, rapid reversibility of GEM action ([Cheng et al., Nature, 2026](https://www.nature.com/articles/s41586-025-09957-1)). A switchable GEM is consequently a proposal built on a demonstrated modulator, not a demonstrated switch.

Two other recent developments sharpen the practicality test. Artificial allosteric sensors assembled from machine-learning-designed recognition domains and reporters showed useful biochemical behavior, but response times ranged from minutes to tens of minutes and mammalian receptor-crosstalk performance was not demonstrated ([Artificial allosteric protein switches, Nature Biotechnology, 2026](https://www.nature.com/articles/s41587-026-03081-9)). A fully designed macrocycle–protein dimerization system worked in mammalian reporter assays, yet its 36 nM biochemical ligand-binding affinity coexisted with a 9.4 μM cellular transcriptional EC50 and some basal association ([Hanna et al., Nature Communications, 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13385886/)).

That discrepancy is not a failed design. It is a reminder that biochemical affinity is not cellular controllability. The macrocycle system also uses homodimerization, not a demonstrated selective anchor–payload heterodimer; adapting it for localization would require controlling competing assemblies as well as measuring delivery, baseline activity, and reset ([Hanna et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13385886/)).

## Design the operating window, not just the open state

I would specify a candidate switch by the complete measurement problem it must solve. The required properties are low enough off-state activity, adequate on-state engagement, recovery fast enough for the intended comparison, appropriate localization, and tolerable loading of the target.

For a simple nondepleting 1:1 binding approximation,

\[
f_{\mathrm{bound}}\approx
\frac{[S]_{\mathrm{free}}}{K_d+[S]_{\mathrm{free}}},
\qquad
K_d=\frac{k_{\mathrm{off}}}{k_{\mathrm{on}}}.
\]

Here \(S\) is the binding tool, and the expression is an explanatory model rather than a fitted description of any switch in this article. Increasing affinity can improve occupancy while increasing target sequestration. If the improvement comes from a slower off-rate, it can also make apparent signaling memory outlast the biological event.

A separate schematic model makes the timing problem explicit:

\[
\frac{ds}{dt}=\frac{s_\infty(u)-s}{\tau_s},
\qquad
\frac{dy}{dt}=\frac{x-y}{\tau_y}.
\]

The switch state \(s\) responds to command \(u\); the reporter \(y\) follows biological activity \(x\). A slow return in \(y\) cannot identify whether persistence resides in the biology, the switch, or the reporter unless those response times are independently constrained. Crosstalk Check separates these quantities precisely so that a smooth, convincing trajectory can be challenged.

This also changes the computational design objective. Positive design should stabilize the desired bound or accessible state, while negative design should penalize leak, wrong-state binding, unwanted oligomerization, and inappropriate localization. Structural prediction can nominate candidates; it cannot replace measurements of both states, recovery, and functional interference.

I would therefore evaluate variants on a multi-property frontier rather than rank them by one dynamic-range number. A smaller response with a clean baseline and reproducible reset may be more useful than a large response whose off-state already reorganizes the pathway. The appropriate thresholds should be prespecified from assay variability and the biological decision, not borrowed as universal percentages.

## Eighteen examples, several different engineering problems

The [project-by-project development guide](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/PROJECT_GUIDE.md) gives a proposed architecture, an initial experiment, and a stopping criterion for every workbench example. The routes below explain why those projects should not all receive the same switch.

### GPCR–RTK cooperation

TrkB–mGluR5 is the mechanistic anchor; EGFR–mGluR5, IGF1R–mGluR5, and IGF1R–5-HT2AR are receptor-pair extensions supported by the same study, not four independently established switch platforms ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). I would first establish the proximal activity of each receptor and then test a candidate G-protein contribution to the shared response.

A conditional motif competitor is a plausible de novo development route only after its accessible form passes the selectivity test. The paper’s G-protein perturbations are mechanistic starting points, not evidence that a Gβγ-sequestering payload will selectively interrupt this one receptor connection ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). Broad suppression should redirect the project toward local delivery or a different molecular interface, not toward optimizing the cage.

For the IGF1R–5-HT2AR project, I would resist an especially tempting shortcut. The recent GPCR-miniprotein paper did not establish a 5-HT2AR switch, so it supplies a design strategy rather than an off-the-shelf payload for this pair ([Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)). A conventional, well-characterized receptor perturbation may be the more informative first comparator.

### Adhesion, location, and delayed relay

The β3-integrin–EGFR example begins with adhesion-dependent EGFR engagement and downstream p190RhoGAP regulation in mammary epithelial cells, not with proof that a receptor-interface clamp will isolate the mechanism ([Balanis et al., Molecular Biology of the Cell, 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3216655/)). I would pair EGFR-proximal measurements with contact-area and adhesion measurements before developing a local switch-controlled competitor. Losing attachment is not a selective interruption of biochemical crosstalk.

TCR–LFA-1 is a reader-first project because Ras-LOCKR already supplies the most relevant demonstrated capability. The new engineering should follow the spatial observation: first establish the local response in controlled stimulation conditions, then evaluate a compartment-addressed intervention with an independent control compartment ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). A kinase-caged ITAM would answer a different, receptor-engineering question and has a much larger validation burden.

EGFR→MET requires a different clock. The source study implicated MAPK-dependent regulation and MET stabilization in a delayed response, rather than establishing immediate direct cross-phosphorylation ([Breindel et al., Cancer Research, 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3745527/)). A timed interruption of pathway input can test induction versus maintenance, but phospho-MET must be interpreted alongside total MET. The workbench’s compressed time axis is not a substitute for those hours-scale measurements.

### Cytokine receptors and finite resources

IL-2R–IL-7R, IL-7R–IL-4R, and IL-7R–IL-21R ask whether one receptor changes another’s response by changing access to the shared γc component. The relevant studies support abundance-dependent sensitivity and asymmetric competition, with the strength and interpretation of those effects tied to their cellular contexts ([Cotari et al., Science Signaling, 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3896501/); [Gonnord et al., Science Signaling, 2018](https://www.science.org/doi/10.1126/scisignal.aal1253)).

The useful switch would alter assembly or allocation, not merely suppress downstream kinase activity. I would first show that the proposed intervention changes receptor-complex engagement and the competing pathway’s proximal response. A conditional extracellular blocker or a regulatable receptor component is a possible development route, but a clean γc-allocation switch is not supplied by those papers.

These projects also expose a limitation of the ideal “connection-only” intervention. Releasing a component from receptor A is expected to affect A. The evidence for competition is a coordinated change in access and response, not a fall in one generic STAT reporter followed by a claim of pathway-specific inhibition.

### Innate signaling and the distinction between writing and reading memory

TLR2→TNFR1 is a relatively concrete localization hypothesis. The source experiments linked priming to MAL-dependent TRADD positioning and TRAF6 recruitment into a TNFR1-associated complex, without demonstrating direct TLR2–TNFR1 contact ([Chang et al., Journal of Cellular and Molecular Medicine, 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4124019/)). I would ask whether controlled localization of a validated TRADD construct can replace the priming input, then whether interrupting that localization after priming changes the later TNF response.

A de novo motif gate on a localization element is plausible but unvalidated. An established light-controlled recruitment system may be the lower-risk comparator; calling that hybrid implementation “fully de novo” would obscure rather than strengthen the design. The critical experiment is temporal replacement or interruption of the proposed localization event.

TNFR→TLR4 cross-tolerance is less amenable to a single acute connection switch because the published mechanism includes negative feedback and chromatin regulation. An acute perturbation after priming need not erase a state established earlier ([Park et al., Nature Immunology, 2011](https://www.nature.com/articles/ni.2043)). I would separately perturb the writing period and the later challenge period, and avoid interpreting failed acute rescue as proof that the target never contributed.

Notch–TLR integration adds gene specificity. The original study found cooperation with basal Notch signaling and negative regulation by Hes1/Hey1, with different consequences for different cytokine genes rather than one universal direction of effect ([Hu et al., Immunity, 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2585039/)). A proposed LOCKR-regulated localization element on a validated transcriptional construct could test timing, but the first readouts should include nascent or early transcripts and the relevant regulatory proteins, not only accumulated cytokine.

### Comparator systems and higher-risk receptor tools

The FGFR/SOS example is a pathway-entry comparison, not a native receptor pair. Published optoFGFR and optoSOS experiments exposed different feedback behavior, but the actuators differ in architecture, kinetics, and retained regulation ([Dessauges et al., Molecular Systems Biology, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9189677/)). I would match measured Ras or ERK trajectories where feasible, rather than equate light doses or assume that receptor bypass preserves everything except receptor identity.

The β2AR/Gαi-history example likewise uses an actuator as one input. LOV2GIVe provides a demonstrated receptor-independent Gαi intervention, and the reported β-adrenergic response depended on prior Gαi activity; it is a naturally derived hybrid tool, not a de novo-designed switch ([Garcia-Marcos et al., eLife, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/)). Its value here is to establish a tractable history experiment before designing a replacement actuator.

TLR3 valency is a credible staged tool-development project because de novo minibinders have already separated binding from stronger signaling by multivalent formats. The published constructs were static, and the activation compartment was unresolved, so a switchable assembly adds both a new engineering task and a localization question ([Coventry et al., Nature Communications, 2025](https://www.nature.com/articles/s41467-025-56369-w)). I would establish an interpretable fixed-format comparison before adding a hinge or assembly switch.

D1R/GEM and IL-7R geometry remain higher-risk dynamic-switch projects. D1R has a peer-reviewed modulator precedent but no verified rapid on/off implementation in the evidence reviewed here; IL-7R has directly relevant fixed-geometry work that remains a preprint, while the peer-reviewed cytokine-geometry foundation includes EpoR surrogate ligands rather than a demonstrated IL-7R toggle ([Cheng et al.](https://www.nature.com/articles/s41586-025-09957-1); [Expòsit et al., preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/); [Moraga et al., Cell, 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4766813/)). The distinction is substantive: a fixed panel can reveal a biological opportunity before a dynamic device is worth building.

## Turn the simulation into a discriminating experiment

The workbench’s most useful output is a control decision, not a predicted trace. I would begin with a receptor pair or comparator, state the competing explanations, and choose one proximal observation on which those explanations disagree.

- **Establish the factorial baseline:** Compare neither input, A alone, B alone, and A+B in both intervention states. Define “input absent” biologically rather than equating it automatically with omission of an added ligand.
- **Compare the intended intervention with broad inhibition:** In the simulator, connection gating and shared-output suppression can reduce the combined response for different reasons. In the experiment, use a general downstream inhibitor as a suppression control, not as proof of the proposed connection.
- **Challenge timing:** Compare simultaneous and ordered inputs, then move the intervention before, during, and after the inferred interaction. Measure switch reset and reporter recovery separately.
- **Challenge measurement:** Compare a fast readout with an integrated endpoint and vary sensor burden. A mechanism that only appears at the highest sensor expression requires a different explanation before it deserves a new name.
- **Export and reproduce:** Retain the configuration, trajectories, readout choice, analysis window, and proposed plate layout. The randomized plate is a design aid; technical replicates do not replace independent biological experiments.

The additive interaction contrast is useful for organizing those comparisons:

\[
I_s(t)=Y_{AB,s}(t)-Y_{A,s}(t)-Y_{B,s}(t)+Y_{0,s}(t),
\]

\[
\Delta I(t)=I_{\mathrm{reference}}(t)-I_{\mathrm{intervention}}(t).
\]

These are definitions on the chosen response scale, not a universal synergy test. Saturation, reporter nonlinearity, and shared feedback can generate a nonzero contrast even without the explicit connection being tested. Report the contrast together with the baseline and single-input changes, and inspect proximal measurements before assigning a receptor mechanism.

The eight-condition comparison is necessary but not sufficient. It should be accompanied by no-switch and actuator-only controls, a binding-defective or function-defective payload, an accessible-payload comparator, and an orthogonal readout. Biological replicate structure, expression heterogeneity, and the relevant dose and timing range must be designed outside the current deterministic model.

## What I would build first

I would fund three different kinds of pilot rather than eighteen new switch constructs. Each would earn its next engineering step by resolving a specific uncertainty.

- **A reader-first pilot:** TCR–LFA-1 with compartment-targeted Ras-LOCKR, matched stimulation context, and sensor-burden controls. The immediate goal is to determine where the combined input changes Ras, not to claim a newly controllable connection.
- **A payload-first pilot:** TrkB–mGluR5 with receptor-proximal controls and a candidate junction perturbation tested before caging. If the accessible payload cannot preserve interpretable independent responses, stop or redesign its targeting before investing in the switch.
- **A geometry-first pilot:** TLR3 with fixed binder formats, measured engagement, and a localization assay. Advance to a de novo assembly switch only if the fixed-format result identifies a useful, reproducible difference that dynamic control could resolve.

These priorities are analytical recommendations, not published validation of the proposed constructs. The common standard is that a new component should remove an ambiguity rather than add an unmeasured one.

A useful conformational switch does not have to insulate a pathway from the rest of the cell. It has to create a comparison the unmodified system cannot provide: the same inputs, a defined connection altered at a defined time, and enough of the surrounding biology preserved to explain what changed. That is the difference between controlling a signal and learning what carried it.

## Evidence and use

This article prioritizes peer-reviewed primary studies in Nature, Science, Nature Biotechnology, Nature Structural & Molecular Biology, Cell, Immunity, and related specialist journals. Publication venue is not treated as a substitute for construct-level evidence. The IL-7R-specific fixed-geometry study is explicitly retained as a preprint; the more speculative preprints discussed in the broader literature synthesis are not used here as implementation-ready foundations.

The GEM discussion is limited to the accessible primary abstract and does not supply unverified kinetics or construction details. Literature was reviewed through October 29, 2026. All proposed hybrid constructs, feasibility judgments, and development gates are recommendations; none is represented as a completed experiment.

The [public MIT-licensed repository](https://github.com/dataRichinsightPoor/crosstalk-check) contains the interactive tool, Python reference implementation, numerical tests, model equations, and the [eighteen-project development guide](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/PROJECT_GUIDE.md). The simulation can help choose what to measure next. It cannot establish that a designed protein folds, switches, reaches its target, or behaves selectively in a cell.
