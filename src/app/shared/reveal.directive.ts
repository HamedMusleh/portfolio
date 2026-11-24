import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { prefersReducedMotion } from '../core/reduced-motion';

/**
 * Fades an element in the first time it scrolls into view.
 *
 * Progressive enhancement: the element is only hidden (class `reveal`) once we
 * know IntersectionObserver exists and the user hasn't asked for reduced motion.
 * Without JS or with reduced motion, content is simply visible.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const win = inject(DOCUMENT).defaultView;
    const reduceMotion = prefersReducedMotion();
    const destroyRef = inject(DestroyRef);

    // afterNextRender only runs in the browser, after the element is in the DOM.
    afterNextRender(() => {
      if (reduceMotion || !win || !('IntersectionObserver' in win)) return;

      element.classList.add('reveal');
      const observer = new win.IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            element.classList.add('is-visible');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
