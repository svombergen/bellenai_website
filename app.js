// === Agent Data ===
const agents = [
  {
    name: 'Sophie',
    emoji: '👩‍💼',
    tags: ['Restaurants', 'Reserveringen', 'Menukaart', 'Openingstijden'],
    phone: 'tel:+31XXXXXXXXX',
    color: ['#2563eb', '#7c3aed']
  },
  {
    name: 'Thomas',
    emoji: '🔧',
    tags: ['CV-ketels', 'Storingscodes', 'Onderhoud', 'Troubleshooting'],
    phone: 'tel:+31XXXXXXXXX',
    color: ['#059669', '#0891b2']
  }
];

// === Render Agents ===
function renderAgents() {
  const grid = document.getElementById('agents-grid');
  grid.innerHTML = agents.map(agent => `
    <div class="agent-card">
      <div class="agent-avatar" style="background: linear-gradient(135deg, ${agent.color[0]}, ${agent.color[1]})">
        <span>${agent.emoji}</span>
      </div>
      <h3 class="agent-name">${agent.name}</h3>
      <div class="agent-tags">
        ${agent.tags.map(t => `<span class="agent-tag">${t}</span>`).join('')}
      </div>
      <a href="${agent.phone}" class="btn btn-call">BEL DEMO</a>
    </div>
  `).join('');
}

// === Contact Form ===
const _0x = 'GxkrUT0DWQsiEjgGCwUpMTgUCD0MA0MzHyEsNT82QSotIy9fXVlTVFlXXFVXWg==';
const _0k = [98,101,108,108,101,110];
function _t() {
  const d = Uint8Array.from(atob(_0x), c => c.charCodeAt(0));
  const r = Array.from(d).reverse();
  return r.map((c, i) => String.fromCharCode(c ^ _0k[i % _0k.length])).join('');
}
const _c = '6479333492';

// Per-field validators — return error string or null
const validators = {
  name(v) {
    v = v.trim();
    if (!v) return 'Vul uw naam in.';
    if (v.length < 3 || v.length > 30) return 'Naam: 3-30 tekens.';
    if (!/^[a-zA-Z\s]+$/.test(v)) return 'Naam: alleen letters.';
    return null;
  },
  email(v) {
    v = v.trim();
    if (!v) return 'Vul uw e-mailadres in.';
    if (v.length < 5 || v.length > 50) return 'E-mail: 5-50 tekens.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ongeldig e-mailadres.';
    return null;
  },
  phone(v) {
    v = v.trim();
    if (!v) return null; // optional
    if (!/^[0-9+#]+$/.test(v)) return 'Alleen cijfers, + of #.';
    if (v.replace(/[^0-9]/g, '').length < 10) return 'Minimaal 10 cijfers.';
    return null;
  },
  message(v) {
    v = v.trim();
    if (v.length > 300) return 'Maximaal 300 tekens.';
    if (v && /[^\w\s.,!?@#€%&()\-:;'"\/\n\r]/.test(v)) return 'Bevat ongeldige tekens.';
    return null;
  }
};

function showFieldError(field, msg) {
  clearFieldError(field);
  if (!msg) return;
  field.classList.add('field-error');
  const el = document.createElement('div');
  el.className = 'field-error-msg';
  el.textContent = msg;
  field.parentNode.insertBefore(el, field.nextSibling);
}

function clearFieldError(field) {
  field.classList.remove('field-error');
  const next = field.nextElementSibling;
  if (next && next.classList.contains('field-error-msg')) next.remove();
}

function validateField(field) {
  const fn = validators[field.name];
  if (!fn) return true;
  const err = fn(field.value);
  showFieldError(field, err);
  return !err;
}

function initForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const fields = form.querySelectorAll('input, textarea');

  // Live input filtering
  form.querySelector('[name="name"]').addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 30);
  });
  form.querySelector('[name="phone"]').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9+#]/g, '');
  });

  // Validate on blur
  fields.forEach(f => {
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => {
      if (f.classList.contains('field-error')) validateField(f);
    });
  });

  // Use button click instead of form submit to avoid any default behavior
  const btn = form.querySelector('button[type="submit"]');
  btn.setAttribute('type', 'button');

  btn.addEventListener('click', async () => {
    // Validate all fields
    let allValid = true;
    fields.forEach(f => {
      if (!validateField(f)) allValid = false;
    });
    if (!allValid) return;

    btn.disabled = true;
    btn.textContent = 'Versturen...';
    status.textContent = '';
    status.className = 'form-status';

    const data = Object.fromEntries(new FormData(form));
    const text = `📬 Nieuw contactformulier\n\n👤 ${data.name}\n📧 ${data.email}\n📱 ${data.phone || '-'}\n\n💬 ${data.message || '-'}`;

    try {
      const r = await fetch(`https://api.telegram.org/bot${_t()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: _c, text })
      });
      if (!r.ok) throw new Error();
      status.textContent = 'Bedankt! We nemen snel contact met u op.';
      status.className = 'form-status success';
      form.reset();
      fields.forEach(f => clearFieldError(f));
    } catch {
      status.textContent = 'Er ging iets mis. Probeer het opnieuw of mail info@bellen.ai';
      status.className = 'form-status error';
    }

    btn.disabled = false;
    btn.textContent = 'Verstuur';
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  });
}

// === Smooth scroll for anchor links ===
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) target.scrollIntoView({ behavior: 'smooth' });
});

// === Init ===
document.addEventListener('DOMContentLoaded', () => {
  renderAgents();
  initForm();
});
