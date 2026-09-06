// scroll-triggered reveals (skipped for reduced motion)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

// mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const icon = navToggle.querySelector('i');
    if (icon) icon.className = open ? 'ph ph-x' : 'ph ph-list';
  });
  mainNav.addEventListener('click', (e) => {
    if (e.target.closest('a') && mainNav.classList.contains('open')) {
      navToggle.click();
    }
  });
}

// consultation form: validate, then open WhatsApp with the request prefilled
const consultForm = document.getElementById('consultForm');
if (consultForm) {
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');

  // Clear validation styles dynamically on input
  [name, phone].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('field-invalid');
      const err = document.getElementById(input.id + 'Error');
      if (err) err.classList.remove('show');
    });
  });

  consultForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const visa = document.getElementById('visa');
    const msg = document.getElementById('msg');
    let firstInvalid = null;

    [[name, 'nameError'], [phone, 'phoneError']].forEach(([input, errId]) => {
      const err = document.getElementById(errId);
      const bad = !input.value.trim();
      input.classList.toggle('field-invalid', bad);
      err.classList.toggle('show', bad);
      if (bad && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) { firstInvalid.focus(); return; }

    const lines = [
      'Hello Links Immigration, I would like a free consultation.',
      'Name: ' + name.value.trim(),
      'Phone: ' + phone.value.trim(),
      'Visa type: ' + visa.value,
    ];
    if (msg.value.trim()) lines.push('Plans: ' + msg.value.trim());

    window.open('https://wa.me/923008444978?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
}
