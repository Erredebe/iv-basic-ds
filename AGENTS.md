# AGENTS.md

## Project Shape

- This is a StencilJS design system distributed by CDN from Netlify, not an npm-published package for now (`private: true`).
- Netlify publishes `www`; `/` is the Stencil demo index, `/demos/*.html` are per-component HTML demos, `/storybook/` is Storybook, and `/build/iv-basic-ds.esm.js` is the CDN ESM bundle.
- Components target Angular consumers first, so default to standard Web Components loaded from CDN plus Angular `CUSTOM_ELEMENTS_SCHEMA`.

## Commands

- Install with `npm install`.
- Use `npm run start` for local development; it runs an initial Stencil build, then starts Stencil at `http://localhost:3333/` and Storybook at `http://localhost:6006/` in parallel.
- Use `npm run deploy:netlify` as the main verification command before deploy; it runs Stencil Vitest specs with coverage, builds Netlify output, copies coverage to `www/coverage`, installs the Playwright Chromium browser when needed, then runs Playwright + axe-core with the HTML report in `www/test-report`.
- Use `npm run build:netlify` only when you need generated Stencil + Storybook output without running tests.
- Use `npm run test:spec` for Stencil Vitest spec tests with coverage; coverage is generated in `coverage` and copied to `www/coverage` by `npm run copy:coverage` during deploy.
- Use `npm run test:a11y:build` before deploy only when you specifically need build + a11y without spec coverage; it builds the Netlify output and runs Playwright + axe-core checks against `www`.
- Use `npm run test:a11y` only when `www` already exists and is up to date.
- Use `npm run build` only for the Stencil build.
- Use `npm run storybook` only when you want Storybook without the Stencil dev server; it still requires a Stencil build first.
- `npm run test` runs Stencil spec tests and Playwright a11y tests; make sure `www` exists before the a11y step or run `npm run deploy:netlify`.

## Storybook Quirk

- `.storybook/preview.ts` imports `../www/build/iv-basic-ds.esm.js`, so Storybook depends on `www/build` existing.
- Do not switch Storybook back to `../loader` unless the Stencil `dist` loader output is verified; the current generated loader can reference a missing `dist/esm/loader.js` path.
- Storybook build may warn about large chunks from Storybook/Vite; this is currently non-blocking.
- Storybook uses MDX docs from `src/docs/*.mdx` plus addons: docs, a11y, themes, pseudo-states, and tag badges.

## Dialog Accessibility

- `iv-dialog` wraps a native `<dialog>` and registers `dialog-polyfill` only when `showModal` is missing.
- Use `dialog-role="alertdialog"` for critical confirmations; do not use the global `role` attribute on `<iv-dialog>` because semantics must be applied to the internal native dialog.
- For `iv-dialog`, use `labelled-by` for visible titles, `label` only when no visible title exists, and omit `described-by` for complex/multiparagraph content; the component maps these to ARIA on the internal native dialog.
- Do not add automatic programmatic focus to `iv-dialog`; `initial-focus` and `restore-focus` are opt-in because forced focus can create false focus/scroll issues on mobile screen readers.

## Stencil And Output

- `stencil.config.ts` uses namespace `iv-basic-ds`; changing it changes CDN filenames referenced by `src/index.html`, README, and Storybook.
- Output targets are `www`, `dist`, and `dist-custom-elements`; `www/build` is the runtime CDN output used by demos and consumers.
- `www`, `dist`, and `loader` are generated and ignored by Git.
- `src/index.html` is only the Stencil demo index and should keep visible links to `/storybook/` plus per-component demos in `src/demos/`.
- The deployed Stencil HTML should also keep visible links to `/test-report/` for Playwright/a11y results and `/coverage/` for Stencil spec coverage.

## Component Conventions

- Use the `iv-` tag prefix for all components.
- Components follow Atomic Design physically under `src/components/<atomic-level>/<component>/`, where `<atomic-level>` is `atoms`, `molecules`, `organisms`, or `templates`.
- Classify every new component before implementation; current published components are `atoms/iv-button` and `molecules/iv-dialog`.
- Public tags must not include the atomic level: use `iv-button`, not `iv-atom-button`.
- Storybook titles should reflect the atomic level, such as `Atoms/Button` and `Molecules/Dialog`.
- Set `shadow: false` on components unless the user explicitly changes the accessibility/integration strategy.
- When a component renders a native interactive/semantic element internally, expose semantic reflected props on the host rather than public `aria-*` props, and map those props to ARIA only on the internal native element to avoid duplicate accessibility semantics.
- Put component files under `src/components/<atomic-level>/<component>/` with the Stencil file, CSS file, spec, and story next to each other.
- Keep CSS class names prefixed with `iv-` because there is no Shadow DOM encapsulation.
- Use global tokens from `src/global/tokens.css`; token names should use the `--iv-` prefix.
- Design and implement components mobile-first: base CSS must target small screens and larger breakpoints should use `@media (min-width: ...)`; buttons should become full-width only inside layout/action contexts, not by default.
- Add or update a Storybook story for component states. Put HTML demos in `src/demos/<component>.html` and link them from `src/index.html`; avoid growing `src/index.html` into a full demo page.
- Add or update Stencil spec tests next to the component as `<component>.spec.tsx` for rendering, props, ARIA mapping, and basic public API behavior.
- Add or update Playwright axe tests in `tests/a11y/` for each new component and its main interactive states.

## Accessibility Testing

- Automated a11y tests use `@axe-core/playwright` and run against the generated `www` output through `playwright.config.ts`.
- Each component should have coverage in `tests/a11y/<component>.a11y.spec.ts`.
- For interactive components, test important open/closed, disabled, labelled, keyboard, and dismissal states before running axe.
- Storybook `@storybook/addon-a11y` is for interactive inspection; Playwright axe tests are the repeatable gate.
- Playwright HTML reports are written to `www/test-report` during deploy so Netlify publishes them at `/test-report/`.
- Stencil Vitest spec coverage is copied to `www/coverage` during deploy so Netlify publishes it at `/coverage/`.

## TypeScript And Stories

- `tsconfig.json` excludes `src/**/*.stories.ts` from the Stencil compile; Storybook owns story typechecking/bundling.
- Stencil JSX uses `jsxFactory: "h"`; component TSX files should import `h` from `@stencil/core` when rendering JSX.

## Deploy

- Netlify config is `netlify.toml`: build command `npm run build:netlify`, publish directory `www`.
- `/build/*` has long immutable cache headers, so changing CDN filenames or cache strategy should be deliberate.
