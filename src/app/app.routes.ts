import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'Hamed Musleh · AI-Native Full-Stack Engineer' },
  {
    path: '**',
    // Lazy-loaded: almost no visitor needs it, so it stays out of the main bundle.
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Page not found · Hamed Musleh',
  },
];
