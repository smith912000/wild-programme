/* Builds the "Threads between these cards" lines the way hub/parser/index.html does, for a list of card ids.
   Usage: node scripts/tarot-threads.js M8 W3 W5 ...   (shared by the test) */
global.window = global.window || {};
require('../hub/parser/tarot.js');
var T = window.WILD_TAROT;
function threads(ids) {
  var shown = ids.map(function (i) { return T.byId[i]; }), out = [], done = {};
  shown.forEach(function (a) { shown.forEach(function (b) {
    var k = [a.id, b.id].sort().join('|');
    if (a.id === b.id || done[k] || (a.n === b.n && a.arcana !== b.arcana)) return;
    var r = T.symbolicBetween(a, b), z = T.astroBetween(a, b);
    if (r && r.type !== 'sequence') { done[k] = 1; out.push({ a: a.name, b: b.name, type: r.type, text: r.text, layer: 'symbolic' }); }
    if (z) out.push({ a: a.name, b: b.name, type: z.type, text: z.text, layer: 'astro' });
  }); });
  return out;
}
module.exports = threads;
if (require.main === module) threads(process.argv.slice(2)).forEach(function (l) { console.log(l.type + '\t' + l.a + ' and ' + l.b + ': ' + l.text); });
