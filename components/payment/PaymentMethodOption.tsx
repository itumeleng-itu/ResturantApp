import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type PaymentMethodOptionProps = {
    icon: string;
    iconType: 'material' | 'ionicons';
    title: string;
    subtitle: string;
    isSelected: boolean;
    selectedColor: string;
    onSelect: () => void;
    isLast?: boolean;
};

export default function PaymentMethodOption({
    icon,
    iconType,
    title,
    subtitle,
    isSelected,
    selectedColor,
    onSelect,
    isLast = false,
}: PaymentMethodOptionProps) {
    const IconComponent = iconType === 'material' ? MaterialIcons : Ionicons;

    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`flex-row items-center p-4 rounded-xl border-2 ${isLast ? '' : 'mb-3'} ${
                isSelected
                    ? 'border-[#ea770c] bg-orange-50'
                    : 'border-gray-200 bg-white'
            }`}
            activeOpacity={0.7}
        >
            <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{
                    backgroundColor: isSelected ? selectedColor : '#f3f4f6',
                }}
            >
                <IconComponent
                    name={icon as any}
                    size={24}
                    color={isSelected ? 'white' : '#6b7280'}
                />
            </View>

            <View className="flex-1">
                <Text
                    className={`font-bold text-base ${
                        isSelected ? 'text-[#ea770c]' : 'text-gray-800'
                    }`}
                >
                    {title}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                    {subtitle}
                </Text>
            </View>

            <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
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
