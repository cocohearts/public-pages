## Chap 13: GNNs
Applicable for
- maps, molecules, social networks, paper citations
### Setup
Embed nodes with long vectors associated with each node
Edges embedded in 1/0 adjacency matrix, sometimes dual edge graph adjacency matrices and edge embeddings
*We want* the model to output new embeddings for each node that describes its context in the graph
### Motivation
We want GNNs to respect relevant symmetries, specifically *permutation of nodes*
As a result, the best we can do is *sums of neighbor embeddings*
At each layer, for each node:
- take sums of embeddings for neighbors and self
- linear transform and activation
So each subsequent layer will be
$$H_{k+1}=a(\beta_k 1^T+\Omega_kH_k(A+I))$$
Each $H_k$ has $N$ columns of length $D$, for $D$-dimensional embeddings, $N$ nodes
### Tricks
Batching is difficult for monolithic fill-in-the-blank graphs, it can be done by
- sampling subset of neighbors randomly, for the receptive field from each layer
- dividing graph deterministically to minimize lost edges
With multiple graphs of similar size, zero-padding to use tensor trick