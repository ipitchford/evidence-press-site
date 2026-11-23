# Study a signal in time and frequency

For students with elementary algebra. Trace a feedback recurrence, estimate a peak frequency and explain a sampling ambiguity.

1. What makes a feedback signal decay or grow?
   - [Lecture 2: Discrete-Time (DT) Systems](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/resources/lecture-2-discrete-time-dt-systems/)
   - [Lecture 3: Feedback, Poles, and Fundamental Modes](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/resources/lecture-3-feedback-poles-and-fundamental-modes/)
   Start a recurrence at one and multiply its previous value by one half at every step. Repeat with a negative half and with two. Sketch eight samples from each and distinguish decay from oscillation.
2. How can resonance help measure a frequency?
   - [Lecture 1: Resonance I](https://ocw.mit.edu/courses/8-421-atomic-and-optical-physics-i-spring-2014/resources/lecture-1-resonance-i/)
   - [Lecture 2: Resonance II](https://ocw.mit.edu/courses/8-421-atomic-and-optical-physics-i-spring-2014/resources/lecture-2-resonance-ii/)
   Sketch amplitude against drive frequency for two oscillators with the same natural frequency and different damping. Give a sampling strategy for locating the peak and explain what a broad peak makes difficult.
3. How can two different tones give the same digital samples?
   - [Demonstration 1: Sampling, Aliasing, and Frequency Response, Part 1](https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/resources/demonstration-1-sampling-aliasing-and-frequency-response-part-1/)
   - [Demonstration 2: Sampling, Aliasing, and Frequency Response, Part 2](https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/resources/demonstration-2-sampling-aliasing-and-frequency-response-part-2/)
   Mark equally spaced instants and draw two sinusoids passing through the same sample values. Change the spacing while keeping the original waves fixed. Predict whether the ambiguity survives.