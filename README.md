# Hamed Musleh · Portfolio

Personal portfolio built with **Angular 22** (standalone components, Signals, zoneless),
**strict TypeScript** and **hand-written SCSS** (no UI kit). Prerendered at build time and
deployed to GitHub Pages by GitHub Actions.

Live: https://hamedmusleh.github.io/portfolio/

## Run it locally

Requires Node 24+.

```bash
npm install
npm start               # dev server at http://localhost:4200
npm test                # unit tests in watch mode (Vitest)
npm run test:ci         # unit tests once
npm run lint            # ESLint (TypeScript + templates + accessibility rules)
npm run format          # Prettier: rewrite files
npm run format:check    # Prettier: check only (used in CI)
npm run build           # production build to dist/portfolio/browser
npm run build:gh        # production build for GitHub Pages (base-href /portfolio/ + 404.html)
```

> **Windows + Git Bash:** Git Bash rewrites `/portfolio/` into a Windows path. Run
> `build:gh` from PowerShell/cmd, or prefix it with `MSYS_NO_PATHCONV=1`.

## Editing content

**All text on the site lives in one file: [`src/app/data/portfolio.data.ts`](src/app/data/portfolio.data.ts).**
You never need to touch a component to change content.

- **Profile, bio, education, links**: `profile`
- **Projects**: `projects`. Order matters: featured projects are shown first, in the order
  listed. Set `repoUrl: null` to hide the "Source code" link.
- **Experience & certifications**: `timeline` (newest first)
- **Skills**: `skills`
- **Project filter tags**: `PROJECT_TAGS` in [`portfolio.models.ts`](src/app/data/portfolio.models.ts).
  Adding a tag there adds a filter button, and TypeScript then accepts it in `tags`.

Every field is typed by the interfaces in `portfolio.models.ts`, so a typo or missing field is a
compile error, not a broken page. `portfolio.data.spec.ts` also checks the content
(unique ids, https links, valid tags) on every test run.

**CV**: put the PDF at `public/assets/Hamed_Musleh_CV.pdf`. CI refuses to deploy without it.

**Placeholders**: search the code for `TODO` to find values that still need filling in
(currently missing repository links).

## Project structure

```
.github/workflows/deploy.yml   CI: format → lint → test → build → deploy to Pages
scripts/spa-fallback.mjs       Copies the client-side shell to 404.html (see below)
public/                        Static files copied as-is (favicon, og-image, assets/CV)
src/
├─ index.html                  Meta + Open Graph tags; inline script that sets the theme before first paint
├─ styles.scss                 Global entry: only tokens + base styles
├─ styles/
│  ├─ _tokens.scss             Design tokens as CSS variables (colours per theme, type scale, spacing)
│  ├─ _mixins.scss             Breakpoints (mobile-first), focus ring, mono label
│  └─ _base.scss               Reset, typography, .btn, .container, reveal animation, reduced-motion rules
├─ testing/portfolio.fixture.ts  Small fake data set used by component tests
└─ app/
   ├─ app.ts                   Shell: skip link, header, <main>, footer
   ├─ app.routes.ts            '' → Home, '**' → NotFound (lazy-loaded)
   ├─ app.routes.server.ts     Which routes are prerendered at build time
   ├─ app.config.ts            Router (anchor scrolling) + hydration
   ├─ data/
   │  ├─ portfolio.models.ts   Interfaces for all content
   │  ├─ portfolio.data.ts     ← THE CONTENT
   │  └─ portfolio.token.ts    Injection token components use to read the content
   ├─ core/
   │  ├─ theme.service.ts      Light/dark theme as a signal
   │  └─ reduced-motion.ts     prefers-reduced-motion helper
   ├─ layout/                  header (nav + mobile menu), theme-toggle, footer, nav-links
   ├─ pages/                   home (composes the sections), not-found
   ├─ sections/                hero, about, projects (+ card + filter logic), experience, skills, contact
   └─ shared/                  icon (inline SVGs), section-heading, reveal directive
```

Each component's `.ts`, `.html`, `.scss` and `.spec.ts` sit next to each other. Very small
components keep their template and styles inline.

## Design decisions worth knowing

- **Signals + OnPush everywhere.** State is a few `signal()`s, and everything derived from them is
  `computed()`. For example, `Projects` has a single `selected` signal, and the visible list,
  counts and screen-reader message are derived from it. ESLint enforces OnPush.
- **Content through an injection token** (`PORTFOLIO_DATA`) instead of a direct import, so tests
  provide a small fixture and don't break when the real content changes.
- **Filter logic is plain functions** (`project-filter.ts`) so it can be tested without the DOM.
- **Prerendering (SSG).** At build time the home page is rendered to static HTML, so content appears
  before JavaScript loads, and Angular then hydrates it. This raised mobile Lighthouse Performance
  from 90 to 97. No server is involved: the output is plain files.
- **Theme without a flash.** A tiny inline script in `index.html` sets `data-theme` before the
  page paints. `ThemeService` then takes over: it follows the OS setting live until you click the
  toggle, after which your choice is saved in `localStorage`. The toggle uses `ngSkipHydration`
  because its icon depends on the visitor's theme, which isn't known at build time.
- **GitHub Pages deep links.** Pages has no URL rewriting, so unknown URLs get `404.html`. The build
  copies Angular's client-side shell (`index.csr.html`) there, so the router boots and shows the
  "Page not found" view.
- **Accessibility.** Semantic landmarks, one `h1`, sections labelled by their headings, a skip
  link, visible `:focus-visible` rings, `aria-pressed` filter buttons styled *from* that
  attribute, an `aria-live` result count, 44px touch targets, and colour pairs checked for WCAG
  AA. `angular-eslint`'s template accessibility rules run in lint.
- **Motion.** Only `transform`/`opacity` are animated. Under `prefers-reduced-motion` a global rule
  disables animations, and the reveal directive does nothing.
- **Fonts.** Space Grotesk (headings) is self-hosted through `@fontsource-variable`, so there are no
  third-party requests. Body and mono text use system fonts.

## Deployment (GitHub Pages)

1. Create a GitHub repo named **`portfolio`** and push this project to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs format check, lint, tests and build, then deploys. Pull requests run
   the checks but don't deploy.

If you rename the repo, update the `--base-href` in `package.json` (`build:gh`) and the absolute
URLs in `src/index.html` (canonical, `og:url`, `og:image`).
