import { describe, expect, it } from 'vitest';
import { createGarmentMesh, deformGarmentMesh } from './mesh';
import { triangleTransform } from './render';
import { garmentPlacement } from './placement';
import type { BodyPoint } from '../../types/tryon';
const points: BodyPoint[] = Array.from({ length: 33 }, () => ({ x: 0, y: 0, visibility: 0 }));
points[11] = { x: 0.65, y: 0.25, visibility: 1 }; points[12] = { x: 0.35, y: 0.25, visibility: 1 };
points[13] = { x: 0.7, y: 0.5, visibility: 1 }; points[14] = { x: 0.3, y: 0.5, visibility: 1 };
points[15] = { x: 0.75, y: 0.75, visibility: 1 }; points[16] = { x: 0.25, y: 0.75, visibility: 1 };
points[23] = { x: 0.6, y: 0.6, visibility: 1 }; points[24] = { x: 0.4, y: 0.6, visibility: 1 };
points[25] = { x: 0.6, y: 0.8, visibility: 1 }; points[26] = { x: 0.4, y: 0.8, visibility: 1 };
points[27] = { x: 0.6, y: 0.98, visibility: 1 }; points[28] = { x: 0.4, y: 0.98, visibility: 1 };
describe('live garment mesh', () => {
  it('maps source triangle vertices exactly to their camera positions', () => {
    const source = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }];
    const target = [{ x: 100, y: 20 }, { x: 130, y: 30 }, { x: 90, y: 60 }];
    const transform = triangleTransform(source, target);
    expect(transform).not.toBeNull();
    const [a, b, c, d, e, f] = transform!;
    source.forEach((point, index) => {
      expect(a * point.x + c * point.y + e).toBeCloseTo(target[index].x);
      expect(b * point.x + d * point.y + f).toBeCloseTo(target[index].y);
    });
    expect(triangleTransform([source[0], source[0], source[0]], target)).toBeNull();
  });
  it('moves sleeve vertices when a wrist moves, without moving the torso center', () => {
    const mesh = createGarmentMesh(400, 500), placement = garmentPlacement(points, 640, 480)!;
    const before = deformGarmentMesh(mesh, placement, points, 640, 480, 'top');
    const changed = points.map(point => ({ ...point })); changed[16] = { x: 0.05, y: 0.25, visibility: 1 };
    const after = deformGarmentMesh(mesh, placement, changed, 640, 480, 'top');
    const cuff = mesh.vertices.findIndex(point => point.x === 0 && point.y === 500);
    const center = mesh.vertices.findIndex(point => point.x === 200 && point.y === 250);
    expect(after[cuff]).not.toEqual(before[cuff]);
    expect(after[center]).toEqual(before[center]);
    expect(after.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))).toBe(true);
  });
  it('positions pants from hips and ankles without shoulder visibility', () => {
    const lower = points.map((point, index) => index < 23 ? { ...point, visibility: 0 } : point);
    const placement = garmentPlacement(lower, 640, 480, 'bottom');
    expect(placement).not.toBeNull(); expect(placement?.estimated).toBe(false);
    expect(placement?.height).toBeGreaterThan(150);
    expect(garmentPlacement([], 640, 480, 'bottom')).toBeNull();
  });
});
