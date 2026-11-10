(function(){var t=document.createElement('script');t.src='https://smith912000.github.io/wild-programme/assets/wild-time.js';document.head.appendChild(t);})();
/* WILD shared navigation. One list of apps for the hub menu and the bar on
   every companion app. Add a future app by adding one line to APPS.
   Usage on an app:  <script src="https://smith912000.github.io/wild-programme/assets/wild-nav.js" data-app="codex" defer></script>
   Usage on the members' hub (hub/index.html): <script src="../assets/wild-nav.js" data-mode="hub" defer></script> and an element with id="wild-apps-menu". */
(function(){if(window.__wildCompanyFooter||document.querySelector('script[src*="company-footer.js"]'))return;var s=document.createElement('script');s.src='https://smith912000.github.io/wild-programme/assets/company-footer.js';s.defer=true;(document.head||document.documentElement).appendChild(s);})(); /* company details on every page (Companies Act / E-Commerce Regs) */
(function(){if(window.__wildCheckoutTerms||document.querySelector('script[src*="checkout-terms.js"]'))return;var s=document.createElement('script');s.src='https://smith912000.github.io/wild-programme/assets/checkout-terms.js';s.defer=true;(document.head||document.documentElement).appendChild(s);})(); /* renewal terms + 18+ tick before any Whop checkout */
(function () {
  var HUB = 'https://smith912000.github.io/wild-programme/hub/';
  var APPS = [
    { id: 'os',      name: 'WILD OS',         role: 'Practice',  url: 'https://smith912000.github.io/wild-os/' },
    { id: 'codex',   name: 'Codex Pharmakon', role: 'Codex',     url: 'https://smith912000.github.io/codex-pharmakon/' },
    { id: 'sge',     name: 'SGE',             role: 'Stars',     url: 'https://smith912000.github.io/SGE/' },
    { id: 'parser',  name: 'Symbolic Parser', role: 'Tarot',     url: HUB + 'parser/' },
    { id: 'maryada', name: 'Maryada',         role: 'Daily practice', url: HUB + 'maryada/' },
    { id: 'discord', name: 'Discord',         role: 'The Open Door', url: 'https://discord.gg/jRzKq6Hb6N', external: true },
    { id: 'soon',    name: 'More soon',       role: 'Coming soon', url: null }
  ];
  var me = document.currentScript;
  var mode = me && me.getAttribute('data-mode') || 'bar';
  var current = me && me.getAttribute('data-app') || '';
  var MARK = '<svg viewBox="0 0 100 120" width="16" height="19" aria-hidden="true"><g fill="none" stroke="#4DB8A2" stroke-width="7"><circle cx="50" cy="44" r="34"/><circle cx="50" cy="76" r="34"/></g><line x1="50" y1="51" x2="50" y2="69" stroke="#EBA37F" stroke-width="8" stroke-linecap="round"/></svg>';

  var css = document.createElement('style');
  css.textContent =
    '.wn-bar{position:relative;z-index:50;display:flex;align-items:center;gap:14px;height:42px;padding:0 16px;background:#06100E;border-bottom:1px solid rgba(237,239,230,.08);' +
    'font:500 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;color:rgba(237,239,230,.62);box-sizing:border-box}' +
    '.wn-bar *{box-sizing:border-box}.wn-bar a{color:inherit;text-decoration:none}' +
    '.wn-home{display:flex;align-items:center;gap:8px;color:#EDEFE6!important;font:600 14px/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.18em}' +
    '.wn-apps{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}.wn-apps::-webkit-scrollbar{display:none}' +
    '.wn-apps a{padding:7px 10px;border-radius:6px;white-space:nowrap}.wn-apps a:hover{color:#EDEFE6;background:rgba(237,239,230,.06)}' +
    '.wn-apps a[aria-current]{color:#EDEFE6;background:rgba(47,143,124,.28)}' +
    '.wn-user{display:flex;align-items:center;gap:10px;white-space:nowrap}.wn-user button{background:none;border:1px solid rgba(237,239,230,.18);color:inherit;border-radius:6px;padding:5px 10px;font:inherit;cursor:pointer}' +
    '.wn-user button:hover{color:#EDEFE6}.wn-name{max-width:120px;overflow:hidden;text-overflow:ellipsis}' +
    '@media(max-width:560px){.wn-name{display:none}.wn-home span{display:none}}' +
    /* phones and touch screens: every control in the bar is at least 44px tall */
    '@media(max-width:560px),(pointer:coarse){.wn-bar{height:52px}.wn-home{min-height:44px;min-width:44px;justify-content:center}.wn-apps a{display:flex;align-items:center;min-height:44px;padding:0 12px}.wn-user button{min-height:44px;padding:0 12px}}' +
    '.wn-menu{display:grid;gap:6px}.wn-menu .wn-item{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:10px 12px;border-radius:10px;text-decoration:none;color:#EDEFE6}' +
    'a.wn-item:hover{background:rgba(237,239,230,.06)}.wn-item small{color:rgba(237,239,230,.5);font-size:.75rem;letter-spacing:.04em}.wn-item.soon{opacity:.5}';
  document.head.appendChild(css);

  function session() { try { return JSON.parse(localStorage.getItem('wild_member_session') || 'null'); } catch (e) { return null; } }

  function hubMenu() {
    var el = document.getElementById('wild-apps-menu');
    if (!el) return;
    el.classList.add('wn-menu');
    el.innerHTML = APPS.map(function (a) {
      return a.url
        ? '<a class="wn-item" href="' + a.url + '"' + (a.external ? ' target="_blank" rel="noopener"' : '') + '>' + a.name + '<small>' + a.role + '</small></a>'
        : '<span class="wn-item soon">' + a.name + '<small>' + a.role + '</small></span>';
    }).join('');
  }

  function bar() {
    var s = session();
    var b = document.createElement('nav');
    b.className = 'wn-bar';
    b.setAttribute('aria-label', 'WILD apps');
    b.innerHTML = '<a class="wn-home" href="' + HUB + '" title="Back to the WILD hub">' + MARK + '<span>WILD</span></a>' +
      '<div class="wn-apps">' + APPS.filter(function (a) { return a.url; }).map(function (a) {
        return '<a href="' + a.url + '"' + (a.id === current ? ' aria-current="page"' : '') + (a.external ? ' target="_blank" rel="noopener"' : '') + '>' + a.name + '</a>';
      }).join('') + '</div>' +
      '<div class="wn-user">' + (s && s.token
        ? '<span class="wn-name">' + String(s.name || '').replace(/[<>&"]/g, '') + '</span><button type="button">Sign out</button>'
        : '<a href="' + APPS[0].url + '">Sign in</a>') + '</div>';
    document.body.insertBefore(b, document.body.firstChild);
    var out = b.querySelector('.wn-user button');
    if (out) out.onclick = function () { try { localStorage.removeItem('wild_member_session'); } catch (e) {} location.reload(); };
  }

  window.WILD_APPS = APPS;
  function start() { mode === 'hub' ? hubMenu() : bar(); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
