### Shamir secret sharing
Getting some message $m$ and splitting it up among a bunch of sharers.
Given message $m$, set degree $t$ polynomial $f$ with $f(0)=m$ and randomized coefficients; then share $f(1),\dots,f(n).$ Then any $t$ sharers can meet and Lagrange interpolate to find $f(0).$ With $t-1$, can't do.
Shamir's secret sharing is similar to Reed-Solomon coding, where you take $m$ bits, interpolate the unique polynomial that hits on the first $m,$ and the codeword is the polynomial evaluated over the whole field. (Recall that `plonk` uses the Merkle-hashed codeword!)
## BGW
Safety from $t$ corruptors is defined by if adversaries control $t$ parties in whatever way they want, output is the same as if a single trusted party ran the whole thing.
Protection from honest-curious is defined by, each adversary gets the log of all messages sent/received, and the distribution of their input/outputs can be simulated using only their inputs (same as ZK).

First, each party Shamir secret shares with everybody else; party $i$ sends party $j$ the value $p_{i}(j)$ where $p_{i}(0)=s_{i}.$

Next we do joint computation on shares. We want to get each party a share of the final answer, then we can recombine shares.
Addition is easy; share $j$ of $s_{i_{1}}+s_{i_{2}}$ is just $p_{i_{1}}(j)+p_{i_{2}}(j).$

Multiplication is harder; start by just multiplying $p_{i_{1}}(j)p_{i_{2}}(j),$ now a degree $2t$ polynomial in $j$; now we need to re-randomize the polynomial and reduce the degree.

Re-randomization is easy; each party secret shares $0$ and then all-gather the shares. The coefficients of the degree $2t$ polynomial are now randomized.

Degree reduction we can do since there exists a fixed matrix $A$ that maps $g(i)$ with degree $2t$ to truncated $g(i),$ for any $g$ (namely, invert Vandermonde (get coeffs), then use truncated diagonal, then apply Vandermonde again). Computing this matrix is a all-gather-scatter operation.
Each party:
* secret shares with everyone
* takes all of the secret shares they've gathered and computes their corresponding shares of the matrix output
* sends share of output $i$ to party $i$

Finally, once all computations are done, all-gather naked secrets and recombine!

To make this safe against malicious adversaries, need to ensure that all outputs come from a fixed degree $t$ polynomial, i.e. use polynomial commitments.

Applications include anonymized telemetry, voting, etc. it works lol