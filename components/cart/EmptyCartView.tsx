import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type EmptyCartViewProps = {
    onClose: () => void;
};

export const EmptyCartView = ({ onClose }: EmptyCartViewProps) => {
    return (
        <View className="items-center justify-center py-16 px-6">
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text className="text-gray-400 text-lg mt-4 text-center">
                Your cart is empty
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
                Add some delicious items to get started!
            </Text>
            <TouchableOpacity
                onPress={onClose}
                className="mt-6 bg-orange-500 px-8 py-3 rounded-full"
            >
                <Text className="text-white font-bold">Browse Menu</Text>
            </TouchableOpacity>
        </View>
    );
};
