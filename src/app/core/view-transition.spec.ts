import { mockMedia } from '../../testing/media';
import { runViewTransition } from './view-transition';

describe('runViewTransition', () => {
  afterEach(() => {
    // jsdom has no View Transitions API; remove any fake a test installed.
    delete (document as Partial<Document>).startViewTransition;
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
    document.startViewTransition = vi.fn((update?: unknown) => {
      (update as () => void)();
      return fake;
    }) as unknown as Document['startViewTransition'];
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
    document.startViewTransition = vi.fn() as unknown as Document['startViewTransition'];
    const update = vi.fn();

    expect(runViewTransition(document, update)).toBeNull();
    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});
