import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type FoodModalFooterProps = {
    quantity: number;
    customizationPrice: number;
    basePrice: number;
    isAvailable: boolean;
    onDecrement: () => void;
    onIncrement: () => void;
    onAddToCart: () => void;
};

export const FoodModalFooter = ({
    quantity,
    customizationPrice,
    basePrice,
    isAvailable,
    onDecrement,
    onIncrement,
    onAddToCart,
}: FoodModalFooterProps) => {
    const itemTotalPrice = (basePrice + customizationPrice) * quantity;

    return (
        <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 pt-4 pb-8">
            {/* Price breakdown */}
            {customizationPrice > 0 && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400">Extras:</Text>
                    <Text className="text-gray-400">+R{customizationPrice.toFixed(2)}</Text>
                </View>
            )}

            {/* Quantity selector and Add button */}
            <View className="flex-row items-center gap-4">
                {/* Quantity Selector */}
                <View className="flex-row items-center bg-gray-800 rounded-full">
                    <TouchableOpacity
                        onPress={onDecrement}
                        disabled={quantity <= 1}
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                            quantity <= 1 ? 'opacity-50' : ''
                        }`}
                    >
                        <MaterialIcons name="remove" size={24} color={quantity <= 1 ? '#666' : 'white'} />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold w-10 text-center">{quantity}</Text>
                    <TouchableOpacity
                        onPress={onIncrement}
                        className="w-12 h-12 rounded-full items-center justify-center"
                    >
                        <MaterialIcons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity
                    onPress={onAddToCart}
                    disabled={!isAvailable}
                    className={`flex-1 py-4 rounded-full items-center justify-center ${
                        isAvailable ? 'bg-orange-500' : 'bg-gray-700'
                    }`}
                >
                    <Text className={`text-lg font-bold ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                        {isAvailable
                            ? `Add to Cart • R${itemTotalPrice.toFixed(2)}`
                            : 'Out of Stock'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
