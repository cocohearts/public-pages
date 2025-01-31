## Useful properties of current game state
There exists an infinite sequence of proof steps such that at any point in this sequence, all available moves for the current player are reversible. 

Black and White can play in such a way that at any point in the sequence, any available move is reversible. In particular, Black can choose to move their knight between a8, b6, d5 only and avoid breaking 3rep draw rule (see below). Under this setup, at any point in the sequence the only pieces Black could move are the king, either knight (unable to reach any White pieces if White plays mirror) and the rook, all of which are reversible moves.

As a remark, we claim this is a necessary condition for such a sequence to exist. What follows for this remark is not entirely rigorous, but the main idea is here.

Any proof game is valid for only finitely many prefixes of the sequence, otherwise the entire sequence is valid with that proof game. However, each of the infinitely many prefixes is valid with some proof game. Thus, for any $N$ there are infinitely many proof games that are valid with the first $N$ moves of the sequence.

From any board state there are finitely many possible previous moves. Construct the tree whose root is the given board state, and where the children of each node are all possible previous board states, assuming the follow-up is the path to root and 3rep is not violated. Then for any $N$ there exist nodes of arbitrary depth such that the corresponding proof "suffix" plus the first $N$ moves of the sequence is valid.

Suppose this condition is not satisfied, i.e. beyond some fixed depth $D$ in this tree we are forced to make an irreversible move $M$. If $M$ is irreversible, it cannot be replayed, i.e. it cannot occur again in the sequence. Hence $M$ serves as a "separator" between all preceding and succeeding moves; because $M$ cannot be replayed it cannot occur in a 3rep violation, so for any proof game and any sequence prefix, we can consider the moves before $M$ and after $M$ separately.

Hence of the finitely many proof game suffixes with length $D,$ at least one of them is valid with infinitely many sequence prefixes, i.e. is valid with the entire sequence. Since we are guaranteed to have an irreversible move after length $D$ suffix, all "subsequent" moves (moving backwards in time) are irrelevant, so (almost) any finite progression from initial board state to $-D$ state will work with the entire sequence, which is a contradiction.
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

At any timestep $-(i-1)$ the only diff from the current game state is the position of the knights on `a8` and `h1`. The `a8` knight can be on `b6` or `d5` and the `h1` knight can be on `g3` or `e4`.

We wish to prohibit all moves at timestep $-i$ other than the one we have prescribed. Either:

- the rook that is free to move takes its one possible action

- the king whose turn it is to move takes its one possible action

- the other knight who has never moved takes its one possible action

We prohibit these in turn. Let the sequence developed so far be $s,$ defined by all actions in $[-(i-1),r_{i-1}].$ For each of the above three possible actions:

- let the action be $A$ (in the "forward" time direction, e.g. `Raa7`.)

- Pick another "irrelevant" reversible action. Either the "other knight" action or the king action is always available, call that $B$.

- let $s'$ be the sequence of moves formed by$$ ss ^{-1}A ^{-1}Ass ^{-1}A ^{-1}Ass ^{-1}A ^{-1}BB ^{-1}A. $$

- Note that $s'$ still has $s$ as a prefix, so take $s'[len(s):]$ and append that to $Q.$ Let the other color mirror.

- Intuition: note that prepending the action $A$ creates a 3rep of the subsequence $Ass ^{-1}A,$ but because of the $BB ^{-1}$ at the end there is no violation of 3rep using only the subsequence (at first inspection, more details later).

Do this for every timestamp $i$, for both Black and White, for every "off-script past action" available to the current player. This generates an infinite sequence $Q$, and it is apparent from construction that there are no proof games. As argued earlier, any proof game must come "onto" the forced history, and at that point would create a 3rep violation.
## Proving correctness
It remains to show that a finite proof game exists for any finite prefix of $Q$. Equivalently we show that the bidirectional infinite sequence $P$ followed by $Q$ contains no 3rep violations. If this holds, then for any prefix $Q$ of length $N$ we take a $P$-suffix of length approximately $3N$ so that  then move a rook and move a pawn.