## Useful properties of current game state
Black and White can play in such a way that at any point in the sequence, any available move is reversible. In particular, Black can choose to move their knight between a8, b6, d5 only and avoid breaking 3rep draw rule (see below). Under this setup, at any point in the sequence the only pieces Black could move are the king, either knight (unable to reach any White pieces if White plays mirror) and the rook, all of which are reversible moves.
## Setup and intuition
We construct an infinite "forced history" $P$ using a binary sequence that satisfies the 3rep rule, constructed below. We then construct the post-sequence $Q$ recursively. Denote the $i$th move before the current game state as $-i$. When processing the $i$th step of $P$ (move $-i$), we append to $Q$ in such a way that making any *other* move at time $-i$ would result in a 3rep violation, but the intended move is ok.

Because the forced history never goes to the initial game state, any proof game must "hop onto" the forced history, and by construction there is a 3rep violation starting from that timestep (since moving backwards it is "stepping off of" the forced history). However, for any finite prefix of $Q$, some finite suffix $[-N,0]$ of the forced history $P$ is valid with that prefix, so we only need to make some fixed progression of moves to get to timestep $-N$ to generate a valid proof game.
## Bit sequence construction
First we recursively construct an infinite sequence of bits that is "fine" under the 3rep draw rule.

Start with $A=0$ and $B=1$. Repeatedly replace
$$
A,B:=AAB,ABB
$$
so that the two values start at $0,1$ then become $001, 011$, then $001001011, 001011011$ etc.

Note that at timestep $i$ the new value of $A$ contains the previous value of $A$ as its prefix. Hence we can define the limit of $A$ to be our infinite sequence. We claim no subsequence of this limiting sequence $S$ breaks the 3rep rule.

Breaking the infinite sequence into chunks of length 3, the boundary of each chunk is the only place where $1$ becomes $0$. Hence given any slice with length at least $3$ there exists such a boundary $10$, and hence we can uniquely determine the starting index of that slice modulo $3$.
 
Suppose some subsequence $s$ breaks the 3rep rule. Since $s$ is finite, we can say it is a subset of $A_{t}$ for some $t.$

Clearly the subunit with length $\frac{|s|}{3}$ cannot have length 1, and by inspection cannot have length 2. Suppose it has length at least 3. Then we claim the three slices must have the same starting indices modulo $3,$ i.e. we have $3\mid s.$

Suppose the starting index is not divisible by $3,$ i.e. it doesn't "begin" on a block. Note that since the slice has length divisible by $3,$ it must cover one chunk on one side by 2 (wlog right side), and one chunk on the other side by 1.

Note that knowing the middle number in any chunk suffices to inform us what the other digits in that chunk are, since first digit of every chunk is $0$, and last digit of every chunk is $1$. Hence if we simply shift all three slices one index to the right, they will still all be equal, but they will also be aligned with the chunks.

Now replace every occurrence of $001$ with $0$ and every occurrence of $011$ with $1$ (equivalently remove all occurrences of $10$). Then the slices decrease in size by $3,$ and they become slices in $A_{t-1}$ that break the 3-rule. Induction immediately finishes to prove our claim.
## Translating binary sequence (bits) into forced history (chess)
Here we define the sequence $P$ (imagine moving backwards in time, from current game state). The only piece that moves will be the knight at `a8`, and it only ever travels between `a8`, `b6`, and `d5`.

First move to `b6`. Then follow the infinite sequence constructed above. A $0$ corresponds to `b6->a8->b6` and a $1$ corresponds to `b6->d5->b6`. Similarly to above, if there are any 3rep violations we can easily align them to these 2-move chunks, and then translate back into binary-space, and arrive at a contradiction.

Make mirror moves for White using the knight at `h1`. We have hence arrived at a construction for a "forced history" $P$ that doesn't violate 3rep.
## Using forced history to generate sequence
Now we have a target forced history $P$. Now the goal is to design an algorithm yielding a sequence $Q$, along with "timestamps" $r_{i},$ such that the prefix of timestamps $[0,r_{i}]$ of $Q$ permits the suffix $[-i, 0]$ of $P,$ but permits no other suffixes of length $i$.


## Proving correctness