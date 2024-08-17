source [here](https://github.com/Voultapher/driftsort/blob/main/src/drift.rs)
rust new version of std::sort, called `driftsort`

for small cases (<=20 elem) it does either insertion sort (for `NonFreeze` types that can be mutated during comparison, or `Arc` that can't be copied byte by byte)

in general it does quicksort using a weird $n^{\log_{8}3}$ recursive median of 3s algorithm
they do a fun thing with incrementing lower pointer, decrementing larger pointer, swap when bump into a swap that can be made

and if a $\sqrt{ n }$ run is found it does some merging using mergesort

takeaways:
- lots of hardware-centric optimizations
	- branchless arithmetic computations
	- small compiled code for instruction-cache
	- different sorting algorithms depending on level of safety
and then ofc quicksort is good for cache locality to begin with

also learned about `CMOVE` which only moves data on a conditional, instead of branching on a conditional
- branch mispredictions can be expensive
there are some sort9/sort13 things hardcoded in for smallsort

### Quicksort
there's two ways to execute quicksort partition
- hoare, have left pointer coming right and right pointer coming left which swap
- lomuto, have pointer coming right and "last swapped" pointer which is last below item, swap with first higher when encounter new lower
https://github.com/Voultapher/sort-research-rs/blob/main/writeup/lomcyc_partition/text.md

swap optimizations:
- "branchless": instead of doing conditional branches (high overhead cuz of mispredict), just make copies of both and choose using arithmetic
- "cyclic permutation": a swap is acutally "store, move, move" so amortized 3 per swap
- if you just put a "gap" in and manage correctly then only amortized 2 per swap

also about "sort safety", apparently C people think users should make sure their sort functions are weak strict sorting, as opposed to 