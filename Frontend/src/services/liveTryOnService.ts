import api from '../api/client';
import { LIVE_TRY_ON } from '../constants/liveTryon';
import type { LiveTryOnConfig, LiveTryOnToken } from '../types/liveTryon';
export const liveTryOnService = {
  config: (productId: number, signal: AbortSignal) => api.get<LiveTryOnConfig>('/live-try-on/config/', { params: { product_id: productId }, signal }),
  token: (productId: number, signal: AbortSignal) => api.post<LiveTryOnToken>('/live-try-on/token/', { product_id: productId, consent: true }, { signal, timeout: 20000 }),
  garment: async (image: string, signal: AbortSignal): Promise<Blob> => {
    const url = new URL(image, window.location.href);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('The selected garment image is unavailable.');
    // Public assets must not receive the account Authorization header or cookies.
    const response = await fetch(url, { signal, credentials: 'omit' });
    if (!response.ok || Number(response.headers.get('Content-Length')) > LIVE_TRY_ON.imageMaxBytes) throw new Error('The selected garment image could not be loaded.');
    const blob = await response.blob();
    if (!blob.size || blob.size > LIVE_TRY_ON.imageMaxBytes || !['image/jpeg', 'image/png', 'image/webp'].includes(blob.type)) throw new Error('This garment photo is not supported. Please choose another product.');
    return blob;
  },
};
