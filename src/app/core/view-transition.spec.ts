import { mockMedia } from '../../testing/media';
import { stubProperty } from '../../testing/stub';
import { runViewTransition } from './view-transition';

describe('runViewTransition', () => {
  // jsdom has no View Transitions API; fakes are installed with stubProperty and
  // removed automatically after each test (see src/test-setup.ts).
  afterEach(() => {
    document.documentElement.className = '';
  });

  it('just runs the update when the API is unavailable', () => {
    mockMedia();
    const update = vi.fn();

    expect(runViewTransition(document, update)).toBeNull();
    expect(update).toHaveBeenCalledOnce();
  });

  it('uses the API and adds the class only while the transition runs', async () => {
    mockMedia();
    let finish!: () => void;
    const finished = new Promise<void>((resolve) => (finish = resolve));
    const fake = { finished, ready: Promise.resolve() } as unknown as ViewTransition;
    stubProperty(
      document,
      'startViewTransition',
      vi.fn((update?: unknown) => {
        (update as () => void)();
        return fake;
      }),
    );
    const update = vi.fn();

    const result = runViewTransition(document, update, 'theme-transition');

    expect(result).toBe(fake);
    expect(update).toHaveBeenCalledOnce();
    expect(document.documentElement.classList).toContain('theme-transition');

    finish();
    await finished;
    await Promise.resolve(); // let .finally() run
    expect(document.documentElement.classList).not.toContain('theme-transition');
  });

  it('skips the animation for users who prefer reduced motion', () => {
    mockMedia({ reducedMotion: true });
    stubProperty(document, 'startViewTransition', vi.fn());
    const update = vi.fn();

    expect(runViewTransition(document, update)).toBeNull();
    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});
