import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { SectionHeading } from '../../shared/section-heading';
import { ProjectCard } from './project-card';
import {
  ALL,
  FILTER_OPTIONS,
  ProjectFilter,
  countByFilter,
  filterProjects,
} from './project-filter';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, ProjectCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private readonly projects = inject(PORTFOLIO_DATA).projects;

  protected readonly filterOptions = FILTER_OPTIONS;
  protected readonly counts = countByFilter(this.projects);

  /** The only mutable state: which filter is selected. */
  protected readonly selected = signal<ProjectFilter>(ALL);

  /** Derived state, recomputed automatically whenever `selected` changes. */
  protected readonly visibleProjects = computed(() =>
    filterProjects(this.projects, this.selected()),
  );

  /** Read out by the aria-live region so screen-reader users hear the result. */
  protected readonly resultMessage = computed(() => {
    const count = this.visibleProjects().length;
    const noun = count === 1 ? 'project' : 'projects';
    return this.selected() === ALL
      ? `Showing all ${count} ${noun}`
      : `Showing ${count} ${noun} tagged ${this.selected()}`;
  });

  protected select(option: ProjectFilter): void {
    this.selected.set(option);
  }
}
