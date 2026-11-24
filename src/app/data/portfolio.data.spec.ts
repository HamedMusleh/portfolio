import { PORTFOLIO } from './portfolio.data';
import { PROJECT_TAGS } from './portfolio.models';

/**
 * Guards the real content file. These catch editing mistakes (duplicate ids,
 * non-https links, missing tags) before they reach the live site.
 */
describe('portfolio content', () => {
  const { projects, timeline, profile } = PORTFOLIO;

  it('has unique project and timeline ids', () => {
    const projectIds = projects.map((p) => p.id);
    const timelineIds = timeline.map((t) => t.id);

    expect(new Set(projectIds).size).toBe(projectIds.length);
    expect(new Set(timelineIds).size).toBe(timelineIds.length);
  });

  it('uses URL-safe project ids (they become element ids)', () => {
    for (const { id } of projects) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('gives every project at least one valid tag and some tech', () => {
    for (const project of projects) {
      expect(project.tags.length, project.id).toBeGreaterThan(0);
      expect(project.tech.length, project.id).toBeGreaterThan(0);
      for (const tag of project.tags) expect(PROJECT_TAGS).toContain(tag);
    }
  });

  it('uses https for every external link', () => {
    const urls = [
      profile.github.url,
      profile.linkedin.url,
      profile.siteRepo,
      ...projects.flatMap((p) => (p.repoUrl ? [p.repoUrl] : [])),
    ];
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  });

  it('keeps the CV path relative so it works under any base-href', () => {
    expect(profile.cvPath.startsWith('/')).toBe(false);
  });
});
