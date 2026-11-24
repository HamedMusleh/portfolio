import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  async function render(): Promise<HTMLElement> {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  it('renders the skip link first, then header, main and footer', async () => {
    const el = await render();

    expect(el.firstElementChild?.classList).toContain('skip-link');
    expect(el.querySelector('app-header')).not.toBeNull();
    expect(el.querySelector('main#main')).not.toBeNull();
    expect(el.querySelector('app-footer')).not.toBeNull();
  });

  it('moves focus to <main> when the skip link is activated', async () => {
    const el = await render();

    el.querySelector<HTMLAnchorElement>('.skip-link')?.click();

    expect(document.activeElement).toBe(el.querySelector('main'));
  });
});
