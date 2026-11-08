import type { SkincareHeaderProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareHeader({ name, heroImage }: SkincareHeaderProps) {
    return (
        <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-sm group border border-emerald-100">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-transparent flex items-center p-12">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase">{name}</h2>
            </div>
        </div>
    );
}
