# Stripe Payment Integration Setup Guide

This guide explains how to set up real Stripe payment processing for the Restaurant App.

---

## Prerequisites

1. **Stripe Account**: Create an account at [stripe.com](https://stripe.com)
2. **Supabase CLI**: Install the Supabase CLI for deploying edge functions

---

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API keys**
3. Copy your keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

---

## Step 2: Configure Environment Variables

### Local Development (.env)
Your `.env` file should have:
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# DO NOT put the secret key in .env - it goes in Supabase
```

### Supabase Edge Function Secrets
Add your Stripe secret key to Supabase:

```bash
# Using Supabase CLI
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

Or via Supabase Dashboard:
1. Go to your Supabase project → **Edge Functions**
2. Click **Manage Secrets**
3. Add: `STRIPE_SECRET_KEY` = `sk_test_your_secret_key_here`

---

## Step 3: Deploy the Edge Function

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link Your Project
```bash
# Navigate to your project root
cd ResturantApp

# Initialize supabase if not already done
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref
```

### Deploy the Payment Function
```bash
supabase functions deploy create-payment-intent
```

---

## Step 4: Test the Integration

### Use Test Card Numbers
See `docs/STRIPE_TEST_CARDS.md` for all test cards.

#### Quick Test Cards:
| Card | Number | Result |
|------|--------|--------|
| **Success** | `4242 4242 4242 4242` | Payment succeeds |
| **Declined** | `4000 0000 0000 0002` | Card declined |
| **Insufficient Funds** | `4000 0000 0000 9995` | Insufficient funds |
| **3D Secure** | `4000 0027 6000 3184` | Requires authentication |

### Test Expiry & CVC
- **Expiry**: Any future date (e.g., 12/30)
- **CVC**: Any 3 digits (e.g., 123)

---

## How It Works

### Payment Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Mobile App     │     │  Supabase Edge   │     │     Stripe       │
│                  │     │    Function      │     │                  │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │ 1. User adds card      │                        │
         │ ───────────────────────┼───────────────────────>│
         │                        │                        │
         │ 2. Stripe returns      │                        │
         │    PaymentMethod ID    │                        │
         │ <───────────────────────────────────────────────│
         │                        │                        │
         │ 3. App saves PM ID     │                        │
         │    to Supabase DB      │                        │
         │ ─────────────────────> │                        │
         │                        │                        │
         │ 4. Checkout: Call      │                        │
         │    Edge Function       │                        │
         │ ─────────────────────> │                        │
         │                        │ 5. Create PaymentIntent│
         │                        │ ───────────────────────>│
         │                        │                        │
         │                        │ 6. Stripe validates    │
         │                        │    and charges card    │
         │                        │ <───────────────────────│
         │                        │                        │
         │ 7. Return result       │                        │
         │ <───────────────────── │                        │
         │                        │                        │
```

### Files Involved

| File | Purpose |
|------|---------|
| `supabase/functions/create-payment-intent/index.ts` | Edge function that creates PaymentIntents |
| `lib/paymentService.ts` | Client-side service that calls the edge function |
| `hooks/useCheckout.ts` | Checkout hooks with payment processing |
| `components/payment/StripeAddCardForm.tsx` | Card input form using Stripe's CardField |

---

## Troubleshooting

### "Invalid API Key" Error
- Ensure your publishable key is correct in `.env`
- Restart Expo: `npx expo start --clear`

### "Function not found" Error
- Make sure you deployed the edge function: `supabase functions deploy create-payment-intent`
- Check your Supabase project is linked correctly

### Card Always Declined
- You might be using a decline test card
- Use `4242 4242 4242 4242` for successful payments

### 3D Secure Not Working
- Ensure your app has the return URL configured
- Check that `handleNextAction` is being called correctly

---

## Going Live

When ready for production:

1. **Switch to Live Keys**:
   - Replace `pk_test_` with `pk_live_` in `.env`
   - Replace `sk_test_` with `sk_live_` in Supabase secrets

2. **Enable Live Mode in Stripe Dashboard**

3. **Test with Real Cards** (small amounts first!)

4. **Set Up Webhooks** (optional but recommended):
   - Configure Stripe webhooks for payment confirmations
   - Handle async payment events

---

## Security Notes

⚠️ **NEVER**:
- Put your secret key (`sk_*`) in client-side code
- Commit API keys to git
- Log full card numbers

✅ **ALWAYS**:
- Use environment variables for keys
- Keep secret key only on server (Supabase Edge Functions)
- Use Stripe's secure card collection (CardField component)
