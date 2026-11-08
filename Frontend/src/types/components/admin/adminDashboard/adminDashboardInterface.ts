import type { ComponentType } from 'react';

export interface DashboardStats {
    sales?: {
        total?: number;
        weekly?: number;
        monthly?: number;
    };
    orders?: {
        total?: number;
        pending?: number;
        weekly?: number;
    };
    products?: {
        total?: number;
        out_of_stock?: number;
        low_stock?: number;
    };
    users?: {
        total?: number;
        active_this_week?: number;
    };
    subscriptions?: {
        total?: number;
        new_this_week?: number;
    };
}

export interface Order {
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
}

export interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
}

export interface StatsGridProps {
    stats: DashboardStats;
}

export interface QuickStatCardProps {
    title: string;
    value: string | number;
    gradient: string;
}

export interface QuickStatsRowProps {
    stats: DashboardStats;
}

export interface OrderStatusBadgeProps {
    status: string;
}

export interface OrderTableRowProps {
    order: Order;
}

export interface RecentOrdersTableProps {
    orders: Order[];
}

export interface RecentOrdersSectionProps {
    recent_Orders: Order[];
}
