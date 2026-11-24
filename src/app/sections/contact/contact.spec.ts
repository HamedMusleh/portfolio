import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEST_PORTFOLIO } from '../../../testing/portfolio.fixture';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { stubProperty } from '../../../testing/stub';
import { Contact } from './contact';

describe('Contact', () => {
  let fixture: ComponentFixture<Contact>;
  let el: HTMLElement;

  const copyButton = (): HTMLButtonElement => {
    const button = el.querySelector<HTMLButtonElement>('button.copy');
    if (!button) throw new Error('Missing copy button');
    return button;
  };

  /** Installs a fake (or missing) Clipboard API, then renders the component. */
  async function render(clipboard?: Pick<Clipboard, 'writeText'>): Promise<void> {
    stubProperty(navigator, 'clipboard', clipboard);
    TestBed.configureTestingModule({
      imports: [Contact],
      providers: [{ provide: PORTFOLIO_DATA, useValue: TEST_PORTFOLIO }],
    });
    fixture = TestBed.createComponent(Contact);
    el = fixture.nativeElement;
    await fixture.whenStable();
  }

  it('links to email, GitHub, LinkedIn and the CV', async () => {
    await render();
    const hrefs = [...el.querySelectorAll('a')].map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual([
      'mailto:test@example.com',
      'https://github.com/test',
      'https://www.linkedin.com/in/test',
      'assets/test-cv.pdf',
    ]);
  });

  it('copies the email and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    await render({ writeText });

    copyButton().click();
    await fixture.whenStable();

    expect(writeText).toHaveBeenCalledWith('test@example.com');
    expect(copyButton().textContent).toContain('Copied!');
  });

  it('reports failure when the Clipboard API is unavailable', async () => {
    await render(undefined);

    copyButton().click();
    await fixture.whenStable();

    expect(copyButton().textContent).toContain('Copy failed');
  });
});
