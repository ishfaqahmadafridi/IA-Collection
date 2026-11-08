import type { ApiProduct } from '../../api';
export interface FragranceProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface FragranceCategory {
    id: number;
    name: string;
    heroImage?: string;
    products: FragranceProduct[];
}

export interface FragranceProductCardProps {
    product: FragranceProduct;
    showDiscount?: boolean;
}

export interface FragranceProductImageProps {
    src: string;
    name: string;
    discount?: string | null;
}

export interface FragranceProductInfoProps {
    product: FragranceProduct;
}

export interface FragranceProductTitleProps {
    name: string;
}

export interface FragranceProductPriceProps {
    price: number;
    originalPrice?: number;
}

export interface FragranceAddToCartBtnProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface FragranceHeaderProps {
    name: string;
    heroImage: string;
}

export interface FragranceSectionProps {
    category: FragranceCategory;
    backendProducts?: ApiProduct[];
}

export interface FragranceProductsGridProps {
    products: FragranceProduct[];
}
