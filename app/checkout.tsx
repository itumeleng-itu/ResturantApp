import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import {
    CheckoutHeader,
    DeliveryAddressSection,
    OrderSummarySection,
    PaymentSummarySection,
    PaymentWarning,
} from '@/components/checkout/CheckoutComponents';
import { SuccessAnimation } from '@/components/checkout/SuccessAnimation';
import PaymentMethodSelector from '@/components/ui/paymentMethods';

// Hooks
import { useCart } from '@/hooks/useCart';
import {
    useCheckoutAddresses,
    useCheckoutTotals,
    usePaymentProcessing,
    usePaymentSelection,
} from '@/hooks/useCheckout';

export default function CheckoutScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Custom hooks for checkout logic
    const { loading, selectedAddress } = useCheckoutAddresses();
    const { selectedPayment, handlePaymentMethodSelect } = usePaymentSelection();
    const { deliveryFee, totalWithDelivery } = useCheckoutTotals(cartTotal);
    const {
        paymentLoading,
        setPaymentLoading,
        processCardPayment,
        processCashPayment,
        processWalletPayment,
        createOrder,
    } = usePaymentProcessing();

    const handlePayment = async () => {
        // Validate delivery address
        if (!selectedAddress) {
            Alert.alert('Missing Address', 'Please select a delivery address');
            return;
        }

        // Validate cart is not empty
        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty');
            return;
        }

        // Validate payment method is selected
        if (!selectedPayment) {
            Alert.alert('Payment Required', 'Please select a payment method before proceeding');
            return;
        }

        // Handle "new-card" selection - redirect to add card
        if (selectedPayment.method === 'new-card') {
            router.push('/PaymentMethods');
            return;
        }

        setPaymentLoading(true);

        try {
            let paymentSuccess = false;

            // Process payment based on selected method
            switch (selectedPayment.method) {
                case 'saved-card':
                    if (!selectedPayment.stripePaymentMethodId) {
                        Alert.alert('Error', 'This card cannot be used for payment. Please add a new card.');
                        setPaymentLoading(false);
                        return;
                    }
                    paymentSuccess = await processCardPayment(
                        selectedPayment.stripePaymentMethodId,
                        totalWithDelivery
                    );
                    break;

                case 'cash':
                    paymentSuccess = await processCashPayment();
                    break;

                case 'wallet':
                    paymentSuccess = await processWalletPayment();
                    break;

                default:
                    Alert.alert('Error', 'Invalid payment method');
                    setPaymentLoading(false);
                    return;
            }

            if (paymentSuccess) {
                // Create order in database
                await createOrder(
                    selectedAddress.id,
                    cartItems,
                    cartTotal,
                    deliveryFee,
                    totalWithDelivery,
                    selectedPayment.method,
                    selectedPayment.stripePaymentMethodId
                );
                
                clearCart();
                setIsSuccess(true);
            }
        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const getPayButtonText = () => {
        if (!selectedPayment) {
            return 'Select Payment Method';
        }

        switch (selectedPayment.method) {
            case 'new-card':
                return 'Add Card to Continue';
            case 'cash':
                return `Confirm Order (Cash) - R${totalWithDelivery.toFixed(2)}`;
            case 'wallet':
                return `Pay with Wallet - R${totalWithDelivery.toFixed(2)}`;
            case 'saved-card':
            default:
                return `Pay R${totalWithDelivery.toFixed(2)}`;
        }
    };

    const isPayButtonDisabled = () => {
        if (paymentLoading || cartItems.length === 0) return true;
        if (!selectedPayment) return true;
        if (!selectedAddress) return true;
        return false;
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <View className="flex-1 bg-white items-center justify-center">
                    <ActivityIndicator size="large" color="#ea770c" />
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
                {/* Header */}
                <CheckoutHeader onBack={() => router.back()} />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Delivery Address Section */}
                    <DeliveryAddressSection 
                        selectedAddress={selectedAddress}
                        onChangePress={() => router.push('/DeliveryAddresses')}
                    />

                    {/* Order Summary Section */}
                    <OrderSummarySection cartItems={cartItems} />

                    {/* Select payment methods */}
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
                        <PaymentMethodSelector onMethodSelect={handlePaymentMethodSelect} />
                    </View>

                    {/* Payment Method Validation Message */}
                    {!selectedPayment && <PaymentWarning />}

                    {/* Payment Summary Section */}
                    <PaymentSummarySection
                        subtotal={cartTotal}
                        deliveryFee={deliveryFee}
                        total={totalWithDelivery}
                    />

                    {/* Spacer for bottom button */}
                    <View className="h-24" />
                </ScrollView>

                {/* Pay Now Button - Fixed at bottom */}
                <View 
                    className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4"
                    style={{ paddingBottom: insets.bottom + 16 }}
                >
                    <TouchableOpacity
                        onPress={handlePayment}
                        disabled={isPayButtonDisabled()}
                        className={`py-4 rounded-full items-center flex-row justify-center ${
                            isPayButtonDisabled() ? 'bg-gray-300' : 'bg-[#ea770c]'
                        }`}
                    >
                        {paymentLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <MaterialIcons 
                                    name={selectedPayment?.method === 'cash' ? 'payments' : 'payment'} 
                                    size={22} 
                                    color="white" 
                                />
                                <Text className="text-white font-bold text-lg ml-2">
                                    {getPayButtonText()}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
            {isSuccess && (
                <SuccessAnimation 
                    onAnimationFinish={() => {
                        router.replace('/orders');
                    }} 
                />
            )}
        </SafeAreaProvider>
    );
}
