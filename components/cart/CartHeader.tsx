import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type CartHeaderProps = {
  cartCount: number;
  uniqueItemsCount: number;
  onClose: () => void;
};

export const CartHeader = ({ cartCount, uniqueItemsCount, onClose }: CartHeaderProps) => {
    return (
        <View className="flex-row justify-between items-center px-6 pb-4">
            <View>
                <Text className="text-black text-2xl font-bold">Your Cart</Text>
                {cartCount > 0 && (
                    <Text className="text-gray-500 text-sm">
                        {cartCount} {cartCount === 1 ? "item" : "items"} •{" "}
                        {uniqueItemsCount}{" "}
                        {uniqueItemsCount === 1 ? "product" : "products"}
                    </Text>
                )}
            </View>
            <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
};
