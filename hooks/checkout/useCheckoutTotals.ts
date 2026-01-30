import { DELIVERY_FEE } from "@/types/checkout";

export function useCheckoutTotals(cartTotal: number) {
    const deliveryFee = DELIVERY_FEE;
    const totalWithDelivery = cartTotal + deliveryFee;

    return {
        deliveryFee,
        totalWithDelivery,
    };
}
