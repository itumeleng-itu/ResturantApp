import { Card } from '@/types/payment';
import { getCardIcon } from '@/utils/cardUtils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SavedCardOptionProps = {
    card: Card;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
};

export default function SavedCardOption({ 
    card, 
    isSelected, 
    onSelect, 
    onDelete 
}: SavedCardOptionProps) {
    const cardIcon = getCardIcon(card.brand);

    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`flex-row items-center p-4 rounded-xl border-2 mb-3 ${
                isSelected
                    ? 'border-[#ea770c] bg-orange-50'
                    : 'border-gray-200 bg-white'
            }`}
            activeOpacity={0.7}
        >
            {/* Card Icon */}
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{
                    backgroundColor: isSelected ? cardIcon.color : '#f3f4f6',
                }}
            >
                <MaterialIcons
                    name="credit-card"
                    size={24}
                    color={isSelected ? 'white' : '#6b7280'}
                />
            </View>

            {/* Card Info */}
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text
                        className={`font-bold text-base ${
                            isSelected ? 'text-[#ea770c]' : 'text-gray-800'
                        }`}
                    >
                        {card.brand} •••• {card.last4}
                    </Text>
                    {card.isDefault && (
                        <View className="bg-green-100 px-2 py-1 rounded ml-2">
                            <Text className="text-green-700 text-xs font-semibold">
                                Default
                            </Text>
                        </View>
                    )}
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                    Expires {card.expiryMonth}/{card.expiryYear}
                </Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
                onPress={onDelete}
                className="p-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>

            {/* Selection Indicator */}
            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ml-2 ${
                    isSelected ? 'border-[#ea770c]' : 'border-gray-300'
                }`}
            >
                {isSelected && (
                    <View className="w-3 h-3 rounded-full bg-[#ea770c]" />
                )}
            </View>
        </TouchableOpacity>
    );
}
