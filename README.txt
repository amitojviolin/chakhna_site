CHAKH-NA! CONCEPT STOREFRONT

What's included
- index.html: responsive home page and storefront
- product.html: dynamic product pages for Hydrate, Meltz, Creme, and each discovery box
- css/styles.css: layout and responsive styling
- js/catalog.js: product ranges and proposed prices from the supplied pitch deck
- js/app.js: cart, quantities, custom bundle builder, and checkout preview
- js/product.js: product page rendering, flavour switching, and product selection
- assets/: supplied brand logos and product packaging images, optimised for the web, plus the Diljit concept image extracted from the supplied pitch deck

How to open
1. Unzip the folder.
2. Open index.html in a modern browser.
3. For a local server preview, run this command from the unzipped folder:
   python3 -m http.server 8000
   Then open http://localhost:8000

Working interactions
- Product cards open dedicated category pages.
- Flavour controls switch the selected flavour and relevant product image group.
- Discovery boxes can be added to the bag.
- The custom 3-pack builder lets shoppers pick any 3 packs across Hydrate, Meltz and Creme for the proposed ₹399 bundle price.
- Cart quantities can be updated and items removed. The bag persists in browser local storage where supported.
- Checkout validates contact/address fields and prepares a copyable order summary.

Important prototype notes
- This is a functional front-end prototype, not a deployed online store.
- Checkout is a preview only. It does not process payments, create fulfilment requests, or submit personal data to a server.
- Product claims, final ingredient declarations, pack contents, regulatory copy, and pricing should be verified before launch.
- The Diljit visual is taken from the supplied deck. The deck describes the collaboration as proposed, so the page labels it as a campaign concept rather than an announced endorsement.
