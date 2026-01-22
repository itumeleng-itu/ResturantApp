// Card formatting and validation utilities

/**
 * Format card number with spaces (XXXX XXXX XXXX XXXX)
 */
export const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Format expiry date as MM/YY
 */
export const formatExpiryDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
};

/**
 * Detect card type from card number
 */
export const getCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');

    if (cleaned.startsWith('4')) {
        return 'Visa';
    } else if (cleaned.startsWith('5')) {
        return 'Mastercard';
    } else if (cleaned.startsWith('3')) {
        return 'Amex';
    }
    return 'Card';
};

/**
 * Validate expiry date is not in the past
 */
export const isExpiryDateValid = (expiry: string): boolean => {
    if (expiry.length !== 5) return false;

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (month < 1 || month > 12) {
        return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) {
        return false;
    }

    if (year === currentYear && month < currentMonth) {
        return false;
    }

    return true;
};

/**
 * Validate card form data
 */
export const validateCardForm = (
    cardNumber: string,
    cardHolder: string,
    expiryDate: string,
    cvv: string
): { valid: boolean; error?: string } => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        return { valid: false, error: 'Please fill in all card details' };
    }

    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanedCardNumber.length !== 16) {
        return { valid: false, error: 'Card number must be 16 digits' };
    }

    if (expiryDate.length !== 5) {
        return { valid: false, error: 'Please enter a valid expiry date (MM/YY)' };
    }

    if (!isExpiryDateValid(expiryDate)) {
        return { valid: false, error: 'Card expiry date must be in the future' };
    }

    if (cvv.length !== 3) {
        return { valid: false, error: 'CVV must be 3 digits' };
    }

    return { valid: true };
};

/**
 * Get card icon configuration based on brand
 */
export const getCardIcon = (brand: string): { name: string; color: string } => {
    switch (brand.toLowerCase()) {
        case 'visa':
            return { name: 'credit-card', color: '#1434CB' };
        case 'mastercard':
            return { name: 'credit-card', color: '#EB001B' };
        case 'amex':
            return { name: 'credit-card', color: '#006FCF' };
        default:
            return { name: 'credit-card', color: '#6b7280' };
    }
};
