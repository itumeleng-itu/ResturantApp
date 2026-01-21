import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type FoodCardProps = {
  item: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    is_available?: boolean;
  };
  width: number;
  onPress?: () => void;
};

export default function FoodCard({ 
  item, 
  width, 
  onPress
}: FoodCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = item.image_url && !imageError;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      // style usage here is necessary for the dynamic width from props
      style={{ width }}
      className={`bg-gray-50/50 rounded-[35px] p-4 mb-6 border border-gray-50 ${!item.is_available ? 'opacity-60' : ''}`}
      disabled={!item.is_available}
    >
      {/* Image Section */}
      <View className="w-full h-28 bg-white rounded-3xl mb-4 overflow-hidden items-center justify-center relative">
        {hasImage ? (
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <MaterialIcons name="fastfood" size={40} color="#e5e7eb" />
        )}
        
        {/* Out of Stock Overlay */}
        {!item.is_available && (
          <View className="absolute inset-0 bg-black/60 items-center justify-center">
            <Text className="text-white font-bold text-[10px] uppercase">Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Item Name */}
      <Text className="text-[13px] font-bold text-center text-gray-800" numberOfLines={1}>
        {item.name}
      </Text>

      {/* Subtitle */}
      <Text className="text-[10px] text-gray-400 text-center mt-1">
        Premium Quality
      </Text>

      {/* Price - */}
      <View className="items-start mt-4">
        <Text className="font-extrabold text-sm text-black">
          <Text className="text-[#ea770c] font-bold">R </Text>
          {item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
