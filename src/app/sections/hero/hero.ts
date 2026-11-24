import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly data = inject(PORTFOLIO_DATA);
  protected readonly profile = this.data.profile;
  /** The most recent experience entry, shown in the "spec sheet" card. */
  protected readonly latestRole = this.data.timeline.find((entry) => entry.kind === 'experience');
}
