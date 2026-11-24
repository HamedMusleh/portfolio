import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PORTFOLIO_DATA } from '../../data/portfolio.token';
import { Icon } from '../../shared/icon';
import { SectionHeading } from '../../shared/section-heading';

type CopyState = 'idle' | 'copied' | 'failed';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeading, Icon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly clipboard = inject(DOCUMENT).defaultView?.navigator.clipboard;
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly profile = inject(PORTFOLIO_DATA).profile;
  protected readonly copyState = signal<CopyState>('idle');
  protected readonly copyLabel = computed(() => {
    switch (this.copyState()) {
      case 'copied':
        return 'Copied!';
      case 'failed':
        return 'Copy failed';
      default:
        return 'Copy email';
    }
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copyEmail(): Promise<void> {
    try {
      if (!this.clipboard) throw new Error('Clipboard API unavailable');
      await this.clipboard.writeText(this.profile.email);
      this.copyState.set('copied');
    } catch {
      this.copyState.set('failed');
    }
    // Return the button label to normal after a moment.
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copyState.set('idle'), 2000);
  }
}
