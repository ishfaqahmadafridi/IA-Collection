export interface Product {
    id: number;
    name: string;
    image: string;
    images?: string[];
    price: number;
    originalPrice?: number;
    details?: Record<string, string>;
}

export interface BackButtonProps {
    onClick: () => void;
}

export interface AddToCartBtnProps {
    onClick: () => void;
}

export interface ProductImagesProps {
    images: string[];
    name: string;
}

export interface ProductInfoProps {
    product: Product;
    onAddToCart: () => void;
}

export interface ProductDetailsProps {
    details?: Record<string, string>;
}

export interface SizeSelectorProps {
    sizes: string[];
}
