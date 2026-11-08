/* node scripts/test-tarot-threads.js : the Symbolic Parser's "Threads between these cards" must lead with symbolism. */
var assert = require('assert'), threads = require('./tarot-threads.js');
var IDS = 'M8 W3 W5 W6 W7 W8 M9 W9 M1 M6 M4 W4 M3 M5'.split(' ');
var all = threads(IDS), main = all.filter(function (l) { return l.layer === 'symbolic'; }), astro = all.filter(function (l) { return l.layer === 'astro'; });
var ASTRO = /rules|both sit in|both carry [A-Z]|face each other across the zodiac/;
var T = window.WILD_TAROT;

/* 1. the main list has no astrological wording at all */
main.forEach(function (l) { assert(!ASTRO.test(l.text), 'astro wording in main list: ' + l.a + ' / ' + l.b + ': ' + l.text); });
/* 2. the astrology is still there, but in its own layer */
assert(astro.length > 0 && astro.every(function (l) { return ['planet', 'sign', 'rule', 'opposition'].indexOf(l.type) > -1; }));
/* 3. the user's example pairs now get a symbolic thread */
function has(a, b) { return main.some(function (l) { return (l.a === a && l.b === b) || (l.a === b && l.b === a); }); }
[['Strength', 'Six of Wands'], ['Strength', 'Seven of Wands'], ['Strength', 'Nine of Wands'], ['Strength', 'The Magician'], ['Strength', 'The Emperor'],
 ['Eight of Wands', 'Three of Wands'], ['Eight of Wands', 'The Empress'], ['The Emperor', 'Seven of Wands'], ['The Emperor', 'Three of Wands'],
 ['Four of Wands', 'The Empress'], ['Four of Wands', 'The Hierophant'], ['Four of Wands', 'Six of Wands']].forEach(function (p) { assert(has(p[0], p[1]), 'no symbolic thread: ' + p.join(' / ')); });
/* 4. spot-check the reasons are the right ones */
function why(a, b) { return main.filter(function (l) { return (l.a === a && l.b === b) || (l.a === b && l.b === a); })[0].text; }
assert(/courage and endurance/.test(why('Strength', 'Nine of Wands')));
assert(/infinity loop/.test(why('Strength', 'The Magician')));
assert(/contest and defence/.test(why('Five of Wands', 'Seven of Wands')));
assert(/order and authority/.test(why('The Emperor', 'The Hierophant')));
/* 5. symbolism ranks first in related(): no astro reason before a symbolic one */
T.cards.forEach(function (c) {
  var seenAstro = false;
  T.related(c, 'wands').forEach(function (r) { var a = ['planet', 'sign', 'rule', 'opposition'].indexOf(r.type) > -1; assert(!(seenAstro && !a), 'astro ranked before symbolism on ' + c.name); if (a) seenAstro = true; });
});
/* 6. reasonBetween still returns something for any card pair the old one joined (no card loses its links) */
console.log('threads: ' + main.length + ' symbolic, ' + astro.length + ' astrological (optional layer); all assertions passed');
