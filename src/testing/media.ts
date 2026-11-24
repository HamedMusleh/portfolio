/**
 * jsdom has no matchMedia. This installs a fake that answers the media queries
 * the motion helpers ask about, so tests can simulate a mouse user, a touch
 * user, or someone who prefers reduced motion.
 */
export function mockMedia({ finePointer = true, reducedMotion = false } = {}): void {
  window.matchMedia = ((query: string) => ({
    matches:
      (query.includes('pointer: fine') && finePointer) ||
      (query.includes('prefers-reduced-motion: reduce') && reducedMotion),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

/** Runs requestAnimationFrame callbacks immediately, so pointer effects apply synchronously. */
export function mockAnimationFrame(): void {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    callback(0);
    // 0 = "no frame pending": the callback already ran, so callers may schedule again.
    return 0;
  };
  window.cancelAnimationFrame = () => undefined;
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
