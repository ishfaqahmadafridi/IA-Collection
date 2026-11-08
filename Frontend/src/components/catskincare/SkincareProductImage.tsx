import type { SkincareProductImageProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareProductImage({ src, name, discount }: SkincareProductImageProps) {
    return (
        <div className="relative aspect-square overflow-hidden bg-emerald-50/50">
            <img src={src} alt={name} className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110" />
            {discount && (
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {discount}
                </div>
            )}
        </div>
    );
}
