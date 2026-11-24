import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: `
    :host {
      display: block;
      padding-block: var(--space-section);
    }
    .code {
      font-family: var(--font-mono);
      color: var(--color-accent);
    }
    h1 {
      margin-block: var(--space-2) var(--space-4);
      font-size: var(--text-hero);
    }
    p {
      margin-bottom: var(--space-8);
      color: var(--color-text-muted);
    }
  `,
  template: `
    <div class="container">
      <p class="code">404</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <a class="btn btn--primary" routerLink="/">Back to the homepage</a>
    </div>
  `,
})
export class NotFound {}
