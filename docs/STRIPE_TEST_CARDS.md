# Stripe Test Cards Reference

This document contains all the test card numbers you can use when testing payments in **test mode** with Stripe.

> ⚠️ **Important**: These card numbers only work in Stripe's **test mode**. They will NOT work in live/production mode.

---

## ✅ Successful Payment Cards

These cards simulate successful payments:

| Card Brand | Number | CVC | Expiry Date |
|------------|--------|-----|-------------|
| **Visa** | `4242 4242 4242 4242` | Any 3 digits | Any future date |
| **Visa (debit)** | `4000 0566 5566 5556` | Any 3 digits | Any future date |
| **Mastercard** | `5555 5555 5555 4444` | Any 3 digits | Any future date |
| **Mastercard (2-series)** | `2223 0031 2200 3222` | Any 3 digits | Any future date |
| **Mastercard (debit)** | `5200 8282 8282 8210` | Any 3 digits | Any future date |
| **Mastercard (prepaid)** | `5105 1051 0510 5100` | Any 3 digits | Any future date |
| **American Express** | `3782 822463 10005` | Any 4 digits | Any future date |
| **Discover** | `6011 1111 1111 1117` | Any 3 digits | Any future date |
| **Diners Club** | `3056 9300 0902 0004` | Any 3 digits | Any future date |
| **JCB** | `3566 0020 2036 0505` | Any 3 digits | Any future date |
| **UnionPay** | `6200 0000 0000 0005` | Any 3 digits | Any future date |

---

## ❌ Declined Cards

Use these to test error handling for declined payments:

| Scenario | Card Number | Decline Code |
|----------|-------------|--------------|
| **Generic decline** | `4000 0000 0000 0002` | `card_declined` |
| **Insufficient funds** | `4000 0000 0000 9995` | `insufficient_funds` |
| **Lost card** | `4000 0000 0000 9987` | `lost_card` |
| **Stolen card** | `4000 0000 0000 9979` | `stolen_card` |
| **Expired card** | `4000 0000 0000 0069` | `expired_card` |
| **Incorrect CVC** | `4000 0000 0000 0127` | `incorrect_cvc` |
| **Processing error** | `4000 0000 0000 0119` | `processing_error` |
| **Incorrect number** | `4242 4242 4242 4241` | `incorrect_number` |

---

## 🔐 3D Secure (SCA) Test Cards

For testing Strong Customer Authentication (3D Secure):

| Scenario | Card Number | Behavior |
|----------|-------------|----------|
| **3DS Required** | `4000 0027 6000 3184` | Always requires authentication |
| **3DS Required (Mastercard)** | `5200 0000 0000 1096` | Always requires authentication |
| **3DS Optional** | `4000 0000 0000 3220` | Authentication optional |
| **3DS Not Supported** | `3782 822463 10005` | Card doesn't support 3DS |
| **3DS Authentication Fails** | `4000 0084 0000 1629` | Authentication will fail |

---

## 🌍 International Cards

Test cards for different countries:

| Country | Card Number |
|---------|-------------|
| **United States (US)** | `4242 4242 4242 4242` |
| **Brazil (BR)** | `4000 0007 6000 0002` |
| **Canada (CA)** | `4000 0012 4000 0000` |
| **Mexico (MX)** | `4000 0048 4000 8001` |
| **Argentina (AR)** | `4000 0003 2000 0021` |
| **United Kingdom (GB)** | `4000 0082 6000 0000` |
| **France (FR)** | `4000 0025 0000 0003` |
| **Germany (DE)** | `4000 0027 6000 0016` |
| **Spain (ES)** | `4000 0072 4000 0007` |
| **Italy (IT)** | `4000 0038 0000 0008` |
| **Australia (AU)** | `4000 0003 6000 0006` |
| **Japan (JP)** | `4000 0039 2000 0003` |
| **Singapore (SG)** | `4000 0070 2000 0003` |
| **South Africa (ZA)** | `4000 0071 0000 0002` |

---

## 💳 Specific Card Behaviors

### Cards that require specific CVC/ZIP
| Scenario | Card Number | Notes |
|----------|-------------|-------|
| **CVC check fails** | `4000 0000 0000 0101` | CVC verification fails |
| **ZIP code check fails** | `4000 0000 0000 0036` | Postal code verification fails |
| **Both checks fail** | `4000 0000 0000 0044` | Both CVC and ZIP fail |

### Cards with disputes/chargebacks
| Scenario | Card Number |
|----------|-------------|
| **Fraudulent dispute** | `4000 0000 0000 0259` |
| **Inquiry dispute** | `4000 0000 0000 1976` |
| **Warning dispute** | `4000 0000 0000 1000` |

---

## 📱 Apple Pay / Google Pay Test Cards

When testing digital wallets in test mode:

- Use the **Stripe test card numbers** in your Apple/Google wallet setup
- In the simulator/emulator, Apple Pay and Google Pay will use test tokens
- Real devices require additional setup (see Stripe docs)

---

## 🧪 Testing Tips

### Default Test Values
- **CVV/CVC**: Any 3-digit number (4 digits for Amex)
- **Expiry Date**: Any future date (MM/YY format)
- **ZIP/Postal Code**: Any valid format for the country

### Common Test Scenarios

1. **Happy Path**: Use `4242 4242 4242 4242` for successful payments
2. **Error Handling**: Use decline cards to test error messages
3. **3D Secure**: Use `4000 0027 6000 3184` to test authentication flows
4. **International**: Use country-specific cards for localization testing

### Testing in Your App

```javascript
// Test card details example
const testCard = {
  number: '4242 4242 4242 4242',
  exp_month: 12,
  exp_year: 2030,
  cvc: '123',
};
```

---

## 📚 Additional Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Test Clocks for Subscriptions](https://stripe.com/docs/billing/testing/test-clocks)
- [Stripe CLI for Local Testing](https://stripe.com/docs/stripe-cli)

---

## ⚡ Quick Reference

For quick testing, use this card:

```
Card:   4242 4242 4242 4242
Exp:    12/30
CVC:    123
ZIP:    12345
```

This will always succeed in test mode! 🎉
