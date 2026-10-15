/* WILD — analytics loader (single source of truth).
 * Nothing is sent to Google until BOTH are true:
 *   1. GA_ID below is a real GA4 Measurement ID, and
 *   2. the visitor clicked "Accept analytics" in the consent banner (consent.js).
 * Until then the Google script is never requested, so no visitor IP reaches
 * Google (GDPR/PECR; see the 15 Oct 2026 web launch legal checks).
 * If you set a real ID, also update the "No tracking" and "Cookies" lines in
 * "02 - Landing Pages/legal.html" to say analytics run with consent. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; /* [USER: set real GA4 Measurement ID here — the only place it lives] */
  var REAL = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied' });
  gtag('js', new Date());
  gtag('config', GA_ID);

  var loaded = false;
  window.wildLoadAnalytics = function () {
    if (loaded || !REAL) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  };

  var saved = null;
  try { saved = localStorage.getItem('wild_consent_v1'); } catch (e) {}
  if (saved === 'accept') window.wildLoadAnalytics();
})();
