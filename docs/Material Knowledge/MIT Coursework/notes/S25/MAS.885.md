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
## History of folding algos
Generally, can measure entropy and enthalpy; free energy is some kind of funnel, there are several local minima ie there can be multiple ways to fold, but we want to find the local minima that has a "big receptive field"


Start with basic rules: do some DP with some cost matrices, maybe use covariance (correlated evolutionary mutations), figure out which bps / amino acids are touching. Then twist and turn to put them together.
