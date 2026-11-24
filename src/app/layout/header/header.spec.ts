import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let el: HTMLElement;

  const query = <T extends Element>(selector: string): T => {
    const found = el.querySelector<T>(selector);
    if (!found) throw new Error(`Missing ${selector}`);
    return found;
  };
  const menuButton = () => query<HTMLButtonElement>('.menu-button');

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), { provide: PORTFOLIO_DATA, useValue: TEST_PORTFOLIO }],
    });
    fixture = TestBed.createComponent(Header);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders a link for every section', () => {
    const labels = [...el.querySelectorAll('#primary-nav a')].map((a) => a.textContent?.trim());
    expect(labels).toEqual(['About', 'Projects', 'Experience', 'Skills', 'Contact']);
  });

  it('toggles the mobile menu and exposes its state via aria-expanded', async () => {
    expect(menuButton().getAttribute('aria-expanded')).toBe('false');

    menuButton().click();
    await fixture.whenStable();

    expect(menuButton().getAttribute('aria-expanded')).toBe('true');
    expect(query('#primary-nav').classList).toContain('open');
  });

  it('closes the menu on Escape', async () => {
    menuButton().click();
    await fixture.whenStable();

    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(menuButton().getAttribute('aria-expanded')).toBe('false');
  });
});
