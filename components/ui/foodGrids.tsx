// components/FoodGrids.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Text,
    View
} from "react-native";

// Components
import FoodCard from './FoodCard';
import FoodDetailModal, { FoodItem } from './FoodDetailModal';
import { FilterOptions } from './searchNfilter';

// Hooks
import { useCart } from "@/hooks/useCart";
import { useGetData } from "@/hooks/useGetData";

type FoodGridsProps = {
  selectedCategory: string;
  searchQuery?: string;
  filterOptions?: FilterOptions;
};

export default function FoodGrids({ 
  selectedCategory, 
  searchQuery = '', 
  filterOptions 
}: FoodGridsProps) {
  const { getAllItems, loading } = useGetData();
  const { addToCart } = useCart();
  
  const [items, setItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
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
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter and sort items based on category, search query, and filter options
  const filteredItems = useMemo(() => {
    let result = [...items];

    // 1. Filter by category
    if (selectedCategory.toLowerCase() !== 'all') {
      result = result.filter(item => 
        item.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category_name?.toLowerCase().includes(query)
      );
    }

    // 3. Filter by price range
    if (filterOptions?.priceRange && filterOptions.priceRange !== 'all') {
      switch (filterOptions.priceRange) {
        case 'under50':
          result = result.filter(item => item.price < 50);
          break;
        case '50to100':
          result = result.filter(item => item.price >= 50 && item.price <= 100);
          break;
        case 'over100':
          result = result.filter(item => item.price > 100);
          break;
      }
    }

    // 4. Sort items
    if (filterOptions?.sortBy) {
      switch (filterOptions.sortBy) {
        case 'name':
          result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'price_low':
          result.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price_high':
          result.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'popular':
        default:
          // Keep original order (or could sort by rating/orders if available)
          break;
      }
    }

    return result;
  }, [items, selectedCategory, searchQuery, filterOptions]);

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

  // Empty state - different messages based on context
  if (!loading && filteredItems.length === 0) {
    const isSearching = searchQuery.trim().length > 0;
    const hasFilters = filterOptions?.priceRange !== 'all' || filterOptions?.sortBy !== 'popular';

    return (
      <View className="w-full items-center justify-center px-6 mt-20">
        <MaterialIcons 
          name={isSearching ? "search-off" : "restaurant-menu"} 
          size={80} 
          color="#e5e7eb" 
        />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          {isSearching 
            ? `No results for "${searchQuery}"`
            : hasFilters
              ? 'No items match your filters'
              : `No items found in ${selectedCategory}`
          }
        </Text>
        {(isSearching || hasFilters) && (
          <Text className="text-gray-300 text-sm mt-2 text-center">
            Try adjusting your search or filters
          </Text>
        )}
      </View>
    );
  }

  return (
    <>
      {/* Results count when searching */}
      {searchQuery.trim() && (
        <View className="px-6 mt-4 mb-2">
          <Text className="text-gray-500 text-sm">
            {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
          </Text>
        </View>
      )}

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
