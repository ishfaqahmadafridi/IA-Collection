import type { FragranceProductTitleProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductTitle({ name }: FragranceProductTitleProps) {
    return (
        <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 min-h-12 group-hover:text-indigo-700 transition-colors">
            {name}
        </h3>
    );
}
