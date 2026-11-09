/* WILD loading screen, the same on every WILD app page (hub, parser, Maryada, SGE, Codex and the open
   copies; WILD OS draws the same screen inside its app). Put it first in <head>, without defer:
     <script src="https://smith912000.github.io/wild-programme/assets/wild-loader.js"></script>
   It paints at once in the current palette, in the colour this device last used (wild-time.js remembers
   it), and lifts as soon as the page has drawn. It never holds a page: gone by 3 s at the latest.
   No network, no cookies. */
(function () {
  if (window.__wildLoader) return;
  window.__wildLoader = 1;
  var d = document.documentElement, t0 = Date.now();

  /* today's colour from the last visit, so nothing shifts when wild-time.js (deferred) arrives */
  try {
    var h = localStorage.getItem('wild_hue');
    if (h != null && !/[?&](hue|at)=/.test(location.search)) {
      d.style.setProperty('--wild-hue', parseFloat(h) + 'deg');
      var hs = document.createElement('style');
      hs.textContent = 'html{filter:hue-rotate(var(--wild-hue,0deg))}img,video,picture,[data-keep-hue]{filter:hue-rotate(calc(-1 * var(--wild-hue,0deg)))}';
      (document.head || d).appendChild(hs);
    }
  } catch (e) {}

  var css = document.createElement('style');
  css.textContent =
    '#wild-loader{position:fixed;inset:0;z-index:2147483646;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;' +
    'background:#06100E;color:#A3B0AB;font:600 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.42em;text-indent:.42em;' +
    'visibility:visible!important;transition:opacity .2s ease}' +
    '#wild-loader.out{opacity:0;pointer-events:none}' +
    '#wild-loader svg{width:40px;height:48px;animation:wildbreathe 1.6s ease-in-out infinite}' +
    '@keyframes wildbreathe{0%,100%{opacity:.5;transform:scale(.94)}50%{opacity:1;transform:scale(1)}}' +
    '@media(prefers-reduced-motion:reduce){#wild-loader svg{animation:none}#wild-loader{transition:none}}';
  (document.head || d).appendChild(css);

  var el = document.createElement('div');
  el.id = 'wild-loader';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-label', 'Loading');
  el.innerHTML = '<svg viewBox="0 0 100 120" aria-hidden="true"><g fill="none" stroke="#4DB8A2" stroke-width="7"><circle cx="50" cy="44" r="34"/><circle cx="50" cy="76" r="34"/></g>' +
    '<line x1="50" y1="51" x2="50" y2="69" stroke="#EBA37F" stroke-width="8" stroke-linecap="round"/></svg><div>WILD</div>';
  d.appendChild(el); /* on <html>, not <body>, so the members' gate never hides it */

  var gone = false;
  function lift() {
    if (gone) return;
    gone = true;
    el.classList.add('out');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
  }
  window.WILD_LOADER = { lift: lift };
  /* lift on the frame after the page is parsed, so the page is drawn underneath as it fades */
  function ready() {
    (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(lift);
  }
  if (document.readyState !== 'loading') ready();
  else document.addEventListener('DOMContentLoaded', ready);
  setTimeout(lift, Math.max(0, 3000 - (Date.now() - t0)));
})();
