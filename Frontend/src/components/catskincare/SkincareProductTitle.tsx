import type { SkincareProductTitleProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareProductTitle({ name }: SkincareProductTitleProps) {
    return (
        <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 min-h-12 group-hover:text-emerald-700 transition-colors">
            {name}
        </h3>
    );
}
