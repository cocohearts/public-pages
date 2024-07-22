## Chap 11: Residual Networks
### Residual blocks
so convnet is pretty good, and deep networks are pretty good
but really deep networks have "shattered gradients" aka multiple orders of derivative have high Lipschitz
so we introduce "residual blocks," aka taking
$$h_3=f(h_2,\phi)+h_2.$$
Then after a bunch of composition, the final expression is
$$h_n=f(h_{n-1})+f(h_{n-2})+\dots+h_1.$$
In other words, residual networks are actually, more realistically, an ensemble of correlated shallow networks, each of which take different "short" paths through the network.
### Batchnorm
Each hidden node activation $h_i$ gets rescaled. Inside of the batch, take the statistical mean and variance, and then rescale so it has mean $\sigma_i$ and variance $\gamma_i$. Then make $\sigma_i,\gamma_i$ additional learned parameters for each node.

After training and before testing, take statistical parameters across the entire training dataset and "lock them in."

In theory this helps because it lets us directly control/regularize for mean/variance at nodes that might otherwise be hard to control.
#### Batchnorm Variants: Ghostnorm, Layernorm, Groupnorm, Instancenorm
- Ghostnorm: take some samples from this batch randomly
- Layernorm: go instance by instance, taking samples from this entire layer, as opposed to from the whole batch (better for text/images sometimes)
- Groupnorm: Normalize within groups of channels, as opposed to by layers of channels
- Instancenorm: normalize within each channel separately, taking stats only from pixels in that one channel
### U-Nets, Hourglass
Take the convolutional encoder/decoder from last time, but now make it residual. Specific properties may have been lost through the "compression" in the middle, so when re-upscaling, concatenate the "original image" with the same resolution from the other side before mapping. If only valid convolutions are taken then cropping is necessary.
Iterate this several times for "stacked hourglass networks".
## Chap 12: Transformers !!
### Premise
- Long input sequence of long vectors
- Sequence of vectors out that carry information in some way
### Desirable Properties
- Works no matter sequence length
- Inputs can talk to each other/interact with each other/determine each other's "context"
### Basic Implementation
Matrices $\Omega_k,\Omega_q,\Omega_v$ for key, query, value
1. $\Omega_v$ maps input vectors to their *values*
2. $\Omega_q,\Omega_v$ maps input vectors to their *key* embeddings and *query* embeddings
3. Final embedding of input $x_i$ is softmax *linear combination* of values $v_i$ determined by *dot product* $k_j\cdot q_i$

Position can be encoded by adding to the inputs

In matrix form:
- $X$ has input as column values
- Matrices for values, keys, queries being $\Omega_i X$
- As a reminder: 
	- $X\colon \mathbb{R}^N\to \mathbb{R}^D$ with $N$ inputs, embedding length $D$
	- $\Omega_i\colon \mathbb{R}^D\to\mathbb{R}^l$ mapping to key/query vectors with length $l$
- Attention coeffs are $A=softmax\_col(K^TQ)$
- Final output is $V\cdot A$

We can do *multihead* meaning several such transformers are running at once. 

A normal transformer *layer* is
![[Pasted image 20240324220323.png]]
Finally, we train GPT3 using *encoder-decoder*.
![[Pasted image 20240324220421.png]]
We can train GPT3 very cheaply and unsupervised-ly:
![[Pasted image 20240324220524.png]]
Anddd that's it.