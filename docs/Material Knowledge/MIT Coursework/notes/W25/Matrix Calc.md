Crucially high-dimensional derivative is defined as as linear form
$$
f'(x)[dx] = f(x+dx)-f(x)
$$
where $f'(x)$ is a linear form on $[dx].$ In vector spaces equipped with inner products the linear form can be represented as an inner product with an element of the vector space, and said element becomes the gradient.

Key thing to know is good ol product rule, which is derived only from distributive property and not commutativity hence we can use in matrix calc.

> Abstractions like Kronecker product and $vec$ are nice but at the end of it all is still Einstein summation lol.

Kronecker product $A\otimes B$ is where each element $a_{ij}$ is replaced by $a_{ij}B$ so that output is $2\times 2$ mat with product'd dims. Then $vec(M)$ flattens a matrix into a vector columnwise.

Then for three matrices of the same dim, note that
$$
(A \otimes  B) \cdot vec(C^{\dagger})
$$
can be partitioned by rows of $A$. (Note that $vec C^{\dagger}$ is just flattening rowwise to match Kronecker rows of $B$.) For the first row of $A$ (hence first chunk of output) we get
$$
A_{1j}B_{kl}C_{jl}
$$
for element number $k$. Then rearranging yields
$$
vec(M)=(A \otimes  B) \cdot vec(C^{\dagger})\implies M_{ik}=A_{kj}B_{il}C_{jl}=B_{il}C^{\dagger}_{lj}A^{\dagger}_{jk},
$$
hence
$$
(A\otimes B)\cdot vec(C)=vec(BCA^{\dagger}).
$$

Can also do finite difference stuff. Sure. Can also do standard exponent tricks, e.g. $d(AA^{-1})=(dA)A^{-1}+A(dA^{-1})=0$ hence $dA^{-1}=-A^{-1}dAA^{-1}.$

Also remember that $\mathrm{Tr}(AB)=\mathrm{Tr}(BA)$ (just do sum of product elementwise of the "square intersection").

In the vector space of matrices with fixed dim, standard *Frobenius inner product* is $\left< vec(A),vec(B) \right> =Trace(A^{\dagger}B)$ and hence Frobenius norm is $\sqrt{ \mathrm{Tr}(A^{\dagger}A) }$.

Also recall that second derivative of $\mathbb{R}^{n}\to \mathbb{R}$ is called Hessian, gradient of $\mathbb{R}^{n}\to \mathbb{R}^{m}$ is Jacobian with shape $m\times n.$
## Autograd
It's really cool. When using with libraries, could get a big boost from writing custom autograd for those parts, e.g. especially with Newton solvers (just implicit differentiate instead).

Goal is to get gradients of an output in terms of an input.
For long chains represented as computational DAGs there two ways—forward-mode diff and backward-mode diff.

Forward means start from input. Cost scales with number of inputs (for every elem compute change at elem for each input).
Backward means start from output, cost scales with outputs (for every elem compute change output for that elem). Still chain rule multiplicative, always making gradient longer with mul (not shorter with division).
In ML output is almost always 1 so backward is the best—gradient attached to each param has size 1.

Note that Hessian matrix is really annoying for $f: \mathbb{R}^{n}\to \mathbb{R}$ since $f'$ is $\mathbb{R}^{n}\to \mathbb{R}^{n}$ and so backward/forward on the second is the same. Hence "forward-over-backward". Use forward or backward depending on input/output shape.
## Special Matrix Ops
Don't forget determinant: defined recursively using either
- permutation parity
- recursively using "minors" (drop out row/column), sum using "cofactors" (use $-1^{(i+j)}$, sum along any row/column)
Then
$$
\nabla \det A=\det(A)A^{-\dagger}=\text{adj}(A^{\dagger})=\text{cofactor}(A)
$$
where $\text{cofactor}$ is the transpose of matrix of elementwise cofactors. Note that $A\cdot\text{cofactor}(A)=\det(A)I_{n}$ (self-evident).

Proof 1. Note that $\det(I+dA)-\det(I)=\mathrm{Tr}(dA),$ so
$$
\det(A+dA)=\det(A)(\det(I+A^{-1}dA))=\det(A)+\det(A)\mathrm{Tr}(A^{-1}dA)
$$
and hence
$$
d \det(A)=\left< \det(A) A^{-\dagger},dA\right>.
$$
Proof 2. $\det(A)=\sum_{j}A_{ij}C_{ij}$ for any $i$ so $d \det(A)=C_{ij}$ (lmao).
## Functions $\mathbb{R}^{n}\to \mathbb{R}$ as Banach Spaces
Couple ideas: calculus of variations, random functions, second derivatives.
As always, the key idea is that a derivative is a different type; its a linear form, as oppposed to "another vector space element".

Calculus of variations: we can have functions $u: (\mathbb{R}\to \mathbb{R})\to \mathbb{R}$ that map functions $f$ to reals. Generally we can take $\int G(f,f',\dots,t)\,dx$. Then we want $\nabla u[df]=u(f+df)-u(f).$ Then we also care about $df', df'',\dots$ the derivatives of $f'$ and we can feed them directly into $G$, i.e.
$$
\nabla u=\int \nabla G[df,df',df'',\dots]\,dx
$$
Note that here, $df',df'',$ etc. are no longer "independent" in the usual sense. It's just that the $x$-wise term $\Delta G$ needs to know $\Delta (f')$ and that's expressed in $df'$.

Euler-Lagrange equations: if we have some "potential" expressed as 
$$
f(u)=\int F(u,u',x)\,dx
$$
with fixed endpoints, then at equilibrium for all $du$ we get
$$
0=df=\int \left(   \frac{dF}{du}[du]+\frac{dF}{du'}[du']\right)\,dx=\left. \frac{dF}{du'} du \right| + \int \left(   \frac{dF}{du}- \left(   \frac{dF}{du'}\right)' \right)du\,dx
$$
hence
$$
\int \frac{dF}{du}=\int \left( \frac{dF}{du'} \right) '.
$$

There's random functions, i.e. we feed some input and get a distribution back (that we sample from). Maybe we want to measure delta of expectation or smth, using Monte Carlo diffs. But, it can be very noisy if our two samples are uncorrelated. Hence correlate them with some confounding variable that preserved marginal but makes the joint difference really small, e.g. use CDF inverse.

Then there's bilinear maps. Take a function $f:\mathbb{R}^{n}\to \mathbb{R}.$ Second derivative could be represented as "differentiate first in $x_{i}$ then $x_{j}$" i.e. just Hessian matrix all over again.

However this doesn't work all that well. Consider taking second derivative of $\det(A).$ Then linear form is $\det(A)A^{-1}$ as derived earlier (either linear expansion around 0 or cofactor expansion). The second differential we denote $dA'$, so
$$
\begin{align*}
d^{2}\det(A)
&=d(\left< \det(A)A^{-\dagger}, dA \right> )[dA']\\
&=d(\det(A)\mathrm{Tr}(A^{-1}dA))[dA']\\
&=d(\det(A))[dA']\cdot\mathrm{Tr}(A^{-1}dA)+\det(A)\cdot d(\mathrm{Tr}(A^{-1}dA))[dA']\\
&=\det(A)\mathrm{Tr}(A^{-1}dA')\mathrm{Tr}(A^{-1}dA) + \det(A)\mathrm{Tr}(d(A^{-1})[dA']dA)\\
&=\det(A)\left(\mathrm{Tr}(A^{-1}dA')\mathrm{Tr}(A^{-1}dA) - \mathrm{Tr}(A^{-1}dA'A^{-1}dA)  \right).
\end{align*}
$$
(I did that correctly first try wow) This is how it's done. Now $d^{2}\det(A)$ becomes a generalized bilinear form on $dA$ and $dA'$ as opposed to the dual of some linear form.

We can use these bilinear forms in Taylor expansions, i.e. $f(x)+f'(x)[\Delta x] + \frac{1}{2}f''(x)[\Delta x,\Delta x]$. Can also use this for "perfect gradient descent" i.e. Newton's method on the gradient; given gradient $g$ and Hessian $H$ just set $\Delta x=H^{-1}g.$