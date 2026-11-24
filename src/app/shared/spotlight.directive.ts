import { Directive } from '@angular/core';
import { bindPointerEffect } from '../core/motion';

/**
 * Publishes the cursor position over the host as CSS custom properties:
 * `--mx` / `--my` (px from the host's top-left corner).
 *
 * The directive does no drawing itself. Styles decide what to do with the
 * position, e.g. a `radial-gradient(circle at var(--mx) var(--my), …)` glow.
 * The `spotlight-active` class is set while the pointer is over the host.
 */
@Directive({ selector: '[appSpotlight]' })
export class SpotlightDirective {
  constructor() {
    bindPointerEffect({
      move: (event, rect, element) => {
        element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        element.style.setProperty('--my', `${event.clientY - rect.top}px`);
        element.classList.add('spotlight-active');
      },
      leave: (element) => element.classList.remove('spotlight-active'),
    });
  }
}
