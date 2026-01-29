export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: string;
    user_id: string;
    driver_id?: string | null;
    user_name: string;
    user_surname: string;
    user_email: string;
    user_contact: string;
    delivery_street: string;
    delivery_city: string;
    delivery_postal_code: string;
    card_last_four: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    notes?: string | null;
    created_at: string;
    updated_at: string;
    num_items?: number;
    unique_items?: number;
    pickup_code?: string | null;
    eta?: string | null;
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
