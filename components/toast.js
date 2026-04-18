/** Uso: <script src="/components/toast.js"></script> showToast('Mensaje') */
function showToast(msg, type) {
  let el = document.getElementById('zb-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'zb-toast';
    el.className = 'zb-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.borderColor = type === 'err' ? 'var(--zb-danger)' : 'var(--zb-gold)';
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 3200);
}
