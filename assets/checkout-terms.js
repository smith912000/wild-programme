/* Checkout terms. Every link to a Whop checkout, on any WILD page or app, opens
   this short panel first: the price, that the plan renews automatically until
   cancelled, how to cancel, the refund policy, and a required "I am 18 or over"
   tick. Only then does the checkout open. Keeps us inside UK subscription and
   consumer rules (and California's auto-renewal law) and gives an age check.

   Loaded by founders-door.js and wild-nav.js, so pages that use either get it
   with no extra tag. A page can also load it directly:
     <script src="https://smith912000.github.io/wild-programme/assets/checkout-terms.js" defer></script>
   Add a new plan by adding one line to PLANS. */
(function () {
  if (window.__wildCheckoutTerms) return;
  window.__wildCheckoutTerms = true;

  var LEGAL = 'https://smith912000.github.io/wild-programme/02%20-%20Landing%20Pages/legal.html';
  var PLANS = {
    plan_rKY1Z5JoKORHj: { name: 'WILD membership, monthly', price: '£13 a month.', renew: 'Renews automatically every month until you cancel.' },
    plan_h7BCmUwJo2VLX: { name: 'WILD membership, yearly', price: '£100 a year.', renew: 'Renews automatically every year until you cancel.' },
    plan_rC0YO0w8EAM9G: { name: 'Founding membership', price: '£1,124.11 today: a one-off £1,111.11 joining fee plus your first month at £13. Then £13 a month.', renew: 'The £13 a month renews automatically every month until you cancel. The joining fee is paid once.', refund: 'Refunds follow our refund policy.' }
  };
  var GENERIC = { name: 'WILD membership', price: 'The price is shown on the checkout page.', renew: 'This is a subscription. It renews automatically until you cancel.' };

  var css = document.createElement('style');
  css.textContent =
    '.wct-back{position:fixed;inset:0;z-index:2147483000;background:rgba(5,3,9,.78);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.wct{max-width:440px;width:100%;background:#0E0A18;color:#F4F1ED;border:1px solid rgba(201,168,76,.35);border-radius:14px;padding:22px 22px 18px;' +
    'font:400 15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    '.wct h2{margin:0 0 10px;font:600 20px/1.25 "Cormorant Garamond",Georgia,serif;letter-spacing:.02em;color:#E9C766}' +
    '.wct ul{margin:0 0 14px;padding-left:18px}.wct li{margin:4px 0}.wct a{color:#B9A9F0}' +
    '.wct label{display:flex;gap:10px;align-items:flex-start;margin:6px 0 16px;cursor:pointer}.wct input{margin-top:4px;width:18px;height:18px;flex:none}' +
    '.wct .wct-row{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
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
      '<li><span class="wct-f"></span> <a target="_blank" rel="noopener">Terms and refund policy</a>.</li>' +
      '</ul><label><input type="checkbox" class="wct-age"> <span>I am 18 or over, and I have read the terms above.</span></label>' +
      '<div class="wct-row"><button type="button" class="wct-no">Not now</button><button type="button" class="wct-go" disabled>Continue to checkout</button></div></div>';
    back.querySelector('#wct-t').textContent = p.name;
    back.querySelector('.wct-p').textContent = p.price;
    back.querySelector('.wct-r').textContent = p.renew;
    back.querySelector('.wct-f').textContent = p.refund || 'Full refund of your first membership payment if you cancel within 30 days.';
    back.querySelector('.wct a').href = LEGAL;
    var age = back.querySelector('.wct-age'), go = back.querySelector('.wct-go');
    function close() { back.remove(); document.removeEventListener('keydown', esc); }
    function esc(e) { if (e.key === 'Escape') close(); }
    age.addEventListener('change', function () { go.disabled = !age.checked; });
    back.querySelector('.wct-no').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    document.addEventListener('keydown', esc);
    go.addEventListener('click', function () {
      if (!age.checked) return;
      close();
      if (newTab) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });
    document.body.appendChild(back);
    age.focus();
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
