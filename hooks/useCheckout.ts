// Checkout-related hooks
import { createPaymentIntent, showPaymentError } from "@/lib/paymentService";
import { supabase } from "@/lib/supabase";
import { Address, DELIVERY_FEE, SelectedPaymentInfo } from "@/types/checkout";
import { PaymentMethod } from "@/types/payment";
import { useStripe } from "@stripe/stripe-react-native";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { CartItem } from "./useCart";

/**
 * Hook for managing delivery addresses in checkout
 */
export function useCheckoutAddresses() {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const loadAddresses = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("is_default", { ascending: false });

      if (!error && data) {
        setAddresses(data);
        // Auto-select default address
        const defaultAddr = data.find((a) => a.is_default) || data[0];
        if (defaultAddr) setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  return {
    loading,
    addresses,
    selectedAddress,
    setSelectedAddress,
    refreshAddresses: loadAddresses,
  };
}

/**
 * Hook for managing payment method selection
 */
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

/**
 * Hook for calculating checkout totals
 */
export function useCheckoutTotals(cartTotal: number) {
  const deliveryFee = DELIVERY_FEE;
  const totalWithDelivery = cartTotal + deliveryFee;

  return {
    deliveryFee,
    totalWithDelivery,
  };
}

/**
 * Hook for payment processing logic with real Stripe integration
 */
export function usePaymentProcessing() {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { handleNextAction } = useStripe();

  /**
   * Process card payment using Stripe
   * This calls the Supabase Edge Function to create and confirm a PaymentIntent
   */
  const processCardPayment = async (
    stripePaymentMethodId: string,
    totalAmountRands: number,
  ): Promise<boolean> => {
    if (!stripePaymentMethodId) {
      Alert.alert("Error", "No payment method selected");
      return false;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        Alert.alert("Error", "Please sign in to complete payment");
        return false;
      }

      // Convert Rands to cents for Stripe
      const amountInCents = Math.round(totalAmountRands * 100);

      console.log("Processing payment:", {
        paymentMethodId: stripePaymentMethodId,
        amount: amountInCents,
        currency: "zar",
      });

      // Call our Supabase Edge Function to process the payment
      const result = await createPaymentIntent(
        amountInCents,
        stripePaymentMethodId,
        "zar",
      );

      if (result.success) {
        console.log("Payment successful:", result.paymentIntentId);
        return true;
      }

      // Handle 3D Secure authentication if required
      if (result.requiresAction && result.clientSecret) {
        console.log("3D Secure authentication required");

        const { error: actionError } = await handleNextAction(
          result.clientSecret,
        );

        if (actionError) {
          Alert.alert(
            "Authentication Failed",
            actionError.message || "Card authentication failed",
          );
          return false;
        }

        // Authentication successful
        return true;
      }

      // Payment failed - show user-friendly error
      showPaymentError(result);
      return false;
    } catch (error: any) {
      console.error("Card payment error:", error);
      Alert.alert(
        "Payment Error",
        error.message || "Failed to process payment",
      );
      return false;
    }
  };

  /**
   * Process cash on delivery order
   */
  const processCashPayment = async (): Promise<boolean> => {
    console.log("Processing cash on delivery order");
    return true;
  };

  /**
   * Process digital wallet payment (Apple Pay, Google Pay)
   */
  const processWalletPayment = async (): Promise<boolean> => {
    console.log("Processing wallet payment");
    Alert.alert(
      "Coming Soon",
      "Digital wallet payments (Apple Pay, Google Pay) will be available soon!",
    );
    return false;
  };

  /**
   * Order data interface matching the database schema
   */
  interface OrderData {
    // User info
    userName: string;
    userSurname: string;
    userEmail: string;
    userContact: string;
    // Delivery address
    deliveryStreet: string;
    deliveryCity: string;
    deliveryPostalCode: string;
    // Payment info
    cardLastFour: string;
    paymentMethod: PaymentMethod;
    // Order totals
    subtotal: number;
    deliveryFee: number;
    total: number;
    num_items: number; // Total quantity of all items
    unique_items: number; // Count of distinct products
    // Optional
    notes?: string;
    // Items
    items: CartItem[];
  }

  /**
   * Create order in database
   * Matches the orders table schema
   */
  const createOrder = async (orderData: OrderData): Promise<boolean> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return false;

      // Determine payment status based on payment method
      const paymentStatus =
        orderData.paymentMethod === "cash" ? "pending" : "paid";

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: session.user.id,
          user_name: orderData.userName,
          user_surname: orderData.userSurname,
          user_email: orderData.userEmail,
          user_contact: orderData.userContact,
          delivery_street: orderData.deliveryStreet,
          delivery_city: orderData.deliveryCity,
          delivery_postal_code: orderData.deliveryPostalCode,
          card_last_four: orderData.cardLastFour,
          subtotal: orderData.subtotal,
          delivery_fee: orderData.deliveryFee,
          total: orderData.total,
          status: "preparing",
          payment_status: paymentStatus,
          notes: orderData.notes || null,
          num_items: orderData.num_items,
          unique_items: orderData.unique_items,
        })
        .select()
        .single();

      if (error || !data) throw error;

      console.log("Order created successfully:", data.id);

      // Insert order items
      const orderItems = orderData.items.map((item) => ({
        order_id: data.id,
        menu_item_id: item.menuItemId,
        item_name: item.name,
        base_price: item.price,
        quantity: item.quantity,
        selected_sides: JSON.stringify(item.customization.selectedSides),
        selected_drink: JSON.stringify(item.customization.selectedDrink),
        selected_extras: JSON.stringify(item.customization.selectedExtras),
        ingredient_modifications: JSON.stringify(
          item.customization.ingredientMods,
        ),
        item_total: item.totalItemPrice,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Optionally handle partial failure (rollback order?)
        // For now, we'll throw, which assumes the UI handles the error
        throw itemsError;
      }

      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      return false;
    }
  };

  return {
    paymentLoading,
    setPaymentLoading,
    processCardPayment,
    processCashPayment,
    processWalletPayment,
    createOrder,
  };
}
