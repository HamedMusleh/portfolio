// GitHub Pages has no server-side rewrites: for an unknown URL it serves 404.html.
//
// index.html is the *prerendered* home page, so it can't be reused for other URLs
// (hydration would find home-page markup where it expects something else).
// index.csr.html is Angular's empty client-side shell: copying it to 404.html lets
// the router boot and render the right view (our "Page not found" page).
import { copyFileSync } from 'node:fs';

const dist = 'dist/portfolio/browser';
copyFileSync(`${dist}/index.csr.html`, `${dist}/404.html`);
console.log('Created 404.html from the client-side shell');
