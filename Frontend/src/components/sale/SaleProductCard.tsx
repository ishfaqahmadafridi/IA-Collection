import type { SaleProductCardProps } from '../../types/components/sale/saleInterface';

export default function SaleProductCard({ product, onClick }: SaleProductCardProps) {
  return (
    <div
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-muted aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount && (
          <div className="absolute top-4 right-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {product.discount}
          </div>
        )}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {product.categoryType}
        </div>
      </div>

      <div className="p-4 grow flex flex-col">
        <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-foreground/50 mb-3">{product.categoryName}</p>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black ${product.originalPrice ? 'text-rose-600' : 'text-foreground'}`}>
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-foreground/30 line-through decoration-rose-600/50">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
