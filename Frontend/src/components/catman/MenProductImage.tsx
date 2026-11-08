import type { MenProductImageProps } from '../../types/components/catman/catmanInterface';

export default function MenProductImage({ src, name, discount }: MenProductImageProps) {
    return (
        <div className="relative aspect-4/5 overflow-hidden bg-gray-50">
            <img src={src} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {discount && (
                <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm">
                    {discount}
                </div>
            )}
        </div>
    );
}
