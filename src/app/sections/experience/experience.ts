import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeading } from '../../shared/section-heading';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, RevealDirective],
  styleUrl: './experience.scss',
  template: `
    <section id="experience" class="container" aria-labelledby="experience-title">
      <app-section-heading
        index="03"
        label="Experience"
        title="Experience & Training"
        headingId="experience-title"
      />

      <!-- An ordered list: the order (newest first) carries meaning. -->
      <ol class="timeline">
        @for (entry of timeline; track entry.id) {
          <li class="entry" [class.experience]="entry.kind === 'experience'" appReveal>
            <p class="period">{{ entry.period }}</p>
            <div class="body">
              <span class="node" aria-hidden="true"></span>
              <p class="kind">
                {{ entry.kind === 'experience' ? 'Experience' : 'Certification' }}
              </p>
              <h3>{{ entry.title }}</h3>
              <p class="org">{{ entry.organization }}</p>
              @if (entry.description; as description) {
                <p class="description">{{ description }}</p>
              }
            </div>
          </li>
        }
      </ol>
    </section>
  `,
})
export class Experience {
  protected readonly timeline = inject(PORTFOLIO_DATA).timeline;
}
