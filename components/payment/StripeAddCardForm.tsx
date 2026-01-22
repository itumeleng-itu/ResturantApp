import { getCardBrandDisplayName } from '@/lib/stripe';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

type StripeAddCardFormProps = {
    onSave: (
        paymentMethodId: string,
        cardHolder: string,
        last4: string,
        brand: string,
        expiryMonth: number,
        expiryYear: number
    ) => Promise<boolean>;
    onCancel: () => void;
    saving: boolean;
};

export default function StripeAddCardForm({ onSave, onCancel, saving }: StripeAddCardFormProps) {
    const { createPaymentMethod } = useStripe();
    const [cardHolder, setCardHolder] = useState('');
    const [cardComplete, setCardComplete] = useState(false);
    const [cardDetails, setCardDetails] = useState<{
        brand?: string;
        last4?: string;
        expiryMonth?: number;
        expiryYear?: number;
    }>({});
    const [processing, setProcessing] = useState(false);

    const handleSave = async () => {
        if (!cardHolder.trim()) {
            Alert.alert('Error', 'Please enter the card holder name');
            return;
        }

        if (!cardComplete) {
            Alert.alert('Error', 'Please complete the card details');
            return;
        }

        setProcessing(true);

        try {
            // Create a PaymentMethod with Stripe
            const { paymentMethod, error } = await createPaymentMethod({
                paymentMethodType: 'Card',
                paymentMethodData: {
                    billingDetails: {
                        name: cardHolder,
                    },
                },
            });

            if (error) {
                console.error('Stripe error:', error);
                Alert.alert('Payment Error', error.message || 'Failed to process card');
                setProcessing(false);
                return;
            }

            if (!paymentMethod) {
                Alert.alert('Error', 'Failed to create payment method');
                setProcessing(false);
                return;
            }

            // Extract card details from the payment method
            const card = paymentMethod.Card;
            const success = await onSave(
                paymentMethod.id,
                cardHolder,
                card?.last4 || cardDetails.last4 || '****',
                getCardBrandDisplayName(card?.brand || cardDetails.brand),
                card?.expMonth || cardDetails.expiryMonth || 0,
                card?.expYear || cardDetails.expiryYear || 0
            );

            if (success) {
                // Reset form
                setCardHolder('');
                setCardComplete(false);
                setCardDetails({});
            }
        } catch (error: any) {
            console.error('Error creating payment method:', error);
            Alert.alert('Error', error.message || 'Failed to save card');
        } finally {
            setProcessing(false);
        }
    };

    const isLoading = saving || processing;

    return (
        <View className="bg-gray-50 rounded-2xl p-4 mt-4">
            <Text className="font-bold text-lg mb-4">Add New Card</Text>

            {/* Card Holder Name */}
            <View className="mb-4">
                <Text className="text-gray-500 mb-2">Card Holder Name</Text>
                <TextInput
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    editable={!isLoading}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                />
            </View>

            {/* Stripe Card Field */}
            <View className="mb-4">
                <Text className="text-gray-500 mb-2">Card Details</Text>
                <View className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                            borderWidth: 0,
                            borderRadius: 12,
                            fontSize: 16,
                            placeholderColor: '#9ca3af',
                        }}
                        style={{
                            width: '100%',
                            height: 50,
                        }}
                        onCardChange={(details) => {
                            setCardComplete(details.complete);
                            if (details.complete) {
                                setCardDetails({
                                    brand: details.brand,
                                    last4: details.last4,
                                    expiryMonth: details.expiryMonth,
                                    expiryYear: details.expiryYear,
                                });
                            }
                        }}
                    />
                </View>
                <Text className="text-gray-400 text-xs mt-2">
                    Your card information is securely processed by Stripe
                </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                    onPress={onCancel}
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-full border border-gray-300 items-center"
                >
                    <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isLoading || !cardComplete}
                    className={`flex-1 py-3 rounded-full items-center ${
                        cardComplete ? 'bg-[#ea770c]' : 'bg-gray-300'
                    }`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-white font-bold">Save Card</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
