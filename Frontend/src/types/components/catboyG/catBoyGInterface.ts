export interface CatBoyGProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface CatBoyGCategory {
    id: string;
    name: string;
    heroImage: string;
    products: CatBoyGProduct[];
}

export interface CategoryGridProps {
    onProductClick: (product: CatBoyGProduct) => void;
}

export interface CategoryHeaderProps {
    name: string;
    heroImage: string;
}

export interface ProductCardProps {
    product: CatBoyGProduct;
    onClick: () => void;
    showDiscount?: boolean;
}

export interface CatBoysGProps {
    setPage?: (page: string) => void;
    setSelectedProduct?: (product: CatBoyGProduct) => void;
}
