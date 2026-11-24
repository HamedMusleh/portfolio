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
├─ styles.scss                 Global entry: fonts, tokens, base, motion
├─ styles/
│  ├─ _fonts.scss              Self-hosted @font-face rules (latin subset)
│  ├─ _tokens.scss             Design tokens as CSS variables (colours per theme, type scale, spacing)
│  ├─ _mixins.scss             Breakpoints, fine-pointer/motion-ok queries, focus ring, crop marks, 12-col grid
│  ├─ _base.scss               Reset, typography, noise overlay, .btn (with fill sweep), .container
│  └─ _motion.scss             Reveal wipes, View Transition styles, global reduced-motion rule
├─ testing/
│  ├─ portfolio.fixture.ts     Small fake data set used by component tests
│  └─ media.ts                 Fakes for matchMedia / rAF / pointer events (jsdom has none)
└─ app/
   ├─ app.ts                   Shell: skip link, scroll progress, header, <main>, footer
   ├─ app.routes.ts            '' → Home, '**' → NotFound (lazy-loaded)
   ├─ app.routes.server.ts     Which routes are prerendered at build time
   ├─ app.config.ts            Router (anchor scrolling) + hydration
   ├─ data/
   │  ├─ portfolio.models.ts   Interfaces for all content
   │  ├─ portfolio.data.ts     ← THE CONTENT
   │  └─ portfolio.token.ts    Injection token components use to read the content
   ├─ core/
   │  ├─ theme.service.ts      Light/dark theme as a signal
   │  ├─ motion.ts             Reduced-motion / fine-pointer checks + bindPointerEffect() helper
   │  └─ view-transition.ts    View Transitions API wrapper with fallback
   ├─ layout/                  header, theme-toggle, scroll-progress, footer, nav-links
   ├─ pages/                   home (composes the sections), not-found
   ├─ sections/                hero, about, projects (+ card, filter and bento layout logic),
   │                           experience, skills, contact
   └─ shared/                  icon, section-heading, and the motion directives:
                               reveal, spotlight, tilt, magnetic
```

Each component's `.ts`, `.html`, `.scss` and `.spec.ts` sit next to each other. Very small
components keep their template and styles inline.

## Design decisions worth knowing

- **Signals + OnPush everywhere.** State is a few `signal()`s, and everything derived from them is
  `computed()`. For example, `Projects` has a single `selected` signal, and the visible list,
  counts and screen-reader message are derived from it. ESLint enforces OnPush.
- **Content through an injection token** (`PORTFOLIO_DATA`) instead of a direct import, so tests
  provide a small fixture and don't break when the real content changes.
- **Filter and bento logic are plain functions** (`project-filter.ts`, `bento-layout.ts`) so they
  can be tested without the DOM.
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
  link, visible `:focus-visible` rings, `aria-pressed` filter buttons styled _from_ that
  attribute, an `aria-live` result count, 44px touch targets, and colour pairs checked for WCAG
  AA. `angular-eslint`'s template accessibility rules run in lint.

## Design system: "Signal / Lab instrument"

Dark-first, precise and technical, like the UI of an oscilloscope or lab tool. Everything is
defined in `src/styles/` and reused through CSS variables and mixins.

**Colour** (`_tokens.scss`). Dark is the default theme and light is an override.
`--bg`, `--surface`, `--surface-2` (layers), `--line` (hairlines), `--text`, `--muted`, `--accent`
(mint: primary actions, indices, focus ring), `--accent-2` (electric blue: secondary, e.g. tag
hover), `--warn` (amber: tiny status details like "In progress"). Every text/background pair passes
WCAG AA. Light mode's accent, accent-2 and warn were darkened from the original brief to pass (see
the comment at the top of the file).

**Type** (`_fonts.scss`, self-hosted, latin subset, `font-display: swap`, so no third-party requests):

- **Bricolage Grotesque**: display and headings, tight `-0.03em` tracking, fluid `clamp()` sizes
  (the hero name is `clamp(3rem, 9vw, 7.5rem)`)
- **Geist**: body text
- **JetBrains Mono**: labels, indices, dates, tags, buttons (uppercase, wide tracking via the
  `mono-label` mixin)

**Shape and layout.** Corners are 2px (4px max). Surfaces are separated by 1px `--line` hairlines,
not shadows. Sections use a 12-column grid (`section-grid` mixin): a mono label like `01 / ABOUT`
sits in columns 1–3 and content starts at column 4, giving an asymmetric, left-aligned rhythm.
Projects use a bento grid whose card widths come from `bento-layout.ts`: the first two featured
projects are large, and every row is filled. Details like crop marks (`crop-marks` mixin), a status
line, coordinates, a readout panel, a ruler and a faint noise overlay give the instrument feel.

**Motion.** CSS, the Web Animations API, IntersectionObserver and the View Transitions API only,
with no animation library. Only `transform`, `opacity` and `clip-path` animate. (The spotlight glows
also redraw a gradient as the cursor moves.)

| Effect                                    | Where                                                 | How                                                                             |
| ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| Letter-by-letter name, typed title        | `hero.scss`                                           | CSS keyframes staggered by a per-letter `--i`; typing = `clip-path` + `steps()` |
| Drifting grid + cursor spotlight          | `hero.scss`, `SpotlightDirective`                     | Transform drift loop; accent grid masked around `--mx/--my`                     |
| Scroll progress bar                       | `ScrollProgress`                                      | CSS `animation-timeline: scroll()`, JS fallback                                 |
| Section reveals                           | `RevealDirective`, `_motion.scss`                     | IntersectionObserver + clip-path wipe; `appReveal="stagger"` for children       |
| Card border spotlight, 3D tilt, chip wave | `ProjectCard` + `SpotlightDirective`, `TiltDirective` | Pointer position → CSS vars / transform (max 4°)                                |
| Filter reorder                            | `Projects.select()`                                   | View Transitions with per-card names; fade fallback                             |
| Timeline rail + node pulse                | `experience.scss`                                     | CSS view timeline; one pulse on reveal                                          |
| Skills ticker                             | `skills.scss`                                         | Infinite transform loop; pauses on hover or with the Pause button               |
| Magnetic buttons + fill sweep             | `MagneticDirective`, `.btn`                           | Transform toward cursor (max 8px); `scaleX` sweep                               |
| Theme switch                              | `ThemeToggle`                                         | View Transition + circular `clip-path` reveal from the button                   |

**Motion rules**, enforced in one place (`core/motion.ts` and `_motion.scss`):

- `prefers-reduced-motion: reduce` disables everything. Pointer effects never bind, reveals don't
  hide content, View Transitions are skipped, and infinite loops (grid, ticker) are turned off.
- Cursor effects only run with a fine, hovering pointer, so touch devices get a static page.
- Nothing runs during prerendering. Content that is already on screen at load is never hidden.

## Deployment (GitHub Pages)

1. Create a GitHub repo named **`portfolio`** and push this project to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs format check, lint, tests and build, then deploys. Pull requests run
   the checks but don't deploy.

If you rename the repo, update the `--base-href` in `package.json` (`build:gh`) and the absolute
URLs in `src/index.html` (canonical, `og:url`, `og:image`).
