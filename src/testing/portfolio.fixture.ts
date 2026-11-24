import { Portfolio, Project } from '../app/data/portfolio.models';

/** Builds a project with sensible defaults; override only what a test cares about. */
export function makeProject(overrides: Partial<Project> & Pick<Project, 'id'>): Project {
  return {
    title: `Project ${overrides.id}`,
    context: 'Test context',
    summary: 'Test summary',
    highlights: ['Did a thing'],
    tech: ['TypeScript'],
    tags: ['Frontend'],
    featured: false,
    repoUrl: null,
    ...overrides,
  };
}

/**
 * Small, stable data set for component tests. Tests use this instead of the real
 * content so that editing portfolio.data.ts never breaks them.
 */
export const TEST_PORTFOLIO: Portfolio = {
  profile: {
    name: 'Test Person',
    title: 'Test Engineer',
    pitch: 'A test pitch.',
    location: 'Test City',
    email: 'test@example.com',
    github: { label: 'github.com/test', url: 'https://github.com/test' },
    linkedin: { label: 'linkedin.com/in/test', url: 'https://www.linkedin.com/in/test' },
    cvPath: 'assets/test-cv.pdf',
    bio: ['First paragraph.', 'Second paragraph.'],
    education: { degree: 'B.Sc. Testing', institution: 'Test University', period: '2026' },
    siteRepo: 'https://github.com/test/portfolio',
  },
  projects: [
    makeProject({ id: 'plain-ai', tags: ['AI'] }),
    makeProject({ id: 'featured-web', tags: ['Frontend', 'Backend'], featured: true }),
    makeProject({ id: 'robot', tags: ['Hardware'], repoUrl: 'https://github.com/test/robot' }),
    makeProject({ id: 'featured-ai', tags: ['AI'], featured: true }),
  ],
  timeline: [
    { id: 'job', kind: 'experience', title: 'Trainee', organization: 'Test Co', period: '2026' },
  ],
  skills: [{ category: 'Testing', skills: ['Vitest'] }],
};
