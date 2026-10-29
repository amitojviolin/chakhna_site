(function () {
  const meltzImages = {
    classics: 'assets/meltz-classics.webp',
    curries: 'assets/meltz-curries.webp',
    tadka: 'assets/meltz-tadka.webp',
    pasta: 'assets/meltz-pasta.webp'
  };
  const catalog = {
    hydrate: {
      key: 'hydrate', name: 'Hydrate', display: 'hydrate', title: 'Chakh-Na! Hydrate', logo: 'assets/logo-hydrate.webp',
      image: 'assets/hydrate-lineup.webp', price: 149, unit: '10 tablets', category: 'Water flavour tablets',
      colour: '#168fce', short: 'Turn ordinary water into something worth drinking.',
      description: 'Portable water flavour tablets, inspired by the flavours we already love. Drop one into water and make your everyday sip a little more exciting.',
      bullets: ['10 tablets per pack', 'Zero sugar concept', 'Water based flavours'],
      groups: [
        { id: 'classics', name: 'Classics', sub: 'Familiar favourites', flavours: ['Cola', 'Mint Mojito', 'Lemon Lime', 'Orange', 'Berry Blast', 'Peach Ice Tea'] },
        { id: 'desi', name: 'Desi', sub: 'Regional favourites', flavours: ['Shikanji', 'Kala Khatta', 'Rose', 'Khus', 'Aam Panna', 'Jaljeera'] }
      ],
      discovery: { id: 'discovery-hydrate', title: 'Hydrate Discovery Box', price: 99, image: 'assets/hydrate-discovery.webp', desc: 'Six desi-inspired water flavours, one easy way to find a new favourite.', unit: '6 flavours · 60 tablets', included: ['Shikanji', 'Kala Khatta', 'Rose', 'Khus', 'Aam Panna', 'Jaljeera'] }
    },
    meltz: {
      key: 'meltz', name: 'Meltz', display: 'meltz', title: 'Chakh-Na! Meltz', logo: 'assets/logo-meltz.webp',
      image: 'assets/meltz-lineup.webp', price: 149, unit: '6 cubes', category: 'Fat-based spice cubes',
      colour: '#f36c21', short: 'Flavour cubes that take everyday meals somewhere delicious.',
      description: 'Fat-based spice cubes designed to turn everyday ingredients into flavour-packed creations. Pick a style, crumble in the flavour and make that meal your own.',
      bullets: ['6 cubes per pack', 'Regional and global flavours', 'Quick meal transformation'],
      groups: [
        { id: 'pasta', name: '6 Weeks of Pastas', sub: 'Pasta night, sorted', image: meltzImages.pasta, flavours: ['Peri Peri Arrabbiata', 'Garlic Herb Alfredo', 'Hariyali Pesto', 'Makhani Rosa', 'Tandoori Tadka', 'Chilli Cheese Mac'] },
        { id: 'tadka', name: 'Indian Tadka', sub: 'A little tadka goes a long way', image: meltzImages.tadka, flavours: ['Indori Poha', 'Tamarind Rice', 'Lemon Rice', 'Gunpowder Ghee', 'Panch Phoron', 'Punjabi Dal Tadka'] },
        { id: 'curries', name: 'Indian Curry', sub: 'Regional favourites', image: meltzImages.curries, flavours: ['Makhani (Punjab)', 'Kadhai (North)', 'Kolhapuri (Maharashtra)', 'Chettinad (Tamil Nadu)', 'Kashmiri Rogan', 'Achari'] },
        { id: 'classics', name: 'Classics', sub: 'Global flavour, desi attitude', image: meltzImages.classics, flavours: ['Peri Peri', 'Chipotle', 'Garlic Herb', 'Smoky BBQ', 'Mexican Taco', 'Chilli Cheese'] }
      ],
      discovery: { id: 'discovery-meltz', title: 'Meltz Discovery Box', price: 99, image: 'assets/meltz-discovery.webp', desc: 'Six regional flavour cubes for a little tour of India’s tadka.', unit: '6 regional flavours · 6 cubes', included: ['Punjabi Tadka', 'South Tadka', 'Kashmiri Tadka', 'Haryali Tadka', 'Indori Tadka', 'Maharashtrian Tadka'] }
    },
    creme: {
      key: 'creme', name: 'Creme', display: 'creme', title: 'Chakh-Na! Creme', logo: 'assets/logo-creme.webp',
      image: 'assets/creme-lineup.webp', price: 149, unit: '10 tablets', category: 'Milk flavour tablets',
      colour: '#df5c87', short: 'Make everyday milk your favourite flavoured drink.',
      description: 'Milk flavour tablets for café-inspired and nostalgic drinks at home. Turn a glass of milk into a simple little treat, whenever the mood hits.',
      bullets: ['10 tablets per pack', 'Zero added sugar concept', 'Milk based flavours'],
      groups: [
        { id: 'classics', name: 'Classics', sub: 'Cafe-inspired favourites', flavours: ['Chocolate', 'Vanilla', 'Coffee', 'Nutella', 'Strawberry', 'Cookie'] },
        { id: 'desi', name: 'Desi', sub: 'A taste of home', flavours: ['Kesar Badam', 'Kaju Pista', 'Malai Kulfi', 'Rose Milk', 'Thandai', 'Elaichi'] }
      ],
      discovery: { id: 'discovery-creme', title: 'Creme Discovery Box', price: 99, image: 'assets/creme-discovery.webp', desc: 'Six indulgent milk flavours. One box of little treats.', unit: '6 flavours · 60 tablets', included: ['Chocolate', 'Vanilla', 'Coffee', 'Tiramisu', 'Strawberry', 'Cookies & Cream'] }
    }
  };
  const productRecords = {};
  for (const [key, line] of Object.entries(catalog)) {
    productRecords['discovery-' + key] = { id: 'discovery-' + key, title: line.discovery.title, description: line.discovery.desc, price: line.discovery.price, image: line.discovery.image, unit: line.discovery.unit, type: 'discovery', line: key };
  }
  window.CHAKH_CATALOG = catalog;
  window.CHAKH_MELTZ_IMAGES = meltzImages;
  window.CHAKH_PRODUCT_RECORDS = productRecords;
})();
