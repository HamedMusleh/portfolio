import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Consistent heading for every section: a mono index ("01") + the title.
 * `headingId` is referenced by the parent <section aria-labelledby="…">,
 * so screen readers announce each landmark by its visible title.
 */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './section-heading.scss',
  template: `
    <div class="heading">
      <span class="index" aria-hidden="true">{{ index() }}</span>
      <h2 [id]="headingId()">{{ title() }}</h2>
    </div>
    @if (intro(); as intro) {
      <p class="intro">{{ intro }}</p>
    }
  `,
})
export class SectionHeading {
  readonly index = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input.required<string>();
  readonly intro = input<string>();
}
