### CNNs
CNN is sliding window matrix convolution (indices backwards), fit the kernel "inside" the input
in_channel * out_channel * kernel_size ** 2
other args are dilation (whether it "reaches far"), stride (it "moves fast"), padding

ConvTranspose2D is the opposite; consider conv1D from $\mathbb{R}^{m}\to \mathbb{R}^{m-k},$ then this is the transpose matrix
kernel goes "outside" the input; replace every cell with kernel \* cell, then attach kernel multiple relative to cell
![[Pasted image 20241029133757.png]]
usually have U-net structure, with width halving, channel doubling, using kernel size 4, stride 2, padding 1. Previous side length $n$ becomes $\frac{n+2*p-k}{s}+1=\frac{n}{2}.$
### VAEs
Want inputs to give gaussians. Specifically, we ask for
- encoder $f(x)$ to generate mean $\mu$ variance $\sigma$ (usually covariance) to sample latent from
- decoder $g(z)$ takes noised latent and creates image
From discretizing the conditional integral on latent $z$ and sampling, we can use ELBO approximation to bound by sum of representation loss and KL divergence. The $\beta$-VAE adds a $\beta$ term to the KL divergence.

Recall the parametrization trick, where we draw random $\epsilon \sim \mathcal N(0,1)^{l}.$ Then our e2e network for this "playthrough" is $(f_{\mu}(x)+\epsilon f_{\sigma}(x))$ and our loss is $\lVert g(f_{\mu}(x)+\epsilon f_{\sigma}(x))-x \rVert + KL.$
### VQ-VAEs, RVQ
Snap the latents to a learned quantized codebook (or even just round them), so that we're able to one-hot encode latents.
When backprop, assume gradients of un-quantized latents equal those of quantized latents.
RVQ is when we have multiple rounds; quantize, take the residual, quantize *that*, etc.
### Transformers
Tokens are vectors. We map them to queries, keys, or values with linear maps (W&B). Token $i$ asks token $j$ about its information; so token $i$ cares about token $j$ to the extent of $q_{i}\cdot k_{j}=a_{ij}.$ We then softmax along the key dimension, so that for each query we have a distribution of which tokens $j$ token $i$ should attend to. These probabilities are then used to get weighted value vector for each token.

In typical LLM transformers, we apply causal self-attention, meaning we set logits for tokens after token $i$ to $-\infty$ before softmax so that later tokens don't affect output of beginning tokens.
> [!important] Note about "forcing end tokens"
> At inference time, we still have to apply causal self-attention, meaning if we feed in $n$ tokens we get $n$ outputs, the first $n-1$ of which are just the last $n-1$ of our input. There's lot of redundancy near the end of the model because tokens are constrained to become "what we already know", hence speculative decoding.

This is the self-attention block. The full transformer block, as used in GPT2, is
- residual stream $r$
- add `attent(layer_norm(r))` to residual stream
- add `mlp(layer_norm(r))` to residual stream
Then we add a final layernorm and a final linear map to get logits that tell us what token's actually next.

Recall:
- vocab_d
- token_d
- value_d
- token_d
- value_d
- ...
- token_d
- MLP -> vocab_d
### Mamba
SSMs, classically $h'(t)=Ah+Bx, y=Ch$ are basically RNNs. The "latent/hidden" variable is what serves up the magic. By this formulation, expanding shows that it's performing a global convolution $y_{t}=\sum_{i}(CA^{t-i}B)x_{i}.$ This convolution is "linearly time invariant," cannot really perform selection.

Existing SSM strategies are able to select or ignore tokens based on their content using $H_{3},$ but we want selective context learning.

We have $A,B,C$ depend on the input $x$. Specifically we have fixed $A,$ learn $B,C$ from the input $x,$ discretize $A,B$ using input-specific $\Delta$  then apply SSM. Switching from the differentiable version of SSM, $\Delta$ indicates how long to hold onto the current signal for.

Then at train-time, when expanding the whole thing we can write as a masked convolution of input yielding output. Can directly backprop on this. $A$ can be initialized according to HiPPPO (some matrix that has good properties).

Basically, we independently determine the importance $B$, effect on output $C$, and time to hold $\Delta$ as linear maps of input $x$.

Assuming single-dimension $x_{t},$ we have $h_{t}=\bar{A}h_{t-1}+\bar{B}x_{t}, y_{t}=Ch_{t}$ where $h_{t}\in \mathbb{R}^{N},$ $\bar{A}\in \mathbb{R}^{N\times N}, \bar{B}\in \mathbb{R}^{N\times 1},C\in \mathbb{R}^{1\times N}.$ Keep in mind that $\bar{A}$ is diagonalized so is expressed in $N$ values, we call this "structured".

For Mamba specifically the $B,C$ are generated as linear functions of $x,$ $\Delta=\tau_{\Delta}(P+s_{\Delta}(x))$ where $s_{\Delta}$ is linear mapping to $\mathbb{R}^{1}$ broadcast to dimension $D$, $\tau_{\Delta}$ is softplus $\ln ({1+e^{x}})$.
![[Pasted image 20241018231105.png]]
In the below algorithm, $D$ is `block_expand` times dimension of resid. stream (dimension after Mb inLP), $N$ is SSM hidden state size. Finally note that SSM is applied independently over each of the $D$ channels, and hidden state has dimension $DN$ i.e. it's like D-many SSMs stitched together.

Also the convolution is over all tokens, in the dimension direction $L$. At inference time we cache the last `conv_kernel` many inputs to compute the next one.
![[Pasted image 20241018231118.png]]
![[Pasted image 20241018231303.png]]
![[Pasted image 20241018231149.png]]
![[Pasted image 20241104160141.png]]
#### Training details for Mamba
![[Pasted image 20241104141804.png]]
Used
- gradient clip 1.0
- weight decay 0.1
- linear lr warmup with cosine decay to 1e-5
- RMSNorm
- AdamW with $\beta=(.9, .95)$
![[Pasted image 20241104154434.png]]