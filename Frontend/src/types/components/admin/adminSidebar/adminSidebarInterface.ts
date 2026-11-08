import type { ComponentType } from 'react';

export interface SidebarMenuItem {
    id: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
}

export interface SidebarNavProps {
    currentView: string;
    onNavigate: (viewId: string) => void;
}

export interface SidebarMenuItemProps {
    id: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    isActive: boolean;
    onClick: (id: string) => void;
}

export interface SidebarHeaderProps {
    title?: string;
    subtitle?: string;
}

export interface BackToStoreButtonProps {
    onClick: () => void;
}
