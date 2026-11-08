import type { MakeupProductImageProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductImage({ src, name, discount }: MakeupProductImageProps) {
    return (
        <div className="relative aspect-square overflow-hidden bg-pink-50">
            <img src={src} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {discount && (
                <div className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {discount}
                </div>
            )}
        </div>
    );
}
