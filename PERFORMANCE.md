# Performance maintenance

The GitHub Pages build is static. `npm run build` runs Vite's client build and a temporary server build, renders the shared React App once, hydrates that HTML on the client, and inlines only first-view CSS. No Node server is required on GitHub Pages.

- `src/App.jsx`: shared markup and interaction state. Keep initial markup deterministic, visible, and compatible with reduced motion.
- `src/main.jsx` / `src/entry-server.jsx`: hydration and build-time rendering.
- `src/style.css`: first-view/header/menu styles. `src/sections.css`: lazy section styles imported with `Sections.jsx`. Do not move shared rules into the deferred stylesheet.
- `src/motion-features.js`: full layout/gesture features, activated on actual input. Keep all keyboard, touch, pointer and wheel activation modes.
- `src/hero-image.js` and HTML preload: keep identical `srcset` / `sizes`. `npm run images:prepare` regenerates transparent WebP variants, including 360px for the mobile DPR gap.
- First-view fonts are subsets of the same source font versions, with shaping tables, advances and vertical metrics retained. The three required first-view subsets are embedded into critical CSS to prevent the font-swap CLS observed in a production trial. Complete fonts remain available to other scenes. Complete section fonts retain `font-display: swap`. The three embedded first-view subsets use a short block phase while their inline WOFF2 data is decoded, preventing the measured fallback-text shift without waiting for network font requests.

## Updating first-view text

After changing name, role, headline, eyebrow, CTA or navigation text in `src/content.ts`, regenerate the subsets:

```sh
python3 -m venv .venv-fonts
.venv-fonts/bin/pip install 'fonttools[woff]==4.60.2'
.venv-fonts/bin/python scripts/prepare-fonts.py
npm run build
node scripts/check-production.mjs
npm test
```

The full Cairo source lives in `artwork/fonts/`, outside the deployed public directory. Its slant axis is instantiated at 0 to match the existing Google Fonts version 3.130. Font licenses are under `src/assets/fonts/`.

Deploy only `dist/` into `docs/` (retaining `.nojekyll`). Source artwork, build intermediates and `.vite` manifests do not need to be published. Check the build under `/mohamed-motrash-portfolio/` as well as at localhost.

## Measurements and constraints

Use the same Lighthouse device/network/version for before/after comparisons, run the published site three times and report the median. Check currentSrc and observed network assets before changing image sizes. Do not equate image physical pixels with CSS pixels.

GitHub Pages controls HTTP cache headers (observed `max-age=600`). Content fingerprints handle safe asset updates. No service worker or unrelated hosting header files are used.
