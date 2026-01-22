import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom hooks
import { usePaymentCards } from '@/hooks/usePaymentCards';

// Components - Using Stripe-integrated form
import PaymentCardItem from '@/components/payment/PaymentCardItem';
import StripeAddCardForm from '@/components/payment/StripeAddCardForm';

export default function PaymentMethodsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [showAddCard, setShowAddCard] = useState(false);
    
    const {
        loading,
        cards,
        saving,
        addCardWithStripe,
        confirmDeleteCard,
    } = usePaymentCards();

    const handleSaveCard = async (
        paymentMethodId: string,
        cardHolder: string,
        last4: string,
        brand: string,
        expiryMonth: number,
        expiryYear: number
    ): Promise<boolean> => {
        const success = await addCardWithStripe(
            paymentMethodId,
            cardHolder,
            last4,
            brand,
            expiryMonth,
            expiryYear
        );
        if (success) {
            setShowAddCard(false);
        }
        return success;
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <View className="flex-1 bg-white items-center justify-center">
                    <ActivityIndicator size="large" color="#ea770c" />
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Payment Methods</Text>
                </View>

                <ScrollView className="flex-1 px-6 py-6">
                    {/* Stripe Security Badge */}
                    <View className="flex-row items-center justify-center mb-4 py-2 px-4 bg-gray-50 rounded-lg">
                        <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                        <Text className="text-gray-500 text-xs ml-2">
                            Payments secured by Stripe
                        </Text>
                    </View>

                    {/* Empty State */}
                    {cards.length === 0 && !showAddCard ? (
                        <View className="items-center py-10">
                            <MaterialIcons name="credit-card-off" size={60} color="#d1d5db" />
                            <Text className="text-gray-400 mt-4">No payment methods saved</Text>
                        </View>
                    ) : (
                        /* Card List */
                        cards.map((card) => (
                            <PaymentCardItem
                                key={card.id}
                                card={card}
                                onDelete={confirmDeleteCard}
                            />
                        ))
                    )}

                    {/* Add Card Form (Stripe-integrated) */}
                    {showAddCard && (
                        <StripeAddCardForm
                            onSave={handleSaveCard}
                            onCancel={() => setShowAddCard(false)}
                            saving={saving}
                        />
                    )}

                    {/* Add Card Button */}
                    {!showAddCard && (
                        <TouchableOpacity 
                            onPress={() => setShowAddCard(true)}
                            className="flex-row items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-2xl mt-4"
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                            <Text className="text-gray-500 font-medium ml-2">Add New Card</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}