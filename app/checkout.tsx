import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import PaymentMethodSelector from '@/components/ui/paymentMethods';

import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';

type Address = {
    id: string;
    label: string;
    street: string;
    city: string;
    postal_code: string;
    is_default: boolean;
};

export default function CheckoutScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    
    const deliveryFee = 25.00; // Fixed delivery fee in Rands
    const totalWithDelivery = cartTotal + deliveryFee;

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false });

            if (!error && data) {
                setAddresses(data);
                // Auto-select default address
                const defaultAddr = data.find(a => a.is_default) || data[0];
                if (defaultAddr) setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder function - In production, this would call your backend
    const fetchPaymentSheetParams = async () => {
        // TODO: Replace with actual backend call to create PaymentIntent
        // For now, we'll simulate the payment flow
        // 
        // In production, you would:
        // 1. Call your backend (e.g., Supabase Edge Function)
        // 2. Backend creates PaymentIntent with Stripe
        // 3. Returns paymentIntent, ephemeralKey, customer
        
        // Simulated response for testing UI
        return {
            paymentIntent: 'pi_test_simulated',
            ephemeralKey: 'ek_test_simulated',
            customer: 'cus_test_simulated',
        };
    };

    const initializePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "The Eatery",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: {
                name: 'Customer',
            },
        });

        if (error) {
            console.log('Error initializing payment sheet:', error);
        }
    };

    const handlePayment = async () => {
        if (!selectedAddress) {
            Alert.alert('Missing Address', 'Please select a delivery address');
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty');
            return;
        }

        setPaymentLoading(true);

        try {
            // For now, simulate payment success since we don't have a backend
            // In production, uncomment the Stripe payment sheet flow below
            
            /*
            await initializePaymentSheet();
            const { error } = await presentPaymentSheet();

            if (error) {
                Alert.alert(`Payment failed`, error.message);
                return;
            }
            */

            // Simulate successful payment
            setTimeout(() => {
                setPaymentLoading(false);
                clearCart();
                Alert.alert(
                    'Order Placed!',
                    'Your order has been placed successfully. You will receive a confirmation shortly.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/orders'),
                        },
                    ]
                );
            }, 1500);

        } catch (error) {
            console.error('Payment error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
        }
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
                <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Checkout</Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Delivery Address Section */}
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold">Delivery Address</Text>
                            <TouchableOpacity onPress={() => router.push('/DeliveryAddresses')}>
                                <Text className="text-[#ea770c] font-medium">Change</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {selectedAddress ? (
                            <View className="flex-row items-start">
                                <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                                    <MaterialIcons 
                                        name={selectedAddress.label === 'Home' ? 'home' : selectedAddress.label === 'Work' ? 'work' : 'location-on'} 
                                        size={20} 
                                        color="#ea770c" 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-800">{selectedAddress.label}</Text>
                                    <Text className="text-gray-500 text-sm">{selectedAddress.street}</Text>
                                    <Text className="text-gray-400 text-sm">{selectedAddress.city}, {selectedAddress.postal_code}</Text>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                onPress={() => router.push('/DeliveryAddresses')}
                                className="flex-row items-center py-3 border-2 border-dashed border-gray-200 rounded-xl justify-center"
                            >
                                <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                                <Text className="text-gray-500 ml-2">Add delivery address</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Order Summary Section */}
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
                        <Text className="text-lg font-bold mb-4">Order Summary</Text>
                        
                        {cartItems.map((item) => (
                            <View key={item.id} className="flex-row items-center py-3 border-b border-gray-50">
                                {item.image_url ? (
                                    <Image 
                                        source={{ uri: item.image_url }} 
                                        className="w-16 h-16 rounded-xl bg-gray-100"
                                    />
                                ) : (
                                    <View className="w-16 h-16 rounded-xl bg-gray-100 items-center justify-center">
                                        <MaterialIcons name="restaurant" size={24} color="#d1d5db" />
                                    </View>
                                )}
                                <View className="flex-1 ml-3">
                                    <Text className="font-semibold text-gray-800" numberOfLines={1}>{item.name}</Text>
                                    <Text className="text-gray-400 text-sm">Qty: {item.quantity}</Text>
                                </View>
                                <Text className="font-bold text-gray-800">R{(item.price * item.quantity).toFixed(2)}</Text>
                            </View>
                        ))}

                        {cartItems.length === 0 && (
                            <View className="items-center py-6">
                                <MaterialIcons name="shopping-cart" size={48} color="#d1d5db" />
                                <Text className="text-gray-400 mt-2">Your cart is empty</Text>
                            </View>
                        )}
                    </View>

                    {/* Select payment methods */}
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
                        <PaymentMethodSelector />
                    </View>

                    {/* Payment Summary Section */}
                    <View className="bg-white mx-4 mt-4 mb-4 rounded-2xl p-4">
                        <Text className="text-lg font-bold mb-4">Payment Summary</Text>
                        
                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-500">Subtotal</Text>
                            <Text className="font-medium text-gray-800">R{cartTotal.toFixed(2)}</Text>
                        </View>
                        
                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-500">Delivery Fee</Text>
                            <Text className="font-medium text-gray-800">R{deliveryFee.toFixed(2)}</Text>
                        </View>
                        
                        <View className="border-t border-gray-100 mt-2 pt-3">
                            <View className="flex-row justify-between">
                                <Text className="text-lg font-bold">Total</Text>
                                <Text className="text-lg font-bold text-[#ea770c]">R{totalWithDelivery.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

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
                        disabled={paymentLoading || cartItems.length === 0}
                        className={`py-4 rounded-full items-center flex-row justify-center ${
                            paymentLoading || cartItems.length === 0 ? 'bg-gray-300' : 'bg-[#ea770c]'
                        }`}
                    >
                        {paymentLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <MaterialIcons name="payment" size={22} color="white" />
                                <Text className="text-white font-bold text-lg ml-2">
                                    Pay R{totalWithDelivery.toFixed(2)}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaProvider>
    );
}
