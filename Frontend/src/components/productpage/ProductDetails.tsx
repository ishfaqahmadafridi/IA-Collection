import type { ProductDetailsProps } from '../../types/components/productpage/productpageInterface';

export default function ProductDetails({ details }: ProductDetailsProps) {
    if (!details) return null;
    return (
        <div className="pt-8 border-t border-border space-y-4 transition-colors duration-500">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Product Details</h4>
            <div className="prose prose-sm max-w-none text-muted-foreground">
                <ul className="grid grid-cols-1 gap-2 list-none p-0">
                    {Object.entries(details).map(([key, val]) => (
                        <li key={key} className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">{key}:</span>
                            <span className="text-foreground/80">{val}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
