import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

type CartSummaryProps = {
  cartCount: number;
  cartTotal: number;
  isLoggedIn: boolean;
  onCheckout: () => void;
  onClearCart: () => void;
};

export const CartSummary = ({ cartCount, cartTotal, isLoggedIn, onCheckout, onClearCart }: CartSummaryProps) => {
    return (
        <View className="px-6 py-4 border-t border-gray-100">
            {/* Subtotal */}
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-500">
                    Subtotal ({cartCount} items)
                </Text>
                <Text className="text-black font-medium">
                    R{cartTotal.toFixed(2)}
                </Text>
            </View>

            {/* Delivery Fee */}
            <View className="flex-row justify-between mb-4">
                <Text className="text-gray-500">Delivery Fee</Text>
                <Text className="text-black font-medium">R30.00</Text>
            </View>

            {/* Total */}
            <View className="flex-row justify-between mb-4">
                <Text className="text-black text-lg font-bold">Total</Text>
                <Text className="text-orange-500 text-xl font-bold">
                    R{(cartTotal + 30).toFixed(2)}
                </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
                onPress={onCheckout}
                className={`w-full py-4 rounded-full items-center justify-center 
                                  ${isLoggedIn ? "bg-orange-500" : "bg-gray-800"}`}
            >
                <Text className="text-white text-lg font-bold">
                    {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
                </Text>
            </TouchableOpacity>

            {/* Clear Cart */}
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        "Clear Cart",
                        "Are you sure you want to remove all items?",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Clear",
                                style: "destructive",
                                onPress: onClearCart,
                            },
                        ],
                    );
                }}
                className="mt-3 mb-3 items-center"
            >
                <Text className="text-red-500 font-medium">Clear Cart</Text>
            </TouchableOpacity>
        </View>
    );
};
