## Summary

How many exchanges does a particle system need before it has largely forgotten where it started? This candidate gives an $O(n\log n)$ upper bound for a global Kawasaki sampler on bounded-degree graphs in two precisely defined regimes. Each step proposes an exchange between one occupied and one unoccupied vertex, preserving the total number of particles. The vertices need not be neighbours.

The bound covers all particle densities below the source paper's critical inverse temperature. Above it, the result covers sufficiently unbalanced densities, beyond a source-defined magnetisation threshold. Both conditions are strict. The proof applies directly to the original discrete, nonlazy chain: it does not insert extra holding steps or change the clock.

The proposed advance is an entropy argument connecting an interacting particle law to simpler fixed-size sampling laws. It retains a controlled amount of information through random thinning, then transfers that control to the actual exchange sampler. The paper also gives a finite-size retention coefficient and a conditional extension to unequal nonnegative interactions. These are written mathematical claims supported by internal finite checks, not external peer review or a formal proof-assistant certificate.

*Banner:* the coloured intervals show the two claimed regimes. Threshold positions are schematic, not numerical estimates. The uncoloured interval is outside this result; it is not labelled slow. The critical temperature and the low-temperature threshold boundaries are excluded. At magnetisation $\pm1$, there is only one configuration and no mixing is needed.

## Summary for specialists

Let $G$ be a finite simple graph on $n$ vertices with maximum degree at most a fixed integer $\Delta\ge3$. On the $k$-subsets of its vertices, the canonical Ising law is

$$
\begin{gathered}
\mu_k(S)\propto \exp\{\beta m_G(S)\},\\
k=\left\lfloor\frac{n(1+\eta)}2\right\rfloor,
\end{gathered}
$$

where $m_G(S)$ counts monochromatic edges and $\eta\in[-1,1]$. A global Metropolis step chooses $x\in S$ and $y\notin S$ uniformly, proposes $S-x+y$, and accepts with probability $\min\{1,\mu_k(S-x+y)/\mu_k(S)\}$.

Theorem 1 claims worst-start total-variation mixing to error $1/4$ in $C_{\mathrm{mix}}n\log n$ steps, for all sufficiently large $n$, in either regime:

$$
0\le\beta<\beta_u(\Delta)=\log\frac{\Delta}{\Delta-2},
$$

or

$$
\beta>\beta_u(\Delta),\qquad |\eta|>\eta_a(\Delta,\beta).
$$

Here $\eta_a$ is exactly the analytic threshold of Kuchukova, Pappik, Perkins and Yap (KPPY), not a substitute tree-uniqueness threshold. In the convention $\mu_{\beta,\lambda}(S)\propto\lambda^{|S|}e^{\beta m_G(S)}$, their $\lambda_a$ is the onset of the uniform zero-free property under all mixed partial spin assignments, and $\eta_a$ is the plus-state root magnetisation on the infinite $\Delta$-regular tree at $\lambda_a$. The manuscript records the full definition and source interfaces.

The constants and the sufficiently-large-size cutoff depend on the fixed parameters. They are not asserted to remain uniform as a regime boundary is approached. The theorem requires neither graph expansion nor connectedness nor regularity. It does not concern nearest-neighbour exchanges, cutoff, or the excluded boundaries.

## Technical account

### From analytic control to an entropy window

The argument first obtains canonical influence control after sparse mixed pinning: some spins may be fixed occupied and others unoccupied. It then uses the sparse-localisation theorem of Jain, Pham and Vuong to establish entropic independence throughout a positive-pinning window that leaves a positive fraction of the particles free. The manuscript supplies the marginal bounds and Euclidean operator-norm estimate needed at this interface; a bound on eigenvalues alone would not suffice.

### Retain vertices before revealing bonds

For a fixed-size interacting law $\xi(S)\propto z_S\exp\{J e_H(S)\}$, introduce independent open bonds among occupied edges with probability $p=1-e^{-J}$. Conditional on the bonds, the remaining law is a positive weighted slice forced to contain the bond endpoints. That augmentation and cancellation mechanism have precedents; the paper does not claim to invent them.

The useful intermediate object is a randomly retained subset $R$ of the occupied set $S$. Independent halfedge coins, supplemented by dummy coins at lower-degree vertices, make each occupied vertex retained with the same probability

$$
q=1-(1-\sqrt{1-e^{-J}})^\Delta.
$$

The bond set $B$ can then be generated from $R$ alone. Thus $S\longrightarrow R\longrightarrow B$ is a common random channel, including after entropy tilts. An entropy-reveal recursion controls how much entropy survives in the positive-pinning window. A weighted-slice deletion inequality then converts this retention into a one-particle deletion bound.

This last comparison keeps the original rank. Deleting an endpoint forced by a revealed bond contributes no conditional entropy; accounting for those choices prevents an incorrect acceleration of the sampler's clock.

### Return to the original chain

On each completion set, the local Metropolis kernel has overlapping transition rows once there are at least three possible completions. The paper uses a relative-entropy contraction inequality to obtain Theorem 6 directly for the original nonlazy chain. After spin-flipping to minority rank $k\le n/2$, it has the form

$$
D(\nu K\Vert\mu)\le\left(1-\frac{c_0c_*}{k}\right)D(\nu\Vert\mu).
$$

Here $c_0$ and $c_*>0$ are fixed-parameter constants given in the proof. Iterating this inequality, bounding the initial relative entropy by a constant times $n$, and applying Pinsker's inequality yields the stated mixing bound. The two-completion case is explicitly separated; a finite negative control demonstrates why the third completion matters.

### Two bounded extensions

Corollary 4 keeps the binomial average from the reveal recursion instead of replacing it immediately by a coarse constant. For the stated entropic-independence window and rank condition, its retention coefficient is

$$
\begin{aligned}
\Gamma_r&=\sum_{j=0}^{\lfloor q'r\rfloor}\binom rj q^j(1-q)^{r-j}\\
&\qquad\times\prod_{i=0}^{j-1}\left(1-\frac C{r-i}\right).
\end{aligned}
$$

For fixed $C>0$ and $0<q<q'<1$, this coefficient tends to $(1-q)^C$. It is a proved lower coefficient within the candidate argument, not a claim about the optimal contraction constant. The fixed-parameter qualification matters.

Corollary 5 permits unequal finite nonnegative edge interactions and positive vertex activities in the abstract occupied-bond argument. Dummy coins equalise vertex-retention probabilities while preserving the correct individual bond probabilities. **The same entropic-independence window remains an assumption.** This extension does not by itself establish new analytic fast regimes for arbitrary inhomogeneous Ising models.

## Evidence, assurance and limitations

The universal claims rest on the written proofs and their imported theorem interfaces. Internal checks test finite identities, entropy calculations, and failure controls. They do not replace those proofs.

The supplied six-vertex audit checks 20 states, 40 joint atoms and 42 thinning outputs, with 22 numerical entropy tilts. A separate irregular five-vertex audit checks 5,120 occupied coin arrays and 30 numerical tilts. The additional finite audit covers all 64 labelled simple graphs on four vertices at ranks 1, 2 and 3: 192 rank laws, 896 exact channel compositions, 896 exact Metropolis rows and 3,072 exact pinned-slice identities. Its numerical entropy tests include 1,280 tilts. Exact algebraic checks and floating-point inequalities are reported separately in the receipts.

These are coordinated internal checks. No unaffiliated reproduction, external specialist review, editorial peer review or formal verification has been established. The finite audit is not evidence of a practical runtime constant on large systems, and the candidate does not settle behaviour at either excluded boundary.

## Relationship to earlier work

[KPPY's *Fast and Slow Mixing of Kawasaki Dynamics on Bounded-Degree Graphs*](https://arxiv.org/abs/2405.06209v2) supplies the problem, the precise thresholds and the canonical analytic inputs. [Jain, Pham and Vuong](https://arxiv.org/abs/2604.10902v1) supply the sparse-localisation route to entropic independence; [Cryan, Guo and Mousa](https://arxiv.org/abs/1903.06081) supply the weighted-slice entropy inequality. The nonlazy transfer uses the relative-entropy coefficient inequality of Cohen and coauthors.

Auxiliary spin–bond entropy methods have an established history, including [Blanca and coauthors](https://arxiv.org/abs/2007.06931v2). [Chen, Ju, Miao, Yin and Zhang](https://arxiv.org/abs/2604.10525v2) already use the occupied-edge augmentation and interaction cancellation. The candidate's contribution should therefore be assessed at the thinning, extensive-window retention, original-rank deletion and original-chain transfer steps—not credited to the augmentation alone. A bounded prior-art search is not a global priority certificate.

## Who should care and why

| Reader | Possible use | Boundary to check |
| --- | --- | --- |
| Researchers in Markov-chain mixing | A proposed entropy proof for two source-defined global Kawasaki regimes | The imported analytic and localisation interfaces, and every strict parameter condition |
| Researchers in entropy inequalities | A finite retention coefficient and a conditional heterogeneous occupied-bond argument | The entropic-independence window must be established separately |
| Implementers of fixed-particle samplers | A distinction between the actual nonlazy global clock and auxiliary dynamics | This is an asymptotic upper bound, not a benchmark, cutoff theorem or nearest-neighbour guarantee |

## Why the problem matters

Conserving particle number changes how a spin system can explore its configurations. An update must move a particle rather than change one spin in isolation. A proof for a different chain, or one that silently changes how often an effective move occurs, need not answer how long this sampler takes. The candidate addresses that distinction directly: its endpoint is an entropy contraction for the specified discrete transition kernel.

## How to inspect or reproduce

Start with Theorem 1 and the threshold definitions in Section 1. Check the imported interfaces in Sections 2 and 3, the common thinning channel and original-rank factor in Section 4, then the direct nonlazy transfer in Section 6. Corollaries 4 and 5 should be read with their hypotheses, not as replacements for the analytic-regime argument.

The public package includes `verify.py`, `check_manifest.py`, the recorded environment and `REPLAY_RECEIPT.md`. Run the public diagnostics normally and with Python's `-O` option, then check the manifest. The receipt separately records the supplied audits replayed during preparation; their third-party code is not redistributed. Replaying the public diagnostics reproduces their stated finite scope, not every private audit count. Independent assessment of the general theorem requires reading the proof and its primary sources.

## Most valuable next projects

The first priority is scrutiny outside the production workflow of the mixed-pinning analytic interface and the direct nonlazy transfer. A separate project could track usable constants for a fixed graph family. For unequal interactions, establish an appropriate entropic-independence window before asserting an unconditional mixing theorem. Critical-boundary behaviour, local exchanges and cutoff are distinct research questions, not consequences supplied here.

## Evidence package map

The manuscript contains the theorem statements and proof dependencies. The verification code and receipts document the finite tests and negative controls. The review response records changes made during publication preparation. The agent-readable index provides entry points to those files. Archive, source repository, PDF and audio are supplied through the release's resource and media panels.
