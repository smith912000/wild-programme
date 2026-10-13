# Inner Room intro film (Motion tier T2)

`film.html` is the whole film: a pure function of time (`window.seek(t)` paints frame t),
closed-form springs, seeded noise, every timing and colour in the `C` block at the top.

Render (Node 18+, ffmpeg on PATH):

    npm i playwright @fontsource/cormorant-garamond @fontsource/dm-sans
    mkdir fonts && cp node_modules/@fontsource/{cormorant-garamond,dm-sans}/files/*-latin-{400,500,600,700}-*.woff2 fonts/
    node render.mjs 1920 1080 intro-16x9.mp4 30 22
    node render.mjs 1080 1920 intro-9x16.mp4 30 22

`render.mjs` uses Playwright's Chromium; change `executablePath` to match your machine.
The hub plays the 9:16 cut on tall screens and the 16:9 cut elsewhere, once per device.
