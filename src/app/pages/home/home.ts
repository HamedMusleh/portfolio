import { ChangeDetectionStrategy, Component } from '@angular/core';
import { About } from '../../sections/about/about';
import { Contact } from '../../sections/contact/contact';
import { Experience } from '../../sections/experience/experience';
import { Hero } from '../../sections/hero/hero';
import { Projects } from '../../sections/projects/projects';
import { Skills } from '../../sections/skills/skills';

/** The single-page home route: just composes the sections in order. */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, About, Projects, Experience, Skills, Contact],
  template: `
    <app-hero />
    <app-about />
    <app-projects />
    <app-experience />
    <app-skills />
    <app-contact />
  `,
})
export class Home {}
