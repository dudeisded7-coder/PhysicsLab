/* Lab text and quiz questions. Edit this file to add more. */
const DATA = {
 "topics": [
  {
   "id": "incline",
   "title": "Inclined plane",
   "formula": "a = g (sin θ − μ cos θ)",
   "text": "A block slides down a slope when the pull along the slope beats friction. Mass cancels out of the equation, so heavy and light blocks accelerate the same."
  },
  {
   "id": "projectile",
   "title": "Projectile motion",
   "formula": "R = v² sin 2θ ÷ g     H = v² sin² θ ÷ 2g",
   "text": "Horizontal and vertical motion are independent. Gravity only changes the vertical speed, so the ball keeps its horizontal speed the whole way."
  },
  {
   "id": "energy",
   "title": "Energy: pendulum",
   "formula": "KE = ½mv²     PE = mgh     v = √(2gh)",
   "text": "Energy swaps between height (potential) and movement (kinetic). Without friction the total never changes, and the mass has no effect on the speed at the bottom."
  },
  {
   "id": "waves",
   "title": "Wave interference",
   "formula": "f(beat) = |f₁ − f₂|",
   "text": "When waves overlap, their displacements add. Two waves with slightly different frequencies make beats: loud and quiet pulses."
  },
  {
   "id": "refraction",
   "title": "Refraction",
   "formula": "n₁ sin θ₁ = n₂ sin θ₂",
   "text": "Light bends when it changes speed between materials. Going into a denser material bends it toward the normal. Past the critical angle it reflects completely."
  },
  {
   "id": "collision",
   "title": "Collisions",
   "formula": "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",
   "text": "Momentum is conserved in every collision. Kinetic energy is only conserved in a perfectly elastic one (bounciness e = 1)."
  },
  {
   "id": "circuit",
   "title": "Circuits",
   "formula": "I = V ÷ R     P = V × I",
   "text": "Series: one path, the same current everywhere. Parallel: several paths, the same voltage on each, and the total resistance drops."
  }
 ],
 "quiz": [
  {
   "t": "incline",
   "q": "A block sits on a frictionless slope tilted at 30°. What is its acceleration down the slope? (g = 9.8 m/s²)",
   "o": [
    "4.9 m/s²",
    "8.5 m/s²",
    "9.8 m/s²",
    "2.5 m/s²"
   ],
   "a": 0,
   "e": "a = g sin θ = 9.8 × 0.5 = 4.9 m/s²."
  },
  {
   "t": "incline",
   "q": "A block just starts to slide when the slope reaches 45°. What is the friction coefficient μ?",
   "o": [
    "0.5",
    "0.7",
    "1.0",
    "1.4"
   ],
   "a": 2,
   "e": "It slides when tan θ = μ, and tan 45° = 1."
  },
  {
   "t": "projectile",
   "q": "A ball is launched at 20 m/s at 30° (g = 9.8 m/s²). What is its range?",
   "o": [
    "18 m",
    "35 m",
    "41 m",
    "20 m"
   ],
   "a": 1,
   "e": "R = v² sin 2θ ÷ g = 400 × 0.866 ÷ 9.8 ≈ 35 m."
  },
  {
   "t": "projectile",
   "q": "Ignoring air resistance, which launch angle gives the longest range on level ground?",
   "o": [
    "30°",
    "45°",
    "60°",
    "90°"
   ],
   "a": 1,
   "e": "sin 2θ is largest when 2θ = 90°, so θ = 45°."
  },
  {
   "t": "energy",
   "q": "Where is a swinging pendulum’s kinetic energy greatest?",
   "o": [
    "At the highest point",
    "At the lowest point",
    "Halfway up",
    "It is always equal"
   ],
   "a": 1,
   "e": "At the bottom all the potential energy has become kinetic."
  },
  {
   "t": "energy",
   "q": "A pendulum bob is released 0.2 m above its lowest point. What is its speed at the bottom? (g = 9.8 m/s²)",
   "o": [
    "1.4 m/s",
    "2.0 m/s",
    "4.0 m/s",
    "0.2 m/s"
   ],
   "a": 1,
   "e": "v = √(2gh) = √(2 × 9.8 × 0.2) ≈ 2.0 m/s."
  },
  {
   "t": "waves",
   "q": "Two sound waves of 10 Hz and 12 Hz overlap. How many beats per second are there?",
   "o": [
    "1",
    "2",
    "11",
    "22"
   ],
   "a": 1,
   "e": "Beat frequency = |f₁ − f₂| = 2 Hz."
  },
  {
   "t": "waves",
   "q": "Two equal waves meet exactly half a wavelength out of step. What is the resulting amplitude?",
   "o": [
    "Double",
    "The same",
    "Zero",
    "Half"
   ],
   "a": 2,
   "e": "Crest meets trough and they cancel: destructive interference."
  },
  {
   "t": "refraction",
   "q": "Light goes from air (n = 1) into glass (n = 1.5) at 30° to the normal. What is the angle in the glass?",
   "o": [
    "19.5°",
    "30°",
    "45°",
    "48.6°"
   ],
   "a": 0,
   "e": "sin θ₂ = sin 30° ÷ 1.5 = 0.333, so θ₂ ≈ 19.5°."
  },
  {
   "t": "refraction",
   "q": "Total internal reflection can only happen when light travels…",
   "o": [
    "From glass into air",
    "From air into glass",
    "Through a vacuum",
    "Along the normal"
   ],
   "a": 0,
   "e": "It needs light going from a higher n to a lower n, past the critical angle."
  },
  {
   "t": "collision",
   "q": "A 2 kg block moving at 3 m/s hits a stationary 1 kg block and they stick together. What is their speed?",
   "o": [
    "1.5 m/s",
    "2 m/s",
    "3 m/s",
    "6 m/s"
   ],
   "a": 1,
   "e": "Momentum: 2 × 3 = (2 + 1) × v, so v = 2 m/s."
  },
  {
   "t": "collision",
   "q": "Which type of collision conserves kinetic energy?",
   "o": [
    "Perfectly elastic",
    "Perfectly inelastic",
    "Both",
    "Neither"
   ],
   "a": 0,
   "e": "Only elastic collisions keep the total kinetic energy. Momentum is conserved in all of them."
  },
  {
   "t": "circuit",
   "q": "Two 6 Ω resistors are connected in parallel. What is the total resistance?",
   "o": [
    "12 Ω",
    "6 Ω",
    "3 Ω",
    "1.5 Ω"
   ],
   "a": 2,
   "e": "1 ÷ (1/6 + 1/6) = 3 Ω."
  },
  {
   "t": "circuit",
   "q": "A 12 V battery is connected to two 4 Ω bulbs in series. What current flows?",
   "o": [
    "1.5 A",
    "3 A",
    "6 A",
    "0.67 A"
   ],
   "a": 0,
   "e": "R = 4 + 4 = 8 Ω, so I = 12 ÷ 8 = 1.5 A."
  }
 ]
};
