export interface SearchProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    categoryName: string;
    categoryId?: number;
    source: string;
}

export interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}
