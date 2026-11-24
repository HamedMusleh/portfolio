import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Project } from '../../data/portfolio.models';
import { Icon } from '../../shared/icon';
import { CardSpan } from './bento-layout';

@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  host: {
    '[class.featured]': 'project().featured',
    '[class]': '"span-" + span()',
  },
})
export class ProjectCard {
  readonly project = input.required<Project>();
  /** Bento width (1–3 columns). Wider cards use a roomier internal layout. */
  readonly span = input<CardSpan>(1);

  /** Unique heading id so the <article> can be labelled by its title. */
  protected readonly titleId = computed(() => `project-${this.project().id}-title`);

  /** "In progress" periods get the amber warning badge instead of plain text. */
  protected readonly inProgress = computed(() => /in progress/i.test(this.project().period ?? ''));
}
