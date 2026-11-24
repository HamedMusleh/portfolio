import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  computed,
  inject,
  signal,
} from '@angular/core';
import { runViewTransition } from '../../core/view-transition';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { SectionHeading } from '../../shared/section-heading';
import { bentoLayout } from './bento-layout';
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
  private readonly document = inject(DOCUMENT);
  private readonly appRef = inject(ApplicationRef);

  protected readonly filterOptions = FILTER_OPTIONS;
  protected readonly counts = countByFilter(this.projects);

  /** The only mutable state: which filter is selected. */
  protected readonly selected = signal<ProjectFilter>(ALL);

  /** Derived state, recomputed automatically whenever `selected` changes. */
  protected readonly visibleProjects = computed(() =>
    filterProjects(this.projects, this.selected()),
  );

  /** The visible projects with a bento card size for each (see bento-layout.ts). */
  protected readonly cards = computed(() => bentoLayout(this.visibleProjects()));

  /** Read out by the aria-live region so screen-reader users hear the result. */
  protected readonly resultMessage = computed(() => {
    const count = this.visibleProjects().length;
    const noun = count === 1 ? 'project' : 'projects';
    return this.selected() === ALL
      ? `Showing all ${count} ${noun}`
      : `Showing ${count} ${noun} tagged ${this.selected()}`;
  });

  /**
   * Changes the filter inside a View Transition so cards glide to their new
   * positions. The DOM must be updated synchronously inside the callback, so we
   * run change detection right away with appRef.tick() instead of waiting for
   * Angular's scheduler. Without View Transitions support this is a plain update
   * and the CSS fade-in on new cards is the fallback.
   */
  protected select(option: ProjectFilter): void {
    if (option === this.selected()) return;
    runViewTransition(
      this.document,
      () => {
        this.selected.set(option);
        this.appRef.tick();
      },
      'filter-transition',
    );
  }
}
