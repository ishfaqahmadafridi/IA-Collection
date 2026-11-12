import { describe, expect, it } from 'vitest';
import { maskCatalogGarment } from './garmentMask';
import type { BodyPoint, GarmentExtraction } from '../../types/tryon';

const points: BodyPoint[] = [];
points[23] = { x: 0.3, y: 0.65, visibility: 1 };
points[24] = { x: 0.7, y: 0.65, visibility: 1 };
const extraction: GarmentExtraction = { points, mask: { width: 3, height: 3, data: new Uint8Array([0, 3, 1, 3, 4, 3, 4, 4, 0]) } };
const pixels = () => new Uint8ClampedArray(3 * 3 * 4).fill(255);
describe('catalog garment isolation', () => {
  it('removes the model face, arms, background and pants from a shirt reference', () => {
    const data = pixels();
    expect(maskCatalogGarment(data, 3, 3, extraction, 'top')).toBe(true);
    expect(Array.from({ length: 9 }, (_, i) => data[i * 4 + 3])).toEqual([0, 0, 0, 0, 255, 0, 0, 0, 0]);
    expect(Array.from(data.slice(16, 19))).toEqual([255, 255, 255]);
  });
  it('retains only the lower clothing region for pants', () => {
    const data = pixels();
    maskCatalogGarment(data, 3, 3, extraction, 'bottom');
    expect(Array.from({ length: 9 }, (_, i) => data[i * 4 + 3])).toEqual([0, 0, 0, 0, 0, 0, 255, 255, 0]);
  });
  it('rejects an unsafe model photo without a usable clothing boundary', () => {
    expect(() => maskCatalogGarment(pixels(), 3, 3, { ...extraction, points: [] }, 'top')).toThrow('garment-only');
  });
  it('uses the flat-lay background path when no person is detected', () => {
    const data = pixels();
    expect(maskCatalogGarment(data, 3, 3, { points: [], mask: { width: 1, height: 1, data: new Uint8Array([0]) } }, 'top')).toBe(false);
    expect(data.every(value => value === 255)).toBe(true);
  });
});
