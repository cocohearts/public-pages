## Chap 8
Basically, test error data comes from three sources, and this makes sense.

For given input $x$ there can be multiple outputs $y$; determined by a mean $\mu(x)$ with constant noise $\sigma,$ i.e. $\text{Var}(y|_x)=\sigma, \mathbb E(y|_x)=\mu(x).$

For a given model architecture, the function $\mu$ can be fit best by $f_\mu.$ Clearly $\mu, f_\mu$ are determined if architecture is given.

Then we have a final source of error, which is $\mathbb E([f(x,\Phi[\mathcal D])-f_\mu]^2).$ In other words, the error between the model that we're able to train and the best possible model, due to the random sampling as a result of incompleteness in training data.

In this way, we can see source of noise as $$y(x)\leftarrow \mu(x) \leftrightarrow f_\mu(x)\to f(x,\Phi[\mathcal D]).$$
Because we're only taking variances, we can directly write
$$\mathbb E(L)=\mathbb E([f(x,\Phi[\mathcal D])-y(x)]^2)=\sigma^2+(\mu-f_\mu)^2+\mathbb E([f(x,\Phi[\mathcal D])-f_\mu]^2).$$
These terms are called *noise*, *bias*, and *variance*, respectively. They measure
- how noisy training data is from the true pattern
- capacity of our model to fit the true pattern
- our model's error from the best fitting, given our training data

The *Double Descent* phenomenon is when as capacity increases, test performance decreases, increases until the point where the model memorizes the data, then decreases again.

![[Pasted image 20240303130044.png]]

This results from *variance* increasing as the model begins to memorize the training data, because it also begins to memorize noise. Then as capacity increases the model begins to "smooth out" its interpolation and learns again. Something like this; people don't really know.

*Hypertuning* is done by
- Picking the hyperparameters that maximize scores on a *validation set*
- Then testing the entire system on a *test set*
- Performance on test is indicative of real-word performance