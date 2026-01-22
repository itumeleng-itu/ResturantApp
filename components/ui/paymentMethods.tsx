import { supabase } from '@/lib/supabase';
import { Card, PaymentMethod } from '@/types/payment';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Sub-components
import PaymentMethodOption from '@/components/payment/PaymentMethodOption';
import SavedCardOption from '@/components/payment/SavedCardOption';

type PaymentMethodSelectorProps = {
    onMethodSelect?: (method: PaymentMethod, cardId?: string, stripePaymentMethodId?: string) => void;
};

export default function PaymentMethodSelector({ 
    onMethodSelect
}: PaymentMethodSelectorProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [selectedStripePaymentMethodId, setSelectedStripePaymentMethodId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedCards, setSavedCards] = useState<Card[]>([]);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const {data: {session}} = await supabase.auth.getSession();
            if(!session?.user){
                setLoading(false);
                return;
            }

            const {data, error} = await supabase
                .from('payment_cards')
                .select('*')
                .eq('user_id', session.user.id);

            if(error){
                console.error("Error fetching cards:", error);
                setSavedCards([]);
            } else {
                // Transform database cards to Card type with Stripe payment method ID
                const transformedCards: Card[] = (data || []).map(card => ({
                    id: card.id,
                    last4: card.card_last_four,
                    brand: card.card_type || 'Card',
                    expiryMonth: card.expiry_month,
                    expiryYear: card.expiry_year,
                    isDefault: card.is_default || false,
                    stripePaymentMethodId: card.stripe_payment_method_id,
                }));
                setSavedCards(transformedCards);
            }
        } catch(error) {
            console.error(error);
            setSavedCards([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMethodSelect = (method: PaymentMethod, cardId?: string, stripePaymentMethodId?: string) => {
        setSelectedMethod(method);
        setSelectedCardId(cardId || null);
        setSelectedStripePaymentMethodId(stripePaymentMethodId || null);
        
        if (onMethodSelect) {
            onMethodSelect(method, cardId, stripePaymentMethodId);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
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
                            const { error } = await supabase
                                .from('payment_cards')
                                .delete()
                                .eq('id', cardId);

                            if (error) {
                                console.error('Error deleting card:', error);
                                Alert.alert('Error', 'Failed to delete card');
                            } else {
                                await fetchCards();
                                Alert.alert('Success', 'Card deleted successfully');
                            }
                        } catch (error) {
                            console.error('Error deleting card:', error);
                            Alert.alert('Error', 'Failed to delete card');
                        }
                    },
                },
            ]
        );
    };

    const handleContinue = () => {
        if (selectedMethod === 'saved-card' && selectedCardId) {
            if (selectedStripePaymentMethodId) {
                console.log('Pay with Stripe payment method:', selectedStripePaymentMethodId);
                // TODO: Process payment with Stripe using the payment method ID
            } else {
                console.log('Pay with saved card (no Stripe ID):', selectedCardId);
            }
        } else if (selectedMethod === 'new-card') {
            router.push('/PaymentMethods');
        } else {
            console.log('Pay with:', selectedMethod);
        }
    };

    const getButtonText = () => {
        switch (selectedMethod) {
            case 'new-card': return 'Add Card & Continue';
            case 'saved-card': return 'Pay with Selected Card';
            case 'cash': return 'Confirm Order (Cash)';
            case 'wallet': return 'Pay with Wallet';
            default: return '';
        }
    };

    return (
        <View className="bg-white rounded-2xl">
            <Text className="text-lg font-bold mb-4">Select Payment Method</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Saved Cards Section */}
                {savedCards.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-600 mb-3">
                            Saved Cards
                        </Text>
                        {savedCards.map((card) => (
                            <SavedCardOption
                                key={card.id}
                                card={card}
                                isSelected={selectedMethod === 'saved-card' && selectedCardId === card.id}
                                onSelect={() => handleMethodSelect('saved-card', card.id, card.stripePaymentMethodId)}
                                onDelete={() => handleDeleteCard(card.id)}
                            />
                        ))}
                    </View>
                )}

                {/* Other Payment Methods */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-600 mb-3">
                        Other Payment Methods
                    </Text>

                    <PaymentMethodOption
                        icon="add-card"
                        iconType="material"
                        title="Add New Card"
                        subtitle="Credit or Debit card"
                        isSelected={selectedMethod === 'new-card'}
                        selectedColor="#ea770c"
                        onSelect={() => handleMethodSelect('new-card')}
                    />

                    <PaymentMethodOption
                        icon="cash"
                        iconType="ionicons"
                        title="Cash on Delivery"
                        subtitle="Pay when you receive"
                        isSelected={selectedMethod === 'cash'}
                        selectedColor="#10b981"
                        onSelect={() => handleMethodSelect('cash')}
                    />

                    <PaymentMethodOption
                        icon="wallet"
                        iconType="ionicons"
                        title="Digital Wallet"
                        subtitle="Apple Pay, Google Pay"
                        isSelected={selectedMethod === 'wallet'}
                        selectedColor="#3b82f6"
                        onSelect={() => handleMethodSelect('wallet')}
                        isLast
                    />
                </View>
            </ScrollView>

            {/* Continue Button */}
            {selectedMethod && (
                <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-[#ea770c] mt-4 py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-bold text-lg">
                        {getButtonText()}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}