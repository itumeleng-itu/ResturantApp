import { SideOption } from '@/types/customization';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SideSelectionProps = {
    options: SideOption[];
    selectedSides: SideOption[];
    onToggle: (side: SideOption) => void;
};

export const SideSelection = ({ options, selectedSides, onToggle }: SideSelectionProps) => {
    if (options.length === 0) return null;

    return (
        <View className="mt-6 mb-3">
            <View className="mb-3">
                <Text className="text-white text-lg font-bold">Choose Your Sides</Text>
                <Text className="text-gray-400 text-sm mt-1">Select up to 2 (included in price)</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
                {options.map((side) => {
                    const isSelected = selectedSides.some(s => s.id === side.id);
                    return (
                        <TouchableOpacity
                            key={side.id}
                            onPress={() => onToggle(side)}
                            className={`px-4 py-3 rounded-xl border ${
                                isSelected 
                                    ? 'bg-orange-500 border-orange-500' 
                                    : 'bg-gray-800 border-gray-700'
                            }`}
                        >
                            <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {side.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
