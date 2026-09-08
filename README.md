# Michael Angelo Munzon — Portfolio

A responsive, single-page portfolio built with HTML, CSS, and vanilla JavaScript. No build step or dependencies are required.

## Preview

Open `index.html` in a browser, or serve this folder with your preferred local static server.

## Content and navigation

- All content lives in `index.html`: introduction, work (`#projects`), services (`#services`), about (`#about`), and contact (`#contact`).
- Project details expand in place using native `details` / `summary` elements.
- The old `services.html`, `projects.html`, `about.html`, and `contacts.html` URLs redirect to the matching sections, including without JavaScript.
- `styles.css` controls the responsive layout, colors, and typography.
- `script.js` handles the mobile menu, active navigation, anchor focus, and copyright year. Content and links still work with JavaScript disabled.
- `favicon.svg` is the portfolio monogram.
- `theme.js` selects light or dark mode before styles load, follows the device preference until a mode is chosen, and remembers that choice in local storage. The header toggle works on desktop and mobile; blocked storage does not prevent switching.
- Both palettes use steel-blue accents. The About portrait keeps its natural colors, with a small CSS brightness adjustment.

## Updating the portfolio

Use real project screenshots, descriptions, and URLs when they are available. The e-commerce and landing page cards are explicitly labeled as UI explorations; their HTML/CSS previews are illustrative concepts, not screenshots of launched client work.

The contact section uses the existing Facebook profile. To add email or other social profiles, replace or extend these links with verified contact details. There is no contact form backend or simulated message submission.

The existing portrait (`background-img.png`) is used in the hero and about section. The unused legacy stylesheets and second image remain available but are not loaded.

## Design and accessibility

Semantic sections, native anchor links, visible keyboard focus, a skip link, mobile menu controls with accessible names, responsive layouts, and reduced-motion support are included. The Google Fonts request uses `display=swap`; local font fallbacks keep the page readable if the request fails.

Reference: [MDN anchor links](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a), [web.dev accessible responsive design](https://web.dev/articles/accessible-responsive-design), and [web.dev motion preferences](https://web.dev/learn/design/accessibility).

Deploy the folder to a static host when ready. No deployment is configured or performed by this redesign.
