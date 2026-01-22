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

// Components
import AddCardForm from '@/components/payment/AddCardForm';
import PaymentCardItem from '@/components/payment/PaymentCardItem';

export default function PaymentMethodsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [showAddCard, setShowAddCard] = useState(false);
    
    const {
        loading,
        cards,
        saving,
        addCard,
        confirmDeleteCard,
    } = usePaymentCards();

    const handleSaveCard = async (
        cardNumber: string,
        cardHolder: string,
        expiryDate: string,
        cardType: string
    ): Promise<boolean> => {
        const success = await addCard(cardNumber, cardHolder, expiryDate, cardType);
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

                    {/* Add Card Form */}
                    {showAddCard && (
                        <AddCardForm
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