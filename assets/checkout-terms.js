/* Checkout terms. Every link to a Whop checkout, on any WILD page or app, opens
   this panel first: the total price today, what renews and when, how to cancel,
   the 14-day right to cancel (Consumer Contracts Regulations 2013) and the
   refund rule, then the ticks the law needs before a subscription can start
   at once: an express request to start now, the digital-content waiver
   (reg 37), and 18 or over. Only then does the checkout open.

   Loaded by founders-door.js and wild-nav.js, so pages that use either get it
   with no extra tag. A page can also load it directly:
     <script src="https://smith912000.github.io/wild-programme/assets/checkout-terms.js" defer></script>
   Add a new plan by adding one entry to PLANS. Keep the wording in step with
   "02 - Landing Pages/legal.html" (Terms, Founders addendum, Refunds). */
(function () {
  if (window.__wildCheckoutTerms) return;
  window.__wildCheckoutTerms = true;

  var LEGAL = 'https://smith912000.github.io/wild-programme/02%20-%20Landing%20Pages/legal.html';
  var EMAIL = 'smith@negotiorum.com';
  var STD_REFUND = 'You have 14 days from purchase to cancel for a refund less a proportionate charge for the days used. On top of that, if you cancel within 30 days of your first payment, email us for a full refund of that payment.';
  var STD_TICKS = [
    'I ask WILD to start my membership and give me access to the digital content immediately, and I acknowledge that I lose my 14-day right to cancel for that digital content once access begins. I can still cancel the membership itself within 14 days for a proportionate refund.',
    'I am 18 or over and have read the Membership Terms and Privacy Notice.'
  ];
  var PLANS = {
    plan_rKY1Z5JoKORHj: {
      name: 'WILD membership, monthly',
      price: '£13 a month, VAT included where it applies. Nothing else to pay.',
      renew: 'Renews automatically every month until you cancel.',
      refund: STD_REFUND, ticks: STD_TICKS
    },
    plan_h7BCmUwJo2VLX: {
      name: 'WILD membership, yearly',
      price: '£100 a year, VAT included where it applies. Nothing else to pay.',
      renew: 'Renews automatically every year until you cancel. We email you before each renewal.',
      refund: STD_REFUND, ticks: STD_TICKS
    },
    plan_rC0YO0w8EAM9G: {
      name: 'Founding membership',
      price: '£1,124.11 today: a one-off £1,111.11 founder fee plus your first month at £13. Then £13 a month. VAT included where it applies. Nothing else to pay.',
      renew: 'The £13 a month renews automatically every month until you cancel. The founder fee is paid once and buys your founder bundle: the £13 a month price locked for as long as your membership stays active, the Founder channel and badge, and the Founder Vault content delivered to your hub immediately. Only 100 founder places exist.',
      refund: 'Your 14-day right to cancel: cancel within 14 days of purchase by emailing ' + EMAIL + ' and we refund the £1,111.11 less the value of the Founder Vault content you asked us to deliver immediately and a proportionate charge for membership days used. After 14 days the £1,111.11 is not refundable.',
      ticks: [
        'I ask WILD to start my membership immediately and understand that if I cancel within 14 days I will pay a proportionate amount for the days used.',
        'I ask WILD to deliver the Founder Vault digital content immediately and acknowledge that, once delivery starts, I lose my 14-day right to cancel in respect of that content.',
        'I understand the £1,111.11 founder fee is not refundable after 14 days, and I am 18 or over and have read the Membership Terms, Founders Addendum and Privacy Notice.'
      ]
    }
  };
  var GENERIC = {
    name: 'WILD membership',
    price: 'The price is shown on the checkout page.',
    renew: 'This is a subscription. It renews automatically until you cancel.',
    refund: STD_REFUND, ticks: STD_TICKS
  };

  var css = document.createElement('style');
  css.textContent =
    '.wct-back{position:fixed;inset:0;z-index:2147483000;background:rgba(5,3,9,.78);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}' +
    '.wct{max-width:480px;width:100%;max-height:calc(100vh - 32px);overflow:auto;background:#0E0A18;color:#F4F1ED;border:1px solid rgba(201,168,76,.35);border-radius:14px;padding:22px 22px 18px;' +
    'font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    '.wct h2{margin:0 0 10px;font:600 20px/1.25 "Cormorant Garamond",Georgia,serif;letter-spacing:.02em;color:#E9C766}' +
    '.wct ul{margin:0 0 14px;padding-left:18px}.wct li{margin:4px 0}.wct a{color:#B9A9F0}' +
    '.wct label{display:flex;gap:10px;align-items:flex-start;margin:8px 0;cursor:pointer}.wct input{margin-top:3px;width:18px;height:18px;flex:none}' +
    '.wct .wct-row{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px}' +
    '.wct button{font:600 14px/1 inherit;border-radius:999px;padding:11px 16px;cursor:pointer;border:1px solid rgba(244,241,237,.2);background:none;color:inherit}' +
    '.wct button.wct-go{background:#C9A84C;border-color:#C9A84C;color:#0E0A18}.wct button.wct-go:disabled{opacity:.4;cursor:not-allowed}';
  (document.head || document.documentElement).appendChild(css);

  function planOf(href) {
    var m = /whop\.com\/checkout\/(plan_[A-Za-z0-9]+)/.exec(href || '');
    return m ? (PLANS[m[1]] || GENERIC) : null;
  }

  function show(href, newTab) {
    var p = planOf(href);
    var back = document.createElement('div');
    back.className = 'wct-back';
    back.innerHTML =
      '<div class="wct" role="dialog" aria-modal="true" aria-labelledby="wct-t">' +
      '<h2 id="wct-t"></h2><ul>' +
      '<li class="wct-p"></li><li class="wct-r"></li>' +
      '<li>Cancel any time, online, in your Whop account under Memberships. You keep access until the end of the period you have paid for.</li>' +
      '<li class="wct-f"></li>' +
      '<li>Sold by Negotium Maximus Ltd (trading as WILD), England and Wales no. 16548314. <a target="_blank" rel="noopener">Terms, founders addendum, refunds and privacy</a>.</li>' +
      '</ul><div class="wct-ticks"></div>' +
      '<div class="wct-row"><button type="button" class="wct-no">Not now</button><button type="button" class="wct-go" disabled>Continue to checkout</button></div></div>';
    back.querySelector('#wct-t').textContent = p.name;
    back.querySelector('.wct-p').textContent = p.price;
    back.querySelector('.wct-r').textContent = p.renew;
    back.querySelector('.wct-f').textContent = p.refund;
    back.querySelector('.wct a').href = LEGAL;
    var holder = back.querySelector('.wct-ticks'), boxes = [];
    p.ticks.forEach(function (t, i) {
      var l = document.createElement('label');
      var c = document.createElement('input');
      c.type = 'checkbox'; c.className = 'wct-age'; c.setAttribute('data-tick', i);
      var s = document.createElement('span'); s.textContent = t;
      l.appendChild(c); l.appendChild(s); holder.appendChild(l); boxes.push(c);
    });
    var go = back.querySelector('.wct-go');
    function allTicked() { return boxes.every(function (c) { return c.checked; }); }
    function close() { back.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    boxes.forEach(function (c) { c.addEventListener('change', function () { go.disabled = !allTicked(); }); });
    back.querySelector('.wct-no').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    document.addEventListener('keydown', esc);
    go.addEventListener('click', function () {
      if (!allTicked()) return;
      // Record of consent (California ARL asks for 3 years; UK DMCC asks for a durable record).
      try { localStorage.setItem('wild_checkout_consent', JSON.stringify({ plan: p.name, at: new Date().toISOString(), ticks: p.ticks.length })); } catch (e) {}
      close();
      if (newTab) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });
    document.body.appendChild(back);
    if (boxes[0]) boxes[0].focus();
  }

  // Bubble phase on purpose: link handlers (such as the founders' door, which
  // re-reads its target on click) run first, so we read the final href.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || !planOf(a.href)) return;
    e.preventDefault();
    show(a.href, a.target === '_blank');
  });
})();
