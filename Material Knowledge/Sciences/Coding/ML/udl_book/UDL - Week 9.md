## Chap 16: Normalizing Flows
Creates probability distribution for whole space, starting with unit normal sample and reversibly creating object sample.

In this invertible model it's easy to compute likelihood that any given sample is generated, so loss function is straightforward.
![[Pasted image 20240502184111.png]]
$g$ is some nonlinear function composed with linear map $\phi,$ could be Leaky ReLU or sigmoid. 
### Student-Teacher
However, this form of inverse mapping is time-expensive. Instead we define loss as reverse KL divergence between a generated "student" distribution and known/sample-able "teacher" distribution.