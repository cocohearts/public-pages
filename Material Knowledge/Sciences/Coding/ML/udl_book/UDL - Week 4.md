## Chap 9 Regularization
At the end of the day, what we want is to maximize performance on the *test* dataset.

We can try to make our model interpolate more smoothly between data points.

Essentially, we can add extra terms to the loss function to make our model parameters "care" about certain properties.

1. Naively, we can add $\lambda |\phi|^2,$ a constant multiple of the magnitudes of the parameters, to our loss function. Making parameters small $\to$ smoother model. This happens to be equivalent to taking $\phi\to(1-\gamma)\phi$ each descent step.

2. Some training methods have implicit terms, compared to the base $\frac{d\phi}{dt}=\frac{dL}{d\phi}.$ For instance, training with gradient descent distance $\alpha$ is actually adding $\frac{\alpha}4|\frac{dL}{d\phi}|^2.$ This can be derived from a perturbation expansion in $\alpha$ for the "real" $\frac{d\phi}{dt}.$

3. Extending the above, training with SGD adds $\frac1B\sum_i |\frac{dL_i}{d\phi}|^2=|\frac{dL}{d\phi}|^2+\text{Var}(\frac{dL_i}{d\phi}).$ In other words, take the above implicit term, and then add another term for the variance of gradients among all batches.
	1. Hence smaller batches (higher variance) can yield better models
	2. Implicit term encourages consistency across data

That's all for the math.

![[Pasted image 20240317201439.png]]

- Ensembling: run several models and take an average
- Bayesian: maintain a distribution of parameters and update given data
- Dropout: drop out weights randomly during training, akin to applying random noise
- Early stopping
- Label smoothing: move labels around randomly to make model less confident
- Data augmentation: generating new data via transformations
- Transfer: pretraining
- Multi-task: several models that learn sequential tasks