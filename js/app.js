(function () {
  const STORAGE_KEY = 'chakhna_cart_v1';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  let toastTimer;

  function money(value) { return '₹' + Number(value || 0).toLocaleString('en-IN'); }
  function safe(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function getCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter(i => i && i.id && Number(i.qty) > 0) : [];
    } catch (_) { return []; }
  }
  let cart = getCart();
  function saveCart() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (_) {} renderCart(); }
  function subtotal() { return cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0); }
  function showToast(message) {
    const toast = $('[data-toast]'); if (!toast) return;
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  function addToCart(item) {
    const normalized = {...item, qty: Math.max(1, Number(item.qty || 1)), price: Number(item.price || 0)};
    const existing = cart.find(x => x.id === normalized.id);
    if (existing) existing.qty += normalized.qty;
    else cart.push(normalized);
    saveCart(); showToast(`${normalized.title} added to your bag`);
  }
  function lineFlavorProduct(lineKey, flavorName) {
    const line = window.CHAKH_CATALOG[lineKey];
    let sourceImage = line.image;
    let groupId = '';
    for (const group of line.groups) if (group.flavours.includes(flavorName)) { sourceImage = group.image || sourceImage; groupId = group.id; break; }
    const slug = flavorName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { id: `pack-${lineKey}-${groupId}-${slug}`, title: `${line.title} · ${flavorName}`, description: `${flavorName} · ${line.unit}`, price: line.price, image: sourceImage, unit: line.unit, type: 'pack', line: lineKey, flavor: flavorName };
  }
  function openCart() {
    const drawer = $('[data-cart-drawer]'); const backdrop = $('[data-cart-backdrop]');
    if (!drawer || !backdrop) return;
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); backdrop.hidden = false; document.body.classList.add('modal-open');
    const close = $('[data-close-cart]'); if (close) close.focus({preventScroll:true});
  }
  function closeCart() {
    const drawer = $('[data-cart-drawer]'); const backdrop = $('[data-cart-backdrop]');
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); backdrop.hidden = true;
    if (!($('[data-checkout-modal]') && !$('[data-checkout-modal]').hidden)) document.body.classList.remove('modal-open');
  }
  function renderCart() {
    const itemsEl = $('[data-cart-items]'); if (!itemsEl) return;
    const emptyEl = $('[data-cart-empty]'); const footer = $('[data-cart-footer]');
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    $$('[data-cart-count]').forEach(el => el.textContent = count);
    if (!cart.length) {
      itemsEl.innerHTML = ''; emptyEl.hidden = false; footer.hidden = true;
    } else {
      emptyEl.hidden = true; footer.hidden = false;
      itemsEl.innerHTML = cart.map(item => {
        const detail = item.isBundle && Array.isArray(item.customItems) ? item.customItems.map(p => `${safe(p.lineName)}: ${safe(p.flavor)}`).join(' · ') : (item.description || item.unit || '');
        return `<article class="cart-line" data-cart-id="${safe(item.id)}"><div class="cart-line-image"><img src="${safe(item.image || 'assets/logo-master.webp')}" alt="" loading="lazy"></div><div><h3>${safe(item.title)}</h3><p>${detail}</p><div class="qty-row"><button class="qty-button" type="button" data-qty-change="-1" aria-label="Decrease quantity">−</button><span class="qty-number">${item.qty}</span><button class="qty-button" type="button" data-qty-change="1" aria-label="Increase quantity">＋</button><button class="remove-item" type="button" data-remove-item>Remove</button></div></div><strong class="cart-line-price">${money(item.price * item.qty)}</strong></article>`;
      }).join('');
      const subtotalEl = $('[data-cart-subtotal]'); if (subtotalEl) subtotalEl.textContent = money(subtotal());
    }
    const checkoutTotal = $('[data-checkout-total]'); if (checkoutTotal) checkoutTotal.textContent = money(subtotal());
  }
  function openCheckout() {
    if (!cart.length) { showToast('Your bag is empty'); return; }
    closeCart(); const modal = $('[data-checkout-modal]'); const backdrop = $('[data-checkout-backdrop]');
    if (modal && backdrop) { modal.hidden = false; backdrop.hidden = false; document.body.classList.add('modal-open'); const name = $('#checkout-name'); if (name) name.focus({preventScroll:true}); }
  }
  function closeCheckout() {
    const modal = $('[data-checkout-modal]'); const backdrop = $('[data-checkout-backdrop]');
    if (modal) modal.hidden = true; if (backdrop) backdrop.hidden = true;
    if (!($('[data-cart-drawer]') && $('[data-cart-drawer]').classList.contains('open'))) document.body.classList.remove('modal-open');
  }
  function makeOrderText(formData) {
    const rows = cart.map(item => {
      const detail = item.isBundle && item.customItems ? item.customItems.map(p => `${p.lineName}: ${p.flavor}`).join(', ') : (item.description || '');
      return `• ${item.title} × ${item.qty}${detail ? ` (${detail})` : ''} = ${money(item.price * item.qty)}`;
    });
    return `CHAKH-NA! ORDER SUMMARY\nName: ${formData.get('name')}\nPhone: ${formData.get('phone')}\nAddress: ${formData.get('address')}\nPIN code: ${formData.get('pincode')}\n\n${rows.join('\n')}\n\nSubtotal: ${money(subtotal())}\n\nThis is a prepared order summary from the Chakh-Na! concept storefront.`;
  }
  function bindCheckout() {
    const form = $('#checkout-form'); if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault(); if (!form.reportValidity()) return;
      const text = makeOrderText(new FormData(form));
      const result = $('[data-checkout-result]');
      result.hidden = false; result.replaceChildren();
      const message = document.createElement('p'); message.textContent = 'Your order summary is ready. This storefront is a front-end prototype, so no payment or delivery request has been sent.'; result.appendChild(message);
      const copyButton = document.createElement('button'); copyButton.type = 'button'; copyButton.className = 'btn btn-secondary'; copyButton.textContent = 'Copy order details';
      copyButton.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(text); showToast('Order summary copied'); }
        catch (_) { const area = document.createElement('textarea'); area.value = text; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.select(); try { document.execCommand('copy'); showToast('Order summary copied'); } catch(__) { showToast('Copy not supported in this browser'); } area.remove(); }
      });
      result.appendChild(copyButton);
      result.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }
  function initBundleBuilder() {
    const slots = $$('.bundle-slot'); if (!slots.length) return;
    const progress = $('[data-bundle-progress]');
    function buildOptions(slot, preferred) {
      const lineKey = $('.bundle-line', slot).value;
      const select = $('.bundle-flavour', slot); const line = window.CHAKH_CATALOG[lineKey];
      const options = line.groups.flatMap(group => group.flavours.map(name => ({name, group:group.name})));
      select.innerHTML = options.map(item => `<option value="${safe(item.name)}">${safe(item.name)}${lineKey === 'meltz' ? ` · ${safe(item.group)}` : ''}</option>`).join('');
      if (preferred && options.some(o => o.name === preferred)) select.value = preferred;
      slot.classList.toggle('valid', Boolean(select.value));
    }
    slots.forEach((slot, index) => {
      const lineSelect = $('.bundle-line', slot); const flavour = $('.bundle-flavour', slot);
      const preferred = index === 0 ? 'Peri Peri' : index === 1 ? 'Shikanji' : 'Kesar Badam';
      buildOptions(slot, preferred);
      lineSelect.addEventListener('change', () => buildOptions(slot));
      flavour.addEventListener('change', () => slot.classList.toggle('valid', Boolean(flavour.value)));
    });
    function updateProgress() {
      const picked = slots.filter(slot => $('.bundle-line',slot).value && $('.bundle-flavour',slot).value).length;
      if (progress) progress.textContent = `${picked} / 3 picked`;
    }
    slots.forEach(slot => { $('.bundle-line',slot).addEventListener('change', updateProgress); $('.bundle-flavour',slot).addEventListener('change', updateProgress); });
    updateProgress();
    const addButton = $('#add-bundle'); if (!addButton) return;
    addButton.addEventListener('click', () => {
      const picks = slots.map(slot => {
        const key = $('.bundle-line',slot).value; const line = window.CHAKH_CATALOG[key]; const flavor = $('.bundle-flavour',slot).value;
        return {line:key,lineName:line.name,flavor};
      });
      if (picks.some(p => !p.flavor)) { showToast('Choose a flavour for each pack'); return; }
      const signature = picks.map(p => `${p.line}:${p.flavor}`).join('|');
      addToCart({id:`custom-bundle-${signature}`,title:'Custom 3-pack',description:'Your mix & match bundle',price:399,image:'assets/meltz-discovery.webp',unit:'3 packs',qty:1,type:'bundle',isBundle:true,customItems:picks});
      openCart();
    });
  }
  function initEvents() {
    $$('[data-open-cart]').forEach(btn => btn.addEventListener('click', openCart));
    $$('[data-close-cart]').forEach(btn => btn.addEventListener('click', closeCart));
    const cartBackdrop = $('[data-cart-backdrop]'); if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    $$('[data-checkout]').forEach(btn => btn.addEventListener('click', openCheckout));
    $$('[data-close-checkout]').forEach(btn => btn.addEventListener('click', closeCheckout));
    const checkoutBackdrop = $('[data-checkout-backdrop]'); if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckout);
    document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCheckout(); closeCart(); const nav = $('.main-nav'); const toggle = $('.mobile-menu-toggle'); if (nav) nav.classList.remove('open'); if (toggle) toggle.setAttribute('aria-expanded','false'); } });
    document.addEventListener('click', event => {
      const addButton = event.target.closest('[data-add-product]');
      if (addButton) {
        const key = addButton.dataset.addProduct;
        const item = window.CHAKH_PRODUCT_RECORDS[key];
        if (item) { addToCart({...item, type:'discovery'}); openCart(); }
        return;
      }
      const line = event.target.closest('[data-cart-id]');
      if (!line) return;
      const item = cart.find(i => i.id === line.dataset.cartId); if (!item) return;
      if (event.target.closest('[data-qty-change]')) {
        item.qty += Number(event.target.closest('[data-qty-change]').dataset.qtyChange);
        if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id);
        saveCart(); return;
      }
      if (event.target.closest('[data-remove-item]')) { cart = cart.filter(i => i.id !== item.id); saveCart(); showToast('Removed from your bag'); }
    });
    const menuToggle = $('.mobile-menu-toggle'); const nav = $('.main-nav');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open',open); menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.textContent = open ? '×' : '☰'; });
      $$('a',nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰'; }));
    }
    bindCheckout(); initBundleBuilder();
  }
  window.CHAKH = { money, safe, addToCart, lineFlavorProduct, openCart, closeCart, showToast, renderCart };
  document.addEventListener('DOMContentLoaded', () => { renderCart(); initEvents(); });
})();
