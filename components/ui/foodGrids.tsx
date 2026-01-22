// components/FoodGrids.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  View
} from "react-native";

// Components
import FoodCard from './FoodCard';
import FoodDetailModal, { FoodItem } from './FoodDetailModal';

// Hooks
import { useCart } from "@/hooks/useCart";
import { useGetData } from "@/hooks/useGetData";

type FoodGridsProps = {
  selectedCategory: string;
};

export default function FoodGrids({ selectedCategory }: FoodGridsProps) {
  const { getAllItems, loading } = useGetData();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 60) / 2; // 2 columns with spacing

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter items when category changes or items change
  useEffect(() => {
    if (selectedCategory.toLowerCase() === 'all') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  }, [selectedCategory, items]);

  const loadData = async () => {
    const data = await getAllItems();
    if (data) {
      setItems(data);
    }
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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

  // Handle add to cart from modal (with quantity)
  const handleAddToCart = (item: FoodItem, quantity: number) => {
    addToCart(item, quantity);
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
  if (!loading && filteredItems.length === 0) {
    return (
      <View className="w-full items-center justify-center px-6 mt-20">
        <MaterialIcons name="restaurant-menu" size={80} color="#e5e7eb" />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          No items found in "{selectedCategory}"
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-row flex-wrap justify-between px-6 mt-6">
        {filteredItems.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            width={cardWidth}
            onPress={() => handleItemPress(item)}
          />
        ))}
      </View>

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
