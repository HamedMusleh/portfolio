import {
  DOCUMENT,
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

/**
 * Owns the light/dark theme as a signal.
 *
 * Resolution order: explicit choice saved in localStorage → OS preference.
 * Until the user clicks the toggle, OS changes are followed live; after that,
 * their explicit choice wins. The inline script in index.html applies the same
 * logic before Angular boots, so there is no flash on load.
 *
 * During prerendering (build time) there is no real browser, so the service
 * reports 'light' and never touches the DOM.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media = this.document.defaultView?.matchMedia?.(DARK_QUERY);

  private readonly themeState = signal<Theme>(this.resolveInitialTheme());
  /** Read-only view for components; only this service can change the theme. */
  readonly theme = this.themeState.asReadonly();

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    // Keep the <html data-theme> attribute in sync with the signal.
    effect(() => {
      this.document.documentElement.dataset['theme'] = this.themeState();
    });

    const onSystemChange = (event: MediaQueryListEvent) => {
      if (!this.readStoredTheme()) {
        this.themeState.set(event.matches ? 'dark' : 'light');
      }
    };
    this.media?.addEventListener('change', onSystemChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onSystemChange));
  }

  toggle(): void {
    const next: Theme = this.themeState() === 'dark' ? 'light' : 'dark';
    this.themeState.set(next);
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode, blocked cookies): the toggle still works.
    }
  }

  private resolveInitialTheme(): Theme {
    return this.readStoredTheme() ?? (this.media?.matches ? 'dark' : 'light');
  }

  private readStoredTheme(): Theme | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch {
      return null;
    }
  }
}
