import { DrinkOption } from '@/types/customization';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type DrinkSelectionProps = {
    options: DrinkOption[];
    selectedDrink?: DrinkOption;
    onSelect: (drink?: DrinkOption) => void;
};

export const DrinkSelection = ({ options, selectedDrink, onSelect }: DrinkSelectionProps) => {
    if (options.length === 0) return null;

    return (
        <View className="mt-6 mb-3">
            <View className="mb-3">
                <Text className="text-white text-lg font-bold">Add a Drink</Text>
                <Text className="text-gray-400 text-sm mt-1">Optional</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
                {/* No drink option */}
                <TouchableOpacity
                    onPress={() => onSelect(undefined)}
                    className={`px-4 py-3 rounded-xl border ${
                        !selectedDrink 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'bg-gray-800 border-gray-700'
                    }`}
                >
                    <Text className={`font-medium ${!selectedDrink ? 'text-white' : 'text-gray-300'}`}>
                        No Drink
                    </Text>
                </TouchableOpacity>
                {options.map((drink) => {
                    const isSelected = selectedDrink?.id === drink.id;
                    const priceText = drink.price > 0 ? ` (+R${drink.price.toFixed(2)})` : ' (Free)';
                    return (
                        <TouchableOpacity
                            key={drink.id}
                            onPress={() => onSelect(drink)}
                            className={`px-4 py-3 rounded-xl border ${
                                isSelected 
                                    ? 'bg-orange-500 border-orange-500' 
                                    : 'bg-gray-800 border-gray-700'
                            }`}
                        >
                            <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                {drink.name}
                                <Text className="text-xs">{priceText}</Text>
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
