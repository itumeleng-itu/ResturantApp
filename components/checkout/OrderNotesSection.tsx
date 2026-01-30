import React from 'react';
import { Text, TextInput, View } from 'react-native';

type OrderNotesSectionProps = {
    notes: string;
    onChange: (text: string) => void;
};

export const OrderNotesSection = ({ notes, onChange }: OrderNotesSectionProps) => {
    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl p-4">
            <Text className="text-lg font-bold mb-3">Order Notes</Text>
            <TextInput
                className="bg-gray-50 rounded-xl p-4 min-h-[100px] text-gray-700"
                placeholder="Add any special instructions for your order (e.g., no onions, extra spicy, ring doorbell...)"
                placeholderTextColor="#9ca3af"
                value={notes}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
                maxLength={500}
            />
            <Text className="text-gray-400 text-xs text-right mt-2">
                {notes.length}/500
            </Text>
        </View>
    );
};
