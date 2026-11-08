import type { FragranceProductImageProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductImage({ src, name, discount }: FragranceProductImageProps) {
    return (
        <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img src={src} alt={name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" />
            {discount && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {discount}
                </div>
            )}
        </div>
    );
}
