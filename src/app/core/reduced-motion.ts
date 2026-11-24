import { DOCUMENT, inject } from '@angular/core';

/**
 * True when the user has asked the OS to minimise motion.
 * CSS handles most of this with media queries; this helper is for the few
 * places where motion is driven from TypeScript (the reveal directive).
 */
export function prefersReducedMotion(): boolean {
  const win = inject(DOCUMENT).defaultView;
  return win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
