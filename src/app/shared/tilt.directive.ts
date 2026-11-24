import { Directive, input } from '@angular/core';
import { bindPointerEffect } from '../core/motion';

/**
 * Slight 3D tilt toward the cursor. The host's edges lean in by at most
 * `appTilt` degrees (default 4). The host should have a `transition: transform`
 * so the reset on pointer leave eases back smoothly.
 */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  /** Maximum rotation in degrees. Empty attribute (`appTilt`) means the default. */
  readonly maxDegrees = input(4, {
    alias: 'appTilt',
    transform: (value: number | string | undefined) => Number(value) || 4,
  });

  constructor() {
    bindPointerEffect({
      move: (event, rect, element) => {
        if (!rect.width || !rect.height) return;
        // -0.5 … 0.5 across the element, 0 in the centre.
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const max = this.maxDegrees();
        const rotateY = (x * 2 * max).toFixed(2);
        const rotateX = (-y * 2 * max).toFixed(2);
        element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      },
      leave: (element) => {
        element.style.transform = '';
      },
    });
  }
}
