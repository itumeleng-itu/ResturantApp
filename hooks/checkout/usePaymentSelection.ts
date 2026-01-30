import { SelectedPaymentInfo } from "@/types/checkout";
import { PaymentMethod } from "@/types/payment";
import { useCallback, useState } from "react";

export function usePaymentSelection() {
    const [selectedPayment, setSelectedPayment] =
        useState<SelectedPaymentInfo | null>(null);

    const handlePaymentMethodSelect = useCallback(
        (
            method: PaymentMethod,
            cardId?: string,
            stripePaymentMethodId?: string,
            cardLast4?: string,
        ) => {
            setSelectedPayment({
                method,
                cardId,
                stripePaymentMethodId,
                cardLast4,
            });
        },
        [],
    );

    return {
        selectedPayment,
        handlePaymentMethodSelect,
    };
}
