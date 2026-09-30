# Michael Angelo Munzon / Portfolio

A responsive, single-page portfolio built with HTML, CSS, and vanilla JavaScript. No build step or dependencies.

## Preview

Open `index.html` directly in a browser, or serve this folder with a local static server.

## Page structure

- `#home`: introduction, portrait, and primary actions.
- `#projects`: one featured Printbiz Landing Pages collection, with all 24 live links grouped into six categories and expandable project details.
- `#services`: service descriptions and deliverables in native disclosure panels.
- `#about`: introduction, full-color portrait, and toolkit.
- `#process`: a three-step collaboration overview.
- FAQ: answers to common questions, using native disclosure panels.
- `#contact`: the existing Facebook profile and a clear starting point for a conversation.

The old `services.html`, `projects.html`, `about.html`, and `contacts.html` URLs redirect to their corresponding sections.

## Files

- `index.html`: content, semantic structure, and the Printbiz project feature.
- `styles.css`: light and dark palettes, layout, responsive styles, and motion.
- `script.js`: mobile navigation, active section tracking, reading progress, anchor focus, and optional entrance animations.
- `theme.js`: applies the selected palette before the stylesheet loads. Follows the device preference until the visitor chooses a mode; remembers that choice where local storage is available.
- `favicon.svg`: the portfolio monogram.
- `assets/threadworks-hero.jpg`: artwork from the live Threadworks landing page, used in its project card (not a page screenshot).

The site keeps all content and native navigation available without JavaScript. The theme toggle only appears when its behavior is ready. CSS still follows device color preferences without JavaScript.

## Content updates

The featured Printbiz Landing Pages collection credits Michael's design work on 24 WordPress and WooCommerce landing pages. All user-provided URLs are listed under Textile & embroidery; Sublimation; Signage; DTG, DTF & UV; Laser; and More equipment & supplies. The featured artwork comes from Threadworks and is not a screenshot of the collection. The three sample projects remain removed.

Contact uses the existing Facebook profile. Add other social profiles or email links only when the correct details are available; there is no simulated contact-form submission.

The existing portrait, `background-img.png`, is reused and cached by the browser. The About photo retains its natural colors with a modest CSS brightness adjustment. Images include dimensions, descriptive alternatives, and lazy loading where appropriate.

## Accessibility and interaction

- Native section links and disclosures support direct links and keyboard navigation.
- The mobile menu has accessible labels, Escape handling, and deliberate focus movement.
- Theme choice survives reloads, handles unavailable storage, and updates browser chrome.
- Reduced-motion preferences disable entrance animations and smooth scrolling.
- Entrances only apply to off-screen content. Anchor navigation and keyboard focus reveal relevant content immediately.
- Focus outlines apply to interactive controls rather than drawing a frame around a whole section.
- Google Fonts use `display=swap`, with local fallback fonts.

Host the folder on any static website service. The repository does not require a framework, package installation, or build pipeline.
