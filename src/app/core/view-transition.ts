/**
 * Thin wrapper around the View Transitions API (`document.startViewTransition`).
 *
 * The browser snapshots the page, runs `update` (which must change the DOM
 * synchronously), then animates from the old snapshot to the new state.
 *
 * Falls back to simply running `update` when the API is missing (Firefox at the
 * time of writing, jsdom in tests) or when the user prefers reduced motion.
 *
 * `className` is added to <html> for the duration of the transition, so CSS can
 * style one kind of transition (e.g. the theme reveal) without affecting others.
 */
export function runViewTransition(
  doc: Document,
  update: () => void,
  className?: string,
): ViewTransition | null {
  const reduceMotion = doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (typeof doc.startViewTransition !== 'function' || reduceMotion) {
    update();
    return null;
  }

  const root = doc.documentElement;
  if (className) root.classList.add(className);

  const transition = doc.startViewTransition(update);
  if (className) {
    transition.finished.finally(() => root.classList.remove(className));
  }
  return transition;
}
