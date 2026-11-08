import type { FragranceHeaderProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceHeader({ name, heroImage }: FragranceHeaderProps) {
    return (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">{name}</h2>
            </div>
        </div>
    );
}
