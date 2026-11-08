import type { MakeupHeaderProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupHeader({ name, heroImage }: MakeupHeaderProps) {
    return (
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md group border border-pink-50">
            <img src={heroImage} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight uppercase">{name}</h2>
            </div>
        </div>
    );
}
