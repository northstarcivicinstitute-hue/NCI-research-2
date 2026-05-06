(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    const toggles = Array.from(document.querySelectorAll('[data-nav-toggle]'));
    toggles.forEach(function (toggle, index) {
      const controlledId = toggle.getAttribute('aria-controls');
      let nav = controlledId ? document.getElementById(controlledId) : null;
      if (!nav) {
        const wrap = toggle.closest('.nav-wrap') || toggle.parentElement;
        nav = wrap ? wrap.querySelector('.nav-links') : document.querySelector('.nav-links');
      }
      if (!nav) return;

      if (!nav.id) nav.id = 'site-nav-' + (index + 1);
      toggle.setAttribute('aria-controls', nav.id);
      toggle.setAttribute('aria-expanded', 'false');

      function closeNav() {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }

      function openNav() {
        toggle.setAttribute('aria-expanded', 'true');
        nav.classList.add('is-open');
        document.body.classList.add('nav-open');
      }

      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (expanded) closeNav(); else openNav();
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeNav();
      });

      document.addEventListener('click', function (event) {
        if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 840) closeNav();
      });
    });

    const filterGroup = document.querySelector('[data-filter-group]');
    const filterContainer = document.querySelector('[data-filter-container]');
    if (filterGroup && filterContainer) {
      const buttons = Array.from(filterGroup.querySelectorAll('[data-filter]'));
      const cards = Array.from(filterContainer.querySelectorAll('[data-tags]'));
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          const filter = button.getAttribute('data-filter');
          buttons.forEach(function (b) { b.classList.remove('is-active'); });
          button.classList.add('is-active');
          cards.forEach(function (card) {
            const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
            const show = filter === 'all' || tags.includes(filter);
            card.style.display = show ? '' : 'none';
          });
        });
      });
    }

    const mailtoForm = document.getElementById('mailto-form');
    if (mailtoForm) {
      mailtoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(mailtoForm);
        const name = data.get('name') || '';
        const organization = data.get('organization') || '';
        const email = data.get('email') || '';
        const type = data.get('type') || 'General inquiry';
        const message = data.get('message') || '';
        const subject = encodeURIComponent(type + ' inquiry from ' + name);
        const body = encodeURIComponent(
          'Name: ' + name + '\n' +
          'Organization: ' + organization + '\n' +
          'Email: ' + email + '\n' +
          'Inquiry type: ' + type + '\n\n' +
          message
        );
        window.location.href = 'mailto:donavan@nciresearch.org?subject=' + subject + '&body=' + body;
      });
    }
  });
})();
