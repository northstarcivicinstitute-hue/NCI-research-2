/* NCI conversion events for GA4. Upload once to the site root and load it
   after the Google tag. No personal data is collected. */
(function () {
  if (typeof window.gtag !== 'function') return;
  var sent = {};
  function fire(name, params) {
    var key = name + '|' + location.pathname;
    if (sent[key]) return;
    sent[key] = true;
    window.gtag('event', name, params || {});
  }

  /* 1. Clicks: email links and briefing or inquiry requests */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = (a.getAttribute('href') || '').toLowerCase();
    var text = (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var inChrome = !!a.closest('nav, header, footer');

    if (href.indexOf('mailto:') === 0) {
      window.gtag('event', 'email_click', { page_path: location.pathname });
      return;
    }
    if (/request a briefing|request briefing/.test(text)) {
      window.gtag('event', 'generate_lead', { lead_type: 'briefing', page_path: location.pathname });
      return;
    }
    if (/contact/.test(location.pathname) && !inChrome && href && href.charAt(0) !== '#') {
      window.gtag('event', 'generate_lead', { lead_type: 'inquiry_route', page_path: location.pathname });
    }
  }, true);

  /* 2. Engagement on research pages: 75% scroll or 60 seconds visible */
  var research = /brief|atlas|policy-watch|surveillance|youth-sports|federal|buy-outcomes|prediction|growready|buildready|film-room|next-play|michigan-sports/;
  if (research.test(location.pathname)) {
    var engaged = function () { fire('brief_engaged', { page_path: location.pathname }); };
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var pct = (window.scrollY + window.innerHeight) / Math.max(h.scrollHeight, 1);
      if (pct >= 0.75) engaged();
    }, { passive: true });
    setTimeout(function () {
      if (document.visibilityState === 'visible') engaged();
    }, 60000);
  }
})();
