// Proof tests for assets/wild-time.js (planetary days, hours and colour lenses).
// Each check states a fact from a source or from the design rules and fails if the code stops
// reproducing it. Run: node scripts/test-wild-time.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {}, Intl, Date, Math };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/wild-time.js'), 'utf8'), ctx);
const T = ctx.window.WILD_TIME;
let pass = 0, fail = 0;
function check(label, ok, detail) { if (ok) { pass++; console.log('  PASS  ' + label); } else { fail++; console.log('  FAIL  ' + label, detail === undefined ? '' : JSON.stringify(detail)); } }
const LON = [51.5074, -0.1278];
const at = s => Date.parse(s);

console.log('Dio 37.19: hour order and day order');
check('Chaldean order Saturn to Moon', T.CH.join() === 'Saturn,Jupiter,Mars,Sun,Venus,Mercury,Moon');
const p1 = T.planetary(at('2026-11-08T15:46:00Z'), ...LON);
check('8 Nov 2026 (Sunday) 15:46 UTC London: Sun day, hour 12, Saturn', p1.dayRuler === 'Sun' && p1.hour === 12 && p1.hourRuler === 'Saturn', p1);
check('Hour 25 of a Sun day is the Moon (Monday)', p1.nextDayRuler === 'Moon');
const p2 = T.planetary(at('2026-11-09T03:00:00Z'), ...LON);
check('03:00 UTC Monday before sunrise is still Sunday night, hour 21, Mars', p2.dayRuler === 'Sun' && p2.hour === 21 && p2.hourRuler === 'Mars' && p2.part === 'night', p2);
const days = []; for (let k = 0; k < 7; k++) days.push(T.planetary(at('2026-11-0' + (2 + k) + 'T12:00:00Z'), ...LON).dayRuler);
check('Mon 2 Nov to Sun 8 Nov run Moon Mars Mercury Jupiter Venus Saturn Sun', days.join() === 'Moon,Mars,Mercury,Jupiter,Venus,Saturn,Sun', days);

console.log('Sun times (NOAA, London)');
const mid = T.planetary(at('2026-06-21T12:00:00Z'), ...LON), mins = t => { const d = new Date(t); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
check('21 Jun 2026 sunrise 03:43 UTC +-3 min', Math.abs(mins(mid.sunrise) - 223) <= 3, new Date(mid.sunrise).toISOString());
check('21 Jun 2026 sunset 20:21 UTC +-3 min', Math.abs(mins(mid.sunset) - 1221) <= 3, new Date(mid.sunset).toISOString());
check('November day hours shorter than an hour', p1.minutes < 60, p1.minutes);
check('Polar night at 78N in December gives no planetary hour (clock only)', T.planetary(at('2026-12-21T12:00:00Z'), 78, 15) === null);

console.log('Lenses: one per day, foundation underneath');
check('Seven lenses for seven day rulers, all different', new Set(Object.values(T.DAYLENS)).size === 7 && Object.keys(T.DAYLENS).length === 7);
check('Every lens has a slot for all seven planets', Object.values(T.LENS).every(l => l.length === 7));
check('Sky foundation: every planet has a colour, Mars the most coloured (B-V 1.36)', T.SKY.every(c => c && c[1] > 0) && T.SKY[2][1] === Math.max(...T.SKY.map(c => c[1])));
check('Mars is red (hue under 10) in every tradition lens that colours it', ['barrett', 'parashara', 'wuxing', 'queen'].every(k => T.LENS[k][2][0] < 10));
check('Lens changes at sunrise, not midnight: Sunday 23:00 UTC still wears the Sun lens', T.accent(at('2026-11-08T23:00:00Z'), ...LON, 23 * 60).lens === 'sky');
check('Monday after sunrise wears the Moon lens (Barrett)', T.accent(at('2026-11-09T09:00:00Z'), ...LON, 9 * 60).lens === 'barrett');

console.log('Golden-ratio balance');
let maxW = 0, minW = 1;
for (let h = 0; h < 24 * 7; h += 0.25) { const t = at('2026-11-02T00:00:00Z') + h * 36e5, A = T.accent(t, ...LON, (h % 24) * 60); maxW = Math.max(maxW, A.planetWeight); minW = Math.min(minW, A.planetWeight); }
check('Planet never weighs more than 1/phi = 0.618 against the clock', maxW <= 0.6181, maxW);
check('A grey planet leaves the clock in charge (weight under 0.1 somewhere in the week)', minW < 0.1, minW);
const q = T.accent(at('2026-11-06T12:00:00Z'), ...LON, 0);   // Friday, Queen lens
const hold = T.planetary(at('2026-11-06T12:00:00Z'), ...LON);
check('Queen lens on Friday', q.lens === 'queen', q.lens);
// Holding: within the first 61.8% of an hour the planet colour is the ruler's own.
const s0 = hold.sunrise, L = hold.minutes * 6e4;
const early = T.accent(s0 + 0.1 * L, ...LON, 0), late = T.accent(s0 + 0.6 * L, ...LON, 0);
// The planet itself keeps moving, so 'held' means steady to within half a degree of hue.
check('Hour colour held for the first 61.8% of the hour', Math.abs(early.hue - late.hue) < 0.5, [early.hue, late.hue]);

console.log('Night rule (melanopsin, Brainard 2001)');
let blue = 0;
for (let h = 0; h < 24 * 14; h += 0.1) { const t = at('2026-11-02T00:00:00Z') + h * 36e5, A = T.accent(t, ...LON, (h % 24) * 60); if (A.planetary && A.planetary.part === 'night' && A.hue > T.NIGHT_BAND[0] && A.hue < T.NIGHT_BAND[1]) blue++; }
check('Two weeks of night hours never sit in the 190-240 blue band', blue === 0, blue);

console.log('Real sky (JPL elements) against published events');
const sk = (d, p) => T.sky(Date.parse(d))[p];
check('Mars opposition 16 Jan 2025: opposite the Sun (elongation > 170)', sk('2025-01-16T00:00Z', 'Mars').elongation > 170, sk('2025-01-16T00:00Z', 'Mars'));
check('Jupiter opposition 7 Dec 2024: elongation > 170', sk('2024-12-07T00:00Z', 'Jupiter').elongation > 170);
check('Saturn opposition 21 Sep 2025: elongation > 170', sk('2025-09-21T00:00Z', 'Saturn').elongation > 170);
check('Venus greatest elongation 10 Jan 2025 is 47.2 deg (+-0.5)', Math.abs(sk('2025-01-10T00:00Z', 'Venus').elongation - 47.2) < 0.5, sk('2025-01-10T00:00Z', 'Venus').elongation);
check('Venus at inferior conjunction 22 Mar 2025 is lost in the glare (visibility 0)', sk('2025-03-22T12:00Z', 'Venus').visibility === 0);
check('Planets at opposition are at full strength (visibility > 0.85)', ['2025-01-16T00:00Z|Mars', '2024-12-07T00:00Z|Jupiter', '2025-09-21T00:00Z|Saturn'].every(x => sk(...x.split('|')).visibility > 0.85));
check('Full Moon 5 Nov 2025 13:19 UTC: over 98% lit', sk('2025-11-05T13:19Z', 'Moon').illuminated > 0.98);
check('New Moon 21 Sep 2025 19:54 UTC: under 2% lit', sk('2025-09-21T19:54Z', 'Moon').illuminated < 0.02);
const wk = [0, 7, 14, 21].map(w => T.accent(Date.parse('2026-11-08T12:00:00Z') + w * 7 * 864e5, ...LON, 720).hue.toFixed(2));
check('Same weekday and clock time, four weeks running: four different colours', new Set(wk).size === 4, wk);

console.log(`\nRESULTS: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
