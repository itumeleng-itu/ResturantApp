// Payment-related type definitions

export type PaymentCard = {
    id: string;
    card_number: string;
    card_holder: string;
    expiry_date: string;
    card_type: string;
};

export type PaymentCardDB = {
    id: string;
    user_id: string;
    card_holder: string;
    card_last_four: string;
    card_type: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
    created_at?: string;
};

export type PaymentMethod = 'new-card' | 'saved-card' | 'cash' | 'wallet';

export type Card = {
    id: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
};
