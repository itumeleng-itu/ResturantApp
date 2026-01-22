import React from 'react';
import { Text, TextInput, View } from 'react-native';

type PaymentDetailsStepProps = {
    cardNumber: string;
    setCardNumber: (value: string) => void;
    cardName: string;
    setCardName: (value: string) => void;
    expiryDate: string;
    setExpiryDate: (value: string) => void;
    cvv: string;
    setCvv: (value: string) => void;
    loading: boolean;
    formatCardNumber: (text: string) => void;
    formatExpiryDate: (text: string) => void;
};

export default function PaymentDetailsStep({
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    expiryDate,
    setExpiryDate,
    cvv,
    setCvv,
    loading,
    formatCardNumber,
    formatExpiryDate,
}: PaymentDetailsStepProps) {
    return (
        <View className="w-full">
            <Text className="text-gray-400 text-xs mb-3 italic">
                Test cards: 4242 4242 4242 4242 (Visa) • 5555 5555 5555 4444 (Mastercard)
            </Text>
            
            {/* Card Number */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Card Number</Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="4242 4242 4242 4242"
                    placeholderTextColor="#9CA3AF"
                    value={cardNumber}
                    onChangeText={formatCardNumber}
                    keyboardType="numeric"
                    maxLength={19}
                    editable={!loading}
                />
            </View>

            {/* Cardholder Name */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Cardholder Name</Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="JOHN DOE"
                    placeholderTextColor="#9CA3AF"
                    value={cardName}
                    onChangeText={setCardName}
                    autoCapitalize="characters"
                    editable={!loading}
                />
            </View>

            {/* Expiry Date & CVV Row */}
            <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                    <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Expiry Date</Text>
                    <TextInput
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        placeholder="MM/YY"
                        placeholderTextColor="#9CA3AF"
                        value={expiryDate}
                        onChangeText={formatExpiryDate}
                        keyboardType="numeric"
                        maxLength={5}
                        editable={!loading}
                    />
                </View>
                
                <View className="flex-1">
                    <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">CVV</Text>
                    <TextInput
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        placeholder="123"
                        placeholderTextColor="#9CA3AF"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>
            </View>

            <Text className="text-gray-400 text-xs italic">
                You can add or update your payment method later in settings
            </Text>
        </View>
    );
}
