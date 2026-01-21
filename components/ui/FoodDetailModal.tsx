import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available?: boolean;
  is_spicy?: boolean;
  category?: string;
};

type FoodDetailModalProps = {
  visible: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number) => void;
};

const { width: screenWidth } = Dimensions.get('window');
const modalWidth = screenWidth - 48;

export default function FoodDetailModal({
  visible,
  item,
  onClose,
  onAddToCart,
}: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Reset quantity when modal opens with a new item
  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setImageError(false);
    }
  }, [visible, item?.id]);

  if (!item) return null;

  const hasImage = item.image_url && !imageError;
  const totalPrice = item.price * quantity;

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop with blur effect */}
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        onPress={onClose}
      >
        {/* Modal Card */}
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width: modalWidth }}
          className="bg-[#1a1a1a] rounded-3xl overflow-hidden"
        >
          {/* Image Section */}
          <View className="w-full h-56 bg-[#262626] items-center justify-center relative">
            {hasImage ? (
              <Image
                source={{ uri: item.image_url }}
                className="w-full h-full"
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <MaterialIcons name="fastfood" size={80} color="#404040" />
            )}

            {/* Spicy Badge */}
            {item.is_spicy && (
              <View className="absolute bottom-4 right-4 bg-red-600 rounded-full px-3 py-1 flex-row items-center">
                <Text className="text-white font-semibold text-sm">Spicy</Text>
              </View>
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 items-center justify-center"
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Content Section */}
          <View className="p-6">
            {/* Food Name */}
            <Text className="text-white text-2xl font-bold mb-2">
              {item.name}
            </Text>

            {/* Description */}
            <Text className="text-gray-400 text-base leading-6 mb-4">
              {item.description || 'A delicious meal prepared with the finest ingredients.'}
            </Text>

            {/* Price */}
            <Text className="text-[#ffffff] text-2xl font-bold mb-6">
              R{item.price.toFixed(2)}
            </Text>

            {/* Quantity Selector */}
            <View className="flex-row items-center justify-between mb-6">
              {/* Decrement Button */}
              <TouchableOpacity
                onPress={handleDecrement}
                disabled={quantity <= 1}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  quantity <= 1 ? 'bg-gray-700' : 'bg-gray-600'
                }`}
              >
                <MaterialIcons
                  name="remove"
                  size={24}
                  color={quantity <= 1 ? '#666' : 'white'}
                />
              </TouchableOpacity>

              {/* Quantity Display */}
              <Text className="text-white text-2xl font-bold">{quantity}</Text>

              {/* Increment Button */}
              <TouchableOpacity
                onPress={handleIncrement}
                className="w-12 h-12 rounded-full bg-gray-600 items-center justify-center"
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={!item.is_available}
              className={`w-full py-4 rounded-full items-center justify-center ${
                item.is_available ? 'bg-[#ea770c]' : 'bg-gray-600'
              }`}
            >
              <Text
                className={`text-lg font-bold ${
                  item.is_available ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.is_available
                  ? `Add to Cart  R${totalPrice.toFixed(2)}`
                  : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
