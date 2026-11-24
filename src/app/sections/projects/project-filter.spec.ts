import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { ALL, countByFilter, filterProjects } from './project-filter';

const projects = TEST_PORTFOLIO.projects;
const ids = (list: readonly { id: string }[]) => list.map((p) => p.id);

describe('filterProjects', () => {
  it('returns every project for "All", featured first, keeping data order within groups', () => {
    expect(ids(filterProjects(projects, ALL))).toEqual([
      'featured-web',
      'featured-ai',
      'plain-ai',
      'robot',
    ]);
  });

  it('returns only projects with the selected tag', () => {
    expect(ids(filterProjects(projects, 'AI'))).toEqual(['featured-ai', 'plain-ai']);
    expect(ids(filterProjects(projects, 'Backend'))).toEqual(['featured-web']);
  });

  it('returns an empty list when no project has the tag', () => {
    expect(filterProjects(projects, 'Mobile')).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const before = ids(projects);
    filterProjects(projects, ALL);
    expect(ids(projects)).toEqual(before);
  });
});

describe('countByFilter', () => {
  it('counts projects per tag, including zero for unused tags', () => {
    expect(countByFilter(projects)).toEqual({
      All: 4,
      AI: 2,
      Frontend: 1,
      Backend: 1,
      Hardware: 1,
      Mobile: 0,
    });
  });
});
