/* ===== NCI site settings ============================================
   When the email-list and giving accounts are ready, paste their links
   below and upload this file. Nothing else needs to change.
   newsletterAction: the form "action" URL from your email service
     (Buttondown: https://buttondown.com/api/emails/embed-subscribe/YOURNAME)
   newsletterField: the email field name your service expects
     (Buttondown: email   Mailchimp: EMAIL)
   givingUrl: your online donation page (Zeffy, Givebutter, etc.)
   ==================================================================== */
window.NCI_LINKS = window.NCI_LINKS || {
  newsletterAction: '',
  newsletterField: 'email',
  givingUrl: ''
};

/* Northstar Civic Institute — mobile menu */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  var root = document.documentElement;
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
    root.classList.toggle('nav-open', open);
  }
  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (root.classList.contains('nav-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  var wide = window.matchMedia('(min-width: 900px)');
  var onWide = function (e) { if (e.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);
})();

/* Brief tools: reading progress, share and cite (brief pages only) */
(function () {
  var body = document.querySelector('.brief-body');
  if (!body) return;
  var bar = document.createElement('div');
  bar.className = 'read-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var ticking = false;
  function update() {
    var r = body.getBoundingClientRect(), total = r.height - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
    bar.style.transform = 'scaleX(' + p + ')'; ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  var hero = document.querySelector('.brief-hero .container');
  if (!hero) return;
  var link = document.querySelector('link[rel="canonical"]');
  var url = link ? link.href : location.href;
  var h1 = document.querySelector('h1');
  var title = h1 ? h1.textContent.trim() : document.title;
  var author = 'Northstar Civic Institute', updated = '';
  document.querySelectorAll('.meta-row span').forEach(function (s) {
    var t = s.textContent.trim();
    if (/^Author/.test(t)) author = t.replace(/^Author\s*/, '');
    if (/^Updated/.test(t)) updated = t.replace(/^Updated\s*/, '');
    if (!updated && /^Published/.test(t)) updated = t.replace(/^Published\s*/, '');
  });
  var citation = author + '. \u201C' + title + '.\u201D Northstar Civic Institute' + (updated ? ', updated ' + updated : '') + '. ' + url;

  var toast = document.createElement('p');
  toast.className = 'copy-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  var timer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('is-visible');
    clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2400);
  }
  function copy(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { say(done); }, function () { fallback(text, done); });
    } else { fallback(text, done); }
  }
  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); say(done); } catch (e) { say('Copy failed. Press and hold to copy.'); }
    document.body.removeChild(ta);
  }
  var tools = document.createElement('div');
  tools.className = 'brief-tools';
  tools.innerHTML = '<button class="button button--secondary button--small" type="button" data-tool="share">Share</button>' +
                    '<button class="button button--secondary button--small" type="button" data-tool="cite">Cite this brief</button>';
  var actions = hero.querySelector('.brief-actions');
  if (actions) actions.insertAdjacentElement('afterend', tools); else hero.appendChild(tools);
  tools.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.tool === 'share') {
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); }
      else { copy(url, 'Link copied'); }
    } else { copy(citation, 'Citation copied'); }
  });
})();


/* Subscribe forms and giving links */
(function () {
  var L = window.NCI_LINKS || {};
  document.querySelectorAll('[data-subscribe]').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    if (!input) return;
    if (L.newsletterAction) {
      form.action = L.newsletterAction; form.method = 'post'; form.target = '_blank';
      input.name = L.newsletterField || 'email';
      return;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.checkValidity()) { input.reportValidity(); return; }
      var body = 'Please add ' + input.value.trim() + ' to the NCI Policy Watch and research updates list.';
      window.location.href = 'mailto:donavan@nciresearch.org?subject=' + encodeURIComponent('Subscribe to NCI updates') + '&body=' + encodeURIComponent(body);
      var note = form.querySelector('.subscribe-form__note');
      if (note) { note.setAttribute('role', 'status'); note.textContent = 'Your email app should open with the request ready. Tap send to finish subscribing.'; }
    });
  });
  if (L.givingUrl) {
    document.querySelectorAll('[data-give-link]').forEach(function (a) {
      a.href = L.givingUrl; a.hidden = false; a.target = '_blank'; a.rel = 'noopener';
    });
  }
})();
