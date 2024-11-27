from [tsinghua](https://arxiv.org/abs/2307.04139v2)
Take set $R$ including each node independently with prob. $\frac{1}{k}.$ Then for every $v \not\in R$ do Dijkstra's until we hit an element of $R,$ call it $b(v).$ Each $u \in R$ has a set of "closest nodes" which partition $V$. Also define ball of $v\not\in R$ as all $v'$ closer to $v$ than $b(v).$

Initialize Fib heap with elements of $R,$ we never insert. Initialize distance function with $0, \infty.$ Then

grab $u_{t}$ from heap
1. update $N(Ball(Bundle(u_{t})))$
2. update $Ball(N(Bundle(u_{t})))$
Before step 1, $d(u_{t})$ is correct. After step 1, $d(Bundle(u_{t}))$ is correct. After step 2, $N(Bundle(u_{t}))$ and *certain* members of $Ball(N(Bundle(u_{t})))$ are correct.