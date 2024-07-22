## Chap 10: CNNs
right ok
so a convlayer is
convolution (some large tensor (nested ordered list))
usually 2D, in "channels" i.e. 3D stacks
Then we have "kernel sizes" i.e.
$$h_j=\sum_i w_ix_{i+j}$$
Good for images because we can impose translational invariance and get this structure as a symmetric reduction
Then if kernel is size $K\times K,$ has $C_i$ channels in and $C_o$ channels out the convlayer has $K^2C_iC_o$ weights.

We can also define parameters on convlayers:
- *stride*: how dense our "convolution sampling" is (dimension goes down)
- *dilation*: the value of $d$ in $x_{i+dj}$, i.e. "dilating" the convolution
- *padding*: whether we add zeros on the boundary, or cut everything off to only take "valid" full convolutions

#### Heuristics
- Intersperse convlayers with downsampling by two
	- Preserve "size of data" by doubling number of channels
- At some point the "receptive field" of a single value is the entire image, so we can now flatten out into two layers or so of FCNN 
	- Channels $\iff$ parallel feature extraction
- For object detection/semantic segmentation:
	- Add max-unpool and deconvolutions (basically inversions of conv) to generate a new image of the same size, with classifications for each pixel
	- Then use a heuristic greedy algorithm to label collections of pixels with sufficient evidence together

![[Pasted image 20240317231859.png]]

Don't forget to use other "good ideas" such as dropout, SGD, data augmentation, so on.
Data can be augmented "unsupervised" by blacking out certain boxes etc.