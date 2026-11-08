export interface Order {
    allowed_statuses?: string[];
    id: number;
    order_number: string;
    user_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address?: string;
    items?: OrderItem[];
    notes?: string;
}

export interface OrderItem {
    product_name: string;
    quantity: number;
    price: number;
    total_price: number;
    image?: string;
}

export interface StatusOption {
    value: string;
    label: string;
}

export interface OrderFilterTabsProps {
    activeFilter: string;
    onFilterChange: (status: string) => void;
}

export interface OrdersTableProps {
    orders: Order[];
}

export interface OrderTableRowProps {
    order: Order;
    onViewDetails: () => void;
}

export interface OrderStatusSelectProps {
    order: Order;
}

export interface OrderStatsGridProps {
    stats: Record<'total' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled', number>;
}

export interface OrderStatusCardProps {
    label: string;
    value: number;
    color: string;
}

export interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}
