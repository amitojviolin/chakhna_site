(function () {
  const $ = (s, root = document) => root.querySelector(s);
  const safe = window.CHAKH?.safe || (v => String(v));
  const params = new URLSearchParams(window.location.search);
  const lineKey = (params.get('line') || 'hydrate').toLowerCase();
  const mode = (params.get('mode') || '').toLowerCase();
  const line = window.CHAKH_CATALOG[lineKey] || window.CHAKH_CATALOG.hydrate;
  const detail = $('[data-product-detail]');
  const flavoursSection = $('[data-product-flavours]');
  const breadcrumb = $('[data-breadcrumb-current]');
  const discoveryMode = mode === 'discovery';

  function allFlavours() { return line.groups.flatMap(group => group.flavours.map(flavour => ({flavour, group}))); }
  function groupForFlavour(flavour) { return line.groups.find(group => group.flavours.includes(flavour)) || line.groups[0]; }
  function setPdpFlavour(flavour, updateUrl = false) {
    const select = $('[data-pdp-flavour]'); if (!select) return;
    const match = allFlavours().find(x => x.flavour === flavour);
    if (!match) return;
    select.value = flavour;
    const image = $('[data-pdp-image]');
    if (image) image.src = match.group.image || line.image;
    const stamp = $('[data-pdp-stamp]'); if (stamp) stamp.textContent = match.group.name.toUpperCase();
    $$('.flavour-pill').forEach(pill => pill.classList.toggle('active', pill.dataset.flavour === flavour));
    if (updateUrl) {
      const url = new URL(window.location.href); url.searchParams.set('flavour', flavour); try { window.history.replaceState({}, '', url.toString()); } catch (_) {}
    }
  }
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  function renderDiscovery() {
    const discovery = line.discovery;
    if (breadcrumb) breadcrumb.textContent = discovery.title;
    document.title = `${discovery.title} | Chakh-Na!`;
    detail.innerHTML = `
      <div class="pdp-visual"><span class="pdp-stamp" data-pdp-stamp>${line.key === 'meltz' ? 'DISCOVERY BOX' : 'DISCOVERY CAN'}</span><img src="${safe(discovery.image)}" alt="${safe(discovery.title)}" data-pdp-image></div>
      <div class="pdp-copy"><span class="pdp-eyebrow">SIX FLAVOURS. ONE BOX.</span><img class="pdp-logo" src="${safe(line.logo)}" alt="Chakh-Na! ${safe(line.name)}"><h1>Meet your next<br><span>favourite flavour.</span></h1><p class="pdp-description">${safe(discovery.desc)} Try a little bit of everything, then come back for the pack you love most.</p><div class="pdp-price-row"><strong class="pdp-price">${window.CHAKH.money(discovery.price)}</strong><span class="pdp-unit">${safe(discovery.unit)}</span></div><div class="pdp-buy-row"><button class="btn btn-primary" type="button" data-add-product="${safe(discovery.id)}">Add discovery box <span>＋</span></button></div><div class="pdp-bullets"><span>Easy flavour discovery</span><span>Great for first-time chakhna</span></div><p class="pdp-note">Discovery packaging shown as a concept visual from the supplied deck. Final assortment and labelling should be confirmed before launch.</p><a class="text-link" href="product.html?line=${safe(line.key)}">Shop individual ${safe(line.name)} packs <span>→</span></a></div>`;
    flavoursSection.innerHTML = `<div class="flavours-heading"><div><span class="eyebrow">WHAT'S INSIDE</span><h2>Six to fall for.</h2></div><p>This concept box features six flavours from the supplied Chakh-Na! discovery packaging.</p></div><div class="flavour-group"><div class="flavour-pills">${discovery.included.map(name => `<span class="flavour-pill" style="cursor:default">${safe(name)}</span>`).join('')}</div></div>`;
  }

  function renderLine() {
    if (breadcrumb) breadcrumb.textContent = line.name;
    document.title = `${line.title} | Chakh-Na!`;
    const defaultFlavour = params.get('flavour') && allFlavours().some(x => x.flavour === params.get('flavour')) ? params.get('flavour') : line.groups[0].flavours[0];
    const selectedGroup = groupForFlavour(defaultFlavour);
    const heroImage = selectedGroup.image || line.image;
    const options = line.groups.map(group => `<optgroup label="${safe(group.name)}">${group.flavours.map(flavour => `<option value="${safe(flavour)}" ${flavour === defaultFlavour ? 'selected' : ''}>${safe(flavour)}</option>`).join('')}</optgroup>`).join('');
    detail.innerHTML = `
      <div class="pdp-visual"><span class="pdp-stamp" data-pdp-stamp>${safe(selectedGroup.name.toUpperCase())}</span><img src="${safe(heroImage)}" alt="${safe(line.title)} product packaging" data-pdp-image></div>
      <div class="pdp-copy"><span class="pdp-eyebrow">${safe(line.category.toUpperCase())}</span><img class="pdp-logo" src="${safe(line.logo)}" alt="${safe(line.title)}"><h1>${line.key === 'hydrate' ? 'Water, with a little' : line.key === 'meltz' ? 'Every meal deserves' : 'Milk, made a little'}<br><span>${line.key === 'hydrate' ? 'more wow.' : line.key === 'meltz' ? 'more flavour.' : 'more fun.'}</span></h1><p class="pdp-description">${safe(line.description)}</p><div class="pdp-price-row"><strong class="pdp-price">${window.CHAKH.money(line.price)}</strong><span class="pdp-unit">/ ${safe(line.unit)}</span></div><label class="pdp-label" for="pdp-flavour">Choose your flavour</label><select id="pdp-flavour" class="flavour-select" data-pdp-flavour>${options}</select><div class="pdp-buy-row"><div class="qty-control"><button type="button" data-pdp-qty="-1" aria-label="Decrease quantity">−</button><output data-pdp-qty-value>1</output><button type="button" data-pdp-qty="1" aria-label="Increase quantity">＋</button></div><button class="btn btn-primary" type="button" data-pdp-add>Add to bag <span>＋</span></button></div><div class="pdp-bullets">${line.bullets.map(b => `<span>${safe(b)}</span>`).join('')}</div><p class="pdp-note">Pricing shown is the proposed pricing in the pitch deck. Product claims, ingredient details and final pack sizes should be checked against approved packaging before launch.</p><a class="text-link" href="product.html?line=${safe(line.key)}&mode=discovery">Try the Discovery Box <span>→</span></a></div>`;

    const groupsHtml = line.groups.map(group => `<article class="flavour-group"><div class="flavour-group-header"><div><h3>${safe(group.name)}</h3></div><span>${safe(group.sub)}</span></div><div class="flavour-pills">${group.flavours.map(flavour => `<button type="button" class="flavour-pill ${flavour === defaultFlavour ? 'active' : ''}" data-flavour="${safe(flavour)}">${safe(flavour)}</button>`).join('')}</div></article>`).join('');
    const meltzGallery = line.key === 'meltz' ? `<div class="meltz-gallery">${line.groups.map(group => `<a href="#product-main" data-meltz-group="${safe(group.id)}"><img src="${safe(group.image)}" alt="Chakh-Na Meltz ${safe(group.name)} packaging" loading="lazy"><span>${safe(group.name)}</span></a>`).join('')}</div>` : '';
    flavoursSection.innerHTML = `<div class="flavours-heading"><div><span class="eyebrow">EXPLORE THE RANGE</span><h2>Find your flavour.</h2></div><p>Choose a favourite below. You can switch it up any time, or pick three different packs in the mix & match builder.</p></div><div class="flavour-groups">${groupsHtml}</div>${meltzGallery}`;
    setPdpFlavour(defaultFlavour, false);
  }

  if (discoveryMode) renderDiscovery(); else renderLine();

  document.addEventListener('change', event => {
    if (event.target.matches('[data-pdp-flavour]')) setPdpFlavour(event.target.value, true);
  });
  document.addEventListener('click', event => {
    const pill = event.target.closest('[data-flavour]');
    if (pill) { setPdpFlavour(pill.dataset.flavour, true); return; }
    const groupLink = event.target.closest('[data-meltz-group]');
    if (groupLink) {
      const group = line.groups.find(g => g.id === groupLink.dataset.meltzGroup);
      if (group) { setPdpFlavour(group.flavours[0], true); window.scrollTo({top:0,behavior:'smooth'}); }
      return;
    }
    const qtyBtn = event.target.closest('[data-pdp-qty]');
    if (qtyBtn) {
      const output = $('[data-pdp-qty-value]'); if (!output) return;
      const next = Math.max(1, Math.min(20, Number(output.textContent || 1) + Number(qtyBtn.dataset.pdpQty)));
      output.textContent = String(next); return;
    }
    const addButton = event.target.closest('[data-pdp-add]');
    if (addButton) {
      const select = $('[data-pdp-flavour]'); const flavour = select ? select.value : line.groups[0].flavours[0];
      const item = window.CHAKH.lineFlavorProduct(line.key, flavour); item.qty = Number($('[data-pdp-qty-value]')?.textContent || 1);
      window.CHAKH.addToCart(item); window.CHAKH.openCart();
    }
  });
})();
