const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('#nav a');

function showPage() {
  const name = location.hash.replace('#', '') || 'home';
  let found = false;

  pages.forEach(p => {
    const match = p.dataset.page === name;
    p.classList.toggle('show', match);
    if (match) {
      found = true;
      const url = p.dataset.bg;
      if (url) {
        const img = new Image();
        img.onload = () => (document.body.style.backgroundImage = `url(${url})`);
        img.onerror = () => (document.body.style.backgroundImage = 'none');
        img.src = url;
      }
    }
  });

  if (!found) { location.hash = '#home'; return; }

  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + name));
  document.getElementById('cornerBox').hidden = true;
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
showPage();

document.getElementById('backBtn').addEventListener('click', () => history.back());
document.getElementById('forwardBtn').addEventListener('click', () => history.forward());

document.querySelectorAll('.hotspot').forEach(spot => {
  spot.addEventListener('click', () => {
    if (spot.classList.contains('corner')) {
      const box = document.getElementById('cornerBox');
      box.textContent = spot.dataset.text;
      box.hidden = false;
      return;
    }

    const next = spot.nextElementSibling;
    if (next && next.classList.contains('textbox')) {
      next.remove();
      return;
    }
    const tb = document.createElement('div');
    tb.className = 'textbox';
    tb.textContent = spot.dataset.text;
    spot.after(tb);
  });
});

const search = document.getElementById('search');
search.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = search.value.trim().toLowerCase();
  if (!q) return;

  const link = [...navLinks].find(a => a.textContent.toLowerCase().includes(q));
  if (link) { location.hash = link.getAttribute('href'); return; }

  const hit = [...document.querySelectorAll('.hotspot')].find(h =>
    h.textContent.toLowerCase().includes(q) || (h.dataset.text || '').toLowerCase().includes(q));
  if (hit) {
    location.hash = '#' + hit.closest('.page').dataset.page;
    setTimeout(() => {
      hit.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hit.click();
    }, 50);
  } else {
    alert('No results for "' + search.value + '"');
  }
});
