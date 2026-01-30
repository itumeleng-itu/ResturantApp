export type FoodItem = {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    is_available?: boolean;
    is_spicy?: boolean;
    category?: string;
    category_name?: string;
};
