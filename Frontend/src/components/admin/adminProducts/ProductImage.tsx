import type { ProductImageProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function ProductImage({ src, alt }: ProductImageProps) {
  return src ? (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 object-cover rounded-lg"
    />
  ) : (
    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-400 text-xs">N/A</span>
    </div>
  );
}
