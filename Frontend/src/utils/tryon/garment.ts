import { TRY_ON } from '../../constants/tryon';
import { extractGarment } from '../../services/garmentExtraction';
import { maskCatalogGarment } from './garmentMask';
import type { GarmentKind } from '../../types/tryon';
// Remove only background pixels connected to an image edge, preserving enclosed garment details.
export function removeBackground(data: Uint8ClampedArray, width: number, height: number): void {
  const corners = [0, width - 1, (height - 1) * width, width * height - 1];
  // Existing cutouts already have a background mask; preserve their garment pixels.
  if (corners.every(pixel => data[pixel * 4 + 3] === 0)) return;
  const background = [0, 1, 2].map(channel => corners.reduce((sum, pixel) => sum + data[pixel * 4 + channel], 0) / corners.length);
  const seen = new Uint8Array(width * height);
  const queue: number[] = [];
  for (let x = 0; x < width; x++) queue.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) queue.push(y * width, y * width + width - 1);
  for (let index = 0; index < queue.length; index++) {
    const pixel = queue[index];
    if (seen[pixel]) continue;
    seen[pixel] = 1;
    const offset = pixel * 4;
    if (Math.hypot(...background.map((value, channel) => data[offset + channel] - value)) > TRY_ON.backgroundTolerance) continue;
    data[offset + 3] = 0;
    const x = pixel % width, y = Math.floor(pixel / width);
    if (x > 0) queue.push(pixel - 1);
    if (x < width - 1) queue.push(pixel + 1);
    if (y > 0) queue.push(pixel - width);
    if (y < height - 1) queue.push(pixel + width);
  }
}
// Soften the cutout edge inward only (min of original and blurred alpha), so
// removed skin/background pixels never bleed back in as a halo.
export function featherAlpha(data: Uint8ClampedArray, width: number, height: number, radius: number): void {
  if (radius < 1) return;
  const alpha = new Float32Array(width * height), temp = new Float32Array(width * height);
  for (let pixel = 0; pixel < alpha.length; pixel++) alpha[pixel] = data[pixel * 4 + 3];
  const size = radius * 2 + 1;
  const blur = (source: Float32Array, target: Float32Array, horizontal: boolean) => {
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      let sum = 0;
      for (let offset = -radius; offset <= radius; offset++) {
        // Outside the image counts as transparent.
        const sx = horizontal ? x + offset : x, sy = horizontal ? y : y + offset;
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) sum += source[sy * width + sx];
      }
      target[y * width + x] = sum / size;
    }
  };
  blur(alpha, temp, true); const blurred = new Float32Array(alpha.length); blur(temp, blurred, false);
  for (let pixel = 0; pixel < alpha.length; pixel++) data[pixel * 4 + 3] = Math.min(alpha[pixel], Math.round(blurred[pixel]));
}
export async function loadGarment(url: string, kind: GarmentKind = 'top', signal?: AbortSignal): Promise<HTMLCanvasElement> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  await image.decode();
  const canvas = document.createElement('canvas');
  const ratio = Math.min(1, TRY_ON.imageSize / Math.max(image.width, image.height));
  canvas.width = Math.round(image.width * ratio); canvas.height = Math.round(image.height * ratio);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is unavailable.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const extraction = await extractGarment(canvas, signal);
  if (!maskCatalogGarment(pixels.data, canvas.width, canvas.height, extraction, kind)) removeBackground(pixels.data, canvas.width, canvas.height);
  featherAlpha(pixels.data, canvas.width, canvas.height, TRY_ON.edgeFeather);
  context.putImageData(pixels, 0, 0);
  let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    if (pixels.data[(y * canvas.width + x) * 4 + 3] > 0) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX) throw new Error('The product image needs a clearer garment outline.');
  const cropped = document.createElement('canvas');
  cropped.width = maxX - minX + 1; cropped.height = maxY - minY + 1;
  const croppedContext = cropped.getContext('2d');
  if (!croppedContext) throw new Error('Canvas is unavailable.');
  croppedContext.drawImage(canvas, minX, minY, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
  return cropped;
}
