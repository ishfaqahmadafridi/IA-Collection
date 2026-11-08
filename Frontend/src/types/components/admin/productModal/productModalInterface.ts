export interface Product {
    id: number;
    name: string;
    category: number | string;  // Can be ID (number) or name (string)
    category_name?: string;     // Readable category name from backend
    price: number;
    original_price?: number;
    stock: number;
    description?: string;
    is_hot?: boolean;
    image?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    original_price: string;
    category: string;
    stock: string;
    image: string;
    is_hot: boolean;
}

export interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
}

export interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

export interface ProductNameInputProps {
    value: string;
    onChange: (value: string) => void;
}

export interface DescriptionInputProps {
    value: string;
    onChange: (value: string) => void;
}

export interface PriceInputsProps {
    price: string;
    originalPrice: string;
    onPriceChange: (value: string) => void;
    onOriginalPriceChange: (value: string) => void;
}

export interface CategoryStockInputsProps {
    category: string;
    stock: string;
    image: string;
    onCategoryChange: (value: string) => void;
    onStockChange: (value: string) => void;
    onImageChange: (value: string) => void;
}

export interface HotProductCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export interface ModalActionsProps {
    loading: boolean;
    isEditing: boolean;
    onCancel: () => void;
}
