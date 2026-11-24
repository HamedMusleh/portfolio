import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Consistent heading for every section: a mono label ("01 / ABOUT") in the left
 * column and the large display title to its right (asymmetric 12-column grid).
 * `headingId` is referenced by the parent <section aria-labelledby="…">,
 * so screen readers announce each landmark by its visible title.
 */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './section-heading.scss',
  template: `
    <p class="label" aria-hidden="true">
      <span class="index">{{ index() }}</span> / {{ label() ?? title() }}
    </p>
    <div class="main">
      <h2 [id]="headingId()">{{ title() }}</h2>
      @if (intro(); as intro) {
        <p class="intro">{{ intro }}</p>
      }
    </div>
  `,
})
export class SectionHeading {
  readonly index = input.required<string>();
  readonly title = input.required<string>();
  readonly headingId = input.required<string>();
  readonly intro = input<string>();
  /** Short mono label; defaults to the title. */
  readonly label = input<string>();
}
