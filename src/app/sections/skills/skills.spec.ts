import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Skills } from './skills';

describe('Skills', () => {
  let fixture: ComponentFixture<Skills>;
  let el: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Skills],
      providers: [{ provide: PORTFOLIO_DATA, useValue: TEST_PORTFOLIO }],
    });
    fixture = TestBed.createComponent(Skills);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders each group as a term with its skills', () => {
    expect(el.querySelector('dt')?.textContent).toContain('Testing');
    expect(el.querySelector('dd li')?.textContent).toContain('Vitest');
  });

  it('hides the decorative marquee from assistive technology', () => {
    expect(el.querySelector('.marquee')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('lets users pause and resume the marquee', async () => {
    const button = el.querySelector<HTMLButtonElement>('.marquee-toggle')!;
    const marquee = el.querySelector('.marquee')!;

    expect(button.getAttribute('aria-pressed')).toBe('false');
    button.click();
    await fixture.whenStable();

    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.textContent).toContain('Play');
    expect(marquee.classList).toContain('paused');
  });
});
