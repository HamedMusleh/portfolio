import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Hero } from './hero';

describe('Hero', () => {
  async function render(): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      imports: [Hero],
      providers: [provideRouter([]), { provide: PORTFOLIO_DATA, useValue: TEST_PORTFOLIO }],
    });
    const fixture = TestBed.createComponent(Hero);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('renders the name as the only h1, plus title and pitch', async () => {
    const el = await render();

    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent).toContain('Test Person');
    expect(el.textContent).toContain('Test Engineer');
    expect(el.textContent).toContain('A test pitch.');
  });

  it('has the three CTAs: projects, CV download and contact', async () => {
    const links = [...(await render()).querySelectorAll<HTMLAnchorElement>('.actions a')];

    expect(links.map((a) => a.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'View projects',
      'Download CV (PDF)',
      'Contact',
    ]);
    expect(links[0].getAttribute('href')).toBe('/#projects');
    expect(links[1].getAttribute('href')).toBe('assets/test-cv.pdf');
    expect(links[1].hasAttribute('download')).toBe(true);
    expect(links[2].getAttribute('href')).toBe('/#contact');
  });
});
