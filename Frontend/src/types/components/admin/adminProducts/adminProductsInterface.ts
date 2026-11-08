export interface Product {
    id: number;
    name: string;
    category: number;        // FK integer ID from backend
    category_name?: string;  // Computed field from ProductSerializer
    price: number;
    original_price?: number;
    discount?: number;
    stock: number;
    stock_status?: string;
    is_in_stock?: boolean;
    description?: string;
    is_hot?: boolean;
    image?: string;
}

export interface InventoryStatus {
    total_products?: number; // Backend field name from inventory_status endpoint
    in_stock?: number;
    low_stock?: number;
    out_of_stock?: number;
}

export interface ProductsHeaderProps {
    onAddProduct: () => void;
}

export interface InventoryStatsProps {
    stats: InventoryStatus | null;
}

export interface InventoryStatCardProps {
    label: string;
    value: number;
    color: string;
}

export interface ProductFilterTabsProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export interface ProductsTableProps {
    products: Product[];
    onEditProduct: (product: Product) => void;
}

export interface ProductTableRowProps {
    product: Product;
    onEdit: () => void;
}

export interface ProductImageProps {
    src?: string;
    alt: string;
}

export interface ProductStockBadgeProps {
    stock: number;
}

export interface ProductActionsProps {
    product: Product;
    onEdit: () => void;
}
