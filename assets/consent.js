/* WILD — cookie consent banner (single source of truth).
 * Replaces 9 hand-copied inline banners (G1). Privacy-preserving: analytics
 * stays denied until the visitor clicks Accept, which flips gtag consent.
 *
 * Usage on a page:
 *   <script id="wild-consent-js" data-legal="legal.html" src="<path>/assets/consent.js" defer></script>
 * The data-legal attribute points at that page's privacy/legal page. */
(function () {
  var K = 'wild_consent_v1';
  var tag = document.getElementById('wild-consent-js');
  var legal = (tag && tag.getAttribute('data-legal')) || 'legal.html';

  var saved = null;
  try { saved = localStorage.getItem(K); } catch (e) {}
  if (saved) {
    if (saved === 'accept' && typeof gtag === 'function') {
      try { gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
    }
    return; /* already chosen — no banner */
  }

  function build() {
    var bar = document.createElement('div');
    bar.id = 'wild-consent';
    bar.setAttribute('style',
      'position:fixed;left:0;right:0;bottom:0;z-index:9999;background:rgba(10,6,18,.97);' +
      'border-top:1px solid rgba(99,73,184,.4);color:#F4F1ED;font-family:-apple-system,BlinkMacSystemFont,' +
      "'Segoe UI',sans-serif;font-size:13px;padding:14px 18px;display:flex;flex-wrap:wrap;gap:12px;" +
      'align-items:center;justify-content:center;text-align:center');
    bar.innerHTML =
      '<span style="max-width:560px">We use only essential cookies. Optional analytics stay off unless you accept. ' +
      'See our <a href="' + legal + '" style="color:#C9A84C;text-decoration:none">privacy notice</a>.</span>' +
      '<span style="display:flex;gap:8px">' +
      '<button data-consent="decline" style="padding:7px 16px;border:1px solid rgba(244,241,237,.2);' +
      'background:transparent;color:#F4F1ED;border-radius:6px;cursor:pointer;font-size:13px">Essential only</button>' +
      '<button data-consent="accept" style="padding:7px 16px;border:none;background:#C9A84C;color:#0A0612;' +
      'border-radius:6px;cursor:pointer;font-weight:700;font-size:13px">Accept analytics</button></span>';

    function set(v) {
      try { localStorage.setItem(K, v); } catch (e) {}
      bar.remove();
      if (v === 'accept' && typeof gtag === 'function') {
        try { gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
      }
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (b) set(b.getAttribute('data-consent'));
    });
    (document.body || document.documentElement).appendChild(bar);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
