import { TRY_ON } from '../../constants/tryon';
import type { GarmentPlacement } from '../../types/tryon';

// Time-based smoothing keeps behavior consistent when inference speed varies.
// Missing poses are never held on screen. Large jumps start a fresh track.
export function smoothPlacement(previous: GarmentPlacement | null, current: GarmentPlacement | null, elapsed: number): GarmentPlacement | null {
  if (!current || !previous || !Number.isFinite(elapsed) || elapsed <= 0 || elapsed > TRY_ON.smoothingResetGap) return current;
  const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
  if (distance > previous.width * TRY_ON.smoothingResetDistanceRatio) return current;
  const alpha = 1 - Math.exp(-elapsed / TRY_ON.smoothingTime);
  const mix = (from: number, to: number) => from + (to - from) * alpha;
  const angleDelta = Math.atan2(Math.sin(current.angle - previous.angle), Math.cos(current.angle - previous.angle));
  return {
    ...current,
    x: mix(previous.x, current.x), y: mix(previous.y, current.y),
    width: mix(previous.width, current.width), height: mix(previous.height, current.height),
    angle: previous.angle + angleDelta * alpha,
  };
}
