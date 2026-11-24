import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mockAnimationFrame, mockMedia, pointer, stubRect } from '../../testing/media';
import { MagneticDirective } from './magnetic.directive';
import { SpotlightDirective } from './spotlight.directive';
import { TiltDirective } from './tilt.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpotlightDirective, TiltDirective, MagneticDirective],
  template: `
    <div id="spot" appSpotlight></div>
    <div id="tilt" appTilt></div>
    <div id="magnet" appMagnetic></div>
  `,
})
class Host {}

/** Renders the host and gives each test element a 200×100 box at (100, 100). */
async function render(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const el: HTMLElement = fixture.nativeElement;
  for (const child of Array.from(el.children)) {
    stubRect(child, { left: 100, top: 100, width: 200, height: 100 });
  }
  return el;
}

const get = (el: HTMLElement, id: string) => el.querySelector<HTMLElement>(`#${id}`)!;

describe('pointer directives', () => {
  beforeEach(() => mockAnimationFrame());

  describe('on a mouse/trackpad device', () => {
    beforeEach(() => mockMedia({ finePointer: true }));

    it('SpotlightDirective publishes the cursor position and an active class', async () => {
      const spot = get(await render(), 'spot');

      spot.dispatchEvent(pointer('pointermove', 150, 130));
      expect(spot.style.getPropertyValue('--mx')).toBe('50px');
      expect(spot.style.getPropertyValue('--my')).toBe('30px');
      expect(spot.classList).toContain('spotlight-active');

      spot.dispatchEvent(pointer('pointerleave'));
      expect(spot.classList).not.toContain('spotlight-active');
    });

    it('TiltDirective tilts at most 4deg at the corners and resets on leave', async () => {
      const tilt = get(await render(), 'tilt');

      tilt.dispatchEvent(pointer('pointermove', 300, 200)); // bottom-right corner
      // The browser normalises -4.00deg to -4deg when it stores the style.
      expect(tilt.style.transform).toContain('rotateX(-4deg)');
      expect(tilt.style.transform).toContain('rotateY(4deg)');

      tilt.dispatchEvent(pointer('pointerleave'));
      expect(tilt.style.transform).toBe('');
    });

    it('MagneticDirective pulls toward the cursor, capped at 8px', async () => {
      const magnet = get(await render(), 'magnet');

      magnet.dispatchEvent(pointer('pointermove', 210, 160)); // 10px right, 10px down of centre
      expect(magnet.style.transform).toBe('translate(3px, 3px)');

      magnet.dispatchEvent(pointer('pointermove', 300, 200)); // far corner
      expect(magnet.style.transform).toBe('translate(8px, 8px)');

      magnet.dispatchEvent(pointer('pointerleave'));
      expect(magnet.style.transform).toBe('');
    });
  });

  it('does nothing on touch devices', async () => {
    mockMedia({ finePointer: false });
    const el = await render();

    for (const id of ['spot', 'tilt', 'magnet'])
      get(el, id).dispatchEvent(pointer('pointermove', 300, 200));

    expect(get(el, 'spot').style.getPropertyValue('--mx')).toBe('');
    expect(get(el, 'tilt').style.transform).toBe('');
    expect(get(el, 'magnet').style.transform).toBe('');
  });

  it('does nothing when the user prefers reduced motion', async () => {
    mockMedia({ finePointer: true, reducedMotion: true });
    const el = await render();

    get(el, 'tilt').dispatchEvent(pointer('pointermove', 300, 200));
    expect(get(el, 'tilt').style.transform).toBe('');
  });
});
