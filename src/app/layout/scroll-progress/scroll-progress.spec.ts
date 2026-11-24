import { TestBed } from '@angular/core/testing';
import { mockAnimationFrame } from '../../../testing/media';
import { ScrollProgress } from './scroll-progress';

describe('ScrollProgress', () => {
  const root = document.documentElement;

  afterEach(() => vi.restoreAllMocks());

  beforeEach(() => {
    mockAnimationFrame();
    // jsdom does no layout: fake a page that can scroll 1000px.
    Object.defineProperty(root, 'scrollHeight', { value: 1800, configurable: true });
    Object.defineProperty(root, 'clientHeight', { value: 800, configurable: true });
  });

  it('is hidden from assistive technology', async () => {
    const fixture = TestBed.createComponent(ScrollProgress);
    await fixture.whenStable();
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses pure CSS when scroll-driven animations are supported', async () => {
    vi.spyOn(window.CSS, 'supports').mockReturnValue(true);
    const fixture = TestBed.createComponent(ScrollProgress);
    await fixture.whenStable();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.bar');

    window.dispatchEvent(new Event('scroll'));

    expect(bar.style.transform).toBe(''); // JS never touches it
  });

  it('falls back to JS and scales the bar with scroll position', async () => {
    vi.spyOn(window.CSS, 'supports').mockReturnValue(false);
    const fixture = TestBed.createComponent(ScrollProgress);
    await fixture.whenStable();
    const bar: HTMLElement = fixture.nativeElement.querySelector('.bar');

    Object.defineProperty(window, 'scrollY', { value: 250, configurable: true });
    window.dispatchEvent(new Event('scroll'));

    expect(bar.style.transform).toBe('scaleX(0.25)');
  });
});
