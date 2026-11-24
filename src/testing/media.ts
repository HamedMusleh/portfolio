import { stubProperty } from './stub';

/**
 * jsdom has no matchMedia. This installs a fake that answers the media queries
 * the motion helpers ask about, so tests can simulate a mouse user, a touch
 * user, or someone who prefers reduced motion. Restored after each test.
 */
export function mockMedia({ finePointer = true, reducedMotion = false } = {}): void {
  stubProperty(window, 'matchMedia', (query: string) => ({
    matches:
      (query.includes('pointer: fine') && finePointer) ||
      (query.includes('prefers-reduced-motion: reduce') && reducedMotion),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

/**
 * Runs requestAnimationFrame callbacks immediately, so pointer effects apply
 * synchronously. Restored after each test. It must be: Angular's zoneless
 * scheduler also uses rAF, and a synchronous rAF leaking into other specs makes
 * change detection run in the middle of a signal write.
 */
export function mockAnimationFrame(): void {
  stubProperty(window, 'requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    // 0 = "no frame pending": the callback already ran, so callers may schedule again.
    return 0;
  });
  stubProperty(window, 'cancelAnimationFrame', () => undefined);
}

/** jsdom has no PointerEvent constructor; the effects only read clientX/clientY. */
export function pointer(type: 'pointermove' | 'pointerleave', clientX = 0, clientY = 0): Event {
  return new MouseEvent(type, { clientX, clientY, bubbles: true });
}

/** Gives an element a fixed box, since jsdom doesn't do layout. */
export function stubRect(element: Element, rect: Partial<DOMRect>): void {
  const full = { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, ...rect };
  element.getBoundingClientRect = () => ({ ...full, toJSON: () => full }) as DOMRect;
}
