import { MAX_PROFILE_IMAGE_BYTES, PROFILE_IMAGE_TYPES } from '../../constants/limits';
export function validateProfileImage(file: File): string {
  return !PROFILE_IMAGE_TYPES.includes(file.type) || file.size > MAX_PROFILE_IMAGE_BYTES
    ? 'Choose a JPEG, PNG or WebP image smaller than 2 MB.' : '';
}
export function readImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}
