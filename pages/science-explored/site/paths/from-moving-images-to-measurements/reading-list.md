# From moving images to measurements

For computing students building intuition for sensor data. Work from image formation to image motion and then test the sampling assumptions.

1. Where does a lens form an image?
   - [Lecture 3: Focusing, imaging, and the paraxial approximation](https://ocw.mit.edu/courses/2-71-optics-spring-2009/resources/lecture-3-focusing-imaging-and-the-paraxial-approximation/)
   - [Lecture 4: Sign conventions; thin lenses; real and virtual images](https://ocw.mit.edu/courses/2-71-optics-spring-2009/resources/lecture-4-sign-conventions-thin-lenses-real-and-virtual-images/)
   Draw rays from two object points through a converging lens. Move the object inside the focal length, extend the outgoing rays backwards and record where their extensions meet.
2. Can a moving camera estimate time to contact from an expanding image?
   - [Lecture 2: Image Formation, Perspective Projection, Time Derivative, Motion Field](https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/resources/mit6_801f20_lec02_1080p/)
   - [Lecture 3: Time to Contact, Focus of Expansion, Direct Motion Vision Methods, Noise Gain](https://ocw.mit.edu/courses/6-801-machine-vision-fall-2020/resources/mit6_801f20_lec03_1080p/)
   Measure the apparent width of an object in three successive sketches. State the assumptions needed to infer an approach time. Describe a rotation or change in physical size that would fool that inference.
3. How can two different tones give the same digital samples?
   - [Demonstration 1: Sampling, Aliasing, and Frequency Response, Part 1](https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/resources/demonstration-1-sampling-aliasing-and-frequency-response-part-1/)
   - [Demonstration 2: Sampling, Aliasing, and Frequency Response, Part 2](https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/resources/demonstration-2-sampling-aliasing-and-frequency-response-part-2/)
   Mark equally spaced instants and draw two sinusoids passing through the same sample values. Change the spacing while keeping the original waves fixed. Predict whether the ambiguity survives.