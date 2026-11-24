import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeading } from '../../shared/section-heading';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective, Icon],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly skills = inject(PORTFOLIO_DATA).skills;
  /** Every skill in one flat list, for the marquee strip. */
  protected readonly allSkills = this.skills.flatMap((group) => group.skills);

  /**
   * Moving content that lasts more than 5s needs a pause control (WCAG 2.2.2).
   * Hovering also pauses it, but this button works for keyboard and touch users.
   */
  protected readonly marqueePaused = signal(false);

  protected toggleMarquee(): void {
    this.marqueePaused.update((paused) => !paused);
  }
}
