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