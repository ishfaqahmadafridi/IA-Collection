import type { MenHeaderProps } from '../../types/components/catman/catmanInterface';

export default function MenHeader({ name, heroImage }: MenHeaderProps) {
    return (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md group border border-gray-100">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase italic">{name}</h2>
            </div>
        </div>
    );
}
