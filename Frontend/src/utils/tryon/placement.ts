import { TRY_ON } from '../../constants/tryon';
import type { BodyPoint, GarmentKind, GarmentPlacement } from '../../types/tryon';
function visible(point: BodyPoint | undefined): point is BodyPoint {
  return !!point && Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.visibility)
    && point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1 && (point.visibility ?? 0) >= TRY_ON.confidence;
}
export function garmentPlacement(points: BodyPoint[], width: number, height: number, kind: GarmentKind = 'top'): GarmentPlacement | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
  if (kind === 'bottom') {
    const left = points[23], right = points[24], leftAnkle = points[27], rightAnkle = points[28];
    if (!visible(left) || !visible(right)) return null;
    const hipWidth = Math.hypot((left.x - right.x) * width, (left.y - right.y) * height);
    if (hipWidth < TRY_ON.minShoulderPixels) return null;
    const hipY = (left.y + right.y) * height / 2;
    const ankleY = visible(leftAnkle) && visible(rightAnkle) ? (leftAnkle.y + rightAnkle.y) * height / 2 : null;
    const estimated = ankleY === null || ankleY <= hipY;
    const garmentHeight = estimated ? hipWidth * TRY_ON.estimatedLegHeightRatio : (ankleY - hipY) * TRY_ON.bottomHeightRatio;
    return { x: (left.x + right.x) * width / 2, y: hipY - garmentHeight * TRY_ON.waistbandOffsetRatio, width: hipWidth * TRY_ON.hipWidthRatio,
      height: garmentHeight, angle: Math.atan2((left.y - right.y) * height, (left.x - right.x) * width), estimated };
  }
  const left = points[11], right = points[12], leftHip = points[23], rightHip = points[24];
  if (!visible(left) || !visible(right)) return null;
  const shoulderWidth = Math.hypot((right.x - left.x) * width, (right.y - left.y) * height);
  if (shoulderWidth < TRY_ON.minShoulderPixels) return null;
  const x = (left.x + right.x) * width / 2;
  const y = (left.y + right.y) * height / 2;
  const hipY = visible(leftHip) && visible(rightHip) ? (leftHip.y + rightHip.y) * height / 2 : null;
  const estimated = hipY === null || hipY <= y;
  const garmentHeight = estimated ? shoulderWidth * TRY_ON.estimatedHeightRatio : (hipY - y) * TRY_ON.torsoHeightRatio;
  const angle = Math.atan2((left.y - right.y) * height, (left.x - right.x) * width);
  return { x, y, width: shoulderWidth * TRY_ON.shoulderWidthRatio, height: garmentHeight, angle, estimated };
}
export function manualPlacement(width: number, height: number, kind: GarmentKind = 'top'): GarmentPlacement {
  if (kind === 'bottom') return { x: width / 2, y: height * TRY_ON.manualHipY, width: width * TRY_ON.manualBottomWidthRatio, height: height * TRY_ON.manualBottomHeightRatio, angle: 0, estimated: true };
  const garmentWidth = width * TRY_ON.manualWidthRatio;
  return { x: width / 2, y: height * TRY_ON.manualShoulderY, width: garmentWidth,
    height: garmentWidth * TRY_ON.estimatedHeightRatio / TRY_ON.shoulderWidthRatio, angle: 0, estimated: true };
}
