# محمد مطراش | معرض الأعمال

Arabic RTL graphic design portfolio built with React, Vite, Tailwind CSS, Framer Motion and Three.js.

## Development

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

Editable content and image paths: `src/content.ts`.

The `docs/` directory contains the production build for GitHub Pages. To update it after source changes:

```sh
npm run build
cp -R dist/. docs/
```

GitHub Pages source: `main` branch, `/docs` folder.

Lanyard interaction adapted from the React Bits component supplied for this project.
Portfolio artwork currently includes illustrative placeholder designs and stock images.
