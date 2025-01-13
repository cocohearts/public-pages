https://arxiv.org/pdf/2412.15287
sana, again
openvla
pizero source sent by ge
moviegen
[prime](https://curvy-check-498.notion.site/Process-Reinforcement-through-Implicit-Rewards-15f4fcb9c42180f1b498cc9b2eaf896f)
video transformer arch
flows, euler flow, etc. read flux codebase
flow-dpm

- [x] [Nvidia Cosmos 2](https://d1qx31qr3h6wln.cloudfront.net/publications/NVIDIA%20Cosmos_2.pdf)
	- AE:
	- start with Haar 3D wavelet in time/space to downsample spatially
	- alternating factorized resblock and factorized attention with downsampling
	- ends at latent dimension 16 for continuous (diffusion) and 6 for discrete (autoregressive)
	- every video token is predicted autoregressively after flattening in sequence, use finite scalar quantization to quantize to total 64K vocab size
	- because attention is used on "every layer" context length is only 34 frames-quite sad lmao
	- use 8x16x16 compression for autoregressive and 8x8x8 for diffusion
	- autoregressive: hybrid 3D RoPE with absolute embeddings per head for each token, cross attention from text prompt (NOT concat, think abt why)
	- diffusion: typical DiT, patchify using 1x2x2 and project/flatten, then text CA plus adaLN from time
	- like suno, best is to use autoregressive to generate discrete tokens, then use "diffusion decoder"—condition on autoregressive tokens and regenerate continuous latents using diffusion
- [x] [olmo](https://arxiv.org/pdf/2501.00656)
	- training curriculum with general text/fineweb-edu, then text for specific tasks to push benchmark scores
	- stability tricks: Z-score regularization, gradient clipping, KV-norm, RMSnorm, no biases, model soups, careful model init, low lr (1e-8), post-norm, weight decay, dropout
- [x] ditto
	- can backprop differentiable losses on diffusion model outputs to noise inputs! and get desired outputs
- [ ] [Stable Diffusion audio codec](https://arxiv.org/pdf/2411.19842) (400-700 bps!!)
	- patch ViT style, 300 ish
	- blocks of strided conv followed by lots of transformers (sliding attention, 128 tokens)
	- FSQ—bottleneck into even lower dim, and then quantize each dim -> one token
	- either learn N scalars to snap to, or parametrize (they use floor tanh)
	- quantizer-dropout occasionally
- [ ] Suno encoder
	- 
- [ ] grok 1
- [ ] PRIME
Large Memory Layers with Product Keys
https://arxiv.org/pdf/1907.05242
Patchscope: A Unifying Framework for Inspecting Hidden Representations of LLMs
https://arxiv.org/pdf/2401.06102
Recovering the Pre-Fine-Tuning Weights of Generative Models
https://arxiv.org/abs/2402.10208
Location Verification for AI chips
https://static1.squarespace.com/static/64edf8e7f2b10d716b5ba0e1/t/6670467ebe2a477eb1554f40/1718634112482/Location%2BVerification%2Bfor%2BAI%2BChips.pdf
Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks
https://arxiv.org/pdf/1703.10593
Improving Alignment and Robustness with Circuit Breakers (s/o rowan for coauthoring)
https://arxiv.org/pdf/2406.04313
Quantization Model of Neural Scaling (s/o Uzay)
https://arxiv.org/pdf/2303.13506
Gradient Routing (s/o Jacob)
https://arxiv.org/pdf/2410.04332
Binlear MLPs for Interp
https://openreview.net/pdf?id=gI0kPklUKS

Not really AI:
Anatomy of a Bit: Information in a Time Series Observation
https://arxiv.org/pdf/1105.2988
Prediction, Retrodiction, and The Amount of Information Stored in the Present
https://arxiv.org/abs/0905.3587

sasha rush awesome (outdated?)
https://github.com/huggingface/awesome-papers
long awesome ML
https://github.com/aimerou/awesome-ai-papers?tab=readme-ov-file
o1-related
https://github.com/srush/awesome-o1/
awesome ML tools
https://github.com/srush/awesome-machine-learning
awesome discrete diffusion
https://github.com/kuleshov-group/awesome-discrete-diffusion-models

add to [[famous architectures]]
## sys/inference optimization
- what i learned from william brandon:
	- nvidia gpus have two caches, L2 and L1
	- each streaming multiprocessor has its own L1 physically colocated with the SM
	- in the time it takes to send data between L1 and SM, can do 100 tensor operations
	- four datatypes to be aware of:
		- fp32, horrible; tf32, better than bf16 but takes more memory
		- fp16, really not great; bf16, what everyone uses
	- bf16 (if not careful) will get converted into fp32 which is horrible
	- V100s are horrible for the above reason
	- also talked about modular duality, lipschitz stuff from jeremy + laker newhouse, new optimizers
	- life advice: do stuff, make stuff, remake primitives from scratch, when possible if i'm scared of something just do it
	- also learn cuda in 100hrs in [6.S894 labs](https://accelerated-computing-class.github.io/fall24/labs/) (use 1xRTX A4000)
- [ ] ray python dist package
- [ ] deepspeed
- [ ] [jetformer](https://arxiv.org/abs/2411.19722)
- [ ] ddp, fsdp
- [ ] [what to knwo about cpu memory](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)
- [ ] flexattention
- [x] streamingllm, linformer
	- linformer just projects $n\times d$ key, weight matrices into $k\times d$ using direct linear $n\to k$ linear map ("squishing" vectors to make the seq shorter)
	- streamingllm analyzed attention magnitudes, found that "leftover" attention would be dumped into "attention sinks" in the softmax which would then be ignored
	- added initial tokens back to inference, perplexity fixed (compared to sliding window)
- [ ] [speculative decoding](https://arxiv.org/pdf/2211.17192)
- [ ] [yarn](https://arxiv.org/pdf/2309.00071)
	- uses RoPE (instead of adding pos. embedding, multiply by $D/2$ complex numbers with AP magnitude)
	- pretrain on 10K context/RoPE, then interpolate arguments of complex numbers in pos. embedding carefully
	- preserve higher frequency numbers and move lower 
- [ ] [lolcats](https://arxiv.org/pdf/2410.10254)
- [ ] deepseek v3
	- MTP, Yarn, "long-winded and overly reflective" R1 with system prompt during SFT for transfer, carefully load balanced MoE
## interp
- [ ] [automated circuit discovery](https://papers.nips.cc/paper_files/paper/2023/file/34e1dbe95d34d7ebaf99b9bcaeb5b2be-Paper-Conference.pdf)
- [ ] [path patching](https://arxiv.org/pdf/2304.05969)
- [ ] [the logit lens (blogpost)](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens)
- [ ] [nnsight docs](https://nnsight.net/about/)
- [x] [achyuta's sts paper](https://arxiv.org/pdf/2404.14349)
	- uses cross-layer-attribution matrix based on gradient of next layer on each neuron in current
	- take top $k$ in each layer locally, then iteratively refine by taking last layer, grab most influential neurons from prev, etc. go backwards, then go forwards, until circuit stops changing
	- stich images from two classes into a single image, analyze behavior of both circuits under this hybrid image
**FROM TAMAR**
- [x] [https://anishk23733.github.io/vl-interp/](https://anishk23733.github.io/vl-interp/)  
	- VLM embeds images and places before text in transformer decoder
	- hence image embeddings are in the same "space" as text embeddings
	- goal: measure "internal confidence" about an object in an image, potentially ablate
	- defines "internal confidence" about an object in an image as maximum of logit lens (result of applying final unembedding matrix and grabbing logit for token for that object) over all image embeddings (one for each patch) over all layers in the VLM
	- cutoff at a certain internal confidence, and then ablate/activate based on that
	- questions:
		- why are all layers in the model treated equally? can we learn a better combination of information to get internal confidence in a self-supervised way?
		- what about image encoders that don't keep spatial information in an easily interpretable way, how to check segmentation for these?
		- logit lens seems "naive"—why do we expect image tokens to speak "exactly" the "same language"? should we try to learn adjustments to the embedding matrix, esp. wrt. position?
		- good results for end task—hallucination reduction—but gap between hallucation reduction v.s. cd reduction seems small, perhaps can be made more effective with ablation engineering or internal confidence engineering
- [x] https://vision-of-vlm.github.io/ 
	- "the mechanisms underlying how VLMs process visual information remain largely unexplored."
	- through a creative "knockout" experiment, demonstrate implicit image information through text tokens is sufficient, alternatively image tokens only needed for layers 20-40
	- in layers 20-40 attention values make an attempt at segmentation
	- able to get "compressed context" by, for each layer, take only the image tokens with top-K attention values
	- notably works much better with InternVL2-76B (patches into 40x40) than with LLaVa-1.5-7B (patches in 16x16), suggesting that large patching is just very redundant/inefficient and should no longer be pursued
	- question: if we take the best tokens for *each* layer then perhaps over all layers we end up including all image tokens at least once? even worse, if we change which image tokens are included on inference for each text token, perhaps over all text tokens, each layer eventually sees all image tokens? also perhaps these results are to be "expected" because of dropout training schedules?
- [x] [https://arxiv.org/pdf/2410.07149](https://arxiv.org/pdf/2410.07149)
	- adapter VLM that maps CLIP patch embeddings into language token space
	- refers to a register token hypothesis—that blank background patches collect global information; relegates as a side effect
	- uses three methods of checking token understanding, finds that ablating object tokens (replacing with global mean) removes understanding—expected; how to know there's a dog when there are no dog patches?
	- uses logit lens, finds that tokens become aligned with corresponding text embeddings as layers progress (surprising! no compulsion to align with text, some implicit discovery of "best coding" for each patch)
	- most valuable communication between image and text tokens happens in later layers (attention knockout)
	- i'm surprised they discard register hypothesis so quickly, i believe register
- [x] [https://arxiv.org/abs/2310.10348](https://arxiv.org/abs/2310.10348)
	- general program of ACDC: Automated Circuit DisCovery
	- activation patching does one forward pass for every edge/node/wtv. that has to be tweaked, replacing activation at that node with either than average ablation or the activation from some other "corrupted" prompt, sees what the change in metric is
	- attribution patching uses derivative of metric in activation at each node/edge to construct a circuit
	- represent network as a computational graph, differentiate between modules, nodes, edges
	- specifically use EAP, edge attribution patching
	- measure false positive rate/true positive rate from human expert baseline, both increase as %pruning increases
	- two approaches to calculating relevance: take a gradient all the way to the top, or take gradient of next layer(s) from this layer and compute recursively
	- recursive is easier to ensure selected subgraph is actually connected

- [ ] [A Mathematical Framework for Transformer Circuits](https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Not_All_Image_Regions_Matter_Masked_Vector_Quantization_for_Autoregressive_CVPR_2023_paper.pdf)
## rl agents/automation
- [ ] [sakana](https://arxiv.org/abs/2408.06292)
## robotics/rl
- [ ] [kinetix rl physics lib](https://arxiv.org/abs/2410.23208)
- [ ] [aloha robotics](https://mobile-aloha.github.io/resources/mobile-aloha.pdf)
- [ ] [openvla](https://arxiv.org/abs/2406.09246)
- [ ] [ppo](https://spinningup.openai.com/en/latest/algorithms/ppo.html)
- [ ] [diffusion for robotics](https://github.com/mbreuss/diffusion-literature-for-robotics?tab=readme-ov-file#Diffusion-in-Robotics)
- [x] pi's [new paper](https://www.physicalintelligence.company/download/pi0.pdf) (read ??)
- [x] [action latents](https://arxiv.org/html/2410.11758v1)
- [ ] [sergey levine](https://people.eecs.berkeley.edu/~svlevine/) from berkeley has takes
- [ ] some yilun du papers: original [EBM](https://arxiv.org/abs/1903.08689), his [thesis](https://yilundu.github.io/thesis.pdf), his [research statement](https://yilundu.github.io/research_statement.pdf)
- [ ] 
## diffusion
- [ ] [diffusion amth](https://www.peterholderrieth.com/blog/2023/The-Fokker-Planck-Equation-and-Diffusion-Models/)
- [ ] figure out diffusion/normalizing flow/flow forcing, fr, https://boyuan.space/diffusion-forcing/
- [ ] [flow matching math](https://arxiv.org/abs/2210.02747)
- [ ] [moviegen](https://ai.meta.com/static-resource/movie-gen-research-paper)
- [ ] dall-e algorithm
- [ ] [papers](https://arxiv.org/abs/2305.03486) from [william brandon](https://arxiv.org/abs/2206.00364)
## sci of dl
- [ ] [scaling via data manifolds](https://arxiv.org/abs/2004.10802)
- [ ] [low rank](https://arxiv.org/abs/2106.09685)
- [x] [modular duality](https://arxiv.org/pdf/2410.21265) by bernstein
	- two angles for motivation:
	1. gradients are not same type as weights, they are linear functionals on the weights i.e. $\Delta \mathcal{L}=g^{T}w.$ Hence we should update by the result of some "duality map" applied to the gradient.
	3. In the gradient case where we want to optimize $g^{\dagger}\Delta w + \lVert \Delta w \rVert^{2}$ we want $\Delta w$ to be in the direction of the dualizer.
	2. input/outputs are normed, we want to update weights so that activations stay in the same approximate norm. Specifically we set weight norms to be dual norms on input/output using their respective norms, i.e. $\lVert W \rVert=\max \frac{{\lVert W x_{in} \rVert_{out}}}{\lVert x_{in} \rVert_{in}}.$
	4. Generalizing, we want to maintain smoothness of our layers for easy future gradient descent. Given the gradient, want to update in the direction that gives the most "bang for buck" accounting for some norm on the weights. Above maximum can be interpreted as curvature, i.e. fastest ROC of output given fixed input change. Dualizer is the argmax of this norm.
	- They arrive at several duality maps for different modules using specific norms, e.g. RMS for linear, max(RMS) over channels for convolution, $l_{1}\to RMS$ for embedding. Using the above max expression, get spectral nom for Linear, max spectral norm for Conv2D, some other weird stuff idk lmao
	- Formalize modules into a fwd, mass, sensitivity (curvature), and norm for the weights (defined by norms over input/output).
## ssm
- [ ] albert gu's thesis
- [ ] [mamba2: ssm > transformers](https://arxiv.org/abs/2405.21060)
- [ ] [mamba is attentino](https://arxiv.org/abs/2403.01590)
## audio/image/video specific
- [x] [original dit](https://arxiv.org/pdf/2212.09748)
	- u-nets are great but let's try transformers instead
	- standard latent diffusion, break latent into $p\times p$ patches (use $p=2$)
	- classifier-free guidance, i.e. constraining $p(c|x)$ implicitly by using $\log p(x | c) - \log p(x|\emptyset)$ since $p(c|x)=\frac{{p(x|c)p(c)}}{p(x)}$, then setting $\mathcal{L}=p(x)+\gamma p^*(c|x)$ for $\gamma>1$
	- various conditioning strategies including
		- cross-attention
		- adaptive layernorm with "zero scaling" (scaling right before residual by multiplying by MLP output $\alpha$ initialized to 0)
		- straight concat
	- Transformer decoder with just a linear and rearrange to get predicted $\epsilon$ and diagonal $\Sigma.$
- [ ] original [vit](https://arxiv.org/pdf/2010.11929)
- [x] [sana](https://arxiv.org/pdf/2410.10629)
	- huge compression vae, with F32C32P1 instead of standard F8C8P2, leads to 4x fewer tokens (1/16 "patches", 4x channels, 4x patches)
	- linear attention using $ReLU(Q)ReLU(K)^{T}$ instead of softmax, then instead of computing $n\times n$ matrix can do $ReLU(K)^{T}V$ first to get $d\times d$ matrix for linear time full sequence training
		- inference is $O(1)$—additional K,V vectors add to the new $d\times d$ matrix, then mv-mul with new Q vector
	- add nonlinearity with 1x1 convs along channel and 3x3 conv along channel, token index and GLU
	- no positional encoding! rely on 3x3 conv for implicit positional info
	- bit quantization, triton cuda shit, for faster inference
	- [ ] some Flow-DPM math ⏫ 📅 2025-01-12
- [x] [wav2vec](https://arxiv.org/pdf/2006.11477)
	- architecture: 6-deep convnet for latent representation (stride 20ms, receptive field 25ms at 16k hz), then quantize using product codebook w linear projection (gumbel softmax to get $V\times G$ logits for codebook), causal transformer on latents to get context representation
	- train by masking some latents with learned mask token, cosine similarity for cross-entropy loss between "real" masked quantized latent and several distractors
		- mask $\approx$ half of latents
	- intuition:
		- can reconstruct missing latent (when quantized) i.e. latents contain useful info (note no reconstruction!)
		- quantization isn't used for one-hot encodings autoregressive-style, rather is used to "regularize" the latents with some amount of "smoothness"
	- fine-tune final contextual representations into text token classes with a linear layer (includes blank token)
	- uses Connectionist Temporal Classification loss i.e. takes "best possible" alignment allowing for repetitions and blank tokens, takes log prob
- [ ] seq-2-seq (in comparison to wave2vec)
- [ ] [tracks-to-4d](https://tracks-to-4d.github.io/)
- [ ] [mqvae](https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Not_All_Image_Regions_Matter_Masked_Vector_Quantization_for_Autoregressive_CVPR_2023_paper.pdf)
## miscell
- [ ]  [DPO](https://arxiv.org/pdf/2305.18290)
- [ ] [transfer learning survey](https://arxiv.org/pdf/2010.03978)
- [ ] [shampoo](https://arxiv.org/pdf/2309.06497)
- [ ] decision transformer
- [x] dqvae
- [ ] vqgan
- [x] vqvae
- [ ] [deepseek prover](https://www.arxiv.org/pdf/2408.08152)
- [ ] [little book of dl](https://fleuret.org/public/lbdl-a5-booklet.pdf)
- [x] BERT and original [transformers](https://proceedings.neurips.cc/paper_files/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf)
	- attention (2017): add in positional encodings, also mask attention before softmax using causal, transformers solve text gen
	- BERT: full self-attention with masks using masked language modeling (MLM) loss; cross-entropy on logits on masked tokens