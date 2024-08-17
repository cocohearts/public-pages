# Plonky3
#### ALI setup
Programs are represented as a matrix of numbers that satisfy low-degree polynomial *constraints* on adjacent rows.

The height of the matrix must be a power of 2: $h=2^k$. Take the base field $F$ and an *evaluation domain* $L$, which is a multiplicative subgroup of order $h$. Then each column is encoded as a polynomial $C_{i}(\omega^{j})$, the $i$th item in the $j$th row. (Power of 2 is good because it makes FFT easier.) We commit to each column by Merkle hashing its evaluation over $L$.

In particular, constraints $Q(x_{i},y_{i})$ \[where $x_{i}$ is the current row, $y_{i}$ is the next row] are represented as $$\forall x \in L \colon Q(C_{i}(x),C_{i}(\omega \cdot x))=0.$$
Let $H_{i}$ be the polynomial with roots that $Q_{i}$ must vanish on, let $H$ be the polynomial with all roots of L, and $s_{i}=\frac{H}{H_{i}}$. Now we want to show $H_{i}|Q_i,$ or instead $H | Q_{i}s_{i}$.
#### Quotient polynomial definition
Instead of proving this for each constraint one at a time, the verifier stitches all the constraints together using $\theta \in F_{ext}.$ $F_{ext}$ is a low-degree extension of $F$, with order $|F|^{d}$. For default `plonky3` the field $F=\mathbb F_{15\cdot{2}^{27}+1}$ and $d=4$ (quartic field extension), yielding 128-bit security.

Stitching is just
$$
R(x)=\sum_{i} \theta^{i}Q_{i}(C_{j})\cdot s_{i}(C_{j}).
$$
Then we want to show
$$
Q(x)=\frac{R(x)}{H(x)}
$$
exists.

Let `log_blowup=2`, meaning we blow up $L$ by 4, so $L_{b}$ is now a multiplicative subgroup of order $4h$. Then interpolate the degree-$h$ polynomials into $L_{b}$ to create a $4h$-long vector, and Merkle hash it, and the quotient $Q$.
#### PCS
Now apply FRI to the Merkle hash of $Q$ to prove it's low degree.

Finally, prove $Q$ is actually the quotient we want by opening the quotient $Q$ (actually represented as 2 polynomials with same length as $C$) and all the columns $C$ at $\zeta$ from $F_{ext}$. Verify that $Q(\zeta)H(\zeta)=R(\zeta)$.

Prove the opening by supplying $V=C(\zeta)$ and directly running FRI on the rational function $Q'=\frac{{C(x)-V}}{x-\zeta}$. 

Finally, note that we could have directly run FRI on the original quotient polynomial but that would require opening every column for every FRI query.

Using ALI we committed to the quotient $Q$ and queried it before running FRI (saving lots of openings). Using DEEP we proved FRI on $Q$ by evaluating at $\zeta$, an extension element and running FRI on $Q'$. This saved lots of rounds of FRI.
### Batch-PCS Footnote
For multi-STARK Plonky3 (multiple traces with interactions between them), we can *batch-PC* by doing a "rolling commitment". Pad the polynomials to degrees power of 2, and add new polynomials at every FRI round. Add them as late as possible, so to minimize the total number of "folds". Additional randomness needs to be generated at every round to stitch the new polynomials together.
### Evaluation Domain Footnote
Note that if the evaluation is over $L$ then the prover would need to symbolically compute the quotient by dividing through all the coefficients. This sucks because expanding, adding etc. is expensive.

Instead it's easier to evaluate each component of the quotient for a set of values where the divisor doesn't vanish, so the Merkle commit is actually to the evaluations of the polynomial over the coset.

We now have this distinction between the *interpolation domain*, $L$, and the *evaluation domain*, $\gamma L.$
### DEEP-ALI Reasoning
Note that we could have evaluated the quotient $Q=\frac{R}{H}$ at every step of FRI (by opening all the extended column commitments, evaluating directly etc.) instead of committing to this Merkle query and checking that. The reason we don't do this is because we'd have to do *lots of Merkle openings* at each step of the FRI, probably opening every column at every step. We'd rather put everything into a single Merkle hash and then have a much simpler quotient that we check directly.
## FRI and RS codewords
A linear space of codewords is a linear subspace where no two distinct elements have many terms in common. It is known that the codewords resulting from evaluating low-degree polynomials over any evaluation domain is "maximally distance separated" i.e. has the lowest maximum number of collisions (degree $d$ has at most $d$ collisions). Thus in the literature, "Reed-Solomon codeword" and "low-degree polynomial" are used interchangably.
### Protocol
#### COMMIT
- Verifier sends random $\gamma\in \mathbb{F}$
- Prover takes current polynomial $P(y)=P_{0}(y^{2})+yP_{1}(y^{2})$ and returns Merkle hash of $P_{0}+\gamma P_{1}$ over a half-sized domain.
#### QUERY
- Verifier does checks by asking for $P_{i}(s ^{2^{i}})$ and finally opening the very last $P_{i}$ at all points to check it's constant. This is called a "colinearity check".
- Does this for multiple values of $s$

Finally, check that $Q(\zeta)H(\zeta)=R(\zeta)$ for some $\zeta \in \mathbb{F}_{ext}$. The polynomials $H$ and $R$ are easy to evaluate, we evaluate $Q$ by taking $V=Q(\zeta)$ and $Q_{2}=\frac{{Q(x)-V}}{x-\zeta}$. For $Q_{2}$ we don't need a new Merkle hash, just query the Merkle hash for $Q$ over the same $L$. Simply run FRI directly on $Q_{2}=\frac{{Q(x)-V}}{x-\zeta}$ by opening $Q$ for each query.
### Soundness
First analyze FRI soundness.

Assuming the prover Merkle hashes honestly, FRI proves that the vector has at least $\sqrt{ \rho }$ shared coefficients with some codeword.

A blackbox theorem (Reed-Solomon correlated agreement) that says in a random combination over $\mathbb{F}$ with a certain probabilistic error the maximum distance is preserved. When we do the degree splitting the distance of one of the halves must be at least that of the original vector. Then if the final result is all constant then the original distance was also small.

Now we consider the probability prover lied on some hashes. If the original vector was $\delta$ far from RS-codeword, then it must make a total of $L\delta$ "corrections". Each round of the query phase is akin to a random "FFT merkle check". Then soundness error goes to $(1-\delta)^{t}$.

Here's the black box for completeness:

> Take the evaluation domains $L^i$. In each round $i$, if we have $l$ function evaluations, then the FRI random $\gamma$ combination preserves distance $\delta$ with probability
> 
>  $$\varepsilon = \left( \frac{(m+0.5)^{2}}{6 \rho^{1.5}}\cdot \frac{{L^{i}}}{\mathbb{F}}+\frac{{2m+1}}{\rho^{0.5}}\frac{L^{0}}{\mathbb{F}} \right) \cdot l.$$
> The error over all rounds is then
> $$\frac{(m+0.5)^{2}}{3\rho^{1.5}} \frac{{L^{0}}}{\mathbb{F}}+\frac{{2m+1}}{\rho^{0.5}} \frac{{L^{0}}}{\mathbb{F}}\cdot 2k.$$

## Constants for Security
For default `plonky3` the field $F=\mathbb F_{15\cdot{2}^{27}+1}$ and $d=4$ (quartic field extension), yielding 128-bit security. The rules of thumb provided by EthStark documentation say
- hash function needs 256bits
- field needs $2^{128}$ bits (addressed)
- Every colinearity check gets $\log_{2}\rho^{-1}$ bits of security. For `log_blowup=2` we get $\rho=\frac{1}{4}$ so we need 64 colinearity checks.
For plonky3 default we use $m=3$ i.e. $\delta \leq 1- \sqrt{ \rho }\left( 1+\frac{1}{2m} \right) = \frac{5}{12}$.

For plonky3 quotient degree is $2^{k}\leq 8$ so commit error is
$$
\left(  116 \frac{2}{3}\right) \frac{L^{0}}{\mathbb{F}}.
$$
Given that $\mathbb{F}=2^{31}$ and $L^{0}=4h$ we get a maximum trace height of $2^{20}=1048576$.
# Plonky3 LogUp
Implements a Lookup table with log derivatives—aka. sum of inverse linear terms.
Multiset equality can be determined by computing
$$
\sum_{i} \frac{m_{i}}{X-a_{i}}.
$$
How this is implemented is by evaluating this function at $\zeta\in \mathbb{F}_{ext}$. During trace generation, the Fiat-Shamir hash of the rest of the trace is taken. Columns are combined with a random power linear combination of $\alpha$ starting at $1$, and then different bus indices are combined with random power linear combination of $\beta$ (so bus 1 send/receive, bus 2 send/receive etc.). Then $\zeta$ is computed during trace generation and used to generate and constrain the evaluations of $\frac{m_{i}}{X-a_{i}}$ and the partial sum, with coefficient of $1$ for send and $-1$ for receive.

Total sum should be 0 in $\mathbb{F}_{ext}$, hence the debugger showing four field elements upon failure, at least one of which is nonzero.

With multiple rounds of committing/proving/hashing/providing randomness, the AIR is generalized to a RAP, which stands for *something*.
# Binius 
Smaller fields are better. More FFT and parallel recursion with less CPU looping is better. How about a special small field composed of a tower binary construction, where field addition becomes 32-bit XOR. Makes massively parallel Poseidon hashes possible.
# Circle STARKs
Try Mersenne31 ($2^{31}-1$ prime field) except we pick the set of points $x,y$ satisfying $x^{2}+y^{2}=1$. It's like we're doing unit norm complex numbers, but mod $p$.
# Halo2 and KZG
oh idk ive no fucking clue