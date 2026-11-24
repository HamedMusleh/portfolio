import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { prefersReducedMotion } from '../core/motion';

/**
 * Reveals an element with a clip-path wipe + fade the first time it scrolls
 * into view. `appReveal="stagger"` reveals the element's children one after
 * another instead (each child gets a `--reveal-i` index used as a delay).
 *
 * Progressive enhancement: the hidden starting state is only applied in the
 * browser, after render, when IntersectionObserver exists and the user hasn't
 * asked for reduced motion. Elements already on screen at load are left alone
 * (hiding them would cause a flash). Without JS, everything is simply visible.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly mode = input<'' | 'stagger'>('', { alias: 'appReveal' });

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const win = inject(DOCUMENT).defaultView;
    const reduceMotion = prefersReducedMotion();
    const destroyRef = inject(DestroyRef);

    // afterNextRender only runs in the browser, after the element is in the DOM.
    afterNextRender(() => {
      if (reduceMotion || !win || !('IntersectionObserver' in win)) return;
      if (element.getBoundingClientRect().top < win.innerHeight) return;

      if (this.mode() === 'stagger') {
        Array.from(element.children).forEach((child, i) =>
          (child as HTMLElement).style.setProperty('--reveal-i', String(i)),
        );
        element.classList.add('reveal-stagger');
      } else {
        element.classList.add('reveal');
      }

      const observer = new win.IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            element.classList.add('is-visible');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -12% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
