import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Makes routerLink fragments (#projects, #contact…) scroll to the section,
      // and restores scroll position on back/forward.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Reuses the prerendered HTML. Event replay captures clicks made before
    // the JS finished loading and replays them once the app is ready.
    provideClientHydration(withEventReplay()),
  ],
};
