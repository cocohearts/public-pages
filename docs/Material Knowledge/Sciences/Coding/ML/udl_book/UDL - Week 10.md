Variational autoencoders have two paradigms: probabilistic and regularization.
### Preliminary: KL divergence
From $Q$ to $P$ defined as
$$
\begin{align}
D_{KL}(P \parallel Q) &= \int P(x)\log \left( \frac{P(x)}{Q(x)} \right)  \, dx  \\
&= - \int P(x)\log \left( \frac{Q(x)}{P(x)} \right)  \, dx.
\end{align}
$$
## Chap 17: VAEs
### Probabilistic
Latent $z$ drawn from normal Gaussian (prior), and a NN $f[z,\phi]\to \bar{x}$ generates samples, then add another normal Gaussian for noise.

Then loss is $$
L(x,\phi)=-\log \left[ Pr(f=x) \right] =-\log \left[ \int Pr(z,x|\phi) \, dz  \right] .$$
Integral is intractable. Let's make another NN $q[x,\theta]\to\bar{z}$ generating mean and covariance that models the posterior for $z$, and then $$
\begin{align}
\log \left(\int Pr(x,z|\phi) \, dz\right)  &=\log \left(  \int q(z|x,\theta) \frac{{Pr(x,z|\phi)}}{q(z|x,\theta)} \, dz  \right) \\
&\geq \int q(z|x,\theta)\log \left(  \frac{{Pr(z)Pr(x|z,\phi)}}{q(z|x,\theta)}\right)  \, dz  \\
&=\int q(z|x,\theta)\log \left( Pr(x|z,\phi) \right)  \, dz + \int q(z|x,\theta) \log \left( \frac{{Pr(z|\phi)}}{q(z|x,\theta)} \right) \, dz  \\
&= \mathbb{E}_{q(z|x)}\log(Pr(x|z))-D_{KL}\left[ q(z|x,\theta)\lvert  \rvert  Pr(z) \right] .
\end{align}$$
The term after Jensen's is called *Evidence Lower Bound.* Recall that $Pr(z)$ the prior is unit normal.

Then in this final form, the first term can be approximated with a fixed sample $z,$ and the second term can be explicitly computed (both are known Gaussians).

For gradient descent, fix a unit normal "source of randomness" $\epsilon$ and then rewrite to deterministic, get sample etc.
### Regularization
Our network is just $$
x\underset{g=q}{\to}(\bar{z},\sigma(z))\underset{\text{sample}}{\to} z^* \underset{f,\phi}{\to} x^{*}$$
The trained $\sigma$ adds noise to our sample. In theory we could just do $x\to z\to x^*,$ but then it would just spit out what we gave in.

Furthermore the latent variable has been compressed. The final expression in earlier derivation makes sense; if $q(z|x,\theta)$ truly resembles $Pr(z)$ then the first term is exactly what we wanted to compute. This ELBO allows us to integrate over not-quite-the-prior by making us pay for distance from the prior. Hence, we can add hyperparameter $\beta$ as the coefficient of the KL-divergence.

The placeholder $q(z|x,\theta)$ is not an inverse/discriminator in the conventional sense; it just serves as an implicit compromise mechanism for computing the true negative log likelihood.
## Chap 18: Diffusion Models
Now shuffle GAN/VAE/Normalizing, and multiple by 100.

Given input $x$ we have a *diffusion kernel* defined: $z_{0}=x,$ $z_{t}=z_{t-1}\sqrt{ 1-\beta_{t} }+\epsilon\sqrt{ \beta }$ for unit normal $\epsilon.$

Notice that if $\sigma(z_{0})=1$ then by sum-of-squares $\sigma(z_{t})=1,$ so we can infer the distribution for any $t$ as $z_{t}=z_{0}\sqrt{ \prod_{i}\left( 1-\beta_{i} \right) }+\epsilon \sqrt{ 1-  \prod_{i}\left( 1-\beta_{i} \right) }$. Call $\alpha_{t}=\prod_{i}1-\beta_{i}$ so that $z_{t}=z_{0}\sqrt{ \alpha_{t} }+\epsilon \sqrt{ 1-\alpha_{t} }$.

Eventually, we get unit normal back. Now our goal is to create NNs $f_{t}(z_{t},\phi_{t})$ that represent the mean of the conditional distribution $q(z_{t-1}|z_{t})$. Specifically $f_{T}$ has input (unit normal, $\phi_{T}$) outputting the new mean.

We apply the same trick as earlier:
$$
\begin{align}
\log \left(  Pr(x=z_{0}) \right)  &=\log \left( \int P(x=z_{0},z_{i}|\phi) \, dz_{i}  \right) \\
&= \log \left( \int q(z_{i}|x) \frac{Pr(x=z_{0},z_{i})}{q(z_{i}|x)} \, dz_{i}  \right)  \\
&\geq \int q(z_{i}|x) \log \left(\frac{Pr(x=z_{0},z_{i})}{q(z_{i}|x)}  \right)  \, dz_{i}  \\
&= \int q(z_{i}|x) \left( \log \left[ Pr(z_{0}=x|z_{1}) \right]  +\sum_{i=2}^{T} \log \left[ \frac{{Pr(z_{i-1}|z_{i})}}{q(z_{i-1}|z_{i},x)} \right]\right) \, dz_{i} \\
&= \mathbb{E}_{q(z_{1}|x)} \log \left[ Pr(z_{0}=x|z_{1})  \right] - \sum_{i=2}^{T} \mathbb{E}_{q(z_{i}|x)} D_{KL}\left(q(z_{i-1}|z_{i},x) \parallel Pr(z_{i-1}|z_{i})  \right) .
\end{align}
$$
Once again the terms of the KL-divergence are known normals, so we can express literally.

### Implementation
Now, if we reparameterize by setting $g(z_{i-1}|z_{i},x)$ to find the noise $\epsilon=\frac{{z_{t} -z_{t-1}\sqrt{ 1-\beta_{t} }}}{\sqrt{ \beta }}$, then we get a cute and nice expression. Finally, taking the loss over all evidence we get double sum over evidence and layer.

Then for batching, just grab a few evidence and a few layer, and go.
#### Conditional
Same as VAEs, add a label $c$ and input into every $q=f_{t}.$