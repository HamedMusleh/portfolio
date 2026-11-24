/**
 * Replace a property (usually a browser global like `window.matchMedia`) for the
 * current test only. The original is restored automatically after each test by
 * `restoreStubs()`, which `src/test-setup.ts` runs in a global `afterEach`.
 *
 * Why this matters: Angular's Vitest runner defaults to `isolate: false`, so spec
 * files that run in the same worker share one jsdom `window`. A global that one
 * spec replaces and never puts back leaks into whichever spec runs next, and
 * which specs share a worker depends on the machine's CPU count and file order.
 * That made a test fail on CI's 4-core runner but pass on an 8-core laptop.
 */
const restorers: (() => void)[] = [];

export function stubProperty<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: unknown,
): void {
  const original = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, { value, configurable: true, writable: true });
  restorers.push(() => {
    if (original) {
      Object.defineProperty(target, key, original);
    } else {
      delete target[key];
    }
  });
}

/** Undo every `stubProperty` call, newest first. */
export function restoreStubs(): void {
  while (restorers.length) restorers.pop()?.();
}
