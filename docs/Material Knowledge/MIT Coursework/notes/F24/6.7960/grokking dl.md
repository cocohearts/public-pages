contrastive loss:
- for pair $i,j$ get similarity score $s_{ij},$ then contrastive for $i$ is cross-entropy of $s_{ii}$ among ${s_{ij}}_{j}.$
structured vs unstructured prediction
- unstructured: $L_{1}$ loss between U-net image output and true sample; the pixels are not correlated with each other/have no structure
- structured: GAN, discriminator ensures that pixels have to tell a cohesive story "together", instead of just being "somewhat accurate" on a pixel-by-pixel basis
Conditional VAEs work by taking normal VAEs but then learning to generate output when conditioned on text embedding
- At inference random $z$ is taken as input into decoder, along with conditioning text embedding
Diffusion model: condition on text embedding at every step, each step is U-net that produces next de-noising step
- Inference: Specifically if we're currently at $x_{t}$ (where we start with $t=T$) then we generate some noise $\epsilon$ and then $x_{t} = x_{0}(1-\gamma)^{0.5}+\epsilon\gamma^{0.5}$ so we recreate $x_{0}$ and grab the next $x_{t-1}$ (from a Gaussian) conditioning on this $x_{0}$ and $x_{t}$
- Training loss: from generating $\epsilon$ and $x_{t},$ then trying to predict $\epsilon$ and MSELoss
- Can just use U-nets, with cross-attention with text embedding prompt
	- Cross attention: at multiple steps in each U-net we break image into patches, conv/linear each patch into a query, and then cross-attention with values, keys generated from text
	- Then we get attention values, get our weighted values, conv some more then add back into corresponding patch latent and continue U-net
Then we have VQA; image tokens, then text tokens, and pass into autoregressive to get output answer.
Also, don't forget flow matching. CNF is faster than diffusion, at each step it returns $v^{\tau}$ which tells you where each point moves, condition output $v^{\tau}$ on input with usual conditioning techniques. Here $\tau \in[0,1],$ so that $p_{0}$ is noise (starting distrib) and $p_{1}$ is target distrb.
Then just move the unit Gaussian and you get output
"flow matching" is when our loss is $\lVert v^{\tau}_{\theta}-u^{\tau} \rVert$ for some $u$ that we derive.

pi0 paper
big VLM model, stack an action expert onto it
inference architecture:
- feed language tokens, image, joint positions, current action latents into model
- robot tokens use action expert weights, image/text use vlm weights
- output the $v^{\tau}$ that's used for flow matching
![[Pasted image 20241114010511.png]]

Here's a causal-attention-transformer-based image gen cookbook:
![[Gen Models 3 (dragged) 1.pdf]]
Use a discriminator to ensure embeddings actually capture all relevant information, then quantize so that we can train transformer to infer the next patch based on previous patches.

GAN is nice cuz discriminator implicitly learns the representative set, i.e. loss, instead of the concrete training set we give in supervised learning.

Typical stats might have us learn a mixture of two gaussians, or three gaussians. VAE wants infinite mixture of gaussians, i.e. each unit normal latent $z$ corresponds to a gaussian, and we want the resulting infinite mixture to match well with training data.

Want to maximize log prob of drawing $x$ from the infinite gaussian. Tricky to estimate the integral involved in this double conditional, so we do
- Monte Carlo: sample a couple, take the average
- Importance sampling: draw $z$ according to some distribution $q$ based on $x,$ then we get $$ p_{\theta}(x)=\mathbb{E}_{z \sim p_{z}}[p_{\theta}(x|z)]=\mathbb{E}_{z \sim p_{z|x}}\left[ p_{\theta}(x|z) \cdot \frac{p_{z}(z)}{p(z|x)} \right]. $$Nominally $p(z|x)$ is the inverse map of $p(x|z),$ i.e. $p(z|x)=p(x|z)\cdot \frac{p(z)}{p(x)}.$ Alternatively, we want to sample from points $z$ with large probability mass. Recall that $p_{z}(z)$ is unit Gaussian here.
- Predict sampling: Instead of trying to compute $p(z|x)$ we just learn it, in the form of an encoder $q(z|x)$ returning mean and variance.

Mathematically, we try to fit $q(Z|x)$ to $p(Z|x),$ i.e. minimize KL-divergence of this across all $x,$ i.e. improve accuracy of our sampling prediction. This looks like, for each training sample $x,$ trying to minimize
$$
KL(q(Z|x)||p(Z|x))=\mathbb{E}_{z\sim q(Z|x)} \log \left[ q(Z|x) \div \frac{p(x|Z)p_{z}(z)}{p_{\theta}(x)} \right] .
$$
By assumption $p(x)$ is fixed (probability of grabbing training data) so we can simplify to maximizing
$$
\mathbb{E}_{z\sim q(Z|x)} \log q(z|x) - \log p(x|z) - \log p_{z}(z) = \boxed{KL(q(z|x)||p_{z}(z)) + \mathbb{E}_{z\sim q(Z|x)}-\log p(x|z)}.
$$
This is what we get for fitting importance sampling to the Bayesian inverse sampling.

We also want to minimize the original loss. Using Jensen's,
$$
\begin{align*}
-\log p_{\theta}(x)
&=-\log \mathbb{E}_{z \sim p_{z|x}}\left[ p_{\theta}(x|z) \cdot \frac{p_{z}(z)}{q(z|x)} \right]\\
&\leq \mathbb{E}_{z \sim p_{z|x}}-\log \left[ p_{\theta}(x|z) \cdot \frac{p_{z}(z)}{q(z|x)} \right] \\
&= \mathbb{E}_{z \sim p_{z|x}}\log \left[ \frac{q(z|x)}{p_{z}(z)} \right] + \mathbb{E}_{z \sim p_{z|x}}-\log(p_{\theta}(x|z) )\\
&= \boxed{KL(q(z|x)||p_{z}(z)) + \mathbb{E}_{z\sim q(Z|x)}-\log p(x|z)}.
\end{align*}
$$
Now we have both our importance sampling loss and original training loss set to the same values, so we can minimize together.
Note that the equality case of the Jensen's is that no matter the $z$ we draw, the importance sampler $q(z|x)$ yields a value proportional to $p(x|z)p_{z}(z),$ i.e. the likelihood of drawing $x$ from the generator after first sampling $z$ from uniform normal.

This is our loss from *each individual* $x,$ so the goal is in fact not to make the weighted average of all $q(z|x)$ to uniform normal, but we want *each one* to go to uniform normal.

Then no matter the input, we can just assume we can draw the latent from uniform normal and we're fine.