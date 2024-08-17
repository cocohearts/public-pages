# Recursion+DP
### Transition
- How do I build a state from a previous state?
- What information needs to be preserved? What information can be disposed of?
- How do I "unpeel" it by layers? Iterate?
### Backtracking
- If I want to explore multiple "children" of the current state, how do I return to the parent? how to keep track of the children?
- DFS traversal of the tree, in essence
### Memoization
- ==What computations are repeated?==
- What's a naive DP idea? How can I ==add info== to make a valid transition?
### Specific Tricks
- Permutations can be bitmasked
- Subarray DPs, such as digit substrings, or XORs from big-small index
- Use dx/dy for grid problems
- Utilize spatial locality
- If potential MLE discard DP layers no longer in use
- Almost *always* write iteratively
- Unless it's tree, in which case write recursively
# Data Structures
- Set, MultiSet are ordered BBST
- Unordered are hash tables
- ==Cheat with PBDS==, good for sliding window

- Fenwick Tree: ==last 2^n==, for range queries (not used)
- Segment Tree: just fill out to power of 2; consider "lazy Segment" or "Segment of Segment"
	- Remember PURS, RUPF, if needed consult Plat for RURS
- Use *explicit representation* (in 1D flattened array) for random access

- Stack, Queue, Deque: much better constant-time performance than other containers
- Priority Queue maintained by Heap, maintaining greater than children
### Graph Reps
- Adjacency Matrix: weight\[i]\[j]
- Adjacency List: adj\[i] lists all neighbors and corresponding weights of i
- Union-Find Disjoint Set: rep. partition of a collection as a forest, root of each tree is representative for set
- Greedy with Dijkstra's or Kruskal's using ==PQ==
### Tree Augmented DFS
- Includes Tree DP and Euler Tour
- Always Root
- Use DP Mindset-what can I memoize? ==Start with naive recursion==
### $\sqrt n$ Divide and Conquer
- Range queries: rep. as pairs $(a,b),$ sliding window by semantic order
- Basically Meet in Middle for $\sqrt N$ time
