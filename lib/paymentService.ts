// Stripe payment service
// Handles all Stripe-related API calls

import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';

export type PaymentResult = {
    success: boolean;
    paymentIntentId?: string;
    requiresAction?: boolean;
    clientSecret?: string;
    error?: string;
    declineCode?: string;
};

/**
 * Create and confirm a payment with Stripe
 * This calls our Supabase Edge Function which securely handles the Stripe API
 */
export async function createPaymentIntent(
    amountInCents: number,
    paymentMethodId: string,
    currency: string = 'zar'
): Promise<PaymentResult> {
    console.log('Processing payment:', { amount: amountInCents, currency, paymentMethodId });

    try {
        // Get the current session and access token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Session error:', sessionError);
            return {
                success: false,
                error: 'Authentication error. Please sign in again.',
            };
        }

        if (!session?.access_token) {
            console.error('No access token found in session');
            return {
                success: false,
                error: 'Please sign in to complete payment.',
            };
        }

        console.log('Session found, user:', session.user.email);
        console.log('Access token exists:', !!session.access_token);
        console.log('Token expires at:', new Date(session.expires_at! * 1000).toISOString());

        // Invoke the Edge Function with explicit Authorization header
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
            body: {
                amount: amountInCents,
                currency,
                paymentMethodId,
            },
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (error) {
            console.error('Supabase function error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);

            // Try to extract the specific error message from the response body
            let errorMessage = error.message;
            let errorDetails: any = {};

            // FunctionsHttpError has a context property with the Response object
            if (error.context && error.context instanceof Response) {
                try {
                    const responseBody = await error.context.json();
                    console.error('Response body:', JSON.stringify(responseBody, null, 2));
                    errorMessage = responseBody.error || responseBody.message || errorMessage;
                    errorDetails = responseBody;
                } catch (e) {
                    // Try to get text if JSON parsing fails
                    try {
                        const textBody = await error.context.text();
                        console.error('Response text:', textBody);
                        errorMessage = textBody || errorMessage;
                    } catch (textError) {
                        console.error('Could not read response body');
                    }
                }
            }

            return {
                success: false,
                error: errorMessage || 'Failed to process payment',
                declineCode: errorDetails.declineCode,
            };
        }

        console.log('Payment response:', JSON.stringify(data, null, 2));
        return data as PaymentResult;
    } catch (error: any) {
        console.error('Payment service error:', error);
        console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
        };
    }
}

/**
 * Get user-friendly error message for Stripe decline codes
 */
export function getDeclineMessage(declineCode?: string, defaultMessage?: string): string {
    const declineMessages: Record<string, string> = {
        'card_declined': 'Your card was declined. Please try a different card.',
        'insufficient_funds': 'Insufficient funds. Please try a different card.',
        'lost_card': 'This card has been reported lost. Please use a different card.',
        'stolen_card': 'This card has been reported stolen. Please use a different card.',
        'expired_card': 'Your card has expired. Please use a different card.',
        'incorrect_cvc': 'Incorrect CVC code. Please check and try again.',
        'processing_error': 'A processing error occurred. Please try again.',
        'incorrect_number': 'The card number is incorrect. Please check and try again.',
        'card_not_supported': 'This card is not supported. Please try a different card.',
        'currency_not_supported': 'This currency is not supported for this card.',
        'duplicate_transaction': 'A duplicate transaction was detected.',
        'fraudulent': 'This transaction was flagged as potentially fraudulent.',
    };

    if (declineCode && declineMessages[declineCode]) {
        return declineMessages[declineCode];
    }

    return defaultMessage || 'Your payment could not be processed. Please try again.';
}

/**
 * Show a payment error alert with user-friendly message
 */
export function showPaymentError(result: PaymentResult): void {
    const message = getDeclineMessage(result.declineCode, result.error);
    Alert.alert('Payment Failed', message);
}
