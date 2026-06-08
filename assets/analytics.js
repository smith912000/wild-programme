/* WILD — analytics loader (single source of truth).
 * Fixes G2 (one GA ID, not 7 copies) and G4 (privacy-by-default: analytics
 * storage is DENIED until the visitor accepts in the consent banner).
 *
 * To go live: set GA_ID below to the real GA4 Measurement ID. One place. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; /* [USER: set real GA4 Measurement ID here — the only place it lives] */

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  /* Privacy by default — deny analytics until explicit consent (consent.js flips this on accept). */
  gtag('consent', 'default', { analytics_storage: 'denied' });
  gtag('js', new Date());
  gtag('config', GA_ID);

  /* Load the GA library after the consent default + config are queued, so it replays them in order. */
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
