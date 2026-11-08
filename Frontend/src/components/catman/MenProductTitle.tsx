import type { MenProductTitleProps } from '../../types/components/catman/catmanInterface';

export default function MenProductTitle({ name }: MenProductTitleProps) {
    return (
        <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 min-h-12 group-hover:text-amber-700 transition-colors">
            {name}
        </h3>
    );
}
