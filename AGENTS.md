# AGENTS.md

## Project Shape

- This is a StencilJS design system distributed by CDN from Netlify, not an npm-published package for now (`private: true`).
- Netlify publishes `www`; `/` is the Stencil demo index, `/demos/*.html` are per-component HTML demos, `/storybook/` is Storybook, and `/build/iv-basic-ds.esm.js` is the CDN ESM bundle.
- Components target Angular consumers first, so default to standard Web Components loaded from CDN plus Angular `CUSTOM_ELEMENTS_SCHEMA`.

## Commands

- Install with `npm install`.
- Use `npm run start` for local development; it runs an initial Stencil build, then starts Stencil at `http://localhost:3333/` and Storybook at `http://localhost:6006/` in parallel.
- Use `npm run build:netlify` as the main verification command before deploy; it cleans `www`, `dist`, and `loader`, then builds Stencil and Storybook into `www/storybook`.
- Use `npm run build` only for the Stencil build.
- Use `npm run storybook` only when you want Storybook without the Stencil dev server; it still requires a Stencil build first.
- `npm run test` is wired to `stencil test --spec --e2e`, but this repo currently has no test files.

## Storybook Quirk

- `.storybook/preview.ts` imports `../www/build/iv-basic-ds.esm.js`, so Storybook depends on `www/build` existing.
- Do not switch Storybook back to `../loader` unless the Stencil `dist` loader output is verified; the current generated loader can reference a missing `dist/esm/loader.js` path.
- Storybook build may warn about large chunks from Storybook/Vite; this is currently non-blocking.
- Storybook uses MDX docs from `src/docs/*.mdx` plus addons: docs, a11y, themes, pseudo-states, and tag badges.

## Dialog Accessibility

- `iv-dialog` wraps a native `<dialog>` and registers `dialog-polyfill` only when `showModal` is missing.
- Use `dialog-role="alertdialog"` for critical confirmations; do not use the global `role` attribute on `<iv-dialog>` because semantics must be applied to the internal native dialog.
- Prefer `aria-labelledby` for visible titles, `aria-label` only when no visible title exists, and omit `aria-describedby` for complex/multiparagraph content.
- Do not add automatic programmatic focus to `iv-dialog`; `initial-focus` and `restore-focus` are opt-in because forced focus can create false focus/scroll issues on mobile screen readers.

## Stencil And Output

- `stencil.config.ts` uses namespace `iv-basic-ds`; changing it changes CDN filenames referenced by `src/index.html`, README, and Storybook.
- Output targets are `www`, `dist`, and `dist-custom-elements`; `www/build` is the runtime CDN output used by demos and consumers.
- `www`, `dist`, and `loader` are generated and ignored by Git.
- `src/index.html` is only the Stencil demo index and should keep visible links to `/storybook/` plus per-component demos in `src/demos/`.

## Component Conventions

- Use the `iv-` tag prefix for all components.
- Set `shadow: false` on components unless the user explicitly changes the accessibility/integration strategy.
- Put component files under `src/components/<component>/` with the Stencil file, CSS file, and story next to each other.
- Keep CSS class names prefixed with `iv-` because there is no Shadow DOM encapsulation.
- Use global tokens from `src/global/tokens.css`; token names should use the `--iv-` prefix.
- Add or update a Storybook story for component states. Put HTML demos in `src/demos/<component>.html` and link them from `src/index.html`; avoid growing `src/index.html` into a full demo page.

## TypeScript And Stories

- `tsconfig.json` excludes `src/**/*.stories.ts` from the Stencil compile; Storybook owns story typechecking/bundling.
- Stencil JSX uses `jsxFactory: "h"`; component TSX files should import `h` from `@stencil/core` when rendering JSX.

## Deploy

- Netlify config is `netlify.toml`: build command `npm run build:netlify`, publish directory `www`.
- `/build/*` has long immutable cache headers, so changing CDN filenames or cache strategy should be deliberate.
