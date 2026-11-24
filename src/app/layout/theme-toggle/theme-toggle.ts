import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { Icon } from '../../shared/icon';

/**
 * Sun/moon button that switches the theme.
 *
 * `ngSkipHydration`: the page is prerendered at build time, when the visitor's
 * theme is unknown. This button's icon and label depend on that theme, so instead
 * of hydrating possibly-wrong markup, Angular renders it fresh in the browser.
 */
@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { ngSkipHydration: 'true' },
  styles: `
    button {
      display: inline-grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: transparent;
      font-size: 1.125rem;
      cursor: pointer;
    }
    button:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
  `,
  template: `
    <button type="button" [attr.aria-label]="label()" (click)="theme.toggle()">
      <app-icon [name]="isDark() ? 'sun' : 'moon'" />
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
  protected readonly label = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );
}
