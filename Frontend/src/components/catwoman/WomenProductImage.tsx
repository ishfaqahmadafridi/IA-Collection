import type { WomenProductImageProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenProductImage({ src, name, discount }: WomenProductImageProps) {
    return (
        <div className="relative aspect-3/4 overflow-hidden bg-rose-50/30">
            <img src={src} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {discount && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg">
                    {discount}
                </div>
            )}
        </div>
    );
}
