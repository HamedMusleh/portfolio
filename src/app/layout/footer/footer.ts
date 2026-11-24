import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './footer.scss',
  template: `
    <div class="container inner">
      <p class="about-site">
        <span class="label">About this site</span>
        Built with Angular, TypeScript, Signals and SCSS. No UI kit.
        <a [href]="profile.siteRepo" rel="noopener" target="_blank">
          View the source on GitHub<span class="visually-hidden"> (opens in a new tab)</span>
        </a>
      </p>
      <p class="copyright">© {{ year }} {{ profile.name }}</p>
    </div>
  `,
})
export class Footer {
  protected readonly profile = inject(PORTFOLIO_DATA).profile;
  protected readonly year = new Date().getFullYear();
}
