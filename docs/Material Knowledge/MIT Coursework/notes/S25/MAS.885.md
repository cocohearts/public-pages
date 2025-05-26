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
### mass spectrometry
Goal is to measure mass-to-charge ratio of ions. Steps:
- liquid chromatography: separate with a sand-like compound (slightly polar), aka ion mobility (how well it moves through stuff)
- for floppy proteins, can filter using ion mobility, hydrogen / deuterium swap (check if # exposed hydrogen spots is as expected)
- convert into gas ions with a laser or electrospray
	- dissolve in some buffer / water / ethanol, spray through some small hole, and then apply a voltage on the way out; droplets split from internal electrostatic
	- "Bare ionized" means no H's, but usually it'll collect a bunch of H's, either because the side chains are polarized, or the peptide itself has charge
- send it down an electric gradient field (func of charge) with some counter-drift (func of mass / size), this field is created by *quadrupole*. The voltage has a DC and an AC/radio voltage. Quadratic distance with AC will pull back/forth side to side, but DC will pull up. Only specific ratios keep stable oscillating paths; other oscillation paths degenerate and crash into the sides.
- figure out speed, or rate of oscillation, or time to travel
- triple quad uses normal quad to separate proteins, then breaks them up with N2, then separates the fragments, to get even more info; fragmentation with some enzyme can confirm you've got the right peptide sequence

The resulting output spectrum has nice discretization; large molecules can pick up many H+'s.

The raw spectra you get out of a triple quadrupole has four dimensions:
- specific protein
- peptide fragments of that protein
- number of charges on that fragment
- any isotopes in that fragment
that you need to decompose. This is why mass spectrometry allows us to date stuff with carbon in it—because we can decompose the isotope dimension.

Mass spectrometry is done to within 10PPM. The best orbitrap setups are 0.5ppm usually.
### final project learnings
- dsup from tardigrades binds to nucleosomes to protect dna, one guy tried it to protect ovarian cells since free radicals from monthly cycle can damage dna
- sonoporation for thick-walled gram positive bacteria, use of an enzyme to try to produce concrete without huge carbon exposure
- using bacteria to eat up / clean up pollution in all kinds of ways
- yzx using siRNAs to interfere with mRNA for a specific carcinogenic gene in ovarian cancer cells, use the existing RNA-induced silencing complex (RISC) to control expression
- lots of biosensors—just attach gbfp to a binding thing for a "genetic circuit"