export interface CartItem {
    id: number;
    name: string;
    size: string;
    price: number;
    quantity: number;
    totalPrice: number;
    image?: string;
}

export interface CartState {
    items: CartItem[];
}

export interface AddToCartPayload {
    id: number;
    name: string;
    size: string;
    price: number;
    quantity?: number;
    image?: string;
}

export interface RemoveFromCartPayload {
    id: number;
    size: string;
}

export interface UpdateQuantityPayload {
    id: number;
    size: string;
    quantity: number;
}

// Component Props
export interface CartItemProps {
    item: CartItem;
}

export interface CartListProps {
    items: CartItem[];
}

export interface CartSummaryProps {
    subtotal: number;
    totalQuantity: number;
}

export type CartLayoutProps = Record<string, never>;

export interface CartItemImageProps {
    src?: string;
    name: string;
}

export interface CartItemDetailsProps {
    name: string;
    size: string;
    price: number;
    quantity: number;
}

export interface CartItemPriceProps {
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface CartItemRemoveProps {
    id: number;
    size: string;
}

export interface CartSummaryRowProps {
    label: string;
    value: number | string;
    isBold?: boolean;
    isLarge?: boolean;
    isItalic?: boolean;
    border?: boolean;
}
