## Chap 6: Gradient descent, momentum
Ok, we've got normal gradient descent. $\phi :=\phi- \alpha \frac{\partial L}{\partial \phi}.$ But this can be "unstable", so we have some empirical improvements:
#### Momentum
Have a $\beta$-rate time decay on the influence of *all* previous gradient descents, i.e. we move in the direction
$$m=(1-\beta)\sum_{i=0} \beta^i g_i.$$
More specifically, $$m_i=(1-\beta)g+\beta m_{i-1}.$$Don't forget the $\alpha$ coefficient.
#### Nesterov Momentum
Instead of updating by gradient *here*, let's update by gradient over *there*.
$$m_{i+1} = (1-\beta)\left(-\alpha\left. \frac{\partial L}{\partial \phi}\right|_{\phi-\alpha m_{i}}\right)+\beta m_i.$$
Basically, correct our momentum by an assumed future position.
#### ADAptive Momentum (ADAM)
Try moving uniform magnitude in each coordinate; i.e. $\Delta\phi=-\alpha\frac{g}{|g|}.$ We don't like absolute value; instead let's set $v=g^2,$ so $\Delta \phi=-\alpha \frac{g}{\sqrt v}.$ Of course, normalize with $\frac g{\sqrt v+\epsilon}.$ This (Adaptive Gradient) works well, but let's add momentum!

Let $m$ be the momentum of $g$ i.e. $m=\beta m_{i-1}+(1-\beta)g,$ and $u$ the momentum of $v:=g^2$ i.e. $u=\gamma u_{i-1}+(1-\gamma)g^2.$ Then $\Delta g = -\alpha\frac{m}{\sqrt u+\epsilon}.$ 

Don't forget to "normalize" our truncated infinite geometric series by taking $\tilde m=\frac{m}{1-\beta^t}$ and $\tilde u=\frac u{1-\gamma^t},$ and actually using $\tilde m,\tilde u$ in place of $m,u$. This is because $\gamma$ is usually large.

And of course, we can mashup ADAM with Nesterov if we want, by taking $g$ from $\phi+\Delta\phi$.
#### SGD
Instead of taking gradient with the entire training dataset, we chop training into *batches* and gradient descent by these. Going through an entire permutation (set of batches) corresponds to one *epoch*. This can be mashup'd with any of the above.
### Intuitional Notes
- Momentum is a geometric time-average of gradients
- ADAM moves coordinate-wise, mashed up with momentum, scaling for geometric truncation
- Nesterov takes gradient from where you "would" be, like moving double and stepping back
- SGD is "orthogonal" to these descent strategies by adjusting batch
## Chap 7: Backprop
Fun part! We'll work with only deep neural nets, of course.

Assume one input, one output. $K$ layers means $K+1$ sets of linear maps composed with activations (last activation dropped).

We'll take $h$ for hidden (post-activation) and $f$ for pre-activation from $0-K$.
*One "unit" is from $h\to f$ through linear map, and then to $h$ by activation.*

Counterintuitively, by this index notation, *the hidden layer comes first*.

Then $h[0]$ is input, $f[k]$ is output, and $$f_l=\beta_l+\Omega_lh_l$$ (where $l\in[0,K]$ is layer).

#### Total Derivative Chain Rule
The *total derivative* of $f: \RR^m\to\RR^n$ is the matrix $M:\RR^m\to\RR^n$ corresponding to a "linear approximation". By this logic, it's perfectly clear that
$$D(f\circ g)=Df\circ Dg.$$
#### Backprop
Then using activation function $a$ and our above index notation, we have
$$
\begin{align*}
\frac{\partial L}{\partial \beta_i}&=\frac{\partial L}{\partial f_i}\circ\frac{\partial f_i}{\partial \beta_i}=\frac{\partial L}{\partial f_i},\\
\frac{\partial L}{\partial h_i}&=\frac{\partial L}{\partial f_i}\circ\frac{\partial f_i}{\partial h_i}=\frac{\partial L}{\partial f_i}\circ \Omega_i=\Omega_i^T\frac{\partial L}{\partial f_i},\\
\frac{\partial L}{\partial \Omega_i}&=\frac{\partial L}{\partial f_i}\circ\frac{\partial f_i}{\partial \Omega_i}=\frac{\partial L}{\partial f_i} h_i^T.\\
\frac{\partial L}{\partial f_{i-1}}&=\frac{\partial L}{\partial h_{i}}\circ\frac{\partial h_{i}}{\partial f_{i-1}}=\frac{\partial L}{\partial h_{i}}\odot a'(f_{i-1}).
\end{align*}
$$
Note the distinction between a linear map from $\RR^n\to\RR$ (linear functional) v.s. the vector whose dot product encodes said functional. This is the source of the transpose. More generally, we are taking *inner product coefficients* instead of total derivatives.

And of course, $\frac{\partial L}{\partial f_K}=\frac{\partial (f_K-y)^2}{\partial f_K}=2(f_K-y).$

If we shorten to only the ones we care about, we get
$$
\begin{align*}
\frac{\partial L}{\partial \beta_{i}}&=\left(\Omega_{i+1}^T\frac{\partial L}{\partial \beta_{i+1}}\right)\odot a'(f_i),\\
\frac{\partial L}{\partial \Omega_i}&=\frac{\partial L}{\partial \beta_i} h_i^T.
\end{align*}
$$
This also means we can go layer by layer, dropping the values from previous layers, and update weights on each layer iteration.
### Intuitional Notes
- Vector calc stuff, total derivative chain rule; note that we're grabbing inner product duals
- Backprop biases first; chain rule:
	- first Hadamard the activation derivative
	- then next-layer weights transpose, to "amplify" next-layer bias derivatives
- Backprop weights:
	- Literally just $\frac{\partial L}{\partial \beta_i}\otimes h_i$ (remember to match shape)
$\newcommand{\RR}{\mathbb R}$