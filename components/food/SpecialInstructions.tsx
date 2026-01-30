import React from 'react';
import { Text, TextInput, View } from 'react-native';

type SpecialInstructionsProps = {
    value: string;
    onChange: (text: string) => void;
    isMealItem: boolean;
};

export const SpecialInstructions = ({ value, onChange, isMealItem }: SpecialInstructionsProps) => {
    return (
        <View className="mt-6 mb-3">
            <View className="mb-3">
                <Text className="text-white text-lg font-bold">Special Instructions</Text>
                <Text className="text-gray-400 text-sm mt-1">Any special requests?</Text>
            </View>
           
            <TextInput
                className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
                placeholder={isMealItem ? "e.g., No mayo, extra sauce, cook well done..." : "e.g., Extra ice, no straw..."}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={isMealItem ? 3 : 2}
                textAlignVertical="top"
                maxLength={isMealItem ? 200 : 100}
            />
            <Text className="text-gray-500 text-xs text-right mt-1">
                {value.length}/{isMealItem ? 200 : 100}
            </Text>
        </View>
    );
};
