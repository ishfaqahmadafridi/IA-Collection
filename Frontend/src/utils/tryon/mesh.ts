import { GARMENT_MESH, TRY_ON } from '../../constants/tryon';
import type { BodyPoint, GarmentKind, GarmentMesh, GarmentPlacement, MeshPoint } from '../../types/tryon';
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const valid = (point: BodyPoint | undefined): point is BodyPoint => !!point && Number.isFinite(point.x) && Number.isFinite(point.y) && (point.visibility ?? 0) >= TRY_ON.confidence;
export function createGarmentMesh(width: number, height: number): GarmentMesh {
  const vertices: MeshPoint[] = [], triangles: [number, number, number][] = [];
  // Each triangle owns its vertices. Torso and sleeve/leg pieces can then
  // articulate independently without dragging torso fabric towards a wrist.
  for (let row = 0; row < GARMENT_MESH.rows; row++) for (let column = 0; column < GARMENT_MESH.columns; column++) {
    const a = { x: column / GARMENT_MESH.columns * width, y: row / GARMENT_MESH.rows * height };
    const b = { x: (column + 1) / GARMENT_MESH.columns * width, y: a.y };
    const c = { x: a.x, y: (row + 1) / GARMENT_MESH.rows * height };
    const d = { x: b.x, y: c.y };
    const start = vertices.length;
    vertices.push(a, b, c, b, d, c);
    triangles.push([start, start + 1, start + 2], [start + 3, start + 4, start + 5]);
  }
  return { vertices, triangles, width, height };
}
function followBone(point: MeshPoint, source: MeshPoint[], target: MeshPoint[], thicknessScale: number): MeshPoint {
  let nearest = { distance: Infinity, result: target[0] };
  for (let index = 0; index < 2; index++) {
    const a = source[index], b = source[index + 1], ta = target[index], tb = target[index + 1];
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
    if (!length) continue;
    const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / (length * length));
    const px = a.x + dx * t, py = a.y + dy * t, distance = Math.hypot(point.x - px, point.y - py);
    const targetDx = tb.x - ta.x, targetDy = tb.y - ta.y, targetLength = Math.hypot(targetDx, targetDy);
    if (!targetLength || distance >= nearest.distance) continue;
    const offset = ((point.x - px) * -dy + (point.y - py) * dx) / length * thicknessScale;
    nearest = { distance, result: { x: ta.x + targetDx * t - targetDy / targetLength * offset, y: ta.y + targetDy * t + targetDx / targetLength * offset } };
  }
  return nearest.result;
}
export function deformGarmentMesh(mesh: GarmentMesh, placement: GarmentPlacement, points: BodyPoint[], frameWidth: number, frameHeight: number, kind: GarmentKind): MeshPoint[] {
  const cos = Math.cos(placement.angle), sin = Math.sin(placement.angle);
  const base = (x: number, y: number): MeshPoint => {
    const dx = (x - 0.5) * placement.width, dy = (y - (kind === 'top' ? TRY_ON.collarOffsetRatio : 0)) * placement.height;
    return { x: placement.x + dx * cos - dy * sin, y: placement.y + dx * sin + dy * cos };
  };
  const leftIndices = kind === 'top' ? [12, 14, 16] : [24, 26, 28];
  const rightIndices = kind === 'top' ? [11, 13, 15] : [23, 25, 27];
  const referenceA = points[leftIndices[0]], referenceB = points[rightIndices[0]];
  const rawWidth = valid(referenceA) && valid(referenceB) ? Math.hypot((referenceB.x - referenceA.x) * frameWidth, (referenceB.y - referenceA.y) * frameHeight) : 0;
  const referenceRatio = kind === 'top' ? TRY_ON.shoulderWidthRatio : TRY_ON.hipWidthRatio;
  const widthScale = rawWidth ? placement.width / referenceRatio / rawWidth : 1;
  const origin = valid(referenceA) && valid(referenceB) ? { x: (referenceA.x + referenceB.x) * frameWidth / 2, y: (referenceA.y + referenceB.y) * frameHeight / 2 } : placement;
  const bone = (indices: number[]) => indices.every(index => valid(points[index])) ? indices.map(index => ({ x: placement.x + (points[index].x * frameWidth - origin.x) * widthScale, y: placement.y + (kind === 'bottom' ? placement.height * TRY_ON.waistbandOffsetRatio : 0) + (points[index].y * frameHeight - origin.y) * widthScale })) : null;
  const left = bone(leftIndices), right = bone(rightIndices);
  const sourceLeft = (kind === 'top' ? GARMENT_MESH.topLeft : GARMENT_MESH.bottomLeft).map(point => ({ x: point.x * mesh.width, y: point.y * mesh.height }));
  const sourceRight = (kind === 'top' ? GARMENT_MESH.topRight : GARMENT_MESH.bottomRight).map(point => ({ x: point.x * mesh.width, y: point.y * mesh.height }));
  return mesh.vertices.map((point, index) => {
    const triangle = mesh.triangles[Math.floor(index / 3)].map(vertex => mesh.vertices[vertex]);
    const u = triangle.reduce((sum, vertex) => sum + vertex.x, 0) / 3 / mesh.width;
    const v = triangle.reduce((sum, vertex) => sum + vertex.y, 0) / 3 / mesh.height;
    const original = base(point.x / mesh.width, point.y / mesh.height);
    const shoulderExtra = GARMENT_MESH.shoulderBlendExtra * clamp((0.4 - v) / 0.25);
    const side = kind === 'top'
      ? u < GARMENT_MESH.torsoLeft + shoulderExtra ? 'left' : u > GARMENT_MESH.torsoRight - shoulderExtra ? 'right' : null
      : v > GARMENT_MESH.legStart ? u < 0.5 ? 'left' : 'right' : null;
    const target = side === 'left' ? left : side === 'right' ? right : null;
    if (!target) return original;
    return followBone(point, side === 'left' ? sourceLeft : sourceRight, target, placement.width / mesh.width);
  });
}
