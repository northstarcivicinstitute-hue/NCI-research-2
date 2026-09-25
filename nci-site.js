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
