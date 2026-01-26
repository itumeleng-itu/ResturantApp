import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Filter options type
export type FilterOptions = {
    sortBy: 'name' | 'price_low' | 'price_high' | 'popular';
    priceRange: 'all' | 'under50' | '50to100' | 'over100';
};

type SearchNFilterProps = {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterOptions: FilterOptions;
    onFilterChange: (options: FilterOptions) => void;
};

const DEFAULT_FILTERS: FilterOptions = {
    sortBy: 'popular',
    priceRange: 'all',
};

export default function SearchNFilter({
    searchQuery,
    onSearchChange,
    filterOptions,
    onFilterChange,
}: SearchNFilterProps) {
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [tempFilters, setTempFilters] = useState<FilterOptions>(filterOptions);

    // Check if filters are active (not default)
    const hasActiveFilters = 
        filterOptions.sortBy !== DEFAULT_FILTERS.sortBy || 
        filterOptions.priceRange !== DEFAULT_FILTERS.priceRange;

    const handleOpenFilter = () => {
        setTempFilters(filterOptions);
        setFilterModalVisible(true);
    };

    const handleApplyFilters = () => {
        onFilterChange(tempFilters);
        setFilterModalVisible(false);
    };

    const handleResetFilters = () => {
        setTempFilters(DEFAULT_FILTERS);
    };

    const handleClearSearch = () => {
        onSearchChange('');
    };

    // Sort options
    const sortOptions = [
        { key: 'popular', label: 'Most Popular' },
        { key: 'name', label: 'Name (A-Z)' },
        { key: 'price_low', label: 'Price: Low to High' },
        { key: 'price_high', label: 'Price: High to Low' },
    ] as const;

    // Price range options
    const priceRangeOptions = [
        { key: 'all', label: 'All Prices' },
        { key: 'under50', label: 'Under R50' },
        { key: '50to100', label: 'R50 - R100' },
        { key: 'over100', label: 'Over R100' },
    ] as const;

    return (
        <>
            <View className="px-6 mt-8 flex-row gap-3">
                {/* Search Input */}
                <View className="flex-1 flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                    <Ionicons name="search-outline" size={20} color="#9ca3af" />
                    <TextInput
                        placeholder="Search for food..."
                        className="ml-2 flex-1 text-gray-600"
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={onSearchChange}
                        returnKeyType="search"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch} className="p-1">
                            <Ionicons name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    onPress={handleOpenFilter}
                    className={`p-4 rounded-2xl justify-center ${hasActiveFilters ? 'bg-orange-500' : 'bg-black'}`}
                >
                    <Ionicons name="options-outline" size={20} color="white" />
                    {hasActiveFilters && (
                        <View className="absolute -top-1 -right-1 bg-white rounded-full w-3 h-3 border border-orange-500" />
                    )}
                </TouchableOpacity>
            </View>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
                <View className="px-6 mt-3 flex-row flex-wrap gap-2">
                    {filterOptions.sortBy !== 'popular' && (
                        <View className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full flex-row items-center">
                            <Text className="text-orange-600 text-xs font-medium">
                                {sortOptions.find(s => s.key === filterOptions.sortBy)?.label}
                            </Text>
                        </View>
                    )}
                    {filterOptions.priceRange !== 'all' && (
                        <View className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full flex-row items-center">
                            <Text className="text-orange-600 text-xs font-medium">
                                {priceRangeOptions.find(p => p.key === filterOptions.priceRange)?.label}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity 
                        onPress={() => onFilterChange(DEFAULT_FILTERS)}
                        className="bg-gray-100 px-3 py-1.5 rounded-full flex-row items-center"
                    >
                        <Ionicons name="close" size={12} color="#666" />
                        <Text className="text-gray-600 text-xs ml-1">Clear all</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Filter Modal */}
            <Modal
                visible={filterModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl max-h-[80%]">
                        {/* Modal Header */}
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Text className="text-gray-500 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <Text className="text-lg font-bold">Filters</Text>
                            <TouchableOpacity onPress={handleResetFilters}>
                                <Text className="text-orange-500 font-medium">Reset</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-6">
                            {/* Sort By Section */}
                            <View className="mb-6">
                                <Text className="text-base font-bold text-gray-900 mb-3">Sort By</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {sortOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option.key}
                                            onPress={() => setTempFilters(prev => ({ ...prev, sortBy: option.key }))}
                                            className={`px-4 py-2.5 rounded-full border ${
                                                tempFilters.sortBy === option.key
                                                    ? 'bg-orange-500 border-orange-500'
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <Text className={`font-medium ${
                                                tempFilters.sortBy === option.key
                                                    ? 'text-white'
                                                    : 'text-gray-700'
                                            }`}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Price Range Section */}
                            <View className="mb-6">
                                <Text className="text-base font-bold text-gray-900 mb-3">Price Range</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {priceRangeOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option.key}
                                            onPress={() => setTempFilters(prev => ({ ...prev, priceRange: option.key }))}
                                            className={`px-4 py-2.5 rounded-full border ${
                                                tempFilters.priceRange === option.key
                                                    ? 'bg-orange-500 border-orange-500'
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <Text className={`font-medium ${
                                                tempFilters.priceRange === option.key
                                                    ? 'text-white'
                                                    : 'text-gray-700'
                                            }`}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Spacer for bottom button */}
                            <View className="h-20" />
                        </ScrollView>

                        {/* Apply Button */}
                        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                            <TouchableOpacity
                                onPress={handleApplyFilters}
                                className="bg-orange-500 py-4 rounded-full items-center"
                            >
                                <Text className="text-white font-bold text-base">Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

// Export default filters for use in parent component
export { DEFAULT_FILTERS };
