import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
} from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { runViewTransition } from '../../core/view-transition';
import { Icon } from '../../shared/icon';

/**
 * Sun/moon button that switches the theme, revealing the new theme as a circle
 * growing out of the button (View Transitions API + Web Animations API).
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
    <button type="button" [attr.aria-label]="label()" (click)="toggle($event)">
      <app-icon [name]="isDark() ? 'sun' : 'moon'" />
    </button>
  `,
})
export class ThemeToggle {
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);

  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
  protected readonly label = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );

  protected toggle(event: MouseEvent): void {
    const transition = runViewTransition(
      this.document,
      () => {
        this.theme.toggle();
        // Apply the new data-theme now (ThemeService's effect runs during tick),
        // because the browser takes the "after" snapshot right after this callback.
        this.appRef.tick();
      },
      'theme-transition',
    );
    if (!transition) return;

    // Circle centred on the button, big enough to cover the farthest corner.
    const button = event.currentTarget as HTMLElement;
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const win = this.document.defaultView;
    const radius = Math.hypot(
      Math.max(x, (win?.innerWidth ?? 0) - x),
      Math.max(y, (win?.innerHeight ?? 0) - y),
    );

    transition.ready
      .then(() =>
        this.document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 550,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      )
      .catch(() => {
        // The transition was skipped (e.g. tab hidden): the theme still changed.
      });
  }
}
