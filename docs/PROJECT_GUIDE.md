# Crosstalk Check: Project-by-Project Development Guide

Data-Rich, Insight-Poor · No. CCLXVII

99 Small Problems · Installment 08

Companion to “Interrupt the Connection, Not the Cell”

This guide translates each of the eighteen workbench examples into a proposed assay-development path. These are research recommendations, not validated construct specifications, fitted biological models, or ready-to-run laboratory protocols. The source papers establish the observations named below; the conditional interventions are new proposals unless explicitly identified as demonstrated tools.

Use the [interactive model](https://datarichinsightpoor.github.io/crosstalk-check/) and inspect the [GitHub code](https://github.com/dataRichinsightPoor/crosstalk-check). The [companion article](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/ARTICLE.md), [equations and assumptions](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/docs/MODEL.md), and [MIT license](https://github.com/dataRichinsightPoor/crosstalk-check/blob/main/LICENSE) provide the interpretive and implementation context.

## How to read the recommendations

- **Reader-first:** The named switch already measures a directly relevant activity in a published cellular context. Transfer to another cell model and acceptable sensor burden still require validation.
- **Adaptation:** A demonstrated component supports the proposed architecture, but its fusion, payload, localization, timing, or receptor application is new. A successful source construct does not validate the adaptation.
- **Discovery-first:** The necessary selective payload or controllable molecular dependency has not been established. Identify that dependency before building a switch.
- **Frontier:** The project combines capabilities demonstrated separately, or depends on an unvalidated dynamic receptor implementation. Start with simpler fixed-state comparators.

“De novo” identifies the designed component, not necessarily the whole construct. LOCKR and designed hinges provide de novo switching frameworks; LOV2-based optogenetic tools are naturally derived hybrids, and GPCR minibinders or GEMs are designed recognition/modulation modules rather than automatically externally controllable switches ([Langan et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC6733528/); [Praetorius et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC10697137/); [Garcia-Marcos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/); [Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/); [Cheng et al.](https://www.nature.com/articles/s41586-025-09957-1)).

## GPCR and RTK projects

### TrkB + mGluR5

- **Published anchor:** The source supports G-protein cooperation at PLC-β, including a ligand-independent contribution from mGluR5; direct receptor heteromerization was not required ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). Treat the GPCR input as receptor activity, not simply glutamate concentration.
- **Proposed route, discovery-first to adaptation:** Identify a compact competitor that perturbs the proposed cooperative contribution with acceptable effects on each independent pathway. Only then test its conditional exposure in a LOCKR-like cage; the cage is a precedent, not proof that the new motif will switch.
- **Initial assay:** Measure TrkB activation, proximal G-protein output, and time-resolved calcium separately. Compare intervention before stimulation with intervention after the combined response has begun.
- **Decisive control and stopping rule:** A Gβγ-sequestering tool is not inherently connection-selective. Stop cage development if the accessible payload broadly removes both single-input responses; investigate localization or a different interface first.
- **Model boundary:** The cooperation term is a qualitative dependency. The simulator does not generate calcium oscillations or identify a selective protein sequence.

### EGFR + mGluR5

- **Published anchor:** EGF-induced oscillatory calcium responses occurred in a subset of cells coexpressing mGluR5 in the source study ([Lao-Peregrin et al., Figures 7D–7F](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). This is not independent validation of a portable TrkB-derived switch.
- **Proposed route, adaptation after payload qualification:** Reuse the candidate motif gate only after showing that the relevant EGFR input and GPCR branch remain measurable. A phosphorylation-sensitive LOCKR reader could be explored separately, but it would require kinase specificity and response-time qualification.
- **Initial assay:** Compare EGFR phosphorylation, GPCR-proximal coupling, and shared output in single cells or expression-stratified populations. Ask whether the combined response changes before any measured GPCR-proximal alteration.
- **Decisive control and stopping rule:** Track surface EGFR and receptor internalization. If the intervention changes receptor abundance or broad EGFR output, do not interpret reduced calcium as selective interruption of downstream cooperation.
- **Model boundary:** The preset contains no trafficking or responding-cell fraction. A population mean cannot be calibrated from its deterministic trace.

### IGF1R + mGluR5

- **Published anchor:** The receptor-pair extension showed IGF-I-induced, largely oscillatory calcium responses with IGF1R and mGluR5 coexpression ([Lao-Peregrin et al., Figures 7J–7L](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). The shared mechanism is a starting hypothesis to retest in the intended cellular setting.
- **Proposed route, adaptation:** Qualify the accessible cooperative-branch payload in this receptor context before transferring a LOCKR-like gate. Treat low direct output and strong combined output as a reason for sensitive proximal controls, not evidence of an intrinsically selective intervention.
- **Initial assay:** Collect IGF1R-proximal activation and G-protein output alongside calcium dynamics. Evaluate receptor abundance and relevant ligand/receptor cross-reactivity in the chosen cell background rather than assuming the expression model is isolated.
- **Decisive control and stopping rule:** Require restoration after release on a timescale compatible with the measured switch. If apparent recovery follows receptor replacement rather than switch closure, redesign the timing claim.
- **Model boundary:** The numerical cooperation gain is illustrative. It does not quantify IGF1R–mGluR5 interaction strength relative to the other pairs.

### IGF1R + 5-HT2AR

- **Published anchor:** The same study extended the interaction to IGF1R and 5-HT2AR ([Lao-Peregrin et al., Figures S8C–S8D](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). The recent GPCR-miniprotein study does not provide a validated 5-HT2AR binder or switch ([Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)).
- **Proposed route, discovery-first:** Begin with an established receptor perturbation as a comparator and a proximal coupling assay. Develop a conditional branch competitor only after identifying a contribution that can be altered without losing interpretability.
- **Initial assay:** Separate receptor engagement, 5-HT2AR coupling, IGF1R phosphorylation, and the amplified endpoint. Compare simultaneous and sequential stimulation rather than assuming the mGluR5 result transfers unchanged.
- **Decisive control and stopping rule:** Do not infer efficacy or bias from a calcium endpoint alone. If the candidate only changes the amplified output, obtain a proximal explanation before calling it a receptor-state switch.
- **Model boundary:** The preset reuses a mechanism class. It is not a serotonin-pharmacology or receptor-reserve model.

### β3 integrin + EGFR

- **Published anchor:** Adhesion involving β3 integrin engaged EGFR and p190RhoGAP regulation in the reported mammary epithelial-cell system ([Balanis et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3216655/)). The evidence does not by itself specify a unique interface for a conformational inhibitor.
- **Proposed route, discovery-first:** Identify a relay-associated motif or recruitment dependency using nonconditional perturbations. A localized motif gate is a later candidate; an adhesion switch can instead serve as a mechanical-input comparator.
- **Initial assay:** Measure EGFR phosphorylation, adhesion/contact area, and a relevant downstream output separately. Introduce the biochemical intervention after stable contact where the experimental design permits.
- **Decisive control and stopping rule:** Preserve a mechanically interpretable comparison. If cells detach or markedly change spreading, treat the result as altered adhesion context, not selective biochemical crosstalk.
- **Model boundary:** The model lacks mechanics and does not represent the sign of RhoA regulation. Its generic downstream state must not be labeled measured RhoA.

### EGFR → MET

- **Published anchor:** The reported delayed response involved MAPK signaling and MET stabilization rather than established immediate direct receptor cross-phosphorylation ([Breindel et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3745527/)). Total receptor abundance is therefore part of the mechanism, not merely a normalization nuisance.
- **Proposed route, discovery-first:** Use timed EGFR/pathway interventions to distinguish induction from maintenance before selecting a cageable payload. A receptor-level or SOS-level actuator may provide an input comparator, but it does not isolate the MET-stabilization step.
- **Initial assay:** Follow phospho-MET, total MET, EGFR activation, and the relevant MAPK trajectory over the experimentally appropriate interval. Test direct MET stimulation as a competence control.
- **Decisive control and stopping rule:** Do not equate a lower phospho-MET band with weaker activation per receptor if total MET also falls. Advance to switch engineering only after identifying a controllable relay dependency.
- **Model boundary:** The memory state compresses a delayed relay. It is not a protein-synthesis/degradation model and its minutes-scale display is not the source study’s timescale.

## Immune and shared-resource projects

### TCR + LFA-1

- **Published anchor:** Ras-LOCKR-S reported Golgi and plasma-membrane Ras responses under distinct Jurkat stimulation conditions; CD3/CD28 and CD3/ICAM-1 conditions differed in more than a purely isolated LFA-1 input ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). This is the guide’s strongest directly relevant de novo reader precedent.
- **Proposed route, reader-first:** Begin with the published compartment-addressed reader architecture, not a new TCR actuator. Establish a low-burden expression range before adding a separately controlled, compartment-targeted perturbation.
- **Initial assay:** Match TCR input, define costimulation explicitly, and measure contact stability. Compare local Ras with an independent downstream response.
- **Decisive control and stopping rule:** Use a binding-defective reader and an expression titration. If location-dependent signals track probe abundance or altered adhesion, resolve that confound before inferring spatial cooperation.
- **Model boundary:** The workbench has no explicit Golgi or synapse states. Its lumped cooperation example motivates the spatial measurement but cannot reproduce it.

### IL-2R + IL-7R

- **Published anchor:** IL-2Rα abundance changed cytokine sensitivity, and a γc-sequestration/preassembly model accounted for aspects of the measurements; this is not proof that every complete receptor complex is preassembled in every relevant cell ([Cotari et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3896501/)). Receptor abundance is a central experimental variable.
- **Proposed route, discovery-first:** Find an intervention that changes A-associated γc allocation, then assess conditional extracellular masking or a regulatable receptor component. Do not substitute a downstream kinase inhibitor for a physical assembly intervention.
- **Initial assay:** Pair receptor-complex engagement or proximity measurements with branch-specific cytokine responses and surface abundance. Use controlled abundance strata rather than one bulk expression condition.
- **Decisive control and stopping rule:** Look for reciprocal release and recovery of B competence. If A signaling falls without evidence of altered allocation or B recovery, the proposed resource-release mechanism is not established.
- **Model boundary:** “Allocation gate” is an idealized operation. No validated molecular device is encoded by that control.

### IL-7R + IL-4R

- **Published anchor:** IL-7 preexposure reduced IL-4 responses through limiting γc availability in the studied T-cell context ([Gonnord et al.](https://www.science.org/doi/10.1126/scisignal.aal1253)). The asymmetry should be tested rather than assumed to be a universal cytokine hierarchy.
- **Proposed route, discovery-first:** Qualify an intervention that releases or prevents the relevant IL-7R-associated allocation. A conditional assembly-blocking binder would be a new development project, not a published γc switch.
- **Initial assay:** Compare both stimulation orders and washout intervals. Measure IL-4-proximal signaling together with receptor abundance and an assay of complex engagement.
- **Decisive control and stopping rule:** Distinguish ligand removal from receptor-complex disassembly. If signaling recovery occurs without verified release, retain trafficking or feedback as competing explanations.
- **Model boundary:** The invented association and release rates illustrate asymmetric competition. They should not be used as estimates of cytokine-receptor affinities.

### IL-7R + IL-21R

- **Published anchor:** The γc-limitation study also found diminished IL-21 responses after IL-7 preexposure ([Gonnord et al.](https://www.science.org/doi/10.1126/scisignal.aal1253)). It does not establish that every feature of the IL-4 experiment transfers to IL-21.
- **Proposed route, discovery-first:** Start with the same allocation hypothesis but qualify the relevant IL-21 response independently. Reuse a switch architecture only after proving its receptor-context behavior.
- **Initial assay:** Measure an IL-21-appropriate proximal output and surface receptor abundance over ordered-input conditions. Include a competence control independent of the proposed limiting assembly step.
- **Decisive control and stopping rule:** Avoid relying on one common STAT endpoint to identify which receptor changed. If the branch-specific result and shared endpoint disagree, resolve the measurement before changing the mechanism.
- **Model boundary:** No STAT3/STAT5 branching is modeled. The repeated topology is intentional and is not an independent quantitative fit.

### TLR2 → TNFR1

- **Published anchor:** TLR2 priming was associated with MAL-dependent TRADD membrane positioning and TRAF6 recruitment to a TNFR1-associated complex; direct receptor–receptor contact was not demonstrated ([Chang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4124019/)). The reported localization experiments supply a more concrete starting point than a generic NF-κB inhibitor.
- **Proposed route, adaptation after localization qualification:** Test whether controlled TRADD localization can replace the priming step. Conditional exposure of a validated localization motif in a de novo cage is a candidate; an established hybrid recruitment tool is the lower-engineering comparator.
- **Initial assay:** Compare priming, bypassed localization, and localization withdrawal before the later TNF challenge. Measure complex recruitment and early signaling before accumulated IL-6.
- **Decisive control and stopping rule:** Establish that the fusion preserves TRADD function and does not globally activate or suppress TNFR1 signaling. If the construct changes protein abundance or oligomerization, do not attribute its phenotype solely to localization.
- **Model boundary:** The memory variable is not MAL, TRADD, or ubiquitination. It encodes a qualitative priming dependency.

### TNFR → TLR4

- **Published anchor:** TNF-induced cross-tolerance involved GSK3, altered chromatin accessibility, and augmented negative feedback in macrophages ([Park et al.](https://www.nature.com/articles/ni.2043)). This is a distributed history-dependent mechanism, not a demonstrated single molecular connection.
- **Proposed route, discovery-first:** Separate formation of the tolerant state from its expression during challenge. Only after assigning a specific regulatory contribution should a conditional binding or localization element be developed.
- **Initial assay:** Compare perturbation during pretreatment with perturbation only during the later challenge. Read early signaling, transcription, and the candidate persistent state separately.
- **Decisive control and stopping rule:** A failed acute rescue does not exclude a role in writing memory. Stop a rapid-reversal claim if the relevant state does not reset within the measured intervention window.
- **Model boundary:** One inhibitory memory state replaces several processes. The simulator cannot predict chromatin restoration or gene-specific tolerance.

### Notch + TLR

- **Published anchor:** TLR signaling cooperated with basal Notch/RBP-J activity, while Hes1/Hey1 supplied gene-specific negative regulation; the effects were not uniform across inflammatory outputs ([Hu et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC2585039/)). Increased Notch target transcription did not require a corresponding acute increase in receptor cleavage.
- **Proposed route, adaptation with substantial validation:** A LOCKR-controlled localization motif on a validated Notch-pathway transcriptional component could test a defined temporal contribution. This extends localization control demonstrated in other contexts; it is not a published macrophage Notch switch.
- **Initial assay:** Measure the selected regulatory component and early target transcription alongside TLR-proximal activity. Keep the positive contribution and later repressor effects as distinct hypotheses.
- **Decisive control and stopping rule:** Include a gene expected to behave differently from the proposed target class. Broad transcriptional suppression is not evidence for a Notch–TLR-specific connection.
- **Model boundary:** The workbench does not simulate cleavage, RBP-J occupancy, or gene-specific feedback. Its early/late contrast is an analogy.

## Tool comparators and de novo extensions

### FGFR / SOS entry points

- **Published anchor:** OptoFGFR and optoSOS revealed different network responses and feedback dependencies; the constructs also differ in architecture and kinetics ([Dessauges et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9189677/)). Neither should be treated as a complete substitute for a native receptor.
- **Proposed route, established comparator before de novo adaptation:** Use the existing hybrid tools to localize a dependency. Add a de novo reader or motif gate only if the comparator exposes a specific missing capability.
- **Initial assay:** Compare measured Ras/ERK trajectories, expression, and baseline leak rather than matching illumination alone. Retain orthogonal downstream inhibition as a network-control condition.
- **Decisive control and stopping rule:** Loss of an interaction after bypass narrows the candidate region but does not uniquely identify a molecule. Stop a receptor-specific claim if the bypass also changes the relevant localization or feedback.
- **Model boundary:** The preset is a null-convergence exercise. It does not implement the source study’s resolved feedback architecture.

### IL-7R geometry

- **Published anchor:** EpoR surrogate ligands established peer-reviewed geometry-dependent signaling; the directly relevant de novo IL-7R fixed-geometry study remains a preprint and did not demonstrate dynamic switching ([Moraga et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4766813/); [Expòsit et al., preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/)). These are different evidence levels and different receptor systems.
- **Proposed route, frontier:** Establish a useful fixed-format IL-7R comparison before mounting validated binders on a designed hinge. A single molecule that changes geometry while maintaining binder identity and interpretable engagement is a separate tool-development objective.
- **Initial assay:** Compare receptor engagement, surface abundance, signaling time courses, and multiple relevant STAT outputs across fixed variants. Characterize the candidate hinge in purified form before adding membrane constraints.
- **Decisive control and stopping rule:** Hold stoichiometry constant where geometry is the claim, and measure assembly changes where it cannot be held constant. Do not call an avidity or valency change a pure geometry effect.
- **Model boundary:** The context slider has no distance, angle, or structural meaning. It is not evidence that an IL-7R geometry toggle is buildable from the preset.

### TLR3 valency

- **Published anchor:** De novo TLR3 minibinders produced substantially stronger reporter activation in multivalent formats than as monomers, while the signaling compartment remained unresolved ([Coventry et al.](https://www.nature.com/articles/s41467-025-56369-w)). The tested constructs were not dynamically switchable.
- **Proposed route, staged adaptation to frontier:** Use a validated binder and fixed formats first. If the result is informative, evaluate a designed assembly switch with measured oligomeric states; the hinge/assembly literature supplies biochemical precedent, not a validated TLR3 actuator ([Pillai et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/)).
- **Initial assay:** Quantify engagement, assembly, uptake/localization, and an early signaling output before relying on an integrated transcriptional reporter. Test the inducer on cells without the designed assembly.
- **Decisive control and stopping rule:** Rule out aggregates and unintended changes in receptor exposure. If the effective assembly state in cells cannot be assigned, report a format effect rather than a defined valency mechanism.
- **Model boundary:** The context axis does not calculate valency or endosomal access. It only represents a conditional gain.

### D1R + exoframe modulator

- **Published anchor:** Designed D1R GEMs showed distinct allosteric pharmacologies in a peer-reviewed study; this guide’s review of that paper is abstract-level and does not establish an acute reset mechanism ([Cheng et al.](https://www.nature.com/articles/s41586-025-09957-1)). The demonstrated modulator should not be renamed a switch.
- **Proposed route, frontier for dynamic control:** Reproduce and characterize a chosen fixed GEM first. Only then consider conditional interaction or availability, with membrane insertion and receptor co-trafficking treated as design constraints.
- **Initial assay:** Measure surface receptor, proximal coupling, arrestin where relevant, and orthosteric concentration–response behavior separately. Use the same reference ligand and analysis framework across conditions.
- **Decisive control and stopping rule:** Changing expression is not necessarily rapid reversible control. If GEM withdrawal does not release its effect on the necessary timescale, treat it as a chronic context comparator.
- **Model boundary:** The preset illustrates positive modulation only. It does not calculate bias, receptor-state populations, or GEM pharmacology.

### β2AR + Gαi history

- **Published anchor:** LOV2GIVe provides a light-controlled, receptor-independent Gαi input, and the study reported a potentiated subsequent β-adrenergic cAMP response associated with prolonged Gαi activity ([Garcia-Marcos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/)). The actuator is a naturally derived hybrid, not a fully de novo switch or a second named receptor.
- **Proposed route, established comparator:** Use the published actuator concept to distinguish acute inhibition from longer-lived sensitization. A de novo replacement should be considered only after it demonstrates a useful advantage in leak, recovery, localization, or selectivity.
- **Initial assay:** Measure proximal Gαi activity, acute cAMP, and the rechallenge trajectory after defined recovery intervals. Compare actuator expression and illumination controls independently.
- **Decisive control and stopping rule:** Distinguish biological memory from residual actuator activity and reporter integration. If the output does not reset but the actuator remains active, the experiment has not identified persistent downstream memory.
- **Model boundary:** The model combines abstract acute inhibition and slower permissive memory. It does not reproduce adenylyl-cyclase isoform biology or fitted cAMP kinetics.

## Common build–test decision sequence

- **Establish the phenotype without the new tool:** Define the cell context, receptor expression range, stimulus history, and proximal measurements. If the starting interaction is not reproducible, a switch will not make its interpretation more secure.
- **Validate the accessible payload or fixed geometry:** Test the component before introducing conditionality. Reject payloads whose broad effects make the intended causal comparison uninterpretable.
- **Characterize the assembled construct:** Measure both input states, leak, dynamic range, localization, expression dependence, and recovery. The final fusion, rather than its isolated domains, is the unit being qualified.
- **Separate actuator and reader:** Begin in matched populations if coexpression creates interference. Use orthogonal readouts and expression titration before combining them for within-cell timing.
- **Test competing explanations:** Include single-input conditions, a broad-output suppression control, and a null mechanism. Predefine which proximal result would favor one explanation over another.
- **Transfer cautiously:** Recheck the tool in a more relevant cell context after the tractable engineering model. Biological validation is not supplied by numerical agreement between the Python and browser solvers.

Do not impose universal leak percentages, response-time limits, or affinity targets across these projects. Set those criteria from the smallest biological difference that matters, the actual reporter precision, and the interval the experiment is intended to resolve.

## Practical priority

Start with TCR–LFA-1 if the immediate goal is a literature-grounded de novo reader application. Start with TrkB–mGluR5 if the goal is a new connection-selective perturbation and a suitable payload can be qualified. Start with TLR3 fixed formats if the goal is an eventual designed assembly actuator.

Keep γc allocation, dynamic GEM control, and IL-7R geometry toggling as explicitly staged development projects. A published building block makes a proposal plausible; it does not make its final receptor application validated.
