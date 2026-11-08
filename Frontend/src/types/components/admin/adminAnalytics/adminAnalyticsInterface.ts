export interface SalesDataPoint {
    date: string;
    total: number;
}

export interface SalesAnalytics {
    daily_sales?: SalesDataPoint[];
    total_sales?: number;
    total_orders?: number;
    avg_order_value?: number;
}

export interface UserLoginDataPoint {
    date: string;
    count: number;
}

export interface ActivityBreakdownItem {
    type: string;
    count: number;
}

export interface UserAnalytics {
    daily_logins?: UserLoginDataPoint[];
    activity_breakdown?: ActivityBreakdownItem[];
}

export interface TopProduct {
    id: number;
    name: string;
    image?: string;
    total_revenue: number;
    total_sold: number;
}

export type AnalyticsHeaderProps = Record<string, never>;

export interface SalesChartProps {
    data: SalesAnalytics | null;
}

export interface SalesBarChartProps {
    dailySales: SalesDataPoint[];
}

export interface SalesSummaryStatsProps {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
}

export interface UserActivityChartProps {
    data: UserAnalytics | null;
}

export interface UserActivityBarChartProps {
    loginData: UserLoginDataPoint[];
}

export interface ActivityBreakdownProps {
    breakdown: ActivityBreakdownItem[];
}

export interface TopProductsChartProps {
    products: TopProduct[];
}

export interface ProductRankingItemProps {
    product: TopProduct;
    rank: number;
}
