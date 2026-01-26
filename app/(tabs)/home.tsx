//libraries
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";

//hooks
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//components
import CircularCategories from "@/components/ui/circularCategories";
import FoodGrids from "@/components/ui/foodGrids";
import Header from "@/components/ui/header";
import SearchNFilter, { DEFAULT_FILTERS, FilterOptions } from "@/components/ui/searchNfilter";


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(DEFAULT_FILTERS);
    
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      
      {/*header*/}
      <Header/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/*title */}
        <View className="px-6 mt-6">
          <Text className="text-4xl font-light tracking-tight text-black">
            Hungry? <Text className="text-gray-300">Order & Eat.</Text>
          </Text>
        </View>

        {/*search and filter*/}
        <SearchNFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterOptions={filterOptions}
          onFilterChange={setFilterOptions}
        />

        {/*categories*/}
        <CircularCategories 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />

        {/*food grid */}
        <FoodGrids 
          selectedCategory={activeCategory}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
        />
        
      </ScrollView>
    </View>
  );
}