## Summary

**What is being measured.** Put a small conductor, such as a molecular junction or a quantum dot, between a hot and a cold reservoir. Heat flows through it in random bursts. Over a long time $t$ the delivered heat $Q_t$ has *cumulants* that grow linearly in $t$; their rates $C_n$ summarise the statistics. $C_1$ is the mean heat current and $C_2$ its noise. $C_3$ says whether the record is lopsided: positive when the record is dominated by rare large bursts, negative when it is dominated by rare shortfalls. $C_4$ measures how heavy both tails are compared with Gaussian noise.

**The conjecture.** In 2022 Ptaszyński found that in more than 30 000 random classical networks driven only by temperature differences, the ratios
$$
S=\frac{C_3}{C_1},\qquad K=\frac{C_4}{C_2}
$$
were never negative, and conjectured that they never are (his equations (19)–(20)). If true, measuring two higher cumulants would be a cheap diagnostic: a negative ratio would show that something other than heat, or something non-classical, drives the device.

**What was found.** The conjectures are false, with three states. A conductor that occasionally falls into a long-lived idle state, a *trap*, produces a heat current that switches between "on" and "off" like a telegraph signal. Rare long pauses skew the record towards shortfalls, so $C_3$ and $C_4$ become large and negative. The trap can be made rarer and slower without changing the energies, temperatures, stationary probabilities, mean heat current or entropy production, and then both ratios go to $-\infty$.

**A concrete example.** Three states with energies $(0,2,1)$, a hot bath at $\beta_h=\log 2$ and a cold bath at $\beta_c=\log 4$, every pair coupled to both baths, and a weak coupling $\varepsilon$ to the trap. The mean heat current stays exactly $40/63$, while
$$
S\approx-\frac{16}{21609\,\varepsilon^2},\qquad K\approx-\frac{16}{64827\,\varepsilon^2}.
$$

**What it does not show.** The results do not touch variance-based bounds. The thermodynamic uncertainty relation holds in every example. The divergence comes from the noise $C_2$ growing like $\varepsilon^{-1}$: in the trap family the *variance-normalised* ratios stay finite, and when the mean and noise are positive a kinetic bound shows that very negative ratios require slow relaxation. Nothing here concerns quantum systems. The point is narrower: a negative ratio alone does not certify quantum or non-thermal driving, because classical slow switching must be ruled out first.

**How sure we are.** Every result has a written proof, and the key identities are checked in exact rational arithmetic. This is an anonymous, AI-assisted, unrefereed candidate whose review was internal and AI-assisted, not peer review.

## Summary for specialists

Finite continuous-time Markov chains with energies $E_i$ and bath-resolved rates obeying local detailed balance $k^\alpha_{ij}/k^\alpha_{ji}=e^{-\beta_\alpha(E_i-E_j)}$; heat into the cold bath counted by the tilt $k^c_{ij}e^{z(E_j-E_i)}$; $C_n=\chi^{(n)}(0)$ for the scaled cumulant generating function $\chi$. Table 1 of the paper checks each hypothesis of the source.

| Result | Status |
|---|---|
| Three states, two baths: $S\approx-6415$, $K\approx-54732$ at $\varepsilon=10^{-3}$; $K<0$ for $\varepsilon<0.0667$, $S<0$ for $\varepsilon<0.0069$ (Section 3) | exact certificate |
| Weak trap: $C_n=\varepsilon^{1-n}(c_n+O(\varepsilon))$, and $S,K\sim-\mathrm{const}\cdot\varepsilon^{-2}$ simultaneously iff $(3-\sqrt5)/2<U/V<1$ at leading order (Lemma 4.2, Theorem 4.3); every thermal two-state conductor with an equal-energy trap lies in this region (Corollary 4.4) | proof |
| Full support, fixed $\pi=(40,5,18)/63$, $C_1=40/63$, $\dot\sigma=40\log2/63$: $S=-16/(21609\varepsilon^2)+O(\varepsilon^{-1})$, $K=-16/(64827\varepsilon^2)+O(\varepsilon^{-1})$ (Theorem 5.1) | proof; exact Laurent expansion |
| Normalised limits $\hat S=C_3C_1/C_2^2\to\tfrac32(1-r)$, $\hat K=C_4C_1^2/C_2^3\to3(1-3r+r^2)\ge-15/4$ (attained at $r=3/2$) in the trap family; $-9/4$ and $-3/4$ for Theorem 5.1 (Proposition 6.1) | proof |
| Six states, fixed energies and temperatures: $\hat S,\hat K\to-\infty$; both negative only for $\varepsilon\lesssim10^{-3}$ (Proposition 6.2) | proof; exact check |
| $\lvert C_n\rvert\le n!\,(g/2)(E_{\max}/\ell)^n$ with $g$ the spectral separation of $0$; if $C_1>0$ (resp. $C_2>0$) this gives $S\ge-3g(E_{\max}/\ell)^3/C_1$ (resp. $K\ge-12g(E_{\max}/\ell)^4/C_2$), of order $\varepsilon^{-2}$ (Theorem 6.3) | proof |
| Two states, standard state-jump model, one counted bath: $C_2>0$, $C_4>0$, $C_3/C_1\ge E^2/4$ (Proposition 7.1) | proof |
| Random census: no violation when all rates lie within one decade; every violation found has a rate disparity of about $100$ or more (Section 8) | numerical evidence only |

## Technical account

**Pole order.** For the trap generator the characteristic polynomial is $x^3+Tx^2+\varepsilon Bx-(x+\varepsilon\beta)d(z)$. Implicit differentiation gives a cumulant recursion in which, after multiplying by $\varepsilon^{n-2}$, only one linear term and the quadratic convolution survive at $\varepsilon=0$. So $\varepsilon^{n-1}C_n$ has a finite limit, given by the root of
$$
w\,y^2+(B-d_1k)\,y-\beta d_1k=0 .
$$
This quadratic is the standard two-state telegraph cumulant generating function of Jordan–Sukhorukov and Bagrets–Nazarov. The leading coefficients $c_3\propto U-V$ and $c_4\propto U^2-3UV+V^2$ give the sign region.

**Fixed data.** In the full-support family a common rescaling $\lambda_\varepsilon$ fixes $C_1$ without changing $S$ or $K$. The scaled determinant $G(\varepsilon,y,k)=F_\varepsilon(\varepsilon y,\varepsilon k)/\varepsilon^2$ reduces at $\varepsilon=0$ to $\tfrac{27}{2}[y^2+(28-\tfrac89k)y-\tfrac{160}{9}k]$, and the analytic implicit function theorem selects the root through $0$, separated from the other slow root $-28$. The first four derivatives of this root give the limits:
$$
\tfrac{40}{63},\quad \tfrac{320}{27783},\quad -\tfrac{640}{1361367},\quad -\tfrac{5120}{1801088541}.
$$

**What can still be bounded.** Because $C_2\propto\varepsilon^{-1}$, a ratio with units of energy squared naturally scales like $\varepsilon^{-2}$. The variance-normalised ratios remove that scaling. The kinetic bound follows from Bauer–Fike perturbation, a Riesz projection and Cauchy's estimate on the analyticity disc of $\chi$. These are standard tools, and the paper claims only their specialisation to these ratios. For reversible chains $g$ is the spectral gap, so a ratio of order $-X$ needs a relaxation time of order $\sqrt X$ in units of the fast rates. The ratio bounds require $C_1>0$ or $C_2>0$: reversing the temperature ordering in the trap family gives $C_1<0$ while $S\to-\infty$.

**Classical and new.** Slow-switching statistics, characteristic-polynomial cumulant methods and two-state counting formulas are classical, and the paper cites them. What is specific here is their exact realisation inside the conjectured thermal class, the strengthening to fixed thermodynamic data, the normalised-ratio and kinetic results, and the two-state minimality. A bounded literature search found no earlier statement of these counterexamples; it does not establish priority.

## Evidence, assurance and limitations

The synthetic audio briefing is explanatory, not additional evidence. Its [complete transcript](/assets/audio/thermal-cumulant-sign-counterexamples.txt) is available for reading.

- **Proofs.** Every theorem and proposition has a written proof in the 13-page manuscript.
- **Exact checks.** Three separately written standard-library verifiers check local detailed balance, stationarity, the exact cumulants, the scaled determinant and the leading coefficients in rational arithmetic. A SymPy script checks the trap-family formulas, normalised limits, the six-state construction and the kinetic bound. All outputs, the figure data and the census were regenerated byte for byte from a clean copy. Eleven semantic negative controls confirm that the verifiers reject a broken detailed-balance rate, a wrong stationary law, wrong coefficients and a wrong two-state identity.
- **Review.** Internal AI-assisted review in several roles and an outside-model review led to a revision. A verification re-review, a targeted proof audit and a final outside-model correctness audit followed. The audit found that the ratio form of the kinetic bound needed the conditions $C_1>0$ and $C_2>0$, and that a continuity remark was overstated. The editor fixed these and the remaining wording items directly, without a further review round. A rating-free summary is in the package. None of this is peer review or independent reproduction.
- **Limitations.** Results concern long-time cumulants of classical models. The kinetic constants are loose, by about $10^4$ in the main example. No explicit disparity threshold is proved. Whether $\hat K\ge-15/4$ holds for all three-state networks is open. The source's other inequalities are untested. The census is numerical evidence only.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Experimentalists measuring heat or charge counting statistics | Do not read a negative $C_3/C_1$ or $C_4/C_2$ as proof of quantum or non-thermal driving; check for slow switching first (autocorrelation time, Fano factor, waiting-time tails) | Long records are needed: about $10^6$ fast-rate times for kilohertz switching |
| Stochastic-thermodynamics theorists | Exact counterexamples, a fixed-data family and a conditional kinetic bound to test proposed higher-cumulant inequalities against | Variance-based bounds such as the TUR are unaffected |
| Readers of Ptaszyński (2022) | Exactly which conjectures fail, in which class, and why random sampling missed them | Classical state-jump models with heat counted into one bath |
| Research agents | Machine-readable claims, an agent index, exact certificates and negative controls | The checks support identities and constants; the asymptotic theorems rest on the written proofs |

## Why the problem matters

Higher cumulants are increasingly measurable in nanoscale transport, and sign rules for them would be valuable diagnostics. This release shows that, for heat currents, such a rule cannot rest on thermodynamic data alone: a single slow, rarely visited state is enough to reverse the sign. It also locates what survives, namely variance-based bounds and kinetic bounds that depend on relaxation times.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with [uv](https://docs.astral.sh/uv/) installed, from the package root:

```sh
shasum -a 256 -c SHA256SUMS
uv run python3 -I code/verify_determinant.py    # exact, standard library
uv run python3 -I code/verify_poisson.py
uv run python3 -I code/verify_scaling.py
uv run python3 -I code/verify_extension.py      # SymPy
uv run python3 -B -I code/negative_controls.py  # every corruption must be rejected
```

Assertions are the checks, so do not use `-O`. `code/README.md` lists the full order, including the ten-minute census. `AI_INDEX.md` maps each result to its evidence.

## The most valuable next projects

1. Decide whether the normalised kurtosis $\hat K$ is bounded below by $-15/4$ for every three-state network.
2. Prove an explicit rate-disparity threshold below which both signs hold.
3. Sharpen the kinetic constants, which are about $10^4$ loose in the main example.
4. Test the source's other inequalities, including those for unicyclic and multi-bath networks.
5. Identify a physical device, such as a molecular junction with a slow conformational trap, where the effect could be measured.

## What is in the evidence package

The package contains the manuscript (PDF and LaTeX source) and its figures, and the exact verifiers with their JSON certificates. It also has the SymPy extension check, the census script with its output, the figure data and the semantic negative controls. The records include the revision response, the final editor fixes and a rating-free review summary, together with claim, status, assurance and provenance records, the prior-art record and an agent index. Licences are CC0-1.0 for text and data and MIT for code, and SHA-256 manifests are included. The same files are in the GitHub release and the Zenodo record.
