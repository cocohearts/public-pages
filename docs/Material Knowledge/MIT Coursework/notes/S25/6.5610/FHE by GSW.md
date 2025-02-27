Key idea: consider set $S$ of matrices that have $v$ as an eigenvector. Then there's a natural surjective homomorphism from $S$ to $\mathbb{R}$ defined by $Mv=f(M)v.$ Then we can add, multiply matrices in $S$ and add, multiply corresponding reals.

We'll use *LEARNING WITH ERRORS*.

> *Learning with Errors*
> Given some assumptions on parameters of tall matrix $M$ and secret $s,$ we can't distinguish between $Ms+e$ for some small-norm noise $e$ and a uniform random vector $u.$

Since it's easy to determine eigenvectors of any $M,$ we don't want to reveal secret key. Instead we'll add some noise on top.

## Dims
$$
C \in \mathbb{Z}_{q}^{l \times(n+1)}
$$
$$
h: \mathbb{Z}_{q}^{l \cdot(n+1)} \to \mathbb{Z}_{q}^{l \times(n+1)\cdot \log q}
$$

## Protocol
Given secret key $s$ constructed by stacking $-s'$ on top of $1,$ take $B = \left( A \| As'+e \right)$ for some random $B$ so that $Bs=-As'+(As'+e)=e.$ Then $B$ is "almost" a null matrix for the secret $s.$ Then encrypt a bit $\mu$ using
$$
C=B+\mu \cdot G
$$
where $G$ is the "inverse" operation of the binary decomposition function $h,$ i.e. $h(C)\cdot G=C.$ Then $G$ is a block-diagonal matrix where each block is a column vector of powers of $2.$ Then $G\cdot s=B\cdot s+\mu  G\cdot s=e+\mu Gs.$

We decrypt by computing $v=C\cdot s,$ and if $\mu$ is zero then we expect to get noise out (small norm); if $\mu$ is one, then if we use large dimension, we expect one coordinate to have large norm with high probability.
## Evaluation
Addition is easy; we just add the two ciphertexts (matrices) together.

Multiplication is harder; we define it by doing $h(C_{1})\cdot C_{2}.$ Specifically we have to set $l=(n+1)\log q$ so that $h(C_{1})$ is square. Then

$$
\begin{align*}
h(C_{1})\cdot C_{2}\cdot s
&=h(C_{1})\cdot(e_{2}+\mu_{2} Gs)\\
&=h(C_{1})e_{2}+\mu_{2}h(C_{1}) Gs\\
&= \mu_{2} C_{1}s + h(C_{1})e_{2}\\
&= \mu_{1}\mu_{2}s+(\mu_{2}e_{1}+h(C_{1})e_{2}).
\end{align*}
$$
Then since $h$ is binary decomp all the values are small norm (0 or 1), and $\mu_{2}$ is a bit so is also small. Hence error grows by $(n+1)\log q$ every multiplication. Hence bound on depth $d$ is
$$
((n+1)\log q)^{d}\leq q,
$$
i.e.
$$
d \leq \log_{(n+1)\log q}q.
$$
Don't forget that adding linearly adds error, so with these can get $d=n^{0.99}$ with large enough $q.$
## Bootstrapping
We want to "reset" the error. Do this by encrypting the secret key under itself, and giving this to the evaluator. Then they can "clean" the ciphertext $C=E(s)$ by evaluating $D(E(E(C)))$ using $E(s).$ This is bootstrapping, and permits infinite-depth FHE!