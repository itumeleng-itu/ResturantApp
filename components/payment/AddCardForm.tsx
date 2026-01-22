import { formatCardNumber, formatExpiryDate, getCardType, validateCardForm } from '@/utils/cardUtils';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AddCardFormProps = {
    onSave: (cardNumber: string, cardHolder: string, expiryDate: string, cardType: string) => Promise<boolean>;
    onCancel: () => void;
    saving: boolean;
};

export default function AddCardForm({ onSave, onCancel, saving }: AddCardFormProps) {
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleCardNumberChange = (text: string) => {
        setCardNumber(formatCardNumber(text));
    };

    const handleExpiryChange = (text: string) => {
        setExpiryDate(formatExpiryDate(text));
    };

    const handleCvvChange = (text: string) => {
        setCvv(text.replace(/\D/g, '').slice(0, 3));
    };

    const handleSave = async () => {
        const validation = validateCardForm(cardNumber, cardHolder, expiryDate, cvv);
        
        if (!validation.valid) {
            Alert.alert('Error', validation.error || 'Invalid card details');
            return;
        }

        const cardType = getCardType(cardNumber);
        const success = await onSave(cardNumber, cardHolder, expiryDate, cardType);
        
        if (success) {
            // Reset form
            setCardNumber('');
            setCardHolder('');
            setExpiryDate('');
            setCvv('');
        }
    };

    return (
        <View className="bg-gray-50 rounded-2xl p-4 mt-4">
            <Text className="font-bold text-lg mb-4">Add New Card</Text>
            
            <View className="mb-4">
                <Text className="text-gray-500 mb-2">Card Number</Text>
                <TextInput
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    maxLength={19}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-500 mb-2">Card Holder Name</Text>
                <TextInput
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                />
            </View>

            <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                    <Text className="text-gray-500 mb-2">Expiry</Text>
                    <TextInput
                        value={expiryDate}
                        onChangeText={handleExpiryChange}
                        placeholder="MM/YY"
                        keyboardType="numeric"
                        maxLength={5}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                    />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-500 mb-2">CVV</Text>
                    <TextInput
                        value={cvv}
                        onChangeText={handleCvvChange}
                        placeholder="123"
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                    />
                </View>
            </View>

            <View className="flex-row gap-3 mt-2">
                <TouchableOpacity 
                    onPress={onCancel}
                    className="flex-1 py-3 rounded-full border border-gray-300 items-center"
                >
                    <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSave}
                    disabled={saving}
                    className="flex-1 py-3 rounded-full bg-[#ea770c] items-center"
                >
                    {saving ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white font-bold">Save Card</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
