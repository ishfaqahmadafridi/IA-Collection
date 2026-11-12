import { TRY_ON } from '../../constants/tryon';
import type { GarmentMesh, MeshPoint } from '../../types/tryon';
// Push each corner away from the centroid so neighbouring triangles overlap.
export function expandTriangle(points: MeshPoint[], amount: number): MeshPoint[] {
  const cx = (points[0].x + points[1].x + points[2].x) / 3, cy = (points[0].y + points[1].y + points[2].y) / 3;
  return points.map(point => {
    const dx = point.x - cx, dy = point.y - cy, length = Math.hypot(dx, dy);
    return length ? { x: point.x + dx / length * amount, y: point.y + dy / length * amount } : point;
  });
}
export function triangleTransform(source: MeshPoint[], target: MeshPoint[]): [number, number, number, number, number, number] | null {
  const sx1 = source[1].x - source[0].x, sy1 = source[1].y - source[0].y, sx2 = source[2].x - source[0].x, sy2 = source[2].y - source[0].y;
  const determinant = sx1 * sy2 - sx2 * sy1;
  if (Math.abs(determinant) < 0.001) return null;
  const tx1 = target[1].x - target[0].x, ty1 = target[1].y - target[0].y, tx2 = target[2].x - target[0].x, ty2 = target[2].y - target[0].y;
  const a = (tx1 * sy2 - tx2 * sy1) / determinant, c = (tx2 * sx1 - tx1 * sx2) / determinant;
  const b = (ty1 * sy2 - ty2 * sy1) / determinant, d = (ty2 * sx1 - ty1 * sx2) / determinant;
  return [a, b, c, d, target[0].x - a * source[0].x - c * source[0].y, target[0].y - b * source[0].x - d * source[0].y];
}
export function drawGarmentMesh(context: CanvasRenderingContext2D, image: HTMLCanvasElement, mesh: GarmentMesh, targets: MeshPoint[]): void {
  for (const triangle of mesh.triangles) {
    const source = triangle.map(index => mesh.vertices[index]), target = triangle.map(index => targets[index]);
    const transform = triangleTransform(source, target);
    if (!transform || transform.some(value => !Number.isFinite(value))) continue;
    context.save();
    const clip = expandTriangle(target, TRY_ON.seamOverlap);
    context.beginPath(); context.moveTo(clip[0].x, clip[0].y); context.lineTo(clip[1].x, clip[1].y); context.lineTo(clip[2].x, clip[2].y); context.closePath(); context.clip();
    context.transform(...transform); context.drawImage(image, 0, 0); context.restore();
  }
}
