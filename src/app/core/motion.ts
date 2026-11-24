import { DOCUMENT, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Shared helpers for every motion effect on the site.
 *
 * Rules they enforce in one place:
 *  - nothing runs during prerendering (afterNextRender is browser-only),
 *  - users with `prefers-reduced-motion: reduce` get no motion,
 *  - cursor-driven effects only run on devices with a precise, hovering pointer
 *    (so touch devices stay static).
 */

/** True when the user has asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  return matches('(prefers-reduced-motion: reduce)');
}

/** True for mouse/trackpad users; false for touch screens. */
export function hasFinePointer(): boolean {
  return matches('(hover: hover) and (pointer: fine)');
}

function matches(query: string): boolean {
  const win = inject(DOCUMENT).defaultView;
  return win?.matchMedia?.(query).matches ?? false;
}

export interface PointerEffectHandlers {
  /** Called at most once per animation frame while the pointer moves over the host. */
  move(event: MouseEvent, rect: DOMRect, element: HTMLElement): void;
  /** Called when the pointer leaves the host: reset whatever `move` changed. */
  leave?(element: HTMLElement): void;
}

/**
 * Wires pointermove/pointerleave listeners on the host element of the calling
 * directive or component. Must be called from a constructor (injection context).
 * Does nothing for touch users or when reduced motion is requested.
 */
export function bindPointerEffect(handlers: PointerEffectHandlers): void {
  const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const win = inject(DOCUMENT).defaultView;
  const destroyRef = inject(DestroyRef);
  const enabled = hasFinePointer() && !prefersReducedMotion();

  afterNextRender(() => {
    if (!enabled || !win) return;

    let frame = 0;
    let lastEvent: MouseEvent | null = null;

    // Pointer events can fire far more often than the screen refreshes; only the
    // latest one per frame is used, and the DOM is written inside rAF.
    const flush = () => {
      frame = 0;
      if (lastEvent) handlers.move(lastEvent, element.getBoundingClientRect(), element);
    };
    const onMove = (event: Event) => {
      lastEvent = event as MouseEvent;
      if (!frame) frame = win.requestAnimationFrame(flush);
    };
    const onLeave = () => {
      if (frame) win.cancelAnimationFrame(frame);
      frame = 0;
      lastEvent = null;
      handlers.leave?.(element);
    };

    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave, { passive: true });
    destroyRef.onDestroy(() => {
      if (frame) win.cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    });
  });
}
