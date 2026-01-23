// Supabase Edge Function: create-payment-intent
// Save this as: supabase/functions/create-payment-intent/index.ts
// Deploy with: npx supabase functions deploy create-payment-intent --project-ref ygvncynjmwnbjztuydmo --no-verify-jwt

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

// Helper function to make Stripe API calls
async function stripeRequest(
    endpoint: string,
    method: string,
    stripeSecretKey: string,
    body?: Record<string, string>
): Promise<any> {
    const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body ? new URLSearchParams(body).toString() : undefined,
    });
    return response.json();
}

// Find or create a Stripe Customer by email
async function getOrCreateCustomer(
    email: string,
    stripeSecretKey: string
): Promise<{ id: string } | null> {
    console.log('🔍 Looking for existing customer with email:', email);

    // Search for existing customer
    const searchResult = await stripeRequest(
        `/customers?email=${encodeURIComponent(email)}&limit=1`,
        'GET',
        stripeSecretKey
    );

    if (searchResult.data && searchResult.data.length > 0) {
        console.log('✅ Found existing customer:', searchResult.data[0].id);
        return { id: searchResult.data[0].id };
    }

    // Create new customer
    console.log('📝 Creating new Stripe customer...');
    const newCustomer = await stripeRequest(
        '/customers',
        'POST',
        stripeSecretKey,
        { email }
    );

    if (newCustomer.id) {
        console.log('✅ Created new customer:', newCustomer.id);
        return { id: newCustomer.id };
    }

    console.error('❌ Failed to create customer:', newCustomer.error?.message);
    return null;
}

// Attach PaymentMethod to Customer (if not already attached)
async function attachPaymentMethodToCustomer(
    paymentMethodId: string,
    customerId: string,
    stripeSecretKey: string
): Promise<boolean> {
    console.log('🔗 Attaching payment method to customer...');

    // First, check if already attached
    const pm = await stripeRequest(
        `/payment_methods/${paymentMethodId}`,
        'GET',
        stripeSecretKey
    );

    if (pm.customer === customerId) {
        console.log('✅ Payment method already attached to this customer');
        return true;
    }

    if (pm.customer && pm.customer !== customerId) {
        console.log('⚠️ Payment method attached to different customer, cannot reuse');
        return false;
    }

    // Attach to customer
    const attachResult = await stripeRequest(
        `/payment_methods/${paymentMethodId}/attach`,
        'POST',
        stripeSecretKey,
        { customer: customerId }
    );

    if (attachResult.id) {
        console.log('✅ Payment method attached successfully');
        return true;
    }

    console.error('❌ Failed to attach payment method:', attachResult.error?.message);
    return false;
}

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // ✅ Get the Stripe secret key from environment
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

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
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid Stripe key configuration.'
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('✅ Stripe key format is valid');

        // ✅ Parse request body
        const { amount, currency, paymentMethodId, email } = await req.json();
        console.log('📝 Payment request:', { amount, currency, paymentMethodId, email });

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

        console.log('✅ Validation passed');

        // ✅ Get or create Stripe Customer (required for reusable payment methods)
        let customerId: string | undefined;

        if (email) {
            const customer = await getOrCreateCustomer(email, stripeSecretKey);
            if (customer) {
                customerId = customer.id;

                // Attach payment method to customer
                const attached = await attachPaymentMethodToCustomer(
                    paymentMethodId,
                    customerId,
                    stripeSecretKey
                );

                if (!attached) {
                    return new Response(
                        JSON.stringify({
                            success: false,
                            error: 'Unable to use this payment method. Please add a new card.'
                        }),
                        {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        }
                    );
                }
            }
        }

        console.log('💳 Creating PaymentIntent...');

        // ✅ Build PaymentIntent params
        const paymentIntentParams: Record<string, string> = {
            'amount': String(Math.round(amount)),
            'currency': currency || 'zar',
            'payment_method': paymentMethodId,
            'confirm': 'true',
            'automatic_payment_methods[enabled]': 'true',
            'automatic_payment_methods[allow_redirects]': 'never',
        };

        // Add customer if we have one
        if (customerId) {
            paymentIntentParams['customer'] = customerId;
        }

        // ✅ Create PaymentIntent
        const paymentIntent = await stripeRequest(
            '/payment_intents',
            'POST',
            stripeSecretKey,
            paymentIntentParams
        );

        console.log('📡 Stripe response received');
        console.log('Payment Intent ID:', paymentIntent.id || 'N/A');
        console.log('Status:', paymentIntent.status || 'N/A');

        // ✅ Check for Stripe errors
        if (paymentIntent.error) {
            const error = paymentIntent.error;
            console.error('❌ Stripe error:', error.message);

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

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'An unexpected error occurred',
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});