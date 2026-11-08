import type { ApiProduct } from '../../api';
export interface WomenProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface WomenCategory {
    id: number;
    name: string;
    heroImage?: string;
    products: WomenProduct[];
}

export interface WomenProductCardProps {
    product: WomenProduct;
    showDiscount?: boolean;
}

export interface WomenProductImageProps {
    src: string;
    name: string;
    discount?: string | null;
}

export interface WomenProductInfoProps {
    product: WomenProduct;
}

export interface WomenProductTitleProps {
    name: string;
}

export interface WomenProductPriceProps {
    price: number;
    originalPrice?: number;
}

export interface WomenAddToCartBtnProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface WomenHeaderProps {
    name: string;
    heroImage: string;
}

export interface WomenSectionProps {
    category: WomenCategory;
    backendProducts?: ApiProduct[];
}

export interface WomenProductsGridProps {
    products: WomenProduct[];
}
