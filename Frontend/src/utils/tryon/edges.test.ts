import { describe, expect, it } from 'vitest';
import { featherAlpha } from './garment';
import { expandTriangle } from './render';

describe('garment edge quality', () => {
  it('softens the cutout edge inward without adding a halo', () => {
    const width = 7, height = 1, data = new Uint8ClampedArray(width * 4);
    [0, 0, 255, 255, 255, 0, 0].forEach((alpha, x) => { data[x * 4 + 3] = alpha; });
    featherAlpha(data, width, height, 1);
    const alpha = Array.from({ length: width }, (_, x) => data[x * 4 + 3]);
    expect(alpha.slice(0, 2)).toEqual([0, 0]);
    expect(alpha.slice(5)).toEqual([0, 0]);
    expect(alpha[2]).toBeLessThan(255);
    expect(alpha[2]).toBeGreaterThan(0);
  });
  it('expands mesh triangles so neighbours overlap', () => {
    const triangle = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }];
    const expanded = expandTriangle(triangle, 1);
    expect(expanded[0].x).toBeLessThan(0);
    expect(expanded[1].x).toBeGreaterThan(10);
    expect(expanded[2].y).toBeGreaterThan(10);
  });
});
