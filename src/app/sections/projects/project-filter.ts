import { PROJECT_TAGS, Project, ProjectTag } from '../../data/portfolio.models';

export const ALL = 'All';
export type ProjectFilter = ProjectTag | typeof ALL;

/** Filter options in display order: "All" first, then every tag. */
export const FILTER_OPTIONS: readonly ProjectFilter[] = [ALL, ...PROJECT_TAGS];

/**
 * Pure functions (no Angular) so they are trivial to unit-test.
 * The component wraps them in `computed()` signals.
 */
export function filterProjects(
  projects: readonly Project[],
  filter: ProjectFilter,
): readonly Project[] {
  const matching =
    filter === ALL ? projects : projects.filter((project) => project.tags.includes(filter));
  // Featured first. Array.prototype.sort is stable, so data-file order is kept within each group.
  return [...matching].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export function countByFilter(projects: readonly Project[]): Record<ProjectFilter, number> {
  const counts = Object.fromEntries(FILTER_OPTIONS.map((option) => [option, 0])) as Record<
    ProjectFilter,
    number
  >;
  counts[ALL] = projects.length;
  for (const project of projects) {
    for (const tag of project.tags) counts[tag]++;
  }
  return counts;
}
