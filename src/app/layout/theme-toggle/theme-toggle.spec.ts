import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../../core/theme.service';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  beforeEach(() => localStorage.clear());

  it('labels the button with the action it performs and toggles the theme', async () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    await fixture.whenStable();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const service = TestBed.inject(ThemeService);
    const before = service.theme();

    expect(button.getAttribute('aria-label')).toBe(
      before === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    );

    button.click();
    await fixture.whenStable();

    expect(service.theme()).not.toBe(before);
    expect(button.getAttribute('aria-label')).toBe(
      before === 'dark' ? 'Switch to dark theme' : 'Switch to light theme',
    );
  });
});
