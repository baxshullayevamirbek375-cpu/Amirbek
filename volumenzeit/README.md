# Volumenzeit — volumetric wrist watches

React + Vite storefront built from the Volumenzeit design (17 screens). Frontend-only: cart, accounts and orders are stored in `localStorage`.

```bash
cd volumenzeit
npm install
npm run dev     # http://localhost:5174
npm run build
npm run lint
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, features, design steps, mission, watches carousel, about (showreel), newsletter |
| `/products` | Catalog with search, type, price, case/strap color filters, sort, pagination |
| `/products/:id` | Product: gallery, specs, order, AR try-on modal |
| `/design` | Watch builder: case color, dial design, dial color, strap, gift box, engraving, live price & specs |
| `/checkout` | Basic info → shipping → payment, coupon (`VOLUME10`), thank-you popup |
| `/login`, `/register` | Auth (passwords hashed with SHA-256 before storing) |
| `/account` | Dashboard, order history, contact |
| `/contact`, `/delivery` | Contact form, delivery/legal page |
| `*` | 404 |

Watches are rendered as configurable SVGs (`src/components/Watch.jsx`), so every one of the 4×4×3×12 combinations has a real preview. Lifestyle photos load from Unsplash.
