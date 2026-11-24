import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeading } from '../../shared/section-heading';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  styleUrl: './about.scss',
  template: `
    <section id="about" class="container" aria-labelledby="about-title">
      <app-section-heading index="01" title="About" headingId="about-title" />
      <div class="layout" appReveal="stagger">
        <div class="bio">
          @for (paragraph of profile.bio; track $index) {
            <p>{{ paragraph }}</p>
          }
        </div>
        <aside class="education" aria-labelledby="education-title">
          <h3 id="education-title" class="label">Education</h3>
          <p class="degree">{{ profile.education.degree }}</p>
          <p>{{ profile.education.institution }}</p>
          <p class="period">{{ profile.education.period }}</p>
        </aside>
      </div>
    </section>
  `,
})
export class About {
  protected readonly profile = inject(PORTFOLIO_DATA).profile;
}
