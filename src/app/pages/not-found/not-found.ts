import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagneticDirective } from '../../shared/magnetic.directive';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MagneticDirective],
  styles: `
    :host {
      display: block;
      padding-block: var(--space-section);
    }
    .code {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      color: var(--warn);
    }
    h1 {
      margin-block: var(--space-4) var(--space-6);
      font-size: var(--text-hero);
    }
    p {
      margin-bottom: var(--space-8);
      color: var(--muted);
    }
  `,
  template: `
    <div class="container">
      <p class="code">ERR 404 � ROUTE NOT FOUND</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <a class="btn btn--primary" routerLink="/" appMagnetic>Back to the homepage</a>
    </div>
  `,
})
export class NotFound {}
