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