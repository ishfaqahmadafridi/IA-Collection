import type { MakeupProductTitleProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductTitle({ name }: MakeupProductTitleProps) {
    return (
        <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 min-h-12 group-hover:text-purple-700 transition-colors">
            {name}
        </h3>
    );
}
