Zero knowledge can be defined by games.
Proving knowledge:
* if a "god" is able to play back protocol and make it work several times for same random input for prover, then can deduce secret
* protocol has some commitment/checking step that prover will find difficult to solve if it doesn't have the secret
Generally it looks like:
1. ask a question
2. commit
3. ask some question about some part of it that it must satisfy
4. open the commitment
5. opening the commitment in enough places gives us enough info to decipher the secret.
Zero knowledge is defined by "exists simulation s.t. log of real transcript is indistinguishable from simulation transcript".