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
      coloured the hour's planet is, so a grey or white planet leaves the clock in charge, and by where the
      planet really is today (JPL orbital elements): faint when lost in the Sun's glare, full at its
      brightest; the Moon by its phase. So no two weeks are the same. Each hour holds
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
  if (W.WILD_TIME) return; /* loaded once per page, however many tags or navs ask for it */
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

  /* ---- where the planets really are: JPL approximate Keplerian elements (Standish, valid 1800-2050) ----
     [a, e, I, L, long. perihelion, long. node] and their rates per Julian century from J2000. */
  var EL = {
    Mercury: [[0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593], [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081]],
    Venus: [[0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255], [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418]],
    Earth: [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0]],
    Mars: [[1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891], [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343]],
    Jupiter: [[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
    Saturn: [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, 0.28867794]]
  };
  function helio(p, T) {
    var E0 = EL[p][0], d = EL[p][1], x = [];
    for (var i = 0; i < 6; i++) x[i] = E0[i] + d[i] * T;
    var a = x[0], e = x[1], I = x[2] * R, w = (x[4] - x[5]) * R, O = x[5] * R, M = ((x[3] - x[4]) % 360) * R, E = M;
    for (var k = 0; k < 8; k++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    var xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    var cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I), sI = Math.sin(I);
    return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
      (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp, sw * sI * xp + cw * sI * yp];
  }
  function sub(u, v) { return [u[0] - v[0], u[1] - v[1], u[2] - v[2]]; }
  function len(u) { return Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]); }
  function angle(u, v) { return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (len(u) * len(v))))) / R; }
  /* reflected light seen from Earth: half-lit-disc law (1 + cos phase) / 2 over r^2 Delta^2 */
  function flux(r, D, alpha) { return (1 + Math.cos(alpha * R)) / 2 / (r * r * D * D); }
  var BEST = {};
  function best(p) { /* brightest the planet gets, on near-circular orbits, sampled once */
    if (BEST[p]) return BEST[p];
    var a = EL[p][0][0], m = 0;
    for (var k = 0; k < 720; k++) {
      var th = k / 2 * R, P = [a * Math.cos(th), a * Math.sin(th), 0], Dv = sub(P, [1, 0, 0]);
      if (angle([-1, 0, 0], Dv) < 15) continue;
      m = Math.max(m, flux(a, len(Dv), angle(sub([1, 0, 0], P), [-P[0], -P[1], 0])));
    }
    return (BEST[p] = m);
  }
  function sky(t) { /* (c) each planet's state at instant t: elongation from the Sun, brightness, Moon phase */
    var T = (t / 864e5 + 2440587.5 - 2451545) / 36525, Eh = helio('Earth', T), out = {};
    ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].forEach(function (p) {
      var P = helio(p, T), D = sub(P, Eh), elong = angle([-Eh[0], -Eh[1], -Eh[2]], D), alpha = angle(sub(Eh, P), [-P[0], -P[1], -P[2]]);
      var mag = -2.5 * Math.log(flux(len(P), len(D), alpha) / best(p)) / Math.LN10; /* magnitudes below its best */
      var glare = Math.max(0, Math.min(1, (elong - 10) / 15)); glare = glare * glare * (3 - 2 * glare);
      out[p] = { elongation: elong, belowBest: mag, visibility: glare * Math.max(0, Math.min(1, 1 - mag / 5)) };
    });
    /* Moon: mean synodic month from the new moon of 2000-01-06 18:14 UTC (Meeus) */
    var age = (((t - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530589 + 29.530589) % 29.530589, lit = (1 - Math.cos(age / 29.530589 * 2 * Math.PI)) / 2;
    out.Moon = { age: age, illuminated: lit, visibility: lit };
    out.Sun = { visibility: 1 };
    return out;
  }

  /* ---- colour ---- */
  /* A planet's colour strength = its lens saturation x (1/phi^2 + 1/phi x how visible it is today), so the
     tradition's ruler always shows, and the real sky decides how strongly (hidden 0.382, at its best 1). */
  function vec(lens, planet, S) {
    var i = CH.indexOf(planet), c = LENS[lens][i] || SKY[i], k = c[1] * (1 - G + G * S[planet].visibility);
    return [k * Math.cos(c[0] * R), k * Math.sin(c[0] * R)];
  }
  function hueOf(v) { var h = Math.atan2(v[1], v[0]) / R; return (h + 360) % 360; }
  function accent(t, lat, lon, clockMin) {
    var clock = clockMin / 1440 * 360, P = planetary(t, lat, lon);
    if (!P) return { hue: clock, clock: clock, planetary: null };
    var lens = DAYLENS[P.dayRuler], nextLens = P.hour === 24 ? DAYLENS[P.nextDayRuler] : lens;
    var S = sky(t), a = vec(lens, P.hourRuler, S), b = vec(nextLens, P.nextRuler, S), g = 0;
    if (P.frac > G) { g = (P.frac - G) / (1 - G); g = g * g * (3 - 2 * g); }
    var p = [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g], m = Math.min(1, Math.sqrt(p[0] * p[0] + p[1] * p[1]));
    var wc = 1 - G * m, c = [Math.cos(clock * R), Math.sin(clock * R)];
    var h = hueOf([G * p[0] + wc * c[0], G * p[1] + wc * c[1]]);
    if (P.part === 'night' && h > NIGHT_BAND[0] && h < NIGHT_BAND[1])
      h = h - NIGHT_BAND[0] < NIGHT_BAND[1] - h ? NIGHT_BAND[0] : NIGHT_BAND[1];
    return { hue: h, clock: clock, planetWeight: G * m, lens: lens, planetary: P, sky: S };
  }

  /* ---- place from time zone (no prompt). Fallback: longitude from the UTC offset, latitude 51.5. ---- */
  /* TZ-PLACES (generated by scripts/build-tz-places.py from tzdata zone.tab; do not edit by hand).
     Every IANA time zone and the place its clock is set by, so the sunrise and planetary hours are
     the visitor's own. 418 zones, 111 old names. */
  var TZP = {
    Africa: 'Abidjan 5.3 -4,Accra 5.5 -.2,Addis_Ababa 9 38.7,Algiers 36.8 3,Asmara 15.3 38.9,Bamako 12.7 -8,Bangui 4.4 18.6,Banjul 13.5 -16.6,Bissau 11.8 -15.6,Blantyre -15.8 35,Brazzaville -4.3 15.3,Bujumbura -3.4 29.4,Cairo 30.1 31.2,Casablanca 33.6 -7.6,Ceuta 35.9 -5.3,Conakry 9.5 -13.7,Dakar 14.7 -17.4,Dar_es_Salaam -6.8 39.3,Djibouti 11.6 43.1,Douala 4 9.7,El_Aaiun 27.1 -13.2,Freetown 8.5 -13.2,Gaborone -24.6 25.9,Harare -17.8 31.1,Johannesburg -26.2 28,Juba 4.8 31.6,Kampala .3 32.4,Khartoum 15.6 32.5,Kigali -1.9 30.1,Kinshasa -4.3 15.3,Lagos 6.5 3.4,Libreville .4 9.4,Lome 6.1 1.2,Luanda -8.8 13.2,Lubumbashi -11.7 27.5,Lusaka -15.4 28.3,Malabo 3.8 8.8,Maputo -26 32.6,Maseru -29.5 27.5,Mbabane -26.3 31.1,Mogadishu 2.1 45.4,Monrovia 6.3 -10.8,Nairobi -1.3 36.8,Ndjamena 12.1 15.1,Niamey 13.5 2.1,Nouakchott 18.1 -15.9,Ouagadougou 12.4 -1.5,Porto-Novo 6.5 2.6,Sao_Tome .3 6.7,Tripoli 32.9 13.2,Tunis 36.8 10.2,Windhoek -22.6 17.1',
    America: 'Adak 51.9 -176.7,Anchorage 61.2 -149.9,Anguilla 18.2 -63.1,Antigua 17.1 -61.8,Araguaina -7.2 -48.2,Argentina/Buenos_Aires -34.6 -58.5,Argentina/Catamarca -28.5 -65.8,Argentina/Cordoba -31.4 -64.2,Argentina/Jujuy -24.2 -65.3,Argentina/La_Rioja -29.4 -66.8,Argentina/Mendoza -32.9 -68.8,Argentina/Rio_Gallegos -51.6 -69.2,Argentina/Salta -24.8 -65.4,Argentina/San_Juan -31.5 -68.5,Argentina/San_Luis -33.3 -66.3,Argentina/Tucuman -26.8 -65.2,Argentina/Ushuaia -54.8 -68.3,Aruba 12.5 -70,Asuncion -25.3 -57.7,Atikokan 48.8 -91.6,Bahia -13 -38.5,Bahia_Banderas 20.8 -105.2,Barbados 13.1 -59.6,Belem -1.4 -48.5,Belize 17.5 -88.2,Blanc-Sablon 51.4 -57.1,Boa_Vista 2.8 -60.7,Bogota 4.6 -74.1,Boise 43.6 -116.2,Cambridge_Bay 69.1 -105.1,Campo_Grande -20.4 -54.6,Cancun 21.1 -86.8,Caracas 10.5 -66.9,Cayenne 4.9 -52.3,Cayman 19.3 -81.4,Chicago 41.9 -87.7,Chihuahua 28.6 -106.1,Ciudad_Juarez 31.7 -106.5,Costa_Rica 9.9 -84.1,Coyhaique -45.6 -72.1,Creston 49.1 -116.5,Cuiaba -15.6 -56.1,Curacao 12.2 -69,Danmarkshavn 76.8 -18.7,Dawson 64.1 -139.4,Dawson_Creek 55.8 -120.2,Denver 39.7 -105,Detroit 42.3 -83,Dominica 15.3 -61.4,Edmonton 53.5 -113.5,Eirunepe -6.7 -69.9,El_Salvador 13.7 -89.2,Fort_Nelson 58.8 -122.7,Fortaleza -3.7 -38.5,Glace_Bay 46.2 -60,Goose_Bay 53.3 -60.4,Grand_Turk 21.5 -71.1,Grenada 12.1 -61.8,Guadeloupe 16.2 -61.5,Guatemala 14.6 -90.5,Guayaquil -2.2 -79.8,Guyana 6.8 -58.2,Halifax 44.6 -63.6,Havana 23.1 -82.4,Hermosillo 29.1 -111,Indiana/Indianapolis 39.8 -86.2,Indiana/Knox 41.3 -86.6,Indiana/Marengo 38.4 -86.3,Indiana/Petersburg 38.5 -87.3,Indiana/Tell_City 38 -86.8,Indiana/Vevay 38.7 -85.1,Indiana/Vincennes 38.7 -87.5,Indiana/Winamac 41.1 -86.6,Inuvik 68.3 -133.7,Iqaluit 63.7 -68.5,Jamaica 18 -76.8,Juneau 58.3 -134.4,Kentucky/Louisville 38.3 -85.8,Kentucky/Monticello 36.8 -84.8,Kralendijk 12.2 -68.3,La_Paz -16.5 -68.2,Lima -12.1 -77,Los_Angeles 34.1 -118.2,Lower_Princes 18.1 -63,Maceio -9.7 -35.7,Managua 12.2 -86.3,Manaus -3.1 -60,Marigot 18.1 -63.1,Martinique 14.6 -61.1,Matamoros 25.8 -97.5,Mazatlan 23.2 -106.4,Menominee 45.1 -87.6,Merida 21 -89.6,Metlakatla 55.1 -131.6,Mexico_City 19.4 -99.2,Miquelon 47 -56.3,Moncton 46.1 -64.8,Monterrey 25.7 -100.3,Montevideo -34.9 -56.2,Montserrat 16.7 -62.2,Nassau 25.1 -77.3,New_York 40.7 -74,Nome 64.5 -165.4,Noronha -3.9 -32.4,North_Dakota/Beulah 47.3 -101.8,North_Dakota/Center 47.1 -101.3,North_Dakota/New_Salem 46.8 -101.4,Nuuk 64.2 -51.7,Ojinaga 29.6 -104.4,Panama 9 -79.5,Paramaribo 5.8 -55.2,Phoenix 33.4 -112.1,Port-au-Prince 18.5 -72.3,Port_of_Spain 10.7 -61.5,Porto_Velho -8.8 -63.9,Puerto_Rico 18.5 -66.1,Punta_Arenas -53.1 -70.9,Rankin_Inlet 62.8 -92.1,Recife -8.1 -34.9,Regina 50.4 -104.7,Resolute 74.7 -94.8,Rio_Branco -10 -67.8,Santarem -2.4 -54.9,Santiago -33.5 -70.7,Santo_Domingo 18.5 -69.9,Sao_Paulo -23.5 -46.6,Scoresbysund 70.5 -22,Sitka 57.2 -135.3,St_Barthelemy 17.9 -62.9,St_Johns 47.6 -52.7,St_Kitts 17.3 -62.7,St_Lucia 14 -61,St_Thomas 18.4 -64.9,St_Vincent 13.2 -61.2,Swift_Current 50.3 -107.8,Tegucigalpa 14.1 -87.2,Thule 76.6 -68.8,Tijuana 32.5 -117,Toronto 43.6 -79.4,Tortola 18.4 -64.6,Vancouver 49.3 -123.1,Whitehorse 60.7 -135.1,Winnipeg 49.9 -97.2,Yakutat 59.5 -139.7',
    Antarctica: 'Casey -66.3 110.5,Davis -68.6 78,DumontDUrville -66.7 140,Macquarie -54.5 158.9,Mawson -67.6 62.9,McMurdo -77.8 166.6,Palmer -64.8 -64.1,Rothera -67.6 -68.1,Syowa -69 39.6,Troll -72 2.5,Vostok -78.4 106.9',
    Arctic: 'Longyearbyen 78 16',
    Asia: 'Aden 12.8 45.2,Almaty 43.2 77,Amman 31.9 35.9,Anadyr 64.8 177.5,Aqtau 44.5 50.3,Aqtobe 50.3 57.2,Ashgabat 38 58.4,Atyrau 47.1 51.9,Baghdad 33.4 44.4,Bahrain 26.4 50.6,Baku 40.4 49.9,Bangkok 13.8 100.5,Barnaul 53.4 83.8,Beirut 33.9 35.5,Bishkek 42.9 74.6,Brunei 4.9 114.9,Chita 52 113.5,Colombo 6.9 79.8,Damascus 33.5 36.3,Dhaka 23.7 90.4,Dili -8.6 125.6,Dubai 25.3 55.3,Dushanbe 38.6 68.8,Famagusta 35.1 34,Gaza 31.5 34.5,Hebron 31.5 35.1,Ho_Chi_Minh 10.8 106.7,Hong_Kong 22.3 114.2,Hovd 48 91.7,Irkutsk 52.3 104.3,Jakarta -6.2 106.8,Jayapura -2.5 140.7,Jerusalem 31.8 35.2,Kabul 34.5 69.2,Kamchatka 53 158.7,Karachi 24.9 67,Kathmandu 27.7 85.3,Khandyga 62.7 135.6,Kolkata 22.5 88.4,Krasnoyarsk 56 92.8,Kuala_Lumpur 3.2 101.7,Kuching 1.6 110.3,Kuwait 29.3 48,Macau 22.2 113.5,Magadan 59.6 150.8,Makassar -5.1 119.4,Manila 14.6 121,Muscat 23.6 58.6,Nicosia 35.2 33.4,Novokuznetsk 53.8 87.1,Novosibirsk 55 82.9,Omsk 55 73.4,Oral 51.2 51.4,Phnom_Penh 11.6 104.9,Pontianak -0 109.3,Pyongyang 39 125.8,Qatar 25.3 51.5,Qostanay 53.2 63.6,Qyzylorda 44.8 65.5,Riyadh 24.6 46.7,Sakhalin 47 142.7,Samarkand 39.7 66.8,Seoul 37.5 127,Shanghai 31.2 121.5,Singapore 1.3 103.8,Srednekolymsk 67.5 153.7,Taipei 25.1 121.5,Tashkent 41.3 69.3,Tbilisi 41.7 44.8,Tehran 35.7 51.4,Thimphu 27.5 89.7,Tokyo 35.7 139.7,Tomsk 56.5 85,Ulaanbaatar 47.9 106.9,Urumqi 43.8 87.6,Ust-Nera 64.6 143.2,Vientiane 18 102.6,Vladivostok 43.2 131.9,Yakutsk 62 129.7,Yangon 16.8 96.2,Yekaterinburg 56.9 60.6,Yerevan 40.2 44.5',
    Atlantic: 'Azores 37.7 -25.7,Bermuda 32.3 -64.8,Canary 28.1 -15.4,Cape_Verde 14.9 -23.5,Faroe 62 -6.8,Madeira 32.6 -16.9,Reykjavik 64.2 -21.9,South_Georgia -54.3 -36.5,St_Helena -15.9 -5.7,Stanley -51.7 -57.9',
    Australia: 'Adelaide -34.9 138.6,Brisbane -27.5 153,Broken_Hill -31.9 141.4,Darwin -12.5 130.8,Eucla -31.7 128.9,Hobart -42.9 147.3,Lindeman -20.3 149,Lord_Howe -31.6 159.1,Melbourne -37.8 145,Perth -31.9 115.8,Sydney -33.9 151.2',
    Europe: 'Amsterdam 52.4 4.9,Andorra 42.5 1.5,Astrakhan 46.4 48,Athens 38 23.7,Belgrade 44.8 20.5,Berlin 52.5 13.4,Bratislava 48.1 17.1,Brussels 50.8 4.3,Bucharest 44.4 26.1,Budapest 47.5 19.1,Busingen 47.7 8.7,Chisinau 47 28.8,Copenhagen 55.7 12.6,Dublin 53.3 -6.2,Gibraltar 36.1 -5.3,Guernsey 49.5 -2.5,Helsinki 60.2 25,Isle_of_Man 54.1 -4.5,Istanbul 41 29,Jersey 49.2 -2.1,Kaliningrad 54.7 20.5,Kirov 58.6 49.6,Kyiv 50.4 30.5,Lisbon 38.7 -9.1,Ljubljana 46 14.5,London 51.5 -.1,Luxembourg 49.6 6.2,Madrid 40.4 -3.7,Malta 35.9 14.5,Mariehamn 60.1 19.9,Minsk 53.9 27.6,Monaco 43.7 7.4,Moscow 55.8 37.6,Oslo 59.9 10.8,Paris 48.9 2.3,Podgorica 42.4 19.3,Prague 50.1 14.4,Riga 57 24.1,Rome 41.9 12.5,Samara 53.2 50.1,San_Marino 43.9 12.5,Sarajevo 43.9 18.4,Saratov 51.6 46,Simferopol 45 34.1,Skopje 42 21.4,Sofia 42.7 23.3,Stockholm 59.3 18.1,Tallinn 59.4 24.8,Tirane 41.3 19.8,Ulyanovsk 54.3 48.4,Vaduz 47.1 9.5,Vatican 41.9 12.5,Vienna 48.2 16.3,Vilnius 54.7 25.3,Volgograd 48.7 44.4,Warsaw 52.2 21,Zagreb 45.8 16,Zurich 47.4 8.5',
    Indian: 'Antananarivo -18.9 47.5,Chagos -7.3 72.4,Christmas -10.4 105.7,Cocos -12.2 96.9,Comoro -11.7 43.3,Kerguelen -49.4 70.2,Mahe -4.7 55.5,Maldives 4.2 73.5,Mauritius -20.2 57.5,Mayotte -12.8 45.2,Reunion -20.9 55.5',
    Pacific: 'Apia -13.8 -171.7,Auckland -36.9 174.8,Bougainville -6.2 155.6,Chatham -44 -176.6,Chuuk 7.4 151.8,Easter -27.1 -109.4,Efate -17.7 168.4,Fakaofo -9.4 -171.2,Fiji -18.1 178.4,Funafuti -8.5 179.2,Galapagos -.9 -89.6,Gambier -23.1 -134.9,Guadalcanal -9.5 160.2,Guam 13.5 144.8,Honolulu 21.3 -157.9,Kanton -2.8 -171.7,Kiritimati 1.9 -157.3,Kosrae 5.3 163,Kwajalein 9.1 167.3,Majuro 7.2 171.2,Marquesas -9 -139.5,Midway 28.2 -177.4,Nauru -.5 166.9,Niue -19 -169.9,Norfolk -29.1 168,Noumea -22.3 166.4,Pago_Pago -14.3 -170.7,Palau 7.3 134.5,Pitcairn -25.1 -130.1,Pohnpei 7 158.2,Port_Moresby -9.5 147.2,Rarotonga -21.2 -159.8,Saipan 15.2 145.8,Tahiti -17.5 -149.6,Tarawa 1.4 173,Tongatapu -21.1 -175.2,Wake 19.3 166.6,Wallis -13.3 -176.2'
  };
  var TZA = 'Africa/Asmera=Africa/Asmara,Africa/Timbuktu=Africa/Bamako,America/Argentina/ComodRivadavia=America/Argentina/Catamarca,America/Atka=America/Adak,America/Buenos_Aires=America/Argentina/Buenos_Aires,America/Catamarca=America/Argentina/Catamarca,America/Coral_Harbour=America/Atikokan,America/Cordoba=America/Argentina/Cordoba,America/Ensenada=America/Tijuana,America/Fort_Wayne=America/Indiana/Indianapolis,America/Godthab=America/Nuuk,America/Indianapolis=America/Indiana/Indianapolis,America/Jujuy=America/Argentina/Jujuy,America/Knox_IN=America/Indiana/Knox,America/Kralendijk=America/Curacao,America/Louisville=America/Kentucky/Louisville,America/Lower_Princes=America/Curacao,America/Marigot=America/Port_of_Spain,America/Mendoza=America/Argentina/Mendoza,America/Montreal=America/Toronto,America/Nipigon=America/Toronto,America/Pangnirtung=America/Iqaluit,America/Porto_Acre=America/Rio_Branco,America/Rainy_River=America/Winnipeg,America/Rosario=America/Argentina/Cordoba,America/Santa_Isabel=America/Tijuana,America/Shiprock=America/Denver,America/St_Barthelemy=America/Port_of_Spain,America/Thunder_Bay=America/Toronto,America/Virgin=America/St_Thomas,America/Yellowknife=America/Edmonton,Antarctica/South_Pole=Antarctica/McMurdo,Arctic/Longyearbyen=Europe/Oslo,Asia/Ashkhabad=Asia/Ashgabat,Asia/Calcutta=Asia/Kolkata,Asia/Choibalsan=Asia/Ulaanbaatar,Asia/Chongqing=Asia/Shanghai,Asia/Chungking=Asia/Shanghai,Asia/Dacca=Asia/Dhaka,Asia/Harbin=Asia/Shanghai,Asia/Istanbul=Europe/Istanbul,Asia/Kashgar=Asia/Urumqi,Asia/Katmandu=Asia/Kathmandu,Asia/Macao=Asia/Macau,Asia/Rangoon=Asia/Yangon,Asia/Saigon=Asia/Ho_Chi_Minh,Asia/Tel_Aviv=Asia/Jerusalem,Asia/Thimbu=Asia/Thimphu,Asia/Ujung_Pandang=Asia/Makassar,Asia/Ulan_Bator=Asia/Ulaanbaatar,Atlantic/Faeroe=Atlantic/Faroe,Atlantic/Jan_Mayen=Europe/Oslo,Australia/ACT=Australia/Sydney,Australia/Canberra=Australia/Sydney,Australia/Currie=Australia/Hobart,Australia/LHI=Australia/Lord_Howe,Australia/NSW=Australia/Sydney,Australia/North=Australia/Darwin,Australia/Queensland=Australia/Brisbane,Australia/South=Australia/Adelaide,Australia/Tasmania=Australia/Hobart,Australia/Victoria=Australia/Melbourne,Australia/West=Australia/Perth,Australia/Yancowinna=Australia/Broken_Hill,Brazil/Acre=America/Rio_Branco,Brazil/DeNoronha=America/Noronha,Brazil/East=America/Sao_Paulo,Brazil/West=America/Manaus,Canada/Atlantic=America/Halifax,Canada/Central=America/Winnipeg,Canada/Eastern=America/Toronto,Canada/Mountain=America/Edmonton,Canada/Newfoundland=America/St_Johns,Canada/Pacific=America/Vancouver,Canada/Saskatchewan=America/Regina,Canada/Yukon=America/Whitehorse,Chile/Continental=America/Santiago,Chile/EasterIsland=Pacific/Easter,Europe/Belfast=Europe/London,Europe/Bratislava=Europe/Prague,Europe/Busingen=Europe/Zurich,Europe/Kiev=Europe/Kyiv,Europe/Mariehamn=Europe/Helsinki,Europe/Nicosia=Asia/Nicosia,Europe/Podgorica=Europe/Belgrade,Europe/San_Marino=Europe/Rome,Europe/Tiraspol=Europe/Chisinau,Europe/Uzhgorod=Europe/Kyiv,Europe/Vatican=Europe/Rome,Europe/Zaporozhye=Europe/Kyiv,Mexico/BajaNorte=America/Tijuana,Mexico/BajaSur=America/Mazatlan,Mexico/General=America/Mexico_City,Pacific/Enderbury=Pacific/Kanton,Pacific/Johnston=Pacific/Honolulu,Pacific/Ponape=Pacific/Pohnpei,Pacific/Samoa=Pacific/Pago_Pago,Pacific/Truk=Pacific/Chuuk,Pacific/Yap=Pacific/Chuuk,US/Alaska=America/Anchorage,US/Aleutian=America/Adak,US/Arizona=America/Phoenix,US/Central=America/Chicago,US/East-Indiana=America/Indiana/Indianapolis,US/Eastern=America/New_York,US/Hawaii=Pacific/Honolulu,US/Indiana-Starke=America/Indiana/Knox,US/Michigan=America/Detroit,US/Mountain=America/Denver,US/Pacific=America/Los_Angeles,US/Samoa=Pacific/Pago_Pago';
  /* /TZ-PLACES */
  function zonePlace(z) {
    if (!z) return null;
    var a = new RegExp('(?:^|,)' + z.replace(/[.+]/g, '\\$&') + '=([^,]+)').exec(TZA);
    if (a) z = a[1];
    var cut = z.indexOf('/'), list = cut > 0 && TZP[z.slice(0, cut)];
    if (!list) return null;
    var m = new RegExp('(?:^|,)' + z.slice(cut + 1).replace(/[.+]/g, '\\$&') + ' (-?[\\d.]+) (-?[\\d.]+)(?:,|$)').exec(list);
    return m ? [+m[1], +m[2]] : null;
  }
  /* Where the visitor is: ?lat=&lon= if given, else the place their time zone is set by (every IANA
     zone, from tzdata), else the longitude their standard-time offset implies. No location prompt. */
  function place(search, now) {
    var la = /[?&]lat=(-?[\d.]+)/.exec(search), lo = /[?&]lon=(-?[\d.]+)/.exec(search);
    if (la && lo) return [+la[1], +lo[1]];
    var tz = /[?&]tz=([^&]+)/.exec(search), z = null;
    try { z = tz ? decodeURIComponent(tz[1]) : Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
    var p = zonePlace(z);
    if (p) return p;
    /* standard (winter) offset, so summer time does not shift the longitude by 15 degrees */
    var y = now.getFullYear(), std = Math.max(new Date(y, 0, 1).getTimezoneOffset(), new Date(y, 6, 1).getTimezoneOffset());
    return [51.5, -std / 4];
  }

  W.WILD_TIME = { planetary: planetary, accent: accent, sky: sky, place: place, zonePlace: zonePlace, LENS: LENS, DAYLENS: DAYLENS, SKY: SKY, CH: CH, BASE: BASE, NIGHT_BAND: NIGHT_BAND };
  if (typeof document === 'undefined' || !document.documentElement) return;

  var d = document.documentElement, search = location.search;
  var q = /[?&]hue=([^&]+)/.exec(search);
  if (q && q[1] === 'off') return;
  var at = /[?&]at=([^&]+)/.exec(search);
  var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var s = document.createElement('style');
  s.textContent = 'html{filter:hue-rotate(var(--wild-hue,0deg))}' +
    (reduce ? '' : 'html.wild-hue-glide{transition:filter 2s linear}') +
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
    /* remembered so the next page's loading screen paints in today's colour straight away */
    if (!q && !at) { try { localStorage.setItem('wild_hue', String(Math.round(deg * 10) / 10)); } catch (e) {} }
  }
  var last = null;
  set();
  /* the first colour lands at once; later minute steps glide for 2 s (a 30 s glide kept the whole page
     re-filtering half of every minute, which costs phones battery and frames) */
  if (W.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('wild-hue-glide'); }); });
  if (!q && !at) setInterval(set, 60000);
})();
