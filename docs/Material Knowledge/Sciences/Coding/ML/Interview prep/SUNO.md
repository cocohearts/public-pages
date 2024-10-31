Papers to read
1. [MusicLM](https://arxiv.org/pdf/2301.11325)
	- Start with MuLan, autoencoder that maps text, music to similar latents
	- Put the music into w2vBERT to get "semantic tokens"
		- Use layers of w2vBERT and quantize to get 25 semantic tokens per second.
	- Train a semantic model to go from MuLan encodings to semantic tokens
	- Train an acoustic model to condition on MuLan, semantic tokens to yield SoundStream acoustic tokens
		- 50hz 12-codebook RVQ
		- Each codeword is 10 bits for total 6kbps
	- SoundStream (general audio codec) takes tokens from latent RVQ and decodes into audio
	- Acoustic model is "hierarchical": first generate four coarsest RVQ tokens, then the final 8
2. [MusicGen](https://arxiv.org/pdf/2306.05284)
	- Use EnCodec, with $K$ (many) codebooks at a much lower sample rate
	- How can we autoregressively generate each of the codebooks without flattening (reducing parallel benefits) and while keeping complexity small?
	- Given the whole field $k,s$ (codebook, sample) we partition into $P_{s} \subset \{1,\dots,S\}\times \{1,\dots,K\},$ and generate all of those samples at once
		- Parallel: generate all codebooks at sample $s$ uniformly, i.e. $P_{s}=\left\{ (s,k)\forall k \right\}$
		- Delay: $P_{s}=\{(s-k+1,k)\forall k\leq s\}$
	- With the Encodec audio latent, use Transformer with cross-attention from conditioning (latent generated from text through another encoder) to generate next "partition"
	- Also condition on melody using chromagram, creating bottleneck allowing for unsupervised data