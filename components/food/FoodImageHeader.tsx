import { FoodItem } from '@/types/food';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';

export const FoodImageHeader = ({ item }: { item: FoodItem }) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = item.image_url && !imageError;

    return (
        <View className="w-full h-48 bg-gray-800 rounded-2xl overflow-hidden mb-4">
            {hasImage ? (
                <Image
                    source={{ uri: item.image_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View className="flex-1 items-center justify-center">
                    <MaterialIcons name="fastfood" size={60} color="#404040" />
                </View>
            )}
            {item.is_spicy && (
                <View className="absolute top-3 right-3 bg-red-600 rounded-full px-3 py-1">
                    <Text className="text-white font-semibold text-xs">🌶️ Spicy</Text>
                </View>
            )}
        </View>
    );
};
