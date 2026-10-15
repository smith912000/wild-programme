/* Company footer. The Companies Act 2006 (Trading Disclosures Regs 2015) and
   the E-Commerce Regs 2002 require the registered name, number, place of
   registration, registered office and a contact email on every page. This adds
   one small line at the foot of any page that loads it, plus the "not therapy"
   disclaimer. Loaded by founders-door.js and wild-nav.js, so every WILD page
   and app carries it. Update VAT and ICO lines here when registered. */
(function () {
  if (window.__wildCompanyFooter) return;
  window.__wildCompanyFooter = true;
  var LEGAL = 'https://smith912000.github.io/wild-programme/02%20-%20Landing%20Pages/legal.html';
  function place() {
    if (document.querySelector('.wild-co-footer')) return;
    var css = document.createElement('style');
    css.textContent = '.wild-co-footer{margin:28px 0 0;padding:14px 16px 18px;font:400 11px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;color:rgba(244,241,237,.5);text-align:center;border-top:1px solid rgba(244,241,237,.08)}.wild-co-footer a{color:inherit;text-decoration:underline}';
    document.head.appendChild(css);
    var f = document.createElement('div');
    f.className = 'wild-co-footer';
    f.innerHTML =
      'WILD is a trading name of Negotium Maximus Ltd, registered in England and Wales, company no. 16548314. ' +
      'Registered office: 165 Main Street, Yaxley, Peterborough, England, PE7 3LD. ' +
      'Email: <a href="mailto:smith@negotiorum.com">smith@negotiorum.com</a>. Prices include VAT where it applies. ' +
      'WILD is a contemplative and educational practice, not therapy or medical advice. ' +
      '<a href="' + LEGAL + '">Terms, refunds and privacy</a>.';
    document.body.appendChild(f);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', place);
  else place();
})();
