// Stripe service for payment processing
import { Alert } from 'react-native';

// Stripe publishable key from environment
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

/**
 * Stripe card details type (used for creating payment methods)
 */
export type StripeCardDetails = {
    complete: boolean;
    brand?: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
};

/**
 * Result type for payment method creation
 */
export type CreatePaymentMethodResult = {
    success: boolean;
    paymentMethodId?: string;
    cardDetails?: {
        brand: string;
        last4: string;
        expiryMonth: number;
        expiryYear: number;
    };
    error?: string;
};

/**
 * Validates that Stripe is properly configured
 */
export const isStripeConfigured = (): boolean => {
    if (!STRIPE_PUBLISHABLE_KEY) {
        return false;
    }
    return true;
};

/**
 * Shows an error alert for Stripe-related issues
 */
export const showStripeError = (message: string): void => {
    Alert.alert('Payment Error', message);
};

/**
 * Maps Stripe card brand to display name
 */
export const getCardBrandDisplayName = (brand?: string): string => {
    const brandMap: Record<string, string> = {
        'visa': 'Visa',
        'mastercard': 'Mastercard',
        'amex': 'American Express',
        'discover': 'Discover',
        'diners': 'Diners Club',
        'jcb': 'JCB',
        'unionpay': 'UnionPay',
    };
    return brandMap[brand?.toLowerCase() || ''] || 'Card';
};
