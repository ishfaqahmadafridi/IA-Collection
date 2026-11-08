import type { CategoryHeaderProps } from '../../types/components/catboyG/catBoyGInterface';

export default function CategoryHeader({ name, heroImage }: CategoryHeaderProps) {
    return (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex items-center px-8">
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">{name}</h2>
            </div>
        </div>
    );
}
