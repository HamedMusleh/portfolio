import { Directive } from '@angular/core';
import { bindPointerEffect } from '../core/motion';

/** Fraction of the cursor's offset from centre that the element follows. */
const STRENGTH = 0.3;
/** Hard limit in px, so large buttons don't travel far. */
const MAX_OFFSET = 8;

/**
 * "Magnetic" hover: the host is pulled slightly toward the cursor and springs
 * back when it leaves (the spring is the host's CSS transform transition).
 */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  constructor() {
    bindPointerEffect({
      move: (event, rect, element) => {
        const dx = clamp((event.clientX - (rect.left + rect.width / 2)) * STRENGTH);
        const dy = clamp((event.clientY - (rect.top + rect.height / 2)) * STRENGTH);
        element.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      },
      leave: (element) => {
        element.style.transform = '';
      },
    });
  }
}

function clamp(value: number): number {
  return Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
}
