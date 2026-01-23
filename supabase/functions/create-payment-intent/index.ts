// Supabase Edge Function: create-payment-intent
// Save this as: supabase/functions/create-payment-intent/index.ts
// Deploy with: npx supabase functions deploy create-payment-intent --project-ref ygvncynjmwnbjztuydmo

// Deno type declarations for local TypeScript support
declare const Deno: {
    serve: (handler: (req: Request) => Promise<Response> | Response) => void;
    env: {
        get: (key: string) => string | undefined;
    };
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // ✅ Get the Stripe secret key from environment
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

        // ✅ IMPORTANT: Log key info for debugging
        console.log('=== STRIPE KEY CHECK ===');
        console.log('Key exists:', !!stripeSecretKey);
        console.log('Key length:', stripeSecretKey?.length || 0);
        console.log('Key starts with:', stripeSecretKey?.slice(0, 15) || 'N/A');
        console.log('========================');

        if (!stripeSecretKey) {
            console.error('❌ STRIPE_SECRET_KEY not found in environment');
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Stripe not configured on server'
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // ✅ Validate Stripe key format
        const isValidKey = stripeSecretKey.startsWith('sk_test_') ||
            stripeSecretKey.startsWith('sk_live_');

        if (!isValidKey) {
            console.error('❌ Invalid Stripe key format!');
            console.error('Key does not start with sk_test_ or sk_live_');
            console.error('Key starts with:', stripeSecretKey.slice(0, 15));

            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid Stripe key configuration. Please check server environment variables.'
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('✅ Stripe key format is valid');

        // ✅ Parse request body
        const { amount, currency, paymentMethodId } = await req.json();
        console.log('📝 Payment request:', { amount, currency, paymentMethodId });

        // ✅ Validate required fields
        if (!amount || !paymentMethodId) {
            console.error('❌ Missing required fields');
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Missing required fields: amount and paymentMethodId'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // ✅ Validate amount (minimum R5.00 = 500 cents for ZAR)
        if (amount < 500) {
            console.error('❌ Amount too low:', amount);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Amount must be at least R5.00 (500 cents)'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('✅ Validation passed, calling Stripe API...');

        // ✅ Create PaymentIntent using Stripe REST API directly
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'amount': String(Math.round(amount)),
                'currency': currency || 'zar',
                'payment_method': paymentMethodId,
                'confirm': 'true',
                'automatic_payment_methods[enabled]': 'true',
                'automatic_payment_methods[allow_redirects]': 'never',
            }).toString(),
        });

        console.log('📡 Stripe API response status:', response.status);

        const paymentIntent = await response.json();

        // Log response (but hide sensitive data)
        console.log('📡 Stripe response received');
        console.log('Payment Intent ID:', paymentIntent.id || 'N/A');
        console.log('Status:', paymentIntent.status || 'N/A');
        console.log('Has error:', !!paymentIntent.error);

        // ✅ Check for Stripe errors
        if (paymentIntent.error) {
            const error = paymentIntent.error;
            console.error('❌ Stripe error:', error.message);
            console.error('Error type:', error.type);
            console.error('Error code:', error.code);

            return new Response(
                JSON.stringify({
                    success: false,
                    error: error.message || 'Payment failed',
                    declineCode: error.decline_code,
                    code: error.code,
                    type: error.type,
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // ✅ Check payment status
        if (paymentIntent.status === 'succeeded') {
            console.log('✅ Payment succeeded!');
            console.log('Payment Intent ID:', paymentIntent.id);

            return new Response(
                JSON.stringify({
                    success: true,
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        } else if (paymentIntent.status === 'requires_action') {
            console.log('⚠️ Payment requires action (3D Secure)');

            return new Response(
                JSON.stringify({
                    success: false,
                    requiresAction: true,
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        } else {
            console.log('⚠️ Payment incomplete. Status:', paymentIntent.status);

            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Payment status: ${paymentIntent.status}`,
                    status: paymentIntent.status,
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }
    } catch (error: any) {
        console.error('❌ Function error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'An unexpected error occurred',
                details: error.toString(),
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});