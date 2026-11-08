import type { ApiProduct } from '../../api';
export interface MakeupProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    isBackend?: boolean;
}

export interface MakeupCategory {
    id: number;
    name: string;
    heroImage?: string;
    products: MakeupProduct[];
}

export interface MakeupProductCardProps {
    product: MakeupProduct;
    showDiscount?: boolean;
}

export interface MakeupProductImageProps {
    src: string;
    name: string;
    discount?: string | null;
}

export interface MakeupProductInfoProps {
    product: MakeupProduct;
}

export interface MakeupProductTitleProps {
    name: string;
}

export interface MakeupProductPriceProps {
    price: number;
    originalPrice?: number;
}

export interface MakeupAddToCartBtnProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface MakeupHeaderProps {
    name: string;
    heroImage: string;
}

export interface MakeupSectionProps {
    category: MakeupCategory;
    backendProducts?: ApiProduct[];
}

export interface MakeupProductsGridProps {
    products: MakeupProduct[];
}
