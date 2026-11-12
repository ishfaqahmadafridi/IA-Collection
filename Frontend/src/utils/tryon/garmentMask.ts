import { TRY_ON } from '../../constants/tryon';
import type { GarmentExtraction, GarmentKind } from '../../types/tryon';

// Keep only the selected garment region on model-worn product photos.
// Skin/face and background pixels must never enter the garment mesh.
export function maskCatalogGarment(pixels: Uint8ClampedArray, width: number, height: number, extraction: GarmentExtraction, kind: GarmentKind): boolean {
  const { mask, points } = extraction;
  const person = points.length > 0 || mask.data.some(category => category === 2 || category === 3);
  if (!person) return false; // Flat garment photo: use edge-connected background removal.
  const hips = [points[23], points[24]].filter(point => point && (point.visibility ?? 0) >= TRY_ON.confidence);
  if (!hips.length) throw new Error('A garment-only photo is needed: the model clothing cannot be separated safely.');
  const hipY = hips.reduce((sum, point) => sum + point.y, 0) / hips.length;
  let kept = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const maskX = Math.min(mask.width - 1, Math.floor(x / width * mask.width));
    const maskY = Math.min(mask.height - 1, Math.floor(y / height * mask.height));
    const inRegion = kind === 'top' ? (y + 0.5) / height < hipY : (y + 0.5) / height >= hipY;
    const index = (y * width + x) * 4 + 3;
    if (mask.data[maskY * mask.width + maskX] !== TRY_ON.clothingCategory || !inRegion) pixels[index] = 0;
    else if (pixels[index] > 0) kept++;
  }
  if (!kept) throw new Error('No isolated garment was found in this product photo.');
  return true;
}
