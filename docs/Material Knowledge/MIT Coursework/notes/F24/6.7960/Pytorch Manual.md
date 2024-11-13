### tensor manip
Tensors in order: batch, channel, y_from_top, x_from_left
Multiplication is elementwise
Singleton dimensions will be "broadcast" (copied) 
einops is nice
otherwise `torch.{stack, concat, hstack, reduce, mean, sum}` etc.
Often will have a `dim` or `out=` argument
### Constructing models
In order of increasing complexity:
- `nn.Sequential` (just pass in static modules, not iterable)
- `nn.ModuleList([modules])` to track all submodules (variable length)
- list submodules as attributes and evaluate directly in `.forward()` (non-linear computation)
- if we have random numbers include them as `nn.Parameter()` so `.backward()` knows to track
In training loop:
- `optim.zero_grad()`
- `loss.backward()`
- `optim.step()`
In validation:
- use `with model.inference_mode():`
### tooling
- einops/einsum
- WandB (weights and biases) cloud logging
- backprop, computational graph, etc.
### reminders
- .to(device)
- use modules to break stuff down