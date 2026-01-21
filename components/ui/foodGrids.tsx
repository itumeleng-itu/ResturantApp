// components/FoodGrids.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View
} from "react-native";

// Components
import FoodCard from './FoodCard';
import FoodDetailModal, { FoodItem } from './FoodDetailModal';

// Hook
import { useGetData } from "@/hooks/useGetData";

export default function FoodGrids() {
  const { getAllItems, loading } = useGetData();
  
  const [items, setItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 60) / 2; // 2 columns with spacing

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllItems();
    if (data) {
      setItems(data);
    }
  };

  // Handle item press - open modal with item details
  const handleItemPress = (item: FoodItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // Handle add to cart from modal
  const handleAddToCart = (item: FoodItem, quantity: number) => {
    console.log('Add to cart:', item.name, 'Quantity:', quantity, 'Total:', item.price * quantity);
    // TODO: Implement actual cart logic
  };

  // Handle quick add from card
  const handleQuickAdd = (item: FoodItem) => {
    console.log('Quick add to cart:', item.name);
    // TODO: Add single item to cart
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <View className="w-full items-center justify-center mt-20">
        <ActivityIndicator size="large" color="#ea770c" />
        <Text className="text-gray-400 mt-4">Loading delicious food...</Text>
      </View>
    );
  }

  // Empty state
  if (!loading && items.length === 0) {
    return (
      <View className="w-full items-center justify-center px-6 mt-20">
        <MaterialIcons name="restaurant-menu" size={80} color="#e5e7eb" />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          No items available
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap justify-between px-6 mt-6">
          {items.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              width={cardWidth}
              onPress={() => handleItemPress(item)}
              onAddPress={() => handleQuickAdd(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Food Detail Modal */}
      <FoodDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}