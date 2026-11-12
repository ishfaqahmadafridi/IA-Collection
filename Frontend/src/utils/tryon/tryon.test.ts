import { describe, expect, it } from 'vitest';
import { removeBackground } from './garment';
import { garmentPlacement, manualPlacement } from './placement';
import type { BodyPoint } from '../../types/tryon';
describe('try-on placement', () => {
  const points: BodyPoint[] = Array.from({ length: 33 }, () => ({ x: 0, y: 0, visibility: 1 }));
  points[11] = { x: 0.65, y: 0.3, visibility: 1 };
  points[12] = { x: 0.35, y: 0.3, visibility: 1 };
  points[23] = { x: 0.6, y: 0.8, visibility: 1 };
  points[24] = { x: 0.4, y: 0.8, visibility: 1 };
  it('aligns garment to shoulder center and scales with body distance', () => {
    const placement = garmentPlacement(points, 640, 480);
    expect(placement?.x).toBe(320);
    expect(placement?.y).toBe(144);
    expect(placement?.angle).toBe(0);
    expect(placement?.width).toBeCloseTo(364.8);
  });
  it('shows the shirt from shoulders when hips are missing, outside the frame, or occluded', () => {
    for (const hip of [undefined, { x: 0.5, y: 1.2, visibility: 1 }, { x: 0.5, y: 0.8, visibility: 0.1 }]) {
      const cropped = points.slice(0, 13);
      if (hip) { cropped[23] = hip; cropped[24] = hip; }
      const placement = garmentPlacement(cropped, 640, 480);
      expect(placement?.estimated).toBe(true);
      expect(placement?.height).toBeCloseTo(345.6);
    }
  });
  it('accepts moderate shoulder confidence while rejecting unreliable shoulders', () => {
    expect(garmentPlacement(points.map(point => ({ ...point, visibility: 0.55 })), 640, 480)).not.toBeNull();
    expect(garmentPlacement(points.map(point => ({ ...point, visibility: 0.2 })), 640, 480)).toBeNull();
  });
  it('offers an explicitly manual position without inventing tracked landmarks', () => {
    const placement = manualPlacement(640, 480);
    expect(placement.x).toBe(320);
    expect(placement.width).toBeCloseTo(448);
    expect(placement.estimated).toBe(true);
  });
  it('rejects off-screen and invalid landmarks', () => {
    expect(garmentPlacement(points.map(point => ({ ...point, x: 1.2 })), 640, 480)).toBeNull();
    expect(garmentPlacement(points.map(point => ({ ...point, y: NaN })), 640, 480)).toBeNull();
    expect(garmentPlacement(points.map(point => ({ ...point, visibility: NaN })), 640, 480)).toBeNull();
    expect(garmentPlacement(points, 0, 480)).toBeNull();
  });
  it('removes the overlay for missing or low-confidence bodies', () => {
    expect(garmentPlacement([], 640, 480)).toBeNull();
    expect(garmentPlacement(points.map(point => ({ ...point, visibility: 0.2 })), 640, 480)).toBeNull();
  });
});
describe('garment background removal', () => {
  it('retains pale garment color close to a pale background', () => {
    const data = new Uint8ClampedArray(3 * 3 * 4);
    for (let pixel = 0; pixel < 9; pixel++) data.set([245, 244, 250, 255], pixel * 4);
    const cream = [238, 235, 220, 255];
    data.set(cream, 4 * 4);
    removeBackground(data, 3, 3);
    expect(Array.from(data.slice(16, 20))).toEqual(cream);
    expect(data[3]).toBe(0);
  });
  it('preserves an existing transparent cutout with a black garment', () => {
    const data = new Uint8ClampedArray(3 * 3 * 4);
    data.set([0, 0, 0, 255], (1 * 3 + 1) * 4);
    removeBackground(data, 3, 3);
    expect(data[(1 * 3 + 1) * 4 + 3]).toBe(255);
  });
  it('removes edge-connected background while retaining enclosed matching pixels', () => {
    const data = new Uint8ClampedArray(5 * 5 * 4).fill(255);
    for (let y = 1; y < 4; y++) for (let x = 1; x < 4; x++) {
      if (x === 2 && y === 2) continue;
      data.set([0, 0, 0, 255], (y * 5 + x) * 4);
    }
    removeBackground(data, 5, 5);
    expect(data[3]).toBe(0);
    expect(data[(2 * 5 + 2) * 4 + 3]).toBe(255);
    expect(data[(1 * 5 + 1) * 4 + 3]).toBe(255);
  });
});
