## Summary

**In one sentence.** As the genus grows, every zero of a deformed monotone Hurwitz polynomial eventually approaches its limit from the side Coulter, Do and Moskovsky predicted; this release proves that by computing the next term of the large-genus expansion, shows that the motion cannot start at genus zero in general, and certifies the exact behaviour at every genus for all cycle types of 4 to 10 items.

**The object.** Take a shuffle (permutation) of $d$ items and write it as a sequence of swaps of two items. Call the sequence *monotone* if the larger item of each swap never decreases, and *transitive* if the swaps together connect all $d$ items. Count such sequences, giving each one a weight $t$ for every distinct "larger item" it uses. The result is a polynomial in $t$. Longer sequences correspond to higher *genus* (the genus of the branched cover that the sequence describes), and the shuffle's cycle type is called its *profile*.

Coulter, Do and Moskovsky (Canadian Journal of Mathematics, 2025) met these polynomials when integrating over complex Grassmannians and called them deformed monotone Hurwitz numbers. Their data showed something striking: the zeros are all real, they interlace, and as the genus grows each zero heads for a simple limit,
$$-(d-2),\ -\tfrac{d-3}{2},\ \dots,\ -\tfrac{1}{d-2},$$
approaching from below if the limit is less than $-1$ and from above otherwise (their Conjecture 3.15). For the 4-cycle, for example, the smallest zero is $-2.618$, $-2.215$, $-2.086$, $-2.036$ at genus 0, 1, 2 and 3: it climbs towards $-2$ from below.

**Why it matters.** A polynomial with positive coefficients and only real zeros says something concrete: the number of larger items used is exactly a sum of independent coin flips. Hidden structure of this kind usually needs a mechanism to explain it, and the mechanism Coulter, Do and Moskovsky found stops at genus 1.

**What was known.** The limits, and real zeros at very high genus, already follow from a 2026 theorem of Accadia, Lewański and Ruzza on the leading large-genus term. That term does not say from which side the zeros arrive.

**What is new.** The direction of approach, an exact all-genus picture up to ten items, and the first terms beyond the leading one.

| Result | In plain terms | Where |
|---|---|---|
| The next term, exactly | For every profile, and for several prescribed profiles at once, the second term of the large-genus expansion is explicit. It depends on the profile only through its number of fixed points | Theorem 3.1, Corollary 3.2 |
| The direction of approach | Its sign gives the direction Coulter, Do and Moskovsky predicted, so their Conjecture 3.15 holds in its eventual form, with an explicit (very generous) threshold on the length of the sequence | Theorems 4.1 and 4.4 |
| Not from the start | For two 2-cycles and for three 2-cycles some zeros first move away from their limits | Theorem 5.1 |
| Every genus up to ten items | For each of the 132 profiles with 4 to 10 items, exact certificates prove real zeros at every genus and list exactly when a zero moves the wrong way: only 8 profiles, all made of even cycles, and never after genus 2 | Theorem 5.2 |
| Higher terms | The third term depends only on fixed points and 2-cycles, and each early term sees only short cycles | Theorems 6.1 and 6.2 |
| Which larger items are used | In a long random sequence, item $b$ is used with probability $(b-1)/(d-1)$, independently of the others | Proposition 7.2 |
| The published tables explained | Some rows of the table of Coulter, Do and Moskovsky coincide exactly because a fixed point can be removed using their own recursion; the two- and three-term formulas reproduce all 15 rows of their Figure 2, with relative errors of about 1.7e-4 and 5.5e-10 in the displacement from the limit | Proposition 4.5, Table 1 |

**Credit.** The limits and the leading term are due to Accadia, Lewański and Ruzza. At $t=1$ the exponential-polynomial structure in the genus is due to Yang, who also proved the analogous fixed-point formula for simple Hurwitz numbers (and with it the vanishing conjecture of Do, He and Robertson). The conjectures, the tables and the cut-and-join recursion used for Proposition 4.5 are those of Coulter, Do and Moskovsky.

## Idea of the proof

The counts are traces of products of Jucys–Murphy elements, which act on each irreducible representation of the symmetric group through the "contents" of a Young diagram. Long sequences pick out the largest contents. The largest content gives the limit. The next one comes from the trivial and the standard representation and from sequences that never touch one fixed point, which is why only fixed points matter. For the census, every coefficient is, for fixed $d$, an exact combination of exponentials in the genus, so its sign can be certified for all genera at once.

## Summary for specialists

Fix $\sigma\in S_d$ of cycle type $\mu$ with $f$ fixed points, put $D=d-1$, and let $h_r(\mu;t)$ be the generating polynomial of transitive monotone factorisations of length $r$ by hive number. Then
$$\begin{gathered}\tfrac{d!}{2}\,h_r=D^rA_D-E_r+R_r\\ E_r=(D+f-1)(1+t)(D-1)^rA_{D-1}\\ R_r=O\bigl((1+r)^d(D-2)^r\bigr),\end{gathered}$$
with all terms polynomials in $t$, where $A_D$ is the leading polynomial whose zeros are the limits above. The multi-profile version (Theorem 3.1) replaces $-(D+f-1)(1+t)$ by an explicit polynomial $B(t)$. Each moving zero then differs from its limit by an explicit multiple of $((D-1)/D)^r$ with the predicted sign, and $r\ge200\,d^2\log(20d)$ suffices for strict monotone approach (Theorem 4.4). Theorem 6.1 shows that the coefficient of $(D-j)^r$ depends only on the numbers of cycles of length at most $j$ for $j<d/2$; Theorem 6.2 gives the third term in terms of fixed points and 2-cycles. In the multi-profile case the direction where $B$ vanishes at a limit (Remark 4.3) is left open.

## Evidence, assurance and limitations

- **Evidence.** Eight Python scripts, all exact (Fractions and SymPy) except 60-digit mpmath comparisons with published decimals. They check both terms for every profile of degrees 2 to 5 up to length 24, multi-profile cases, the third term for 55 profiles, the fixed-point identity in 212 cases, the occupancy law in 2136 cases, and the census of all 132 profiles of degrees 4 to 10. Every check exits with an error on failure, also under `python -O`.
- **Replay.** The publisher reran all eight scripts from fresh copies under `python -O`; the outputs were byte-identical to the recorded ones. GitHub CI on Linux reproduced them byte for byte and confirmed that a deliberately altered second-term coefficient makes the check fail.
- **Assurance.** A five-reviewer Claude review panel, one revision round that added the census, a re-review and a proof audit of every new or rewritten proof, and clean replays with a negative control. No Astra/Codex review took place. This is internal AI-assisted review, not peer review, independent reproduction or formal verification.
- **Limitations.**
  - All results are for a fixed number of items $d$ and growing genus.
  - The general threshold is far from optimal: for 7 items it asks for sequences of length 48,429 or more, while the census shows that genus 0 already suffices there.
  - Real zeros and the exact direction at every genus are certified only up to $d = 10$; interlacing at small genus is not certified.
  - The joint regime, in which $d$ and the genus grow together, and the b-deformed family coming from real Grassmannians remain open.
  - This is an unrefereed candidate. Its assurance is internal AI-assisted review and exact computational checks only.

## Who should care, and why

| Audience | Potential use | Required caution |
|---|---|---|
| Researchers on Hurwitz numbers and Weingarten calculus | Explicit second and third large-genus terms for every profile, and an account of the coincidences in the published tables | Fixed degree, growing genus only |
| Researchers on real-rooted polynomials and interlacing | Exact all-genus certificates up to ten items, and examples where monotone approach fails at small genus | Interlacing at small genus is not certified |
| Probabilists | The limiting law of the larger letters used in a long random monotone factorisation | A large-genus statement, not a finite-genus one |
| Research agents | Machine-readable claims, an agent index and eight replayable exact scripts with a failure test | The scripts accompany written proofs; they do not replace them |

## Why the problem matters

Real zeros of a counting polynomial with positive coefficients mean that the counted statistic is a sum of independent coin flips, a hidden structure that usually has a reason. Knowing from which side, and from which genus on, the zeros approach their limits turns a numerical observation of Coulter, Do and Moskovsky into theorems, and locates exactly where their predicted monotone behaviour holds and where it fails.

## How to inspect or reproduce the recorded checks

From the GitHub release or the Zenodo archive, with Python 3.12 and the packages in `requirements.txt` (SymPy, mpmath, NumPy), copy the eight scripts in `code/` into one directory and run each one:

```sh
shasum -a 256 -c MANIFEST.sha256
cd code && python3 -B -O verify.py   # likewise for the other seven scripts
```

Each output, followed by the line `exit 0`, should equal `results/<script>.out` byte for byte; `census.py` takes about one minute and the whole replay about two. `ENVIRONMENT.txt` and `REPLAY_RECEIPT.md` record the software and the comparison policy, `AI_INDEX.md` maps each claim to its proof and checks, `RESEARCH_GATES.json` records the prior-work boundary and `REVIEW_SUMMARY.md` lists the review objections and how each was handled.

## Related releases

Within Evidence Press, [Which central elements are transitive?](/releases/transitive-jucys-murphy-images/) studies the connected (transitive) factorisation counts behind these polynomials from the side of the centre of the symmetric group algebra; it remarks on this family but makes no claims about its zeros.

## The most valuable next projects

1. Bring the general genus threshold down towards what the census shows, ideally to a bound that is small for every degree.
2. Certify interlacing at small genus, and extend the all-genus certificates beyond ten items.
3. Treat the joint regime, in which the degree and the genus grow together, and the b-deformed family from real Grassmannians.
4. Settle the direction of approach in the multi-profile case where the second-term polynomial vanishes at a limit (Remark 4.3).

## What is in the evidence package

The paper (LaTeX sources `manuscript.tex` and `third-residue.tex`, and the 17-page PDF); the eight scripts in `code/` with their recorded outputs in `results/` and `requirements.txt`; `refs.bib` from Crossref and arXiv records; `AI_INDEX.md`; `REVIEW_SUMMARY.md`; `RESEARCH_GATES.json`; `REPLAY_RECEIPT.md` and `ENVIRONMENT.txt`; citation metadata, licences (CC0-1.0 for text, MIT for code), the CI workflow and SHA-256 sums.
