import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Icon } from '../../shared/icon';
import { NAV_LINKS } from '../nav-links';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    // Escape closes the mobile menu from anywhere inside the header.
    '(keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  protected readonly name = inject(PORTFOLIO_DATA).profile.name;
  protected readonly links = NAV_LINKS;
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
