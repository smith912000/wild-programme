/* The founders' door. A small vesica with an arched doorway and a gold threshold,
   set among other quiet glyphs on the public pages. Members who are signed in
   (the WILD OS session in localStorage, same check as member-gate.js) go straight
   to the hub; everyone else goes to the Founding Member checkout on Whop.

   Placements:
     <span data-founders-door></span>        the door inside a row of ornaments
     <span data-founders-door="mark"></span> the door alone
     <script src=".../founders-door.js" data-corner></script>
                                             a faint row in the bottom corner, for
                                             pages with no footer */
(function(){if(window.__wildCompanyFooter||document.querySelector('script[src*="company-footer.js"]'))return;var s=document.createElement('script');s.src='https://smith912000.github.io/wild-programme/assets/company-footer.js';s.defer=true;(document.head||document.documentElement).appendChild(s);})(); /* company details on every page (Companies Act / E-Commerce Regs) */
(function(){if(window.__wildCheckoutTerms||document.querySelector('script[src*="checkout-terms.js"]'))return;var s=document.createElement('script');s.src='https://smith912000.github.io/wild-programme/assets/checkout-terms.js';s.defer=true;(document.head||document.documentElement).appendChild(s);})(); /* renewal terms + 18+ tick before any Whop checkout */
(function () {
  var KEY = 'wild_member_session';
  var HUB = 'https://smith912000.github.io/wild-programme/hub/';
  var FOUNDERS = 'https://whop.com/checkout/plan_rC0YO0w8EAM9G/';
  var me = document.currentScript;
  var corner = me && me.hasAttribute('data-corner');

  function claims(t) {
    try {
      var p = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(p + '='.repeat((4 - p.length % 4) % 4)));
    } catch (e) { return {}; }
  }
  function isMember() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!s || !s.token || !s.member) return false;
      var exp = claims(s.token).exp;
      return !!(exp && exp > Date.now() / 1000);
    } catch (e) { return false; }
  }
  function target() { return isMember() ? HUB : FOUNDERS; }

  var DOOR =
    '<svg viewBox="0 0 20 24" width="1em" height="1.2em" aria-hidden="true" focusable="false">' +
    '<path class="fd-v" d="M10 1A13 13 0 0 1 10 23A13 13 0 0 1 10 1Z"/>' +
    '<path class="fd-a" d="M7.6 18.6V12.4A2.4 2.4 0 0 1 12.4 12.4V18.6"/>' +
    '<path class="fd-t" d="M6.8 18.6H13.2"/>' +
    '<circle class="fd-k" cx="11.2" cy="15.6" r=".7"/></svg>';
  var STAR = '<svg viewBox="0 0 10 10" width=".55em" height=".55em" aria-hidden="true"><path d="M5 0L5.9 4.1L10 5L5.9 5.9L5 10L4.1 5.9L0 5L4.1 4.1Z"/></svg>';
  var RING = '<svg viewBox="0 0 10 10" width=".5em" height=".5em" aria-hidden="true"><circle cx="5" cy="5" r="3.6"/></svg>';
  var DOT = '<svg viewBox="0 0 10 10" width=".3em" height=".3em" aria-hidden="true"><circle cx="5" cy="5" r="2.4"/></svg>';

  var css = document.createElement('style');
  css.textContent =
    '.fd-row{display:inline-flex;align-items:center;gap:.7em;font-size:15px;line-height:1;color:rgba(185,169,240,.32);vertical-align:middle}' +
    '.fd-row>svg{fill:currentColor}' +
    '.fd-row>svg:nth-child(2),.fd-row>svg:nth-child(4){fill:none;stroke:currentColor;stroke-width:1}' +
    'a.fd-door{display:inline-flex;color:rgba(185,169,240,.5);text-decoration:none;border-radius:4px;transition:color .3s,filter .3s}' +
    'a.fd-door svg{fill:none;stroke:currentColor;stroke-width:1.1;stroke-linecap:round}' +
    'a.fd-door .fd-t{stroke:#C9A84C;opacity:.55}a.fd-door .fd-k{fill:#C9A84C;stroke:none;opacity:.7}' +
    'a.fd-door:hover,a.fd-door:focus-visible{color:#C9A84C;filter:drop-shadow(0 0 4px rgba(201,168,76,.45))}' +
    'a.fd-door:hover .fd-t,a.fd-door:hover .fd-k,a.fd-door:focus-visible .fd-t,a.fd-door:focus-visible .fd-k{opacity:1}' +
    'a.fd-door:focus-visible{outline:1px solid rgba(201,168,76,.6);outline-offset:3px}' +
    '.fd-corner{position:fixed;left:16px;bottom:14px;z-index:40;opacity:.8}' +
    '@media (prefers-reduced-motion:reduce){a.fd-door{transition:none}}';
  (document.head || document.documentElement).appendChild(css);

  function door() {
    var a = document.createElement('a');
    a.className = 'fd-door';
    a.href = target();
    a.setAttribute('aria-label', "The founders' door");
    a.innerHTML = DOOR;
    // Re-read at the moment of use, in case the visitor signed in on another tab.
    function refresh() { a.href = target(); }
    a.addEventListener('pointerenter', refresh);
    a.addEventListener('focus', refresh);
    a.addEventListener('click', refresh);
    return a;
  }
  function row() {
    var r = document.createElement('span');
    r.className = 'fd-row';
    r.innerHTML = STAR + RING;
    r.appendChild(door());
    r.insertAdjacentHTML('beforeend', RING + DOT);
    return r;
  }

  function place() {
    var spots = document.querySelectorAll('[data-founders-door]');
    for (var i = 0; i < spots.length; i++) {
      var el = spots[i];
      if (el.firstChild) continue;
      el.appendChild(el.getAttribute('data-founders-door') === 'mark' ? door() : row());
    }
    if (corner && !document.querySelector('.fd-corner')) {
      var c = row();
      c.classList.add('fd-corner');
      document.body.appendChild(c);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place);
  else place();
})();
