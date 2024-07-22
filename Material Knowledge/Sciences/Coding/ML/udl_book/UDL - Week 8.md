## Chap 14: Unsupervised Learning
![[Pasted image 20240502173833.png]]
For *generative* models, we have some parameters that determine how something gets generated. In the case of random gen models, the loss function is likelihood of generating the training data $\sum_{x}-\log(Pr(x_{i}|\phi))$.

Unsupervised models learn unstructured info, i.e. "latent variables," on unlabelled data.
## Chap 15: GANs
### Setup
Simple as it sounds. Generator $g(z_{j},\theta)$ creates a sample given normally drawn $z_{j},$ and then discriminator $f(x,\phi)$ determines $Pr(x\text{ real}).$

Generator wants its samples to be marked as real; discriminator wants to be correct. Given fixed $\phi,\theta,$ the params $\theta$ move in the direction that maximizes discriminator logscore given random $z_{j}$, while $\phi$ moves in direction that minimizes logscore given generated $x_{j}$.
### Difficulty
If the discriminator becomes "too smart" or "too stupid" there are vanishing gradients.
#### Theory
The optimal discriminator says, "$x$ is either real or generated. Then given distributions of real and generated objs, I can determine likelihood of being real: $Pr(\text{real}|x)=\frac{{Pr(x)}}{Pr(x)+Pr(x^{*})}.$

In particular, the loss $L(\phi)$ can be expressed as Jenson-Shannon divergence $D_{JS}\left[ Pr(x^{*})\lvert  \rvert Pr(x) \right].$ 
Vanishing gradient is due to this divergence behaving poorly, so instead pick *Wasserstein earth-mover's distance*, i.e. map probability masses, and integrate total mass-distance. Defined as
$$
D[Pr(x),q(x)]=\max_{{f}}\left[ \int Pr(x)f[x] \, dx -\int q(x)f[x] \, dx  \right],
$$
where $\lvert \nabla f \rvert\leq 1.$

Then new loss for the discriminator $$
L[\phi]=\sum_{j}f[g[z_{j},\theta],\phi]-\sum_{j}f[x_{i},\phi].$$
Lipschitz constraint guaranteed by clipping weights, or regularization.
### Implementation Tricks
#### Progressive growing
GAN generator usually CNN. First train to generate 4x4, and then add more to go to 16x16, etc.
#### Mini-batch
Create stats across activations e.g. in discriminator, add regularization to force generator to create diversity
#### Manipulating latent variables
Self-evident
#### Conditional
Pass a vector into both the generator and discriminator, and give matching conditional vector for real samples in discriminator. For text, vector is transformer embedding.

Conversely, discriminator can be called to predict attributes, called InfoGAN.
#### Usual tricks
Careful regularization, step scheduling, ADAM+SGD