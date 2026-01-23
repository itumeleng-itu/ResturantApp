export type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    user_id: string;
    created_at: string;
    total_amount: number;
    status: OrderStatus;
    payment_method: string;
    payment_status: string;
    address_id: string;
    delivery_fee: number;
    items_count?: number;
}

export interface OrderItem {
    id: string;
    order_id: string;
    menu_item_id: string;
    quantity: number;
    price_at_time: number;
    name: string; // From join
    image_url: string; // From join
    options?: any; // JSON for extras, sides, etc.
}
