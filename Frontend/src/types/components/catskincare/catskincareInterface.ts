import type { ApiProduct } from '../../api';
export interface SkincareProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface SkincareCategory {
    id: number;
    name: string;
    heroImage?: string;
    products: SkincareProduct[];
}

export interface SkincareProductCardProps {
    product: SkincareProduct;
    showDiscount?: boolean;
}

export interface SkincareProductImageProps {
    src: string;
    name: string;
    discount?: string | null;
}

export interface SkincareProductInfoProps {
    product: SkincareProduct;
}

export interface SkincareProductTitleProps {
    name: string;
}

export interface SkincareProductPriceProps {
    price: number;
    originalPrice?: number;
}

export interface SkincareAddToCartBtnProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SkincareHeaderProps {
    name: string;
    heroImage: string;
}

export interface SkincareSectionProps {
    category: SkincareCategory;
    backendProducts?: ApiProduct[];
}

export interface SkincareProductsGridProps {
    products: SkincareProduct[];
}
