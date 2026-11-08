import type { WomenHeaderProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenHeader({ name, heroImage }: WomenHeaderProps) {
    return (
        <div className="relative h-56 md:h-80 rounded-3xl overflow-hidden shadow-sm group border border-rose-100">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent flex items-end p-12">
                <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter uppercase">{name}</h2>
            </div>
        </div>
    );
}
