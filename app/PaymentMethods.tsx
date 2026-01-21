import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Services
import { supabase } from '@/lib/supabase';

type PaymentCard = {
    id: string;
    card_number: string;
    card_holder: string;
    expiry_date: string;
    card_type: string;
};

export default function PaymentMethodsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [showAddCard, setShowAddCard] = useState(false);
    
    // New card form
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Get cards from user metadata or a separate table
                const savedCards = session.user.user_metadata?.payment_cards || [];
                setCards(savedCards);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (text: string) => {
        // Remove non-digits and format as XXXX XXXX XXXX XXXX
        const cleaned = text.replace(/\D/g, '').slice(0, 16);
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const formatExpiryDate = (text: string) => {
        // Format as MM/YY
        const cleaned = text.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length >= 2) {
            setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
        } else {
            setExpiryDate(cleaned);
        }
    };

    const getCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('3')) return 'Amex';
        return 'Card';
    };

    const handleAddCard = async () => {
        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
            Alert.alert('Error', 'Please fill in all card details');
            return;
        }

        setSaving(true);
        try {
            const newCard: PaymentCard = {
                id: Date.now().toString(),
                card_number: cardNumber.replace(/\s/g, '').slice(-4),
                card_holder: cardHolder,
                expiry_date: expiryDate,
                card_type: getCardType(cardNumber),
            };

            const updatedCards = [...cards, newCard];

            const { error } = await supabase.auth.updateUser({
                data: {
                    payment_cards: updatedCards,
                }
            });

            if (error) throw error;

            setCards(updatedCards);
            setShowAddCard(false);
            setCardNumber('');
            setCardHolder('');
            setExpiryDate('');
            setCvv('');
            Alert.alert('Success', 'Card added successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to add card');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCard = (cardId: string) => {
        Alert.alert(
            'Delete Card',
            'Are you sure you want to remove this card?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedCards = cards.filter(c => c.id !== cardId);
                            await supabase.auth.updateUser({
                                data: { payment_cards: updatedCards }
                            });
                            setCards(updatedCards);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete card');
                        }
                    }
                }
            ]
        );
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
                    {/* Saved Cards */}
                    {cards.length === 0 && !showAddCard ? (
                        <View className="items-center py-10">
                            <MaterialIcons name="credit-card-off" size={60} color="#d1d5db" />
                            <Text className="text-gray-400 mt-4">No payment methods saved</Text>
                        </View>
                    ) : (
                        cards.map((card) => (
                            <View 
                                key={card.id} 
                                className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row items-center"
                            >
                                <View className="w-12 h-12 bg-white rounded-xl items-center justify-center mr-4">
                                    <MaterialIcons name="credit-card" size={28} color="#ea770c" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-gray-800">{card.card_type}</Text>
                                    <Text className="text-gray-400">•••• •••• •••• {card.card_number}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteCard(card.id)}>
                                    <Ionicons name="trash-outline" size={22} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

                    {/* Add Card Form */}
                    {showAddCard && (
                        <View className="bg-gray-50 rounded-2xl p-4 mt-4">
                            <Text className="font-bold text-lg mb-4">Add New Card</Text>
                            
                            <View className="mb-4">
                                <Text className="text-gray-500 mb-2">Card Number</Text>
                                <TextInput
                                    value={cardNumber}
                                    onChangeText={formatCardNumber}
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
                                        onChangeText={formatExpiryDate}
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
                                        onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))}
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
                                    onPress={() => setShowAddCard(false)}
                                    className="flex-1 py-3 rounded-full border border-gray-300 items-center"
                                >
                                    <Text className="text-gray-600 font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleAddCard}
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
