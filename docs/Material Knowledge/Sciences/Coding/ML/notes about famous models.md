mostly from achyuta's recommended reading, for oct 24 SF trip
### Mamba
SSMs, classically $h'(t)=Ah+Bx, y=Ch$ are basically RNNs. The "latent/hidden" variable is what serves up the magic. By this formulation, expanding shows that it's performing a global convolution $y_{t}=\sum_{i}(CA^{t-i}B)x_{i}.$ This convolution is "linearly time invariant," cannot really perform selection.

Existing SSM strategies are able to select or ignore tokens based on their content using $H_{3},$ but we want selective context learning.

We have $A,B,C$ depend on the input $x$. Specifically we have fixed $A,$ learn $B,C$ from the input $x,$ discretize $A,B$ using input-specific $\Delta$  then apply SSM.

Assuming single-dimension $x_{t},$ we have $h_{t}=\bar{A}h_{t-1}+\bar{B}x_{t}, y_{t}=Ch_{t}$ where $h_{t}\in \mathbb{R}^{N},$ $\bar{A}\in \mathbb{R}^{N\times N}, \bar{B}\in \mathbb{R}^{N\times 1},C\in \mathbb{R}^{1\times N}.$ Keep in mind that $\bar{A}$ is diagonalized so is expressed in $N$ values.

For Mamba specifically the $B,C$ are generated as linear functions of $x,$ $\Delta=\tau_{\Delta}(P+s_{\Delta}(x))$ where $s_{\Delta}$ is linear, etc.
![[Pasted image 20241018231105.png]]
![[Pasted image 20241018231118.png]]
![[Pasted image 20241018231303.png]]
![[Pasted image 20241018231149.png]]

In usual autoregressive style we compute all of $y,$ mask the appropriate parts, logit cross entropy.