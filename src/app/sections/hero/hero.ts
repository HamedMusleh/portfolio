import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Icon } from '../../shared/icon';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { SpotlightDirective } from '../../shared/spotlight.directive';

/** Decorative instrument-style details. Not CV content, so they live here, not in the data file. */
const STATUS_TEXT = 'Available for work';
/** Ramallah. Update together with `profile.location` if that ever changes. */
const COORDINATES = '31.90°N 35.20°E';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, MagneticDirective, SpotlightDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly data = inject(PORTFOLIO_DATA);
  protected readonly profile = this.data.profile;
  protected readonly status = STATUS_TEXT;
  protected readonly coordinates = COORDINATES;

  /** The most recent experience entry, shown in the readout panel. */
  protected readonly latestRole = this.data.timeline.find((entry) => entry.kind === 'experience');

  /**
   * The name split into words → letters, each with a running index used to
   * stagger the letter-by-letter reveal (CSS reads it as `--i`).
   */
  protected readonly nameWords = splitIntoLetters(this.profile.name);
}

export interface Letter {
  readonly char: string;
  readonly index: number;
}

export function splitIntoLetters(text: string): Letter[][] {
  let index = 0;
  return text
    .split(' ')
    .filter(Boolean)
    .map((word) => [...word].map((char) => ({ char, index: index++ })));
}
