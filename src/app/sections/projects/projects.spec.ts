import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Projects } from './projects';

describe('Projects', () => {
  let fixture: ComponentFixture<Projects>;
  let el: HTMLElement;

  const filterButton = (label: string): HTMLButtonElement => {
    const buttons = [...el.querySelectorAll<HTMLButtonElement>('.filter')];
    const match = buttons.find((b) => b.textContent?.trim().startsWith(label));
    if (!match) throw new Error(`No filter button "${label}"`);
    return match;
  };
  const cardTitles = () =>
    [...el.querySelectorAll('app-project-card h3')].map((h) => h.textContent?.trim());

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Projects],
      providers: [{ provide: PORTFOLIO_DATA, useValue: TEST_PORTFOLIO }],
    });
    fixture = TestBed.createComponent(Projects);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows all projects with "All" pressed by default', () => {
    expect(cardTitles()).toHaveLength(4);
    expect(filterButton('All').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton('AI').getAttribute('aria-pressed')).toBe('false');
  });

  it('filters the cards and updates aria-pressed when a tag is clicked', async () => {
    filterButton('Hardware').click();
    await fixture.whenStable();

    expect(cardTitles()).toEqual(['Project robot']);
    expect(filterButton('Hardware').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton('All').getAttribute('aria-pressed')).toBe('false');
  });

  it('announces the result in a polite live region', async () => {
    const live = el.querySelector('[aria-live="polite"]');
    expect(live?.textContent?.trim()).toBe('Showing all 4 projects');

    filterButton('Hardware').click();
    await fixture.whenStable();
    expect(live?.textContent?.trim()).toBe('Showing 1 project tagged Hardware');
  });

  it('disables filters that would show no projects', () => {
    expect(filterButton('Mobile').disabled).toBe(true);
    expect(filterButton('AI').disabled).toBe(false);
  });
});
