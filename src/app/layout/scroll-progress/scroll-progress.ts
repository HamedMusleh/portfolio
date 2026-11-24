import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

/**
 * Thin accent bar at the top of the page showing how far you've scrolled.
 *
 * Preferred path is pure CSS: a scroll-driven animation (`animation-timeline:
 * scroll()`) runs on the compositor with zero JavaScript. Browsers without
 * support get a small fallback: a passive scroll listener that writes
 * `transform: scaleX()` at most once per frame.
 */
@Component({
  selector: 'app-scroll-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    .bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      height: 2px;
      background: var(--accent);
      transform: scaleX(0);
      transform-origin: left;
      pointer-events: none;
    }
    @supports (animation-timeline: scroll()) {
      .bar {
        animation: grow linear both;
        animation-timeline: scroll(root block);
      }
    }
    @keyframes grow {
      to {
        transform: scaleX(1);
      }
    }
    /* Scroll position isn't decorative motion, so keep it under reduced motion.
       Beats the global reduced-motion rule by specificity. */
    @media (prefers-reduced-motion: reduce) {
      .bar {
        animation-duration: auto !important;
      }
    }
  `,
  template: `<div class="bar" #bar></div>`,
})
export class ScrollProgress {
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');

  constructor() {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = doc.defaultView;
      if (!win || win.CSS?.supports?.('animation-timeline: scroll()')) return;

      let frame = 0;
      const update = () => {
        frame = 0;
        const root = doc.documentElement;
        const max = root.scrollHeight - root.clientHeight;
        const progress = max > 0 ? Math.min(1, win.scrollY / max) : 0;
        this.bar().nativeElement.style.transform = `scaleX(${progress})`;
      };
      const onScroll = () => {
        if (!frame) frame = win.requestAnimationFrame(update);
      };

      update();
      win.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', onScroll);
        if (frame) win.cancelAnimationFrame(frame);
      });
    });
  }
}
