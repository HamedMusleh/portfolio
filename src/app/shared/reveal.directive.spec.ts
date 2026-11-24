import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mockMedia, stubRect } from '../../testing/media';
import { RevealDirective } from './reveal.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <div id="single" appReveal></div>
    <ul id="list" appReveal="stagger">
      <li>a</li>
      <li>b</li>
    </ul>
  `,
})
class Host {}

/** Minimal IntersectionObserver fake that lets a test "scroll" elements into view. */
class FakeObserver {
  static instances: FakeObserver[] = [];
  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeObserver.instances.push(this);
  }
  observe = vi.fn();
  disconnect = vi.fn();
  enter(): void {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('RevealDirective', () => {
  beforeEach(() => {
    FakeObserver.instances = [];
    (window as unknown as Record<string, unknown>)['IntersectionObserver'] = FakeObserver;
  });

  /** Renders the host with both elements placed below the fold (or not). */
  async function render(belowFold: boolean): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Host);
    const el: HTMLElement = fixture.nativeElement;
    const top = belowFold ? window.innerHeight + 500 : 10;
    stubRect(el.querySelector('#single')!, { top });
    stubRect(el.querySelector('#list')!, { top });
    await fixture.whenStable();
    return el;
  }

  it('hides below-the-fold elements, then reveals them when they enter the viewport', async () => {
    mockMedia();
    const el = await render(true);
    const single = el.querySelector('#single')!;

    expect(single.classList).toContain('reveal');
    expect(single.classList).not.toContain('is-visible');

    FakeObserver.instances.forEach((observer) => observer.enter());
    expect(single.classList).toContain('is-visible');
  });

  it('gives each child a stagger index in stagger mode', async () => {
    mockMedia();
    const list = (await render(true)).querySelector('#list')!;

    expect(list.classList).toContain('reveal-stagger');
    const indices = Array.from(list.children).map((li) =>
      (li as HTMLElement).style.getPropertyValue('--reveal-i'),
    );
    expect(indices).toEqual(['0', '1']);
  });

  it('leaves elements that are already on screen alone (no flash)', async () => {
    mockMedia();
    const el = await render(false);
    expect(el.querySelector('#single')!.classList).not.toContain('reveal');
  });

  it('does nothing when the user prefers reduced motion', async () => {
    mockMedia({ reducedMotion: true });
    const el = await render(true);
    expect(el.querySelector('#single')!.classList).not.toContain('reveal');
  });
});
