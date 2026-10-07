import OAI.Combinatorics.SecondNeighborhood.Main

-- Audit wrapper; source commit and environment are recorded in openai-math-20261007.md.
theorem audit_standard_statement {V : Type*} [Fintype V] [Nonempty V] [DecidableEq V]
    (r : V → V → Prop)
    (hloop : ∀ v, ¬ r v v) (hasym : ∀ {u v}, r u v → ¬ r v u) :
    (by classical exact ∃ v, (Finset.univ.filter (fun w => r v w)).card ≤
      (Finset.univ.filter (fun w => w ≠ v ∧ ¬ r v w ∧ ∃ u, r v u ∧ r u w)).card) := by
  classical
  simpa only [OAI.SeymourSecondNeighborhood.GoodVertex,
    OAI.SeymourSecondNeighborhood.firstNeighbors,
    OAI.SeymourSecondNeighborhood.secondNeighbors] using
    OAI.SeymourSecondNeighborhood.exists_goodVertex r ⟨hloop, hasym⟩

#print axioms OAI.SeymourSecondNeighborhood.exists_goodVertex
#check OAI.SeymourSecondNeighborhood.exists_goodVertex
