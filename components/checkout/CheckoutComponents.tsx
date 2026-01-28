// Checkout UI Sub-components
import { CartItem } from '@/hooks/useCart';
import { Address } from '@/types/checkout';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * Checkout Header Component
 */
type CheckoutHeaderProps = {
    onBack: () => void;
};

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
    return (
        <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100">
            <TouchableOpacity 
                onPress={onBack}
                className="w-10 h-10 items-center justify-center"
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text className="flex-1 text-xl font-bold text-center mr-10">Checkout</Text>
        </View>
    );
}

/**
 * Delivery Address Section Component
 */
type DeliveryAddressSectionProps = {
    selectedAddress: Address | null;
    onChangePress: () => void;
};

export function DeliveryAddressSection({ selectedAddress, onChangePress }: DeliveryAddressSectionProps) {
    const router = useRouter();

    const getAddressIcon = (label: string) => {
        switch (label) {
            case 'Home': return 'home';
            case 'Work': return 'work';
            default: return 'location-on';
        }
    };

    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold">Delivery Address</Text>
                <TouchableOpacity onPress={onChangePress}>
                    <Text className="text-[#ea770c] font-medium">Change</Text>
                </TouchableOpacity>
            </View>
            
            {selectedAddress ? (
                <View className="flex-row items-start">
                    <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                        <MaterialIcons 
                            name={getAddressIcon(selectedAddress.label) as any}
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
    );
}

/**
 * Order Summary Section Component
 */
import { formatCustomizationSummary } from '@/types/customization';

type OrderSummarySectionProps = {
    cartItems: CartItem[];
};

export function OrderSummarySection({ cartItems }: OrderSummarySectionProps) {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
            <Text className="text-lg font-bold mb-4">Order Summary</Text>
            
            {cartItems.map((item) => {
                const hasCustomizations = item.customizationPrice && item.customizationPrice > 0;
                const totalPrice = item.totalItemPrice || (item.price * item.quantity);
                const customizationLines = item.customization 
                    ? formatCustomizationSummary(item.customization) 
                    : [];

                return (
                    <View key={item.id} className="py-3 border-b border-gray-50">
                        <View className="flex-row items-start">
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
                                <Text className="font-semibold text-gray-800" numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <View className="flex-row items-center gap-2">
                                    <Text className="text-gray-400 text-sm">
                                        R{item.price.toFixed(2)} × {item.quantity}
                                    </Text>
                                    {hasCustomizations && (
                                        <Text className="text-orange-500 text-sm">
                                            +R{item.customizationPrice.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text className="font-bold text-gray-800">
                                R{totalPrice.toFixed(2)}
                            </Text>
                        </View>
                        
                        {/* Customization details */}
                        {customizationLines.length > 0 && (
                            <View className="ml-19 mt-2 pl-4 border-l-2 border-orange-100">
                                {customizationLines.map((line, index) => (
                                    <Text key={index} className="text-gray-500 text-xs mb-0.5">
                                        {`• ${line}`}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                );
            })}

            {cartItems.length === 0 && (
                <View className="items-center py-6">
                    <MaterialIcons name="shopping-cart" size={48} color="#d1d5db" />
                    <Text className="text-gray-400 mt-2">Your cart is empty</Text>
                </View>
            )}
        </View>
    );
}

/**
 * Payment Summary Section Component
 */
type PaymentSummarySectionProps = {
    subtotal: number;
    deliveryFee: number;
    total: number;
};

export function PaymentSummarySection({ subtotal, deliveryFee, total }: PaymentSummarySectionProps) {
    return (
        <View className="bg-white mx-4 mt-4 mb-4 rounded-2xl p-4">
            <Text className="text-lg font-bold mb-4">Payment Summary</Text>
            
            <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Subtotal</Text>
                <Text className="font-medium text-gray-800">R{subtotal.toFixed(2)}</Text>
            </View>
            
            <View className="flex-row justify-between py-2">
                <Text className="text-gray-500">Delivery Fee</Text>
                <Text className="font-medium text-gray-800">R{deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View className="border-t border-gray-100 mt-2 pt-3">
                <View className="flex-row justify-between">
                    <Text className="text-lg font-bold">Total</Text>
                    <Text className="text-lg font-bold text-[#ea770c]">R{total.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
}

/**
 * Payment Warning Component
 */
export function PaymentWarning() {
    return (
        <View className="mx-4 mt-2 px-4 py-2 bg-amber-50 rounded-lg flex-row items-center">
            <Ionicons name="warning" size={16} color="#f59e0b" />
            <Text className="text-amber-700 text-sm ml-2">
                Please select a payment method to continue
            </Text>
        </View>
    );
}
