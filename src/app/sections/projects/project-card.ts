import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Project } from '../../data/portfolio.models';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  host: { '[class.featured]': 'project().featured' },
})
export class ProjectCard {
  readonly project = input.required<Project>();
  /** Unique heading id so the <article> can be labelled by its title. */
  protected readonly titleId = computed(() => `project-${this.project().id}-title`);
}
