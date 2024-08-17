## Chapter 19: RL
So we have *partially observable Markov decision processes*, where
- at each timestep world state encoded in $s$, fixes a set of actions
- each action $a$ has distribution describing subsequent state
- actions can have reward $r$
- observations $o$ drawn from distribution based on state

A policy $\pi[a|s]$ is the distribution of next actions by state. We estimate the value of future rewards with a reverse interest rate $\gamma,$ and so can define the value of a sequence of actions or a policy from a given starting point. Also define $q$, the value from given state with given action.

Relations are
$$
\begin{align}
v[s_{t}]&=\sum_{a_{t}}\pi[a_{t}|s_{t}]q[s_{t},a_{t}], \\
q[s_{t},a_{t}]&=r[s_{t},a_{t}]+\gamma \sum Pr(s_{t+1}|s_{t},a_{t})v[s_{t+1}].
\end{align}
$$
### Markov Decision Problems (full state known)
#### Direct DP
Now, if we know the entire action->state distribution for all states, we can initialize values for $v$ randomly, sweep through by plugging in $q$ into the first equation once, and then greedily update $\pi$. This eventually converges.
#### Monte Carlo
Set policy randomly, then after each run of experimentation, for each pair $a,s$ update the policy to value of $a$ that yielded the best measured average $q$ over all runs.
However, this requires us to see every $a,s$ pair many times, which is not always possible.
#### Temporal Difference
Live updating while doing Monte Carlo, so that the new value of $q[s_{t},a_{t}]$ is the old value plus $\alpha$ times the delta in expectation.

SARSA is $(r[s_{t},a_{t}]+\gamma\cdot q[s_{t+1},a_{t+1}])-q[s_{t},a_{t}].$

Instead we could do *off-policy*, meaning the policy that is acting is "behavioral" whereas optimal "target" is being learned.
Typically, behavioral is stochastic but target is deterministic. Behavioral can be modified by e.g. *epsilon greedy* where pick greedy with chance $1-\epsilon,$ random otherwise.

Then we have some behavioral, but then $q[s_{t+1},a_{t+1}]$ is replaced with the best move (target policy), $\max_{a}(q[s_{t+1},a]).$ This is called *Q-learning*, however faces the same size issue as Monte Carlo.
#### Fitted Q-learning
Represent state $s_{t}$ as a vector, put into model $q$ with parameters $\phi$. Then loss $L(\phi)$ is the average TD delta $\left( r[s_{t},a_{t}]+\gamma\cdot \max_{a}(q[s_{t+1},a]) \right) -q[s_{t},a_{t}]$ squared.

Then $\phi$ gets updated using partial of this.
### Abandon Action Values
Let's just do estimation of policy effectiveness. That would be expected discounted reward over the whole trajectory (measuring state and action). Then after taking $I$ many samples and gradient ascent, we get the addition to $\theta$ of
$$
\begin{align}
\alpha\cdot \frac{1}{I}\sum_{i}^I \frac{r[\tau_{i}]}{Pr(\tau_{i}|\theta)} \frac{{\partial Pr(\tau_{i}|\theta)}}{\partial\theta}
&= \alpha \cdot Mean \left[ r[\tau]\frac{{\partial \ln(Pr[\tau|\theta])}}{\partial\theta} \right]  \\
&=\alpha \cdot Mean\left[ r[\tau] \sum_{i}\frac{\partial \ln(Pr[s_{i+1}|s_{i},\theta])}{\partial\theta} \right] .
\end{align}
$$
The *REINFORCE* algorithm does this for a discrete action space, using a softmaxxed neural net for probabilities. Walking through Monte-Carlo style and updating $\theta$ does the trick.

Another good thing to do is to just train a parallel value model that predicts value of a state $s_{t}$ and replace $r[\tau_{it}]$ with $r[\tau_{t}]-b[s_{t}].$ This compensates for some states just being better than others.

To do this at each step using temporal difference, we can update $\theta$ using $\alpha(r[s_{t},a_{t}]+\gamma v(s_{t+1})-v(s_{t}))$, where $v(s,\phi)$ is a parallel network predicting each state's value.

Now $\pi[s_{t},\theta]$ is the "actor" and $v[s_{t},\phi]$ is the "critic". 
### Offline RL
Where we want to build a model based on past, noninteractive transcripts with the environment. This is new, and rather hard. The above is one paradigm; sequence prediction with transformers or LSTM is another, called "decision transformer," which tries to predict the reward for each action.