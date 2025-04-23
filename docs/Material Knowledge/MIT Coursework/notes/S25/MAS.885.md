learning to apply engineering principles to biology
- hierarchical composability
- standardized "parts"
- plug-and-play for manufacturing, etc. all kinds of stuff
### protein design part 1
- alpha helices, encouraged when gap of 3/4/7 have hydrogen bonding
- beta-sheets, bonds form between strands connecting into a sheet, side chains alternate
- beta-helix takes beta-sheets and it turns around an axis
### protein design part 2
- ml / dl based!
- there's a lot of techniques—gnn PorteinMPNN for struct2seq, RFDiffusion for func2struct, transformers (?) AlphaFold for seq2struct, MLM for protein modelling for downstream, etc.
- have a specific protein can try to denature it with a target (ubiquitous protein cutting), generate a structure that will bind to it, etc.
- design flow for de novo design:
	- pick a binding site to target
	- generate thousands of de novo structures
	- generate hundreds of thousands of sequences
	- verify, filter, simulate, etc. cut down to a hundred or so
- space for: new autoencoder for structure? how to encode 3d structure automatically?
### genetic circuits/gibson assembly
can hack genes, viruses, etc. explore 
gibson assembly
epigenetic editors
lots of crispr variants exist (eg crispr13 for rna)
hard to get crispr to hit without creating cancers
paradigm for viral genomic editing:
1. promoters - on switches
2. capsid - delivery vehicle
3. virtal auxiliary sequences - packaging
4. delivered gene - eg crispr system for editing
### golden gate assembly
learned about for hw! and did a whole simul in benchling
take your vector—e.g. pGGA, often used for GGA
figure out which GGA enzyme you want to use
GG enzymes cut outside of recognition site, hence you can cut the recognition sites *out* of the fragment and no self-ligation, no double-cutting
so then take the desired fragment, and design a primer that overhangs outside of said fragment with the recognition site and the matching overhang from the plasmid
then after PCR with designed primers, can GGA and ligate with plasmid in same tube, very happy!
### genome circuits
can utilize promoter/activation/etc. circuits (2-input AND types, e.g.) to create targeted mRNAs
Easy example is [Strand Therapeutics](https://www.strandtx.com/strandtx-solutions/). Self-replicating RNA drug that only activates when reacting to specific micro-RNA signatures in cells. Then it'll activate expression of {lysis, antigens, inflammation signaling} etc.
Check out paper: https://www.nature.com/articles/s41589-018-0146-9
How to create a genetic circuit that will only activate? can directly use stuff as repressor/activators. The synthetic RNA codes for binding proteins that bind to my RNA if desired compound is NOT present (they will destabilize without existence). Similarly can also code for binding proteins that bind to my RNA if desired compound IS present. Finally include replicon sequence from RNA viruses to make self-propagating copies in cells where it is expressed (i.e. target cancer cells). Am a little scared of mutations in synthetic RNA.
### synthetic cells
make synthetic membranes from lipids, called cell-free systems. they can be freeze-dried, are well understood, just take the pieces that you want and mass-manufacture them with microfluidics. this gives you small easily reprogrammable biomachines. can be used for protein manufacturing, testing, color-based rna matching etc.
### biomanufacturing + ginkgo
The goal is to gradually reduce biology to engineering. Engineering is reducing a problem to a detailed, controlled, reproducible pipeline where each stage can be iterated on in a way that should yield desired product at scale.
As in normal engineering, there are three parts:
- Design: either creating a novel protein, or taking an existing protein and finding a novel enzyme pathway from feedstock (sugar, oil) to synthesize that protein. The key idea is to use evolutionary pathways that nature has found—de novo enzymes are very hard. Ideally find some map of existing enzyme pathways to get the desired. Search databases, but also ML-based design that learns from "focused selection" after iterated modeling / testing. Enzyme design is FUCKING HARD so you get this 'lab-in-the-loop' mechanic.
- Build: Ginkgo has a big, programmable, protocol-based, modular robotics platform for biology at scle, complete with a scheduling 'OS' and train tracks to shuffle live organisms from one station to another. Usual assembly and insertion methods. Steps: chassis selection (E. coli, or beer yeast S. cerevisiae), design, fermentation, processing, QC. Want to utilize natural feedback loops where possible, e.g. yeast produces ethanol. Robotics systems have been custom-built for specific pipelines, but want a generalizable one.
- Test: "part validation" (checking intermediate steps). Evolution factors in a bunch of self-clean-up, garbage collection etc. that we have to control for / optimize for in vitro.
## History of folding algos
Generally, can measure entropy and enthalpy; free energy is some kind of funnel, there are several local minima ie there can be multiple ways to fold, but we want to find the local minima that has a "big receptive field"

Proteins have hierarchical structure, with secondary, tertiary etc. *Homology modeling* assumes new proteins will be similar to old ones with similar sequences; find similar sequences with pairwise alignment or large batched multi-sequence alignment (MSA). This works because similar sequences have shared evolutionary ancestors, which then might have similar functions. 

*Rosetta* (2000) replaced fragments one at a time, and then tried to be smart about positioning the fragments relative to each other. Combination of de-novo physics with assumptions over fragments from database and statistical torsions.

Then was *molecular dynamics* using basic physics simulation on individual atoms and molecules. Using "state models" instead of direct Markov simulation, cluster individual short paths into "states" and construct a brief graph between clustered states. This was competitive with Rosetta for small molecules de novo.

Then came covariance modeling; if residues in sequences evolved together they're probably touching. Called *direct coupling analysis* Instead of direct input to modeling, this became indirect by adding as loss into a model that output score matrix. Don't need previous folded proteins like homolog; only need previous proteins. Output contacts fed into e.g. Rosetta. Came in 2010s with cheap sequencing. Helped with protein-protein modeling. Use a `Potts model` modelling log-likelihood of proteins as $h_{i}(x_{i})+J_{ij}(x_{i},x_{j})$ and then directly maximize likelihood.

*Alphafold 1* used MSA input with a 2D CNN to generate residue contact map then gradient-based folding algo.

Then was *Alphafold 2* using
- a deep MSA
- Evoformer with 48 sequential full attention/cross attention transformer blocks between embedded MSA sequences and representation of the pair interactions
- structure module iteratively refining geometric backbone to match pair interactions representation (partly true analog representation e.g. distance, angles)
- uses MSA but all folded proteins were learned into model weights, no homolog stuff

> Alphafold 2 structure, with computation pipeline
![[Pasted image 20250419181313.png]]

The pair representation is supposed to replicate contact solving / other related residue pair properties, but in DL neuralese. Structure module then solves folding.

The Evoformer (later called Pairformer, because it conditions on just a single representation and pair representation) thinks of $(r,r,c)$ as a directed graph where each edge is labeled with a dim-$c$ vector. Use "triangle updates" that are multiplicative instead of attention-softmax.

*Rosettafold* (2021) came out shortly after, and was similar in idea but simpler. It went for the more custom-tuned, less-resource-intensive DL tradeoff, with three parallel tracks for MSA, residue-residue, and SE(3) equivariant coordinates, that run iteratively and cross-attention talk to each other. Because it's "simulating MD with DL techniques" it can do more novel stuff than single-sequence, e.g. solving complexes. Because of Baker's compute limitations they couldn't do long proteins, meaning Rosettafold failed at long sequences.

Shortly after Meta stepped in with *ESM-2*, a large Transformer masked-loss protein sequence encoder. They followed up with ESMFold, a folding module that uses output representations to create a structure. No MSA needed. ESM also enabled "design by inpainting".

*ProteinMPNN* is a GNN with input as a protein backbone, and it tries to predict the amino acids autoregressively. Start by message passing with coordinates, relative angles, distances, etc. with edges determined by residues close to one another. An encoder does the message passing, and a decoder determines amino acid probabilities / does an "update" for message passing. Amino acids can be determined autoregressively, but randomly is also fine. Trained on folded labeled data, maybe with noise.

*RFDiffusion* is the new kid on the block. The architecture is, given point cloud, use previous predicted structure as conditioning, generate new structure, and interpolate the point cloud. The RF blackbox uses the same parallel track trick. They then finetuned it to condition on various inputs, e.g. symmetry, binder, etc. Because the RF module is conditioned on structure, you can just keep the ligand fixed and don't diffuse those points. Similarly, you can constrain the point cloud to always be symmetric, and the RF output will be symmetric. Used for vaccines, proteins, etc.

*EvoDiff* uses discrete diffusion to generate novel protein sequences directly, without working with structure or an MPNN module to extract amino acids out of structure. Also from Meta, just unsupervised on hundreds of millions of sequences.

> Alphafold 3 architecture
![[Pasted image 20250419180433.png]]

*Alphafold 3* uses Alphafold 2-style MSA / paired attention, but it deemphasizes the MSA (lower embedding dim) and adds a single-sequence latent. Both get fed into a 48-block Pairformer, which is then recycled. The structure module got replaced with a diffusion module that just uses the outputs from the MSA and the pairformer. The pairformer uses both attention-based and multiplication-based triangle updates, meaning computation is cubic in the length of the sequence.
### mass spectrometry
Goal is to measure mass-to-charge ratio of ions. Steps:
- convert into gas ions with a laser or ionization
- send it down an electric gradient field (func of charge) with some counter-drift (func of mass / size)
- figuring out speed, or rate of oscillation, or time to travel
For quadrupoles, if ratio of EM force to mass force isn't in a specific window, it will oscillate "off-center" and not reach the detector.

Ions can be formed through electrospray, i.e. dissolve in some buffer / water / ethanol, spray through some small hole, and then apply a voltage on the way out. If electrostatic exceeds surface tension, the droplet will just explode. "Bare ionized molecule" just means all the extra H's are removed.