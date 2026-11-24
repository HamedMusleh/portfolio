import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Static site generation (SSG): at build time the home page is rendered to real
 * HTML, so visitors (and crawlers) see content before any JavaScript runs.
 * Angular then "hydrates" that HTML instead of re-creating it.
 *
 * Unknown URLs can't be prerendered, so they fall back to client-side rendering
 * (Angular emits index.csr.html, which the build script copies to 404.html).
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
