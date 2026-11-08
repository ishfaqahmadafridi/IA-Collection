import type { ProductImagesProps } from '../../types/components/productpage/productpageInterface';

export default function ProductImages({ images, name }: ProductImagesProps) {
    return (
        <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <img src={images[0]} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all">
                        <img src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
    );
}
