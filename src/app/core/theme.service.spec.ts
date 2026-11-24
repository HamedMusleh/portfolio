import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

type ChangeListener = (event: MediaQueryListEvent) => void;

/** jsdom has no matchMedia, so tests install a controllable fake. */
function mockSystemDarkMode(matches: boolean) {
  const listeners: ChangeListener[] = [];
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: (_type: string, fn: ChangeListener) => listeners.push(fn),
    removeEventListener: vi.fn(),
  });
  return {
    emitChange: (dark: boolean) =>
      listeners.forEach((fn) => fn({ matches: dark } as MediaQueryListEvent)),
  };
}

describe('ThemeService', () => {
  const html = document.documentElement;

  beforeEach(() => {
    localStorage.clear();
    delete html.dataset['theme'];
  });

  function createService(): ThemeService {
    const service = TestBed.inject(ThemeService);
    TestBed.tick(); // run the effect that writes data-theme
    return service;
  }

  it('follows the OS preference when nothing is saved', () => {
    mockSystemDarkMode(true);
    const service = createService();

    expect(service.theme()).toBe('dark');
    expect(html.dataset['theme']).toBe('dark');
  });

  it('prefers a saved choice over the OS preference', () => {
    mockSystemDarkMode(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    expect(createService().theme()).toBe('light');
  });

  it('toggle() flips the theme, updates <html> and saves the choice', () => {
    mockSystemDarkMode(false);
    const service = createService();

    service.toggle();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(html.dataset['theme']).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('follows live OS changes only until the user makes an explicit choice', () => {
    const media = mockSystemDarkMode(false);
    const service = createService();

    media.emitChange(true);
    expect(service.theme()).toBe('dark');

    service.toggle(); // explicit choice: light
    media.emitChange(true);
    expect(service.theme()).toBe('light');
  });
});
