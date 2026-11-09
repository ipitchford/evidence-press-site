# From membranes to interacting circuits

This route follows the mechanism of communication: charge movement, membrane response, transmission and interacting populations. It differs from a general introduction to computational neuroscience by organising every step around what changes between an input and an output. Begin with conceptual sketches, then use the mathematical and notebook material only as preparation allows. The recurring task is to identify what is measured, what is modelled and what the model omits.

1. [Lecture 3: Brain I](https://ocw.mit.edu/courses/9-00sc-introduction-to-psychology-fall-2011/resources/lecture-3-brain-i/)
   Establish the neuron and nervous-system vocabulary before the physical models.
   Task: Draw a neuron with input regions, cell body and output. Label this as a simplified diagram, not a complete biological inventory.

2. [1. Overview and Ionic Currents](https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/resources/overview-and-ionic-currents/)
   Move from a labelled cell to the physical sources of current.
   Task: Explain in separate sentences how a concentration difference and an electrical difference can influence movement of charge.

3. [2. RC Circuit and Nernst Potential](https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/resources/2/)
   Use the physical account to understand a membrane’s time-dependent response.
   Task: Sketch a response to a sustained current and mark which features a resistance–capacitance model is intended to represent.

4. [Video 1: Reduced Neuron Models](https://compneuro.neuromatch.io/tutorials/W2D4_BiologicalNeuronModels/student/W2D4_Tutorial1.html)
   Introduce a deliberately reduced spiking model after the circuit foundation.
   Task: List the threshold/reset rule and two biological details it leaves out. Distinguish a convenient rule from a measured mechanism.

5. [7. Synapses](https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/resources/7/)
   Connect cells through transmission rather than treating them as isolated units.
   Task: Explain why an arrow labelled with a fixed weight may omit saturation, time and input location.

6. [Video 1: Static and dynamic synapses](https://compneuro.neuromatch.io/tutorials/W2D4_BiologicalNeuronModels/student/W2D4_Tutorial3.html)
   Now let a connection’s immediate influence change during activity.
   Task: Compare a fixed connection with a temporarily changing one under the same hypothetical input train.

7. [Video 1: STDP](https://compneuro.neuromatch.io/tutorials/W2D4_BiologicalNeuronModels/student/W2D4_Tutorial4.html)
   Distinguish a learning rule from the short-term effects in the preceding step.
   Task: Write the observation that would be needed to decide whether a change persists beyond the input sequence.

8. [Video 1: Phase analysis of the Wilson-Cowan E-I model](https://compneuro.neuromatch.io/tutorials/W2D5_DynamicalSystems/student/W2D5_Tutorial2.html)
   Optional advanced branch: combine excitation and inhibition using coupled differential equations after the cell and synapse assumptions. Prepare calculus and phase-plane reasoning, plus linear algebra for stability extensions.
   Task: Name what the population variables stand for and one single-cell feature that the model does not resolve. Attempt equations/notebooks only with the stated mathematical/Python preparation.

Original route: Evidence Press, CC BY 4.0. Linked teaching material retains its own rights. No videos or YouTube API payloads are included.
