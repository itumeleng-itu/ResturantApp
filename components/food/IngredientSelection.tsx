import { IngredientModification, IngredientOption } from '@/types/customization';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type IngredientSelectionProps = {
    options: IngredientOption[];
    modifications: IngredientModification[];
    onToggle: (ingredient: IngredientOption, action: 'add' | 'remove') => void;
};

export const IngredientSelection = ({ options, modifications, onToggle }: IngredientSelectionProps) => {
    if (options.length === 0) return null;

    const isIngredientModified = (ingredientId: string, action: 'add' | 'remove') => {
        return modifications.some(
            m => m.ingredient.id === ingredientId && m.action === action
        );
    };

    return (
        <View className="mt-6 mb-3">
            <View className="mb-3">
                <Text className="text-white text-lg font-bold">Customize Ingredients</Text>
                <Text className="text-gray-400 text-sm mt-1">Remove or add items</Text>
            </View>
            <View className="gap-2">
                {options.map((ingredient) => (
                    <View key={ingredient.id} className="flex-row items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                        <Text className="text-white font-medium flex-1">{ingredient.name}</Text>
                        <View className="flex-row gap-2">
                            {ingredient.can_remove && (
                                <TouchableOpacity
                                    onPress={() => onToggle(ingredient, 'remove')}
                                    className={`px-3 py-2 rounded-lg ${
                                        isIngredientModified(ingredient.id, 'remove')
                                            ? 'bg-red-500'
                                            : 'bg-gray-700'
                                    }`}
                                >
                                    <Text className="text-white text-sm font-medium">No</Text>
                                </TouchableOpacity>
                            )}
                            {ingredient.can_add && (
                                <TouchableOpacity
                                    onPress={() => onToggle(ingredient, 'add')}
                                    className={`px-3 py-2 rounded-lg ${
                                        isIngredientModified(ingredient.id, 'add')
                                            ? 'bg-green-500'
                                            : 'bg-gray-700'
                                    }`}
                                >
                                    <Text className="text-white text-sm font-medium">
                                        Extra{ingredient.add_price ? ` +R${ingredient.add_price}` : ''}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
