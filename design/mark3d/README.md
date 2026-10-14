# The 3D mark

`assets/wild-3d.js` draws the WILD mark in 3D with three.js (MIT) and its bloom pass: two indigo
rings and the gold aperture, lit from inside, over a seeded star field. `render(t)` is a pure
function of time, so one file drives both:

- the landing hero (`index.html`), live, with a sprung pointer lean. It only starts with WebGL 2,
  without reduced motion and without data saver, sleeps when the hero is off screen, and the flat
  SVG mark stays as the fallback.
- `film.html`, a 6 second seamless loop for social and the hub, rendered frame by frame:
  `npm i three@0.186.1 playwright` in this folder, then `node render.mjs 1920 1080 mark3d-16x9.mp4`
  (or `1080 1920` for 9:16).

Kept clear of the banned looks list (no gradient text, no fade-in on scroll, no cursor beam,
no grain over a gradient).
