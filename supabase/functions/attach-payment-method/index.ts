// Supabase Edge Function: attach-payment-method
// Attaches a PaymentMethod to a Stripe Customer when saving a card
// Deploy with: npx supabase functions deploy attach-payment-method --project-ref ygvncynjmwnbjztuydmo --no-verify-jwt

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

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Get the Stripe secret key from environment
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

        // Validate Stripe key format
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

        // Parse request body
        const { paymentMethodId, email } = await req.json();
        console.log('📝 Attach request:', { paymentMethodId, email });

        // Validate required fields
        if (!paymentMethodId || !email) {
            console.error('❌ Missing required fields');
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Missing required fields: paymentMethodId and email'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Get or create Stripe Customer
        const customer = await getOrCreateCustomer(email, stripeSecretKey);

        if (!customer) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Failed to create Stripe customer'
                }),
                {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // First, check if the PaymentMethod is already attached
        const pm = await stripeRequest(
            `/payment_methods/${paymentMethodId}`,
            'GET',
            stripeSecretKey
        );

        if (pm.error) {
            console.error('❌ Error fetching payment method:', pm.error.message);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: pm.error.message || 'Invalid payment method'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Check if already attached to this customer
        if (pm.customer === customer.id) {
            console.log('✅ Payment method already attached to this customer');
            return new Response(
                JSON.stringify({
                    success: true,
                    customerId: customer.id,
                    paymentMethodId: paymentMethodId,
                    alreadyAttached: true
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Check if attached to a different customer
        if (pm.customer && pm.customer !== customer.id) {
            console.error('❌ Payment method attached to different customer');
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'This card is associated with a different account'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Attach the PaymentMethod to the Customer
        console.log('🔗 Attaching payment method to customer...');
        const attachResult = await stripeRequest(
            `/payment_methods/${paymentMethodId}/attach`,
            'POST',
            stripeSecretKey,
            { customer: customer.id }
        );

        if (attachResult.error) {
            console.error('❌ Failed to attach payment method:', attachResult.error.message);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: attachResult.error.message || 'Failed to save card'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('✅ Payment method attached successfully');
        return new Response(
            JSON.stringify({
                success: true,
                customerId: customer.id,
                paymentMethodId: paymentMethodId
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    } catch (error: any) {
        console.error('❌ Function error:', error);
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
