import { PaymentCard } from '@/types/payment';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type PaymentCardItemProps = {
    card: PaymentCard;
    onDelete: (id: string) => void;
};

export default function PaymentCardItem({ card, onDelete }: PaymentCardItemProps) {
    return (
        <View className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row items-center">
            <View className="w-12 h-12 bg-white rounded-xl items-center justify-center mr-4">
                <MaterialIcons name="credit-card" size={28} color="#ea770c" />
            </View>
            <View className="flex-1">
                <Text className="font-bold text-gray-800">{card.card_type}</Text>
                <Text className="text-gray-400">•••• •••• •••• {card.card_number}</Text>
                <Text className="text-gray-400 text-xs mt-1">Expires {card.expiry_date}</Text>
            </View>
            <TouchableOpacity onPress={() => onDelete(card.id)}>
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );
}
