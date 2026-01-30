import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type MenuItemProps = {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    danger?: boolean;
};

export const MenuItem = ({ 
    icon, 
    title, 
    subtitle,
    onPress,
    showArrow = true,
    danger = false
}: MenuItemProps) => (
    <TouchableOpacity 
        onPress={onPress}
        className="flex-row items-center py-4 border-b border-gray-100"
    >
        <View className={`w-10 h-10 rounded-full items-center justify-center ${danger ? 'bg-red-100' : 'bg-gray-100'}`}>
            <MaterialIcons name={icon} size={22} color={danger ? '#ef4444' : '#374151'} />
        </View>
        <View className="flex-1 ml-4">
            <Text className={`font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{title}</Text>
            {subtitle && <Text className="text-gray-400 text-sm">{subtitle}</Text>}
        </View>
        {showArrow && <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />}
    </TouchableOpacity>
);
