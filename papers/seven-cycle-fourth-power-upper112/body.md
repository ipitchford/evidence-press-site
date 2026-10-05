## Summary

How many four-symbol messages can remain distinguishable when each symbol has seven possible values and neighbouring values can be confused? A known construction gives **108** messages. This candidate proves that **113 are impossible**, narrowing the possible answer to **108–112**.

The evidence is a finite, exact computation joined to a written mathematical reduction. It checks every required case and uses integer inequalities to rule out completions. The precise answer is still unknown.

## Summary for specialists

For the strong graph power on $\mathbb Z_7^4$, with distinct vertices adjacent when every coordinate difference is $0$ or $\pm 1$, the candidate establishes

$$108\leq\alpha(C_7^{\boxtimes 4})\leq 112.$$

The upper bound excludes size 113 by exhaustive adjacent and nonadjacent maximum-band cases. Double counting then gives $\alpha(C_7^{\boxtimes 5})\leq 392$. These finite-power bounds do not determine Shannon capacity.

## Technical account

Slice a hypothetical 113-word independent set into seven layers. Each adjacent pair projects injectively to a cubic independent set of size at most 33. The seven band sizes sum to 226. If at most one band had size 33, their sum would be at most $33+6\cdot 32=225$. At least two maximum bands therefore exist.

Two selected maximum bands either share a layer or are disjoint. The nonadjacent component covers both possible separations. Once it is excluded, the adjacent case has layer profile $(16,17,16,16,16,16,16)$, up to rotation.

A complete catalogue of 1,016 cubic isometry classes supplies exact necessary transverse trace relations. Every physical allocation is covered by a checked formula or a complete union of partial assignments. Exact weighted packing inequalities exclude every retained prefix. The revised paper spells out the encoding, exhaustive coverage invariants, physical-only blocking and proof-checking semantics.

A separate prerequisite establishes $\alpha(C_5\boxtimes C_7^{\boxtimes 3})\leq 77$. It applies to an actual five-cycle obtained by contraction. Five layers outside a band form a path, so adding 33 and 77 would be an invalid shortcut.

## Evidence, assurance and limitations

The release includes the complete portable proof components and their source code. The acceptance record covers the full main replay and, separately, the complete restricted 32-code census and both saturation-elimination passes. Auxiliary certificates classify 1,003,520 maximum-square traces, establish the square-factor gadget maximum 106, and give exact feasible pseudo-moments for one specified two-block relaxation at 109–112.

These statements have different scopes. The trace classification is not a census of all 32-word cubic codes. The saturation exclusion assumes size 112 and no 33-band and eliminates only zero excess. The gadget result concerns one construction with two square factors. Feasible pseudo-moments are not independent sets.

The manuscript remains an unrefereed candidate. Producer-side replay, the supplied AI-assisted review and an archive DOI do not establish unaffiliated reproduction, formal verification, external specialist acceptance or worldwide priority.

## Relationship to earlier work

Vesel and Žerovnik supplied the original 108 construction in 2002. Polak and Schrijver's 2019 table records the historical fourth-power interval 108–115; their principal construction concerns dimension five. The present candidate lowers that recorded upper endpoint by three.

The more recent Itty and Gao constructions, and Buys–Polak–Zuiddam's valid-tuple formulation and Lean-verified iteration, improve asymptotic lower bounds using higher powers. The 106 theorem here transfers to valid tuples when both input graphs are squares. It does not limit those higher-dimensional constructions.

## Who should care, and why

| Audience | Potential use | Required caution |
| --- | --- | --- |
| Extremal graph theorists | A tighter finite bound and complete boundary catalogues | The exact fourth-power value is unresolved |
| Zero-error coding researchers | Explicit constraints on short distinguishable-message sets | A finite-power upper bound is not a capacity determination |
| Computer-assisted proof researchers | Inspectable trace encodings, exhaustive coverage and integer certificates | Source semantics and runtime remain trusted components |

## Why the problem matters

Strong graph powers model repeated uses of a channel whose confusable symbols form a graph. The independence number counts messages that can be distinguished without error under that model. Even small odd cycles lead to difficult extremal questions. A tighter finite interval helps distinguish successful construction methods from relaxations that are too weak.

## How to inspect or reproduce the recorded checks

Start with the [paper](https://github.com/ipitchford/seven-cycle-fourth-power-upper112/releases/download/v0.1.0-candidate/paper.pdf), especially the finite-proof appendix. Download the evidence bundle from the [versioned release](https://github.com/ipitchford/seven-cycle-fourth-power-upper112/releases/tag/v0.1.0-candidate). Its `REPRODUCE.md` lists copyable commands, expected terminal statuses and prerequisite source locations.

The main replay requires Python 3.10 or later, a C++17 compiler, and at least 20 GiB free disk. It needs no SAT solver or numerical optimizer. Allow roughly two hours on comparable hardware. Quick manifest checks do not substitute for this full replay. A timeout or incomplete run is not a proof.

## The most valuable next projects

An unaffiliated full replay and semantic audit would strengthen assurance. Mathematically, the remaining 112-word cases include positive saturation excess and codes with a 33-band. A 109-word construction or an exclusion of 109 would address the central unresolved gap. Stronger moment conditions need their own exact certificates; the supplied two-block feasibility result does not decide them.

## What is in the evidence package

The package contains the revised paper in PDF, LaTeX and consistently numbered Markdown; a claim and dependency map; five unchanged certificate archives; full acceptance receipts; a response to every review finding; source and licence records; and a dated guide to superseded historical status notes. The 108-word witness is literal data whose 5,778 pairs can be checked directly.
