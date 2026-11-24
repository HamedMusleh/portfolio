import { TestBed } from '@angular/core/testing';
import { makeProject } from '../../../testing/portfolio.fixture';
import { Project } from '../../data/portfolio.models';
import { ProjectCard } from './project-card';

describe('ProjectCard', () => {
  async function render(project: Project): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', project);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('renders title, highlights and tech, and is labelled by its heading', async () => {
    const el = await render(
      makeProject({ id: 'x', title: 'My App', tech: ['Angular', 'SCSS'], highlights: ['A', 'B'] }),
    );
    const heading = el.querySelector('h3');

    expect(heading?.textContent).toContain('My App');
    expect(el.querySelector('article')?.getAttribute('aria-labelledby')).toBe(heading?.id);
    expect(el.querySelectorAll('.highlights li')).toHaveLength(2);
    expect([...el.querySelectorAll('.tech li')].map((li) => li.textContent)).toEqual([
      'Angular',
      'SCSS',
    ]);
  });

  it('shows no repo link when repoUrl is null', async () => {
    const el = await render(makeProject({ id: 'a', repoUrl: null }));
    expect(el.querySelector('a.repo')).toBeNull();
  });

  it('shows a safe external repo link when repoUrl is set', async () => {
    const el = await render(makeProject({ id: 'b', repoUrl: 'https://github.com/x/y' }));
    const link = el.querySelector<HTMLAnchorElement>('a.repo');

    expect(link?.href).toBe('https://github.com/x/y');
    expect(link?.rel).toContain('noopener');
    expect(link?.textContent).toContain('opens in a new tab');
  });

  it('marks featured projects with a badge and a host class', async () => {
    const el = await render(makeProject({ id: 'f', featured: true }));
    expect(el.classList).toContain('featured');
    expect(el.querySelector('.badge')?.textContent).toContain('Featured');
  });
});
