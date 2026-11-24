import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { ScrollProgress } from './layout/scroll-progress/scroll-progress';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, ScrollProgress],
  styleUrl: './app.scss',
  template: `
    <!-- First focusable element: lets keyboard users jump past the navigation. -->
    <a class="skip-link" href="#main" (click)="skipToMain($event)">Skip to main content</a>
    <app-scroll-progress />
    <app-header />
    <main id="main" tabindex="-1" #main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /**
   * With <base href="/portfolio/">, a plain href="#main" resolves against the base,
   * which can trigger a navigation. Moving focus directly is reliable everywhere.
   */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
