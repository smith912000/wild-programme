/* WILD time-of-day colour. Rotates the whole palette once round the colour wheel every 24 hours by the
   visitor's local clock, so the colours drift slowly through the spectrum. The accent colour sits on the clock: 00:00 red, 06:00 green-yellow, 12:00 cyan, 18:00 violet, then back to red at midnight (hue = 15 degrees per hour).
   Photos and video are rotated back so they keep their true colours. Add ?hue=120 to a URL to preview a
   fixed angle, or ?hue=off to turn it off. No cookies, no network. */
(function () {
  var d = document.documentElement;
  var BASE = 18; /* the accent in the stylesheets is ember copper, hue 18 degrees */
  var q = /[?&]hue=([^&]+)/.exec(location.search);
  if (q && q[1] === 'off') return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = document.createElement('style');
  s.textContent = 'html{filter:hue-rotate(var(--wild-hue,0deg))}' +
    (reduce ? '' : 'html{transition:filter 30s linear}') +
    'img,video,picture,[data-keep-hue]{filter:hue-rotate(calc(-1 * var(--wild-hue,0deg)))}';
  (document.head || d).appendChild(s);
  function set() {
    var deg;
    if (q) deg = parseFloat(q[1]) || 0;
    else { var n = new Date(); deg = ((n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60) / 1440) * 360 - BASE; }
    d.style.setProperty('--wild-hue', (Math.round(deg * 10) / 10) + 'deg');
  }
  set();
  if (!q) setInterval(set, 60000);
})();
