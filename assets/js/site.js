import './experience.js?v=visual14';
import { CONTACT_ENDPOINT, PRIVACY_APPROVED } from './config.js';

// Accessible, dependency-free mobile navigation.
const menuToggle = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
function setMenu(open) {
  if (!menu || !menuToggle) return;
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menu?.querySelectorAll('a, button').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});
document.addEventListener('click', event => {
  if (menu?.classList.contains('is-open') && !menu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

// Progressive-enhancement reveal; respects reduced-motion CSS.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, {threshold: .10, rootMargin: '0px 0px -28px 0px'});
  reveals.forEach(item => observer.observe(item));
} else {
  reveals.forEach(item => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-year]').forEach(item => { item.textContent = String(new Date().getFullYear()); });

// Form is deliberately disabled until a verified recipient and lawful privacy copy exist.
// The static GitHub Pages host cannot itself send email.
for (const form of document.querySelectorAll('[data-contact-form]')) {
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.classList.remove('success');
    if (!form.reportValidity()) return;
    if (!CONTACT_ENDPOINT || !PRIVACY_APPROVED) {
      status.textContent = 'Todavía no se ha enviado: estamos configurando el correo y el aviso de privacidad.';
      return;
    }
    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(CONTACT_ENDPOINT)) {
      status.textContent = 'El servicio de envío no está correctamente configurado.';
      return;
    }
    submitButton.disabled = true;
    status.textContent = 'Enviando de forma segura…';
    try {
      // Only administrative fields. Quiz answers are never sent or stored.
      const payload = new FormData();
      for (const field of ['name', 'email', 'message', 'source']) {
        const el = form.elements.namedItem(field);
        if (el && el.value) payload.append(field, el.value.trim());
      }
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST', headers: {Accept: 'application/json'}, body: payload,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      status.textContent = 'Tu mensaje fue recibido por el servicio de contacto. Rosela podrá responderte por correo.';
      status.classList.add('success');
    } catch {
      status.textContent = 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.';
    } finally {
      submitButton.disabled = false;
    }
  });
}
