export interface WomenCategoryItem {
    key: string;
    name: string;
    image: string;
}

export interface WomenCategoryCardProps {
    category: WomenCategoryItem;
    onClick?: () => void;
}
