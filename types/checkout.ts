// Type definitions for checkout
import { PaymentMethod } from '@/types/payment';

export type Address = {
    id: string;
    label: string;
    street: string;
    city: string;
    postal_code: string;
    is_default: boolean;
};

export type SelectedPaymentInfo = {
    method: PaymentMethod;
    cardId?: string;
    stripePaymentMethodId?: string;
    cardLast4?: string;
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
};

// Constants
export const DELIVERY_FEE = 25.00; // Fixed delivery fee in Rands
