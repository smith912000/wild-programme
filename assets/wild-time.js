/* WILD time-of-day colour, with the planetary days and hours.
   1. Clock wheel (unchanged): the accent goes once round the colour wheel every 24 hours of the visitor's
      local clock, 15 degrees per hour (00:00 red, 06:00 yellow-green, 12:00 cyan, 18:00 violet).
   2. Planetary hours: the day runs from local sunrise to the next sunrise, cut into 12 day hours and
      12 night hours of unequal length. Hour 1 belongs to the day's ruler and the rest follow the Chaldean
      order Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon (Cassius Dio, Roman History 37.18-19).
      Sun times use the NOAA formulas.
   3. Seven colour lenses, one per weekday (our design rule). The day's ruler picks the lens and the lens
      gives each hour's planet a colour. A lens colour with little or no colour lets the foundation show
      through: the planet's measured colour in the sky (colour index B-V, Mallama et al. 2017).
   4. Balance (our rule, golden ratio): accent = 0.618 x planetary hour + 0.382 x clock, scaled by how
      coloured the hour's planet is, so a grey or white planet leaves the clock in charge. Each hour holds
      its colour for its first 61.8% and glides into the next hour over the last 38.2%.
   5. Night hours keep the accent out of the blue band that most suppresses melatonin (446-477 nm,
      Brainard et al. 2001), here hues 190-240.
   Photos and video are rotated back so they keep their true colours. URL options: ?hue=120 fixed angle,
   ?hue=off turns it off, ?at=2026-11-08T15:46Z preview an instant, ?lat=51.5&lon=-0.13 place.
   No cookies, no network, no location prompt: the place is estimated from the visitor's time zone.
   Exposes window.WILD_TIME (planetary day, hour, lens) and data-wild-day / data-wild-hour / data-wild-lens
   on <html> for other features. */
(function () {
  var W = typeof window !== 'undefined' ? window : this;
  var R = Math.PI / 180, PHI = (1 + Math.sqrt(5)) / 2, G = 1 / PHI;
  var CH = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  var DAYRULER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']; /* JS getUTCDay order */
  /* [hue, saturation] per planet in Chaldean order; 0 = no colour in this lens, the foundation shows. */
  var SKY = [[26, .25], [27, .18], [27, .35], [27, .09], [28, .12], [27, .22], [27, .2]];
  var LENS = {
    sky: SKY,                                                                         /* (c) measured */
    barrett: [[215, .26], [52, .53], [6, .85], [48, 1], 0, 0, 0],                       /* (a) The Magus 1801 */
    king: [[348, .89], [265, .78], [28, .88], [346, .31], [45, 1], [277, .61], [249, .7]], /* (b) Golden Dawn */
    cousto: [[215, 1], [0, 1], [203, 1], 0, [27, 1], [189, 1], [0, 1]],                 /* (b on c) light octave */
    parashara: [0, [50, .86], [6, .85], [5, .83], 0, 0, 0],                             /* (a) BPHS 3.42-44 */
    queen: [0, [222, .79], [4, .87], [48, 1], [145, .82], [28, .88], [267, .68]],       /* (b) Golden Dawn */
    wuxing: [[48, .88], [169, .67], [6, .85], 0, 0, 0, 0]                              /* (a) Five Phases */
  };
  /* (d) our rule: which lens each day wears, keyed by the day's ruler. */
  var DAYLENS = { Sun: 'sky', Moon: 'barrett', Mars: 'king', Mercury: 'cousto', Jupiter: 'parashara', Venus: 'queen', Saturn: 'wuxing' };
  var BASE = 18; /* the accent in the stylesheets is ember copper, hue 18 degrees */
  var NIGHT_BAND = [190, 240];

  /* ---- sun (NOAA) ---- */
  function sunPos(jc) {
    var L0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360, M = 357.52911 + jc * (35999.05029 - 0.0001537 * jc),
      e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
    var C1 = Math.sin(M * R) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * jc) + Math.sin(3 * M * R) * 0.000289;
    var om = 125.04 - 1934.136 * jc, lam = L0 + C1 - 0.00569 - 0.00478 * Math.sin(om * R);
    var e0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60, eps = e0 + 0.00256 * Math.cos(om * R);
    var decl = Math.asin(Math.sin(eps * R) * Math.sin(lam * R)), y = Math.pow(Math.tan(eps * R / 2), 2);
    var eq = 4 / R * (y * Math.sin(2 * L0 * R) - 2 * e * Math.sin(M * R) + 4 * e * y * Math.sin(M * R) * Math.cos(2 * L0 * R) - 0.5 * y * y * Math.sin(4 * L0 * R) - 1.25 * e * e * Math.sin(2 * M * R));
    return { decl: decl, eq: eq };
  }
  function ev(base, lat, lon, s) {
    var t = base + (720 - 4 * lon) * 6e4;
    for (var i = 0; i < 3; i++) {
      var p = sunPos((t / 864e5 + 2440587.5 - 2451545) / 36525);
      var c = Math.cos(90.833 * R) / (Math.cos(lat * R) * Math.cos(p.decl)) - Math.tan(lat * R) * Math.tan(p.decl);
      if (c > 1 || c < -1) return null;
      t = base + (720 - 4 * (lon + s * Math.acos(c) / R) - p.eq) * 6e4;
    }
    return t;
  }
  function dayEv(y, m, d, lat, lon) { var b = Date.UTC(y, m, d); return { sr: ev(b, lat, lon, 1), ss: ev(b, lat, lon, -1), wd: new Date(b).getUTCDay() }; }

  /* ---- planetary day and hour containing instant t (ms) ---- */
  function planetary(t, lat, lon) {
    var sd = new Date(t + lon * 4 * 6e4), Y = sd.getUTCFullYear(), M = sd.getUTCMonth(), D = sd.getUTCDate();
    for (var o = -1; o <= 1; o++) {
      var X = dayEv(Y, M, D + o, lat, lon), N = dayEv(Y, M, D + o + 1, lat, lon);
      if (X.sr == null || X.ss == null || N.sr == null) return null;
      if (t >= X.sr && t < N.sr) {
        var day = t < X.ss, s0 = day ? X.sr : X.ss, e0 = day ? X.ss : N.sr, L = (e0 - s0) / 12;
        var k = Math.min(11, Math.floor((t - s0) / L)), n = (day ? 0 : 12) + k + 1, ruler = DAYRULER[X.wd];
        var b = CH.indexOf(ruler);
        return { dayRuler: ruler, hour: n, part: day ? 'day' : 'night', hourRuler: CH[(b + n - 1) % 7],
          nextRuler: CH[(b + n) % 7], nextDayRuler: CH[(b + 24) % 7], frac: (t - s0 - k * L) / L,
          minutes: L / 6e4, sunrise: X.sr, sunset: X.ss };
      }
    }
    return null;
  }

  /* ---- colour ---- */
  function vec(lens, planet) {
    var i = CH.indexOf(planet), c = LENS[lens][i] || SKY[i];
    return [c[1] * Math.cos(c[0] * R), c[1] * Math.sin(c[0] * R)];
  }
  function hueOf(v) { var h = Math.atan2(v[1], v[0]) / R; return (h + 360) % 360; }
  function accent(t, lat, lon, clockMin) {
    var clock = clockMin / 1440 * 360, P = planetary(t, lat, lon);
    if (!P) return { hue: clock, clock: clock, planetary: null };
    var lens = DAYLENS[P.dayRuler], nextLens = P.hour === 24 ? DAYLENS[P.nextDayRuler] : lens;
    var a = vec(lens, P.hourRuler), b = vec(nextLens, P.nextRuler), g = 0;
    if (P.frac > G) { g = (P.frac - G) / (1 - G); g = g * g * (3 - 2 * g); }
    var p = [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g], m = Math.min(1, Math.sqrt(p[0] * p[0] + p[1] * p[1]));
    var wc = 1 - G * m, c = [Math.cos(clock * R), Math.sin(clock * R)];
    var h = hueOf([G * p[0] + wc * c[0], G * p[1] + wc * c[1]]);
    if (P.part === 'night' && h > NIGHT_BAND[0] && h < NIGHT_BAND[1])
      h = h - NIGHT_BAND[0] < NIGHT_BAND[1] - h ? NIGHT_BAND[0] : NIGHT_BAND[1];
    return { hue: h, clock: clock, planetWeight: G * m, lens: lens, planetary: P };
  }

  /* ---- place from time zone (no prompt). Fallback: longitude from the UTC offset, latitude 51.5. ---- */
  var TZ = { 'Europe/London': [51.51, -0.13], 'Europe/Dublin': [53.35, -6.26], 'Europe/Paris': [48.86, 2.35], 'Europe/Berlin': [52.52, 13.4],
    'Europe/Madrid': [40.42, -3.7], 'Europe/Rome': [41.9, 12.5], 'Europe/Amsterdam': [52.37, 4.9], 'Europe/Athens': [37.98, 23.73],
    'America/New_York': [40.71, -74.01], 'America/Chicago': [41.88, -87.63], 'America/Denver': [39.74, -104.99],
    'America/Los_Angeles': [34.05, -118.24], 'America/Toronto': [43.65, -79.38], 'Australia/Sydney': [-33.87, 151.21],
    'Australia/Melbourne': [-37.81, 144.96], 'Asia/Kolkata': [28.61, 77.21], 'Asia/Shanghai': [39.9, 116.4], 'Asia/Tokyo': [35.68, 139.69],
    'Asia/Dubai': [25.2, 55.27], 'Africa/Johannesburg': [-26.2, 28.05], 'Pacific/Auckland': [-36.85, 174.76] };
  function place(search, now) {
    var la = /[?&]lat=(-?[\d.]+)/.exec(search), lo = /[?&]lon=(-?[\d.]+)/.exec(search);
    if (la && lo) return [+la[1], +lo[1]];
    try { var z = Intl.DateTimeFormat().resolvedOptions().timeZone; if (TZ[z]) return TZ[z]; } catch (e) {}
    return [51.5, -now.getTimezoneOffset() / 4];
  }

  W.WILD_TIME = { planetary: planetary, accent: accent, LENS: LENS, DAYLENS: DAYLENS, SKY: SKY, CH: CH, BASE: BASE, NIGHT_BAND: NIGHT_BAND };
  if (typeof document === 'undefined' || !document.documentElement) return;

  var d = document.documentElement, search = location.search;
  var q = /[?&]hue=([^&]+)/.exec(search);
  if (q && q[1] === 'off') return;
  var at = /[?&]at=([^&]+)/.exec(search);
  var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = document.createElement('style');
  s.textContent = 'html{filter:hue-rotate(var(--wild-hue,0deg))}' +
    (reduce ? '' : 'html{transition:filter 30s linear}') +
    'img,video,picture,[data-keep-hue]{filter:hue-rotate(calc(-1 * var(--wild-hue,0deg)))}';
  (document.head || d).appendChild(s);
  function set() {
    var deg;
    if (q) deg = parseFloat(q[1]) || 0;
    else {
      var n = at ? new Date(decodeURIComponent(at[1])) : new Date(), pl = place(search, n);
      var A = accent(n.getTime(), pl[0], pl[1], n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60);
      W.WILD_TIME.now = A;
      if (A.planetary) {
        d.setAttribute('data-wild-day', A.planetary.dayRuler);
        d.setAttribute('data-wild-hour', A.planetary.hourRuler);
        d.setAttribute('data-wild-lens', A.lens);
      }
      deg = A.hue - BASE;
    }
    if (last != null) deg = last + ((((deg - last) % 360) + 540) % 360 - 180); /* shortest way round, no full spins */
    last = deg;
    d.style.setProperty('--wild-hue', (Math.round(deg * 10) / 10) + 'deg');
  }
  var last = null;
  set();
  if (!q && !at) setInterval(set, 60000);
})();
