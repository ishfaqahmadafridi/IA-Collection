import { describe, expect, it } from 'vitest';
import { smoothPlacement } from './smoothing';
import type { GarmentPlacement } from '../../types/tryon';
const start: GarmentPlacement = { x: 320, y: 150, width: 300, height: 400, angle: 0, estimated: false };
describe('garment tracking smoothing', () => {
  it('dampens small position and size changes', () => {
    const result = smoothPlacement(start, { ...start, x: 330, width: 320 }, 100);
    expect(result?.x).toBeGreaterThan(320); expect(result?.x).toBeLessThan(330);
    expect(result?.width).toBeGreaterThan(300); expect(result?.width).toBeLessThan(320);
  });
  it('does not leave a ghost garment when the body disappears', () => {
    expect(smoothPlacement(start, null, 100)).toBeNull();
    expect(smoothPlacement(null, start, 100)).toBe(start);
  });
  it('resets after a long gap or large position jump', () => {
    const moved = { ...start, x: 325 };
    expect(smoothPlacement(start, moved, 1000)).toBe(moved);
    const differentTrack = { ...start, x: 600 };
    expect(smoothPlacement(start, differentTrack, 100)).toBe(differentTrack);
  });
  it('takes the short rotation path across the angle boundary', () => {
    const result = smoothPlacement({ ...start, angle: Math.PI - 0.01 }, { ...start, angle: -Math.PI + 0.01 }, 100);
    expect(Math.abs((result?.angle ?? 0) - Math.PI)).toBeLessThan(0.02);
  });
  it('has consistent results across different frame intervals', () => {
    const target = { ...start, x: 340 };
    const once = smoothPlacement(start, target, 100);
    const twice = smoothPlacement(smoothPlacement(start, target, 50), target, 50);
    expect(twice?.x).toBeCloseTo(once?.x ?? 0);
  });
});
