import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeading } from '../../shared/section-heading';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  styleUrl: './skills.scss',
  template: `
    <section id="skills" class="container" aria-labelledby="skills-title">
      <app-section-heading index="04" title="Skills" headingId="skills-title" />
      <div class="grid">
        @for (group of skills; track group.category) {
          <div class="group" appReveal>
            <h3>{{ group.category }}</h3>
            <ul>
              @for (skill of group.skills; track skill) {
                <li>{{ skill }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
})
export class Skills {
  protected readonly skills = inject(PORTFOLIO_DATA).skills;
}
