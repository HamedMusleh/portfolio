import { InjectionToken } from '@angular/core';
import { PORTFOLIO } from './portfolio.data';
import { Portfolio } from './portfolio.models';

/**
 * Components inject content through this token instead of importing PORTFOLIO directly.
 * In production it resolves to the real data; in unit tests it can be overridden with
 * small fixtures, so tests don't break every time the content changes.
 */
export const PORTFOLIO_DATA = new InjectionToken<Portfolio>('PORTFOLIO_DATA', {
  providedIn: 'root',
  factory: () => PORTFOLIO,
});
