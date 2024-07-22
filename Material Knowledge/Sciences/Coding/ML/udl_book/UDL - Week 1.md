## Chap 2
Introduce linear regression, least-squares loss
A "generative model" is $x=f(y,\phi),$ whereas discriminative is $y=f(x,\phi).$ Technicality; but most modern generative models are just very flexible discriminative models.
## Chap 3
First generalize to multivariate linear regression, $y=\theta_0+\Theta_1\cdot x,$ where $\theta_0$ scalar, $\Theta_1$ matrix.

Introduce shallow NN. Add a "hidden layer", becoming a vector of ReLU'd linear combinations of $x$, namely $a(\Theta_0+\Theta_1 x)$ with vector $\Theta_0$ and matrix $\Theta_1$.

In single-variable case we have vector dotted with hidden layer, plus scalar; extending to multivariate we get matrix $\Phi_1$ and vector $\Phi_0$ yielding
$$y = \Phi_0+{\bf\Phi_1}\cdot a(\Theta_0+{\bf\Theta_1}\cdot x).$$
Here the vector-to-vector function $a$ does ReLU on each coordinate.
### Intuitional Notes
- Each hidden layer contributes a hyperplane; resulting linear sum is composition of all of these
- Consider model input size $D_i$ hidden size $D$, region count is exp. in $D_i$ but param count is $D\cdot D_i.$ Higher $D$ values result in greater region counts per param count.
### Syntax Notes
Recall that `my_nd_array.clip(0.0)` literally just works for ReLU.
## Chap 4
Now we generalize to deep NNs. Layers def'd hidden layers; depth def'd hidden layers+1; width def'd maximal nodes in one layer.

Then each layer becomes $$a(\beta_i+\Omega_i x).$$ There are depth-many such layers; in a shallow NN there's one layer $\mathbb R \to \mathbb R^D,$ and then another one $\mathbb R^D \to \mathbb R.$

For example, two shallow $\mathbb R\to\mathbb R$ NNs composed become one $\mathbb R\to\mathbb R^D,$ and then a $\mathbb R^D\to\mathbb R^D$ matrix. This is actually the *outer product* of the two vectors corresponding to what was previously $\RR^D\to\RR$ followed by $\RR\to\RR^D$.
### Intuitional Notes
Consider $f:[0,1]\to[0,1]$ with four linear pieces from $0$ to $1$ or vice versa. Then self-composing $k$ times yields a function with $4^k$ linear pieces. In this way composing multiple layers creates "self-folding" which can create exponentially many facets; however each "sublayer" is a mirror image of other layers, making the layers related to each other in convoluted/difficult ways.

In general, we can optimally get $D^K$ linear regions, but then they're entangled annoyingly.
### Syntax Notes
The object `np.zeros(b,a)` creates a mapping $\RR^a\to\RR^b.$ Beware malformed `np` shapes!
## Chap 5
So-called "recipe" for loss functions:
- For your inference domain, pick a distribution represented by parameters $\theta$ outputted by the model
- For each data point, cost is $-\log(\Pr(y_i\mid \theta))$
- Finally optimize parameters $\phi$ that yield parameters $\theta$
- For inference, take prediction that maximizes probability according to $\theta$
And finally, take negative log everywhere, cuz of course.
### Examples
- Gaussian for univariate (yields squared-loss); variance can also be an output parameter
- Remap using $\exp$ and divide for multiclass
- Random other distros (beta, poisson, von Mises, exponential/gamma, Plackett-Luce)
### Intuitional Notes
- In general we want prob distributions since we're good Bayesians
- We helpfully give structure to our model by *describing* the distro with these parameters
- Then evaluate based on log-sum-score of our guesses
$\newcommand{\RR}{\mathbb R}$