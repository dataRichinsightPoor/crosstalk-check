# Controlling Receptor Crosstalk with Conformational Protein Switches

Data-Rich, Insight-Poor · No. CCLXVII

99 Small Problems · Installment 08 · Companion to Crosstalk Check

## From promiscuous signaling to experimentally identifiable connections

The most useful objective is not to eliminate receptor crosstalk. It is to make individual connections independently controllable, so an assay can distinguish a receptor's intrinsic activity from the contribution of its partners. I would therefore design a switch-enabled assay around a causal question: which connection can be interrupted, restored, or retimed without disabling the rest of the signaling system?

This report combines a literature synthesis with proposed research directions, covering GPCRs, receptor tyrosine kinases, cytokine receptors, immune receptors, integrins, and an innate immune receptor. Literature was checked through October 29, 2026; the analysis distinguishes published demonstrations, preprints, and proposed combinations rather than treating every promising component as an assay-ready platform.

The central recommendation is to start with established conformational switches and proximal measurements, then introduce de novo components only where they provide a missing capability. The highest-value new capabilities are likely to be state-selective binding, conditional exposure of an interaction surface, localization-dependent activity, and controlled receptor geometry.

## Define the crosstalk before choosing the switch

“Promiscuity” and “crosstalk” should not be interchangeable assay labels. For example, EMTA profiling identified multiple possible G-protein couplings for many receptors, but its authors explicitly distinguished coupling possibilities in a heterologous system from coupling realized in a particular physiological cell type ([Avet et al., eLife, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9005190/)).

Likewise, GPCR–RTK interactions can involve ligand release, receptor transactivation, physical association, and shared effectors; detecting the same terminal response does not identify which route was used ([Kilpatrick and Hill, review of GPCR–RTK transactivation](https://pmc.ncbi.nlm.nih.gov/articles/PMC7960640/)). My proposed classification below makes that ambiguity the starting point of assay design.

| Candidate mechanism | Question the assay should answer | Proposed switch intervention |
|---|---|---|
| Ligand cross-reactivity | Does the input engage more than its intended receptor? | Gate one receptor-binding interaction while independently measuring engagement of both receptors. |
| Receptor-complex allostery | Does the state of receptor A change receptor B through a physical complex? | Reversibly stabilize A's conformation or alter the candidate interface, while checking B's abundance and independent signaling. |
| Transactivation | Does A cause B to become activated, directly or through an extracellular mediator? | Gate the proposed relay and read B-proximal activation before a convergent downstream signal. |
| Shared-effector cooperation | Do independent receptor inputs jointly activate a downstream enzyme? | Gate one input to the shared effector without removing the other receptor. |
| Competition for a finite component | Does A change B's output by consuming G proteins, adaptors, phosphatases, or another limiting resource? | Acutely redistribute a candidate component and measure both pathways rather than only the suppressed one. |
| Spatial or temporal integration | Does the effect depend on compartment, pulse order, duration, or previous stimulation? | Localize or pulse the intervention, then compare matched input histories. |

A particularly useful mechanistic anchor is the TrkB–mGluR5 study: the authors proposed that BDNF-activated TrkB supplies Gβγ through noncanonical G-protein signaling, while mGluR5 supplies Gαq-GTP, with cooperation at PLC-β producing calcium oscillations and enhanced MAPK signaling ([Lao-Peregrin et al., Cell Reports](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). The experiments supported a requirement for mGluR5 activity and G-protein coupling, but not glutamate binding or direct receptor heteromerization; deleting the TrkB PLC-γ recruitment site did not abolish the oscillatory response ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)).

This changes the engineering target. If the interaction is cooperation at PLC-β, a switch that separates receptor molecules may be less informative than one that controls a G-protein contribution to PLC-β. Conversely, suppressing PLC-β itself would remove the shared output and would not identify which receptor supplied the critical input.

## Keep the reader separate from the perturbation

I would assign every engineered component one primary role: a reader reports a molecular event, a perturbation changes that event, and a controller uses a measurement to decide when to perturb. Combining these roles can be useful, but only after testing whether the measurement itself changes the biology.

This is a concrete concern, not merely a generic warning: Nb80 recognizes and stabilizes an active β2-adrenergic receptor conformation, whereas Nb37 recognizes the nucleotide-free Gαs intermediate associated with activation, so the two probes report different molecular events and are not interchangeable indicators of “GPCR activity” ([Irannejad et al., Nature, 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC5037407/)). Similarly, the Ras-binding domain in Ras-LOCKR can potentially buffer Ras-GTP; the investigators tested ERK perturbation in their system but did not establish universal noninterference with all Ras outputs ([Zhang et al., Nature Biotechnology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)).

For a new assay, I would initially put the perturbation and the principal readout in separate matched cell populations. Once each is characterized, coexpression can test within-cell dynamics, with expression titration and an orthogonal endpoint used to establish whether combining them alters the result.

### Why maximum affinity is not the right design objective

A simple equilibrium model illustrates the trade-off:

\[
K_d=\frac{k_{\mathrm{off}}}{k_{\mathrm{on}}},
\qquad
f_{\mathrm{bound}}\approx\frac{[S]_{\mathrm{free}}}{K_d+[S]_{\mathrm{free}}}.
\]

Here, \(S\) is a state-binding sensor and the expression assumes a simple, nondepleting 1:1 system. Lowering \(K_d\) may improve occupancy and signal, but it can also increase perturbation; achieving tighter binding through a slower off-rate can additionally make recovery too slow for the biological event.

The design objective should therefore be the smallest perturbation compatible with the required signal-to-noise ratio and time resolution. I would prioritize a usable affinity window, fast enough disengagement, low basal activity, and appropriate localization over the strongest binder obtainable.

## What the literature already makes possible

### Conditional exposure of an interaction surface

LOCKR established a de novo cage–latch–key architecture in which a key displaces a latch and exposes a previously sequestered functional sequence; the published work demonstrated control of protein interactions and cellular functions rather than merely a computational structural model ([Langan et al., Nature, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6733528/)). Subsequent work demonstrated two distinct directions of control: key-dependent exposure of an ITAM for phosphorylation in vitro, and kinase-dependent exposure of functional sequences, including split-GFP outputs tested in cells ([Woodall et al., Nature Structural & Molecular Biology, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8601088/)).

The ITAM result was not a demonstration of switch-controlled T-cell signaling, and the cellular split-GFP output was not a reversible real-time readout ([Woodall et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8601088/)). The study separately showed that dephosphorylated switches lost their ability to activate subsequently added GFP fragments, illustrating why reversibility of the molecular switch and reversibility of its reporter must be tested separately ([Woodall et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8601088/)).

The important engineering idea is that the output need not be a fluorescent protein. For crosstalk experiments, I would consider a caged competitor, adaptor-binding motif, localization signal, or regulatory domain, provided its uncaged specificity is established first.

Co-LOCKR extended this logic to AND, OR, and NOT recognition of cell-surface antigen combinations, but its input was antigen presence and colocalization, not proof that two receptors were signaling simultaneously ([Lajoie et al., Science, 2020](https://www.bakerlab.org/wp-content/uploads/2020/08/Lajoie-coLOCKR2020.pdf)). An intracellular activity-coincidence detector would be a new engineering application, not an already validated capability of that surface-targeting system.

### Light-controlled binding and pathway bypass

Opto-nanobodies were created by inserting a LOV2 domain into nanobody loops, with demonstrated reversible binding control for fluorescent-protein targets and endogenous actin; attaching an opto-nanobody to SOS and using a membrane-localized target enabled light-dependent Ras–ERK control ([Optogenetic control of protein binding, Nature Communications, 2020](https://www.nature.com/articles/s41467-020-17836-8)). The study did not demonstrate a general light-switchable library of GPCR-conformation nanobodies, so transferring the architecture to such binders requires new screening ([OptoNB study](https://www.nature.com/articles/s41467-020-17836-8)).

LOV2GIVe provides a complementary intervention: it exposes a GIV-derived Gα-binding-and-activating motif under illumination, enabling receptor-independent activation of Gαi proteins, with a cellular activation decay of approximately one minute in the reported pulse experiment ([Garcia-Marcos et al., eLife, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/)). It is not a universal G-protein actuator and does not reproduce every regulatory feature of an activated GPCR ([Garcia-Marcos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/)).

These are useful for bypass experiments: if a receptor-dependent interaction disappears when the input is moved directly to a downstream node, that constrains where the interaction can occur. It does not, by itself, establish that the bypass generates the same spatial or temporal signal as the native receptor.

### A de novo sensor at a genuine convergence point

Ras-LOCKR is especially relevant because target recognition opens a designed conformational switch, enabling a FRET readout of endogenous Ras activity; compartment-targeted variants resolved different Ras responses at the plasma membrane, Golgi, and signaling assemblies ([Zhang et al., Nature Biotechnology, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). In Jurkat cells, the study distinguished Golgi-associated Ras activity under CD3/CD28 stimulation from plasma-membrane activity under CD3/ICAM-1 conditions; the costimulation context therefore differed, rather than isolating LFA-1 as the only changed variable ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)).

That finding makes compartment-specific Ras sensing a strong starting point for receptor cooperation assays. I would use Ras-LOCKR as a reader before attempting to repurpose it as a feedback actuator.

The FRET and proximity-labeling versions must be interpreted separately: Ras-LOCKR-S reports dynamics, whereas Ras-LOCKR-PL accumulates biotinylation over labeling windows and records an integrated neighborhood rather than an instantaneous signaling state ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/)). A proximity-labeling hit would therefore nominate a candidate mediator, not prove that it caused an acute crosstalk event.

## What is genuinely new in de novo design

### Designed GPCR ligands: a growing inventory of recognition modules

The 2026 study “De novo design of miniproteins targeting GPCRs” combined RFdiffusion, structurally diverse MetaGen scaffolds, sequence design, and experimental screening across 11 receptor targets, with agonist or antagonist activity established for multiple designs ([Muratspahić et al., Nature, 2026](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)). Its optical pooled receptor-diversion assay identified binding through altered receptor trafficking, which is not itself a functional agonism or antagonism assay ([Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)).

This paper supplies potential receptor-recognition modules for future switches, but the binders are not automatically conformational switches. A further engineering step must make their binding, localization, or activity externally controllable.

The paper also provides an important assay warning: some MRGPRX1 designs looked substantially more effective in amplified calcium assays than in proximal G-protein and arrestin measurements, and the authors explicitly cautioned that choosing an active or inactive receptor structure does not reliably determine the resulting pharmacology ([Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/)). I would therefore screen a candidate switch payload for binding, signaling efficacy, and branch selectivity separately.

### GPCR exoframe modulators: controlling the receptor from its membrane-facing surface

GPCR exoframe modulators, or GEMs, are de novo proteins designed to engage GPCR transmembrane domains; the D1-receptor study reported agonist-positive, negative, and biased allosteric modulators, including rescue of activity in several loss-of-function receptor mutants ([Cheng et al., Nature, 2026](https://www.nature.com/articles/s41586-025-09957-1)). The accessible primary abstract establishes those categories, but not the detailed quantitative selectivity or kinetics needed to specify an assay reagent ([Cheng et al.](https://www.nature.com/articles/s41586-025-09957-1)).

For assay development, the compelling possibility is an independently addressable allosteric control surface outside the orthosteric ligand site. My proposed extension would make the GEM–receptor interaction conditional, allowing orthosteric occupancy to be varied separately from the allosteric perturbation; the demonstrated GEMs should not be described as externally reversible switches on the evidence reviewed here.

### Multistate design: engineering a landscape rather than one structure

Guo and colleagues combined alternative-backbone generation, AlphaFold-guided analysis, multistate sequence design, and NMR validation to engineer a troponin-C-derived protein whose conformational populations and calcium affinity could be tuned ([Guo et al., Science, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC13310074/)). This is a strong multistate-design proof of concept, but it is not a wholly de novo cellular receptor controller: the scaffold was derived from a natural protein, the measured affinities were in the millimolar range, and cellular switching outputs were not demonstrated ([Guo et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13310074/)).

The reported microsecond internal exchange should not be confused with a measured microsecond ligand-to-output response ([Guo et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13310074/)). For a crosstalk tool, I would still require measurements of input binding, output engagement, localization, and complete recovery.

### Allostery without a large structural movement

The 2026 study “Artificial allosteric protein switches with machine-learning-designed receptors” inserted circularly permuted ligand-binding domains into reporter proteins and generated 47 β-lactamase switches; selected constructs showed large biochemical dynamic ranges, and ligand-dependent bacterial growth was demonstrated ([Artificial allosteric protein switches, Nature Biotechnology, 2026](https://www.nature.com/articles/s41587-026-03081-9)). Its NMR and HDX-MS data supported a mechanism involving altered dynamics and stabilization without an obvious global conformational rearrangement, although the entropy-coupling model remained a mechanistic interpretation rather than a fully resolved transmission pathway ([same study](https://www.nature.com/articles/s41587-026-03081-9)).

The practical lesson is that a visible hinge motion is not required for useful allostery. Conversely, the reported response times of minutes to tens of minutes and the absence of a demonstrated mammalian receptor-crosstalk assay limit immediate use for resolving rapid signaling events ([same study](https://www.nature.com/articles/s41587-026-03081-9)).

### Switchable assemblies and receptor geometry

De novo allosterically switchable assemblies demonstrated ligand-dependent changes in oligomeric state and shape, including changes in ring stoichiometry and a dimer that changed shape while retaining its oligomeric state ([Pillai et al., Nature, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/)). The reported ring switching occurred on the order of hours under the tested conditions, and cell-surface receptor control was a prospective application rather than a demonstrated assay ([Pillai et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/)).

Separately, a cytokine-receptor geometry preprint used rigid de novo scaffolds to vary receptor arrangements and reported altered STAT signaling and functional outputs across several systems, including IL-7, interferons, and IL-10 ([Expòsit et al., bioRxiv, 2025, preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/)). Those were panels of fixed geometries, not individual molecules switched dynamically between geometries ([Expòsit et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/)).

Joining these capabilities is an attractive research direction: one molecule could change receptor spacing or rotation without changing binder identity. However, that combination remains a proposal and would need to distinguish geometry from changes in valency, avidity, occupancy, and receptor internalization.

### Emerging methods worth watching, but not treating as ready-made tools

- **Phosphorylation-induced protein switches:** A 2025 preprint described de novo components that use low-populated conformational states to regulate a designed interaction and reported phosphorylation-dependent reporter transcription in cells; the accessible evidence here was abstract-level, so kinase selectivity, acute kinetics, and reset behavior remain unverified in this review ([Buckley et al., bioRxiv, 2025](https://www.biorxiv.org/content/10.1101/2025.09.10.675034v1)).
- **Diff-Switch:** A July 2026 preprint described diffusion-based sampling of conformational ensembles for downstream multistate sequence design; its accessible abstract did not establish the experimental success rate or cellular performance needed to rank it as a validated assay platform ([Omidi et al., bioRxiv, 2026](https://www.biorxiv.org/content/10.64898/2026.07.20.739027v1)).
- **Fully designed light-responsive switches:** A preprint posted October 28, 2026 reported retinal-binding de novo proteins with light-driven conformational switching, more than a 30-fold increase in binding upon illumination, and control of intracellular interactions and signaling receptors; only the abstract was accessible, so receptor identities, detailed kinetics, repeated-cycle performance, and cellular requirements were not independently checked here ([Hilditch et al., bioRxiv, 2026](https://www.biorxiv.org/content/10.64898/2026.10.26.761880v1)).

The last result is unusually close to the desired long-term tool: a designed input, a designed conformational transition, and a designed interaction output. I would place it on the immediate full-manuscript evaluation list, not use its abstract alone to choose a first implementation.

## GPCRs: separate conformation, coupling, and consequence

A GPCR assay should not reduce these layers to a single “activation” score. TRUPATH measures changes in BRET between engineered heterotrimeric G-protein components, while EMTA primarily detects recruitment of effector-based sensors to activated G proteins and uses a distinct tagged-Gαs approach for its Gs measurement ([Olsen et al., Nature Chemical Biology, 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7648517/); [Avet et al., eLife, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9005190/)).

For a switch-enabled GPCR study, I propose a layered readout set rather than simultaneous measurement of everything:

- **Receptor layer:** Surface abundance, ligand engagement where measurable, and a conformation-sensitive probe appropriate to the specific receptor.
- **Transducer layer:** A proximal G-protein measurement, plus arrestin recruitment when the hypothesis concerns trafficking or arrestin-dependent regulation.
- **Compartment layer:** Receptor localization and a local signaling measurement, collected separately if optical interference or probe burden is substantial.
- **Convergence layer:** Ras, ERK, calcium, or cAMP dynamics chosen to match the proposed interaction.
- **Functional layer:** A downstream phenotype appropriate to the biological question, treated as a consequence rather than a substitute for the molecular mechanism.

An important distinction is whether a switch stabilizes a receptor state or blocks a transducer-binding surface. An intracellular active-state binder might maintain an “active-looking” receptor while competing with the very transducer whose signaling is being measured; I would test those possibilities with independent conformation and coupling readouts rather than infer function from state-probe recruitment.

The effect of signaling history also deserves explicit treatment: LOV2GIVe expression potentiated a later β-adrenergic cAMP response in the reported system, consistent with sensitization following prolonged Gαi activity, despite the usual acute inhibitory relationship between Gαi and adenylyl cyclase ([Garcia-Marcos et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7515630/)). Thus, I would compare acute pulses, sustained activation, washout, and rechallenge rather than classify the interaction from one endpoint.

## Beyond GPCRs: what changes with receptor class

### RTKs: use bypasses to localize feedback

OptoFGFR and optoSOS provide interventions at different levels of the Ras–ERK pathway, and their comparison has revealed different feedback and adaptation behavior depending on the entry point ([Dessauges et al., Molecular Systems Biology, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9189677/)). A truncated or relocalized optogenetic RTK construct is therefore a controlled input module, not automatically an equivalent of the full native receptor ([Dessauges et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9189677/)).

I would compare native receptor stimulation, a receptor-proximal engineered input, and a downstream SOS input at matched Ras trajectories where possible. If crosstalk survives the downstream bypass, the candidate mechanism moves downstream; if it disappears, the result narrows the possibilities but still requires localization and feedback controls.

### Cytokine receptors: distinguish geometry from signal strength

The geometry-tuning preprint reported examples in which IL-7-like designs separated pSTAT1 and pSTAT5 responses and interferon-like designs separated MHC-I and PD-L1 induction, but it did not establish direct occupancy-matched comparisons across all ligands ([Expòsit et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/)). These results motivate geometry as an independent experimental axis, while leaving room for differences in efficacy, occupancy, residence time, and cell context.

My first assay would use fixed geometry variants before a dynamic switch, with full concentration–response and time-course comparisons. Only after identifying a reproducible, mechanism-relevant difference would I engineer reversible geometry control.

### TCRs and integrins: preserve mechanics when changing signaling

An optogenetic CAR–LOV2 system separated ligand-binding lifetime from occupancy and resolved progressively stronger kinetic discrimination through ZAP70 recruitment, LAT clustering, and DAG production ([Britain et al., eLife, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536835/)). Crucially, changing the adhesion strategy to LFA-1–ICAM-1 improved the ability to measure proximal events and changed what proofreading behavior could be detected ([Britain et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536835/)).

This is a warning for any “orthogonal” assay: the supposedly supporting adhesion module can affect what is observable. I would explicitly measure contact area, adhesion, and receptor occupancy when testing whether integrin input changes the duration requirement for immune-receptor signaling.

An OptoIntegrin–OptoMatrix system used a photoswitchable extracellular interaction to control adhesion, spreading, and ERK phosphorylation, but did not directly establish the proposed force-driven integrin conformational transition ([Baaske et al., Communications Biology, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6325061/)). A switch experiment should therefore include mechanical readouts, not interpret every ERK change as direct biochemical receptor crosstalk.

### Innate receptors: valency is a mechanistic variable

De novo TLR3 minibinders provided a useful example of binding versus signaling: multivalent constructs induced substantially more NF-κB reporter activity than monovalent binders, while the cellular location of activation remained unresolved in the reported assays ([Coventry et al., Nature Communications, 2025](https://www.nature.com/articles/s41467-025-56369-w)). This suggests a possible valency-switch assay, but not proof that a particular designed geometry reproduces native TLR3 activation.

I would use such a system to ask whether a second receptor changes the clustering requirement or the downstream response to a matched clustering input. The intervention must hold binder identity constant and separately quantify receptor engagement and assembly.

### Synthetic receptors: useful comparators, not untouched native systems

T-SenSERs used computationally designed assemblies of natural receptor-derived components to convert soluble VEGFA or CSF1 inputs into c-MPL-associated signaling, with activity demonstrated in engineered T cells ([Rath et al., Nature Biomedical Engineering, 2025](https://www.nature.com/articles/s41551-025-01532-3)). They are modular engineered receptors, not wholly de novo proteins or direct reporters of the native VEGFR/CSF1R signaling mechanism ([Rath et al.](https://www.nature.com/articles/s41551-025-01532-3)).

I would use such rewired receptors as causal comparators: hold an extracellular input approximately constant while changing the intracellular signaling route. A changed crosstalk phenotype would then nominate a role for intracellular architecture, subject to expression and occupancy matching.

## Seven proposed assay concepts

The concepts below are research proposals, not claims that the complete systems have already been demonstrated. The feasibility rankings refer to the amount of new engineering and validation I would expect relative to the other proposals, not to guaranteed success.

### A connection-specific gate

The aim is to remove one contribution to receptor cooperation without shutting down either entire receptor pathway. Candidate payloads include a localized competitive motif or regulatory domain whose selectivity has first been validated in its constitutively accessible form.

- **Architecture:** A LOV2 or LOCKR-derived gate controls payload accessibility near the candidate junction.
- **Question:** Does interrupting this connection reduce the interaction between inputs A and B while preserving their independent proximal signals?
- **Decisive evidence:** The gated intervention and an independent perturbation agree; reopening restores the effect; a payload-binding mutant fails to reproduce it.
- **Main risk:** A supposedly local payload sequesters a shared cellular component and suppresses several pathways.
- **Priority:** High, once the mechanistic junction and an adequately selective payload are known.

For TrkB–mGluR5, the initial hypothesis would concern the contribution of Gβγ or the noncanonical G-protein route to PLC-β cooperation, anchored in the published GBAi, GRK2-CT, and Gαq perturbations ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). I would not assume that any one of those inhibitors is already selective enough to become a clean switch payload.

### A compartment-specific interruption with a local reader

The aim is to distinguish plasma-membrane cooperation from endosomal or Golgi integration. Rather than alter receptor trafficking globally, I propose recruiting a validated inhibitory payload to one compartment for a defined interval.

- **Architecture:** An addressable recruitment module positions the perturbation; a separate local sensor reports its effect.
- **Question:** Does receptor A change B's output through a particular signaling compartment?
- **Decisive evidence:** The local signaling response changes with the appropriate compartment-targeted intervention, while receptor abundance and signaling in a control compartment remain interpretable.
- **Main risk:** Localization tags, recruitment, or the inhibitor itself alter trafficking or the amount of accessible substrate.
- **Priority:** High to medium; begin with local sensing, then add the perturbation.

Ras-LOCKR supplies a demonstrated local reader at the plasma membrane and Golgi, while the β2-adrenergic nanobody work supplies precedent for distinguishing receptor activation and G-protein activation at endosomes ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/); [Irannejad et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5037407/)). Retargeting an actuator or reader to a new compartment remains a separate validation task.

### A receptor-state clamp independent of orthosteric input

The aim is to ask whether a partner receptor responds to receptor A's conformational state, its downstream signaling, or simply its presence. This requires an allosteric perturbation that can be varied independently of the orthosteric stimulus.

- **Architecture:** A conditional state-selective binder or a controllable GEM-like interaction.
- **Question:** At matched receptor abundance and measured ligand engagement, does changing A's allosteric state change B's proximal activity?
- **Decisive evidence:** B changes before the shared downstream reporter, and the effect survives controls for altered ligand occupancy and shared-transducer depletion.
- **Main risk:** The clamp changes receptor trafficking or blocks transducer access rather than cleanly controlling the intended conformational ensemble.
- **Priority:** Medium to long term; build and characterize the nonconditional binder before adding switching.

The component-level precedents are conformational nanobodies, GPCR miniproteins, and GEMs; none establishes that this complete independently controllable state-clamp assay is already available ([Irannejad et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5037407/); [Muratspahić et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC13692778/); [Cheng et al.](https://www.nature.com/articles/s41586-025-09957-1)).

### A pulse-order experiment that tests signaling memory

The aim is to determine whether crosstalk requires simultaneous inputs or whether one receptor creates a permissive state that persists after its initial activity. This can be more informative than comparing single versus combined endpoint stimulation.

- **Architecture:** One rapidly controllable protein switch paired with a second independently controlled stimulus; two optical actuators are optional rather than assumed.
- **Question:** Are A→B, B→A, and simultaneous A+B equivalent after matching delivered input as closely as possible?
- **Decisive evidence:** A reproducible order-dependent response remains after measuring actuator recovery, receptor desensitization, and reporter lag.
- **Main risk:** Apparent cellular memory is actually slow switch dissociation or accumulated reporter output.
- **Priority:** High with an established switch and a fast readout.

I would start with several pulse delays rather than a large frequency-encoding experiment. Only after calibrating the complete optical and biochemical transfer functions would I test whether distinct temporal patterns can separate receptor contributions.

### A receptor-geometry toggle

The aim is to vary receptor organization without changing the identities of the binding domains. This is particularly attractive for cytokine receptors and clustering-dependent innate receptors.

- **Architecture:** Receptor binders mounted on a ligand-responsive hinge or assembly that changes spacing or rotation.
- **Question:** Can an acute geometry change alter the ratio or duration of proximal signaling outputs at similar receptor engagement?
- **Decisive evidence:** A geometry-sensitive physical measurement changes alongside signaling, while valency, occupancy, surface abundance, and internalization are quantified.
- **Main risk:** The switch alters avidity or assembly size rather than the intended geometric coordinate.
- **Priority:** Long term; fixed-geometry panels should establish the biological opportunity first.

The proposal combines experimentally demonstrated switchable assemblies with separately demonstrated fixed receptor-geometry designs; the combined dynamic receptor assay has not been established by those studies ([Pillai et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/); [Expòsit et al., preprint](https://pmc.ncbi.nlm.nih.gov/articles/PMC12632830/)). The hours-scale behavior of some published assemblies is a serious constraint for fast signaling experiments, not a detail to ignore ([Pillai et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11338832/)).

### An activity-coincidence recorder

The aim is to capture cells in which two receptor-proximal activities overlap, even if the final population average obscures that subpopulation. Such a tool would be especially useful for heterogeneous coexpression systems.

- **Architecture:** Two validated activity-recognition modules jointly expose a reporter-generating output.
- **Question:** Which cells experience coincident A and B activity, and does that history predict the later phenotype?
- **Decisive evidence:** The truth table is validated for both inputs, and the coincidence window is measured using controlled pulse delays.
- **Main risk:** The construct detects receptor abundance or sequential input accumulation rather than simultaneous signaling.
- **Priority:** Medium to long term; use independent live-cell measurements as the ground truth during development.

LOCKR and Co-LOCKR provide useful logic architectures, but the proposed activity inputs and temporal definition would require new engineering ([Langan et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC6733528/); [Lajoie et al.](https://www.bakerlab.org/wp-content/uploads/2020/08/Lajoie-coLOCKR2020.pdf)). If the output is irreversible labeling, I would call it a recorder and explicitly avoid interpreting its endpoint as current receptor activity.

### A dynamic signal-matching comparator

The aim is to ask whether a late phenotype is explained by the amplitude and duration of a shared pathway or requires some additional receptor-specific information. I propose using a switch-controlled pathway input to match one measured trajectory across different receptor contexts.

- **Architecture:** A separately measured ERK or Ras signal guides adjustment of an optogenetic input.
- **Question:** If contexts A and A+B have matched ERK trajectories, does their functional difference persist?
- **Decisive evidence:** Matched trajectories are verified in individual cells or appropriately stratified populations, and the remaining phenotype is reproducible.
- **Main risk:** The controller bypasses relevant upstream organization or matches one reporter while missing other pathway dimensions.
- **Priority:** Medium, after open-loop input–output calibration.

This would not prove that the matched pathway is irrelevant if a phenotype remains. It would test the narrower claim that the particular matched trajectory is insufficient to explain the difference.

## A first pilot I would actually prioritize

I would not begin by designing a completely new photoreceptor or a four-input protein logic circuit. I would begin with one receptor pair, one hypothesized junction, a proximal measurement for each input, and a fast convergence readout.

### Mechanistically anchored pilot: TrkB–mGluR5

This pair is attractive because the literature provides both a defined cooperation model and perturbations that distinguish canonical TrkB signaling from the proposed G-protein route ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)). The pilot below is a proposed assay-development sequence, not a completed experiment or a claim of a validated switch construct.

- **Establish the baseline:** Reproduce the receptor-pair interaction without a switch, checking receptor abundance and each receptor's proximal activity.
- **Localize the dependence:** Compare a perturbation of the proposed junction with a general downstream inhibitor; use the latter only as a positive control for suppressing the output.
- **Validate the payload:** Determine whether the constitutively accessible payload preserves enough independent receptor signaling to answer the question.
- **Add conditional control:** Engineer the best payload into a switch only after its specificity and cellular effect are understood.
- **Resolve timing:** Apply the intervention before, during, and after initiation of the interaction, with calcium dynamics and a separate ERK measurement as complementary outputs.
- **Test restoration:** Reopen the connection and establish whether the effect recovers on a timescale compatible with the measured switch reset.

The minimum factorial comparison would contain eight conditions: neither input, A alone, B alone, and A+B, each in the two switch states. For the TrkB–mGluR5 example, constitutive mGluR5 activity means that “B absent” cannot simply mean “no glutamate”; receptor activity must be independently defined and checked, consistent with the published ligand-independent contribution of mGluR5 ([Lao-Peregrin et al.](https://www.cell.com/cell-reports/fulltext/S2211-1247(23)01607-8)).

The most informative result would be loss of the interaction-dependent feature while both receptors retain interpretable independent activity. The least informative result would be a uniform fall in every readout, which could reflect broad inhibition, substrate sequestration, or cell stress.

### Lower-engineering alternative: TCR–integrin spatial integration

If the priority is learning rather than building a new switch immediately, I would first reproduce the compartment-specific Ras comparison using a low-burden reader and controlled TCR/integrin inputs. The published Ras-LOCKR and optogenetic kinetic-proofreading studies provide direct reasons to examine both signaling location and the adhesion context ([Zhang et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11631767/); [Britain et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC9536835/)).

The next intervention would be chosen from the observed dependence. That avoids committing to a sophisticated actuator before knowing whether the relevant variable is biochemical cooperation, contact stability, or signal duration.

## Quantifying interaction without overcalling mechanism

For a factorial experiment, let \(Y_{AB,s}(t)\) denote a response under receptor inputs A and B and switch state \(s\). A useful initial interaction contrast is:

\[
I_s(t)=Y_{AB,s}(t)-Y_{A,s}(t)-Y_{B,s}(t)+Y_{0,s}(t).
\]

The switch-associated change in interaction is then:

\[
\Delta I(t)=I_{\mathrm{open}}(t)-I_{\mathrm{closed}}(t).
\]

These expressions define interaction on the chosen additive response scale, not a universal biological synergy metric. A nonlinear reporter, saturation, or a change in dynamic range can alter \(I_s\) without changing the underlying receptor connection.

For that reason, I would report \(\Delta I\) together with the effects of switch state on A alone, B alone, and baseline. An attractive candidate intervention reduces the interaction term while preserving the relevant proximal single-input responses; equivalence margins should be set from assay variability and the biological question rather than chosen after seeing the result.

I would also analyze more than amplitude:

- **Timing:** Onset, peak time, recovery, and the delay between proximal and downstream events.
- **Dynamics:** Oscillation frequency, pulse count, duration above a prespecified threshold, and adaptation.
- **Spatial distribution:** Local versus global activity and the fraction of cells with compartment-specific responses.
- **Heterogeneity:** Whether a population mean reflects weaker signaling in every cell or loss of a responsive subpopulation.
- **History:** Whether response differences survive washout and depend on the order of inputs.

For interpretation, it helps to write the measured signal schematically as

\[
Y_{\mathrm{obs}}(t)=(h_{\mathrm{reporter}}*X)(t)+\epsilon(t),
\]

where \(X\) is the biological activity and \(h_{\mathrm{reporter}}\) represents reporter lag and filtering. This is a model, not a claim that a particular reporter is linear; its purpose is to prevent an unmeasured sensor timescale from being mislabeled as signaling memory.

## Validation criteria that determine whether the tool is useful

I would use the following as go/no-go criteria before making a mechanistic claim. They apply to de novo and naturally derived switches alike.

- **A complete state-control set:** No switch, switch without input, input without switch, a binding-defective payload, and constitutively accessible or inaccessible controls where interpretable.
- **An expression window:** A range in which the result is reproducible without gross changes in basal activity, receptor abundance, or the independent pathway responses.
- **Measured whole-system kinetics:** Activation and recovery of the biological output, not only a purified-protein conformational transition.
- **Optical compatibility:** Direct testing of whether imaging activates the actuator, whether stimulation alters the reporter, and whether two intended inputs are actually independent.
- **Occupancy and trafficking checks:** Enough information to distinguish altered signaling from changed ligand engagement, receptor internalization, or surface abundance.
- **Orthogonal readouts:** At least one measurement that does not rely on the same binding interface or reporter chemistry as the principal sensor.
- **Alternative perturbations:** Agreement with a second way of testing the proposed junction, accompanied by evidence that the perturbations do not merely share the same broad downstream effect.
- **Restoration:** Recovery after releasing the perturbation, or a justified alternative rescue when the intervention is not rapidly reversible.
- **Mechanical controls when relevant:** Adhesion, contact area, receptor mobility, or force-related measurements for immune and adhesion-receptor systems.
- **A context check:** Reassessment in a more relevant expression or cellular setting after the tractable engineering model is established.

I would not require every desired property to be perfect before using a tool. I would require its limitations to be measured closely enough that they cannot plausibly account for the central conclusion.

## Design strategy and final recommendation

For de novo work, I would use a staged design–build–test loop: define the causal connection, validate an unswitched payload, specify the required operating range, design conditional accessibility or multistate behavior, test both intended and undesired states, and only then integrate the component into the receptor assay. A good static structure would be an entry criterion, not evidence that the switch has the desired dynamics or pharmacology.

The most important design improvement is negative design against the wrong cellular behaviors: basal exposure, binding to the wrong state, inappropriate compartment localization, sequestration of shared effectors, and slow release. I would rank a modest but interpretable switch above a larger dynamic range obtained by changing the network it is supposed to interrogate.

My recommended order is:

- **Start with a connection-specific perturbation or a pulse-order experiment:** These most directly test mechanism with a manageable number of engineered components.
- **Add compartment-specific sensing next:** This can reveal why an apparently shared pathway produces different outcomes.
- **Use de novo GPCR binders or multistate scaffolds to solve a defined missing capability:** Do not add them solely because they are newer.
- **Pursue geometry toggles and activity-coincidence recorders as dedicated tool-development projects:** Both could be unusually informative, but each requires its own validation before becoming a receptor-crosstalk assay.

The coherent long-term objective is a set of independently controllable signaling connections, not a perfectly insulated synthetic cell. A successful assay should let us say which information passes between receptor systems, where that transfer occurs, when it matters, and what remains unchanged when the connection is interrupted.

## Scope and evidence limits

This is a targeted mechanistic synthesis rather than an exhaustive systematic review. Full-text primary material was available for many of the foundational and recent studies; GEM details were limited to the accessible primary abstract and supporting discovery, while the Hilditch, Buckley, and Diff-Switch preprints were evaluated only to the level supported by their accessible abstracts.

Author and repository searches were attempted for the most recent or inaccessible manuscripts, and no missing kinetic, cellular, or specificity details were inferred. The proposed hybrid constructs, priority rankings, mathematical contrasts, and pilot designs are analytical recommendations; none is presented as an experimentally validated construct or a completed laboratory result.
