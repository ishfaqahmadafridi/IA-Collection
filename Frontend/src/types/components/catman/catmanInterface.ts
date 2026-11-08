import type { ApiProduct } from '../../api';
export interface MenProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface MenCategory {
    id: number;
    name: string;
    heroImage?: string;
    products: MenProduct[];
}

export interface MenProductCardProps {
    product: MenProduct;
    showDiscount?: boolean;
}

export interface MenProductImageProps {
    src: string;
    name: string;
    discount?: string | null;
}

export interface MenProductInfoProps {
    product: MenProduct;
}

export interface MenProductTitleProps {
    name: string;
}

export interface MenProductPriceProps {
    price: number;
    originalPrice?: number;
}

export interface MenAddToCartBtnProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface MenHeaderProps {
    name: string;
    heroImage: string;
}

export interface MenSectionProps {
    category: MenCategory;
    backendProducts?: ApiProduct[];
}

export interface MenProductsGridProps {
    products: MenProduct[];
}
