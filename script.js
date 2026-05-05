(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const closeNav = function () {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });
    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        closeNav();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 840) closeNav();
    });
  }

  const filterGroup = document.querySelector('[data-filter-group]');
  const filterContainer = document.querySelector('[data-filter-container]');
  if (filterGroup && filterContainer) {
    const buttons = Array.from(filterGroup.querySelectorAll('[data-filter]'));
    const cards = Array.from(filterContainer.querySelectorAll('[data-tags]'));
    buttons.forEach((button) => {
      button.addEventListener('click', function () {
        const filter = button.getAttribute('data-filter');
        buttons.forEach((b) => b.classList.remove('is-active'));
        button.classList.add('is-active');
        cards.forEach((card) => {
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
})();
