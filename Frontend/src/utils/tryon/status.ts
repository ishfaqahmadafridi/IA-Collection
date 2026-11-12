import type { GarmentKind, GarmentPlacement } from '../../types/tryon';
export function trackingStatus(kind: GarmentKind, manual: boolean, placement: GarmentPlacement | null): string {
  const garment = kind === 'top' ? 'shirt' : 'pants';
  if (manual) return `Manual preview. Align yourself with the ${garment}; automatic tracking is off.`;
  if (!placement) return kind === 'top' ? 'Face the camera with both shoulders visible, or enable manual placement below.' : 'Keep your hips and legs visible, or enable manual placement below.';
  if (placement.estimated) return kind === 'top' ? 'Tracking your shoulders. Shirt length is estimated; adjust size and position below.' : 'Tracking your hips. Leg length is estimated; adjust size and position below.';
  return 'Tracking your body. Adjust size and position if needed.';
}
