import { restoreStubs } from './testing/stub';

/**
 * Global test hygiene, run after every test in every spec file.
 *
 * Spec files can share one jsdom window (Angular's Vitest runner uses
 * `isolate: false`), so anything a test changes globally must be undone here,
 * or it leaks into whichever spec happens to run next on that worker.
 */
afterEach(() => {
  restoreStubs(); // globals replaced with stubProperty (matchMedia, rAF, clipboard…)
  vi.restoreAllMocks(); // vi.spyOn(...) spies
  localStorage.clear(); // saved theme choice
  delete document.documentElement.dataset['theme'];
});
