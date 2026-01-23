// Saved Card Display Components
import { Card } from '@/types/payment';
import { getCardIcon } from '@/utils/cardUtils';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * Selected Card Display (Collapsed View)
 */
type SelectedCardDisplayProps = {
    card: Card;
};

export function SelectedCardDisplay({ card }: SelectedCardDisplayProps) {
    const cardIcon = getCardIcon(card.brand);
    
    return (
        <View className="flex-row items-center p-4 rounded-xl border-2 border-[#ea770c] bg-orange-50">
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: cardIcon.color }}
            >
                <MaterialIcons name="credit-card" size={24} color="white" />
            </View>
            
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="font-bold text-base text-[#ea770c]">
                        {card.brand} •••• {card.last4}
                    </Text>
                    {card.isDefault && (
                        <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                            <Text className="text-green-700 text-xs font-semibold">Default</Text>
                        </View>
                    )}
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                    Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear.toString().slice(-2)}
                </Text>
            </View>

            <View className="w-6 h-6 rounded-full border-2 border-[#ea770c] items-center justify-center">
                <View className="w-3 h-3 rounded-full bg-[#ea770c]" />
            </View>
        </View>
    );
}

/**
 * Card Option in Selector (Expanded View)
 */
type CardOptionProps = {
    card: Card;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
};

export function CardOption({ card, isSelected, onSelect, onDelete }: CardOptionProps) {
    const cardIcon = getCardIcon(card.brand);
    
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`flex-row items-center p-4 rounded-xl border-2 mb-2 ${
                isSelected ? 'border-[#ea770c] bg-orange-50' : 'border-gray-200 bg-white'
            }`}
        >
            <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: isSelected ? cardIcon.color : '#f3f4f6' }}
            >
                <MaterialIcons
                    name="credit-card"
                    size={20}
                    color={isSelected ? 'white' : '#6b7280'}
                />
            </View>
            
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className={`font-semibold ${isSelected ? 'text-[#ea770c]' : 'text-gray-800'}`}>
                        {card.brand} •••• {card.last4}
                    </Text>
                    {card.isDefault && (
                        <View className="bg-green-100 px-2 py-0.5 rounded ml-2">
                            <Text className="text-green-700 text-xs">Default</Text>
                        </View>
                    )}
                </View>
                <Text className="text-gray-400 text-xs mt-0.5">
                    Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear.toString().slice(-2)}
                </Text>
            </View>

            {/* Delete button */}
            <TouchableOpacity
                onPress={onDelete}
                className="p-2 mr-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>

            <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected ? 'border-[#ea770c]' : 'border-gray-300'
                }`}
            >
                {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#ea770c]" />}
            </View>
        </TouchableOpacity>
    );
}

/**
 * Empty Card Selection Placeholder
 */
type EmptyCardPlaceholderProps = {
    cardCount: number;
};

export function EmptyCardPlaceholder({ cardCount }: EmptyCardPlaceholderProps) {
    return (
        <View className="flex-row items-center p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-gray-200">
                <MaterialIcons name="credit-card" size={24} color="#9ca3af" />
            </View>
            <View className="flex-1">
                <Text className="font-medium text-gray-600">Tap to select a card</Text>
                <Text className="text-gray-400 text-sm">{cardCount} card(s) available</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
    );
}

/**
 * Add New Card Button
 */
type AddNewCardButtonProps = {
    onPress: () => void;
};

export function AddNewCardButton({ onPress }: AddNewCardButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center p-3 rounded-xl border-2 border-dashed border-gray-300 mt-1"
        >
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-gray-100">
                <Ionicons name="add" size={20} color="#6b7280" />
            </View>
            <Text className="text-gray-500 font-medium">Add New Card</Text>
        </TouchableOpacity>
    );
}
