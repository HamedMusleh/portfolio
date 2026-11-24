import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeading } from '../../shared/section-heading';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly skills = inject(PORTFOLIO_DATA).skills;
  /** Every skill in one flat list, for the marquee strip. */
  protected readonly allSkills = this.skills.flatMap((group) => group.skills);
}
