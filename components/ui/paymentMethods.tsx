import { PaymentMethod } from '@/types/payment';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

// Sub-components
import {
    AddNewCardButton,
    CardOption,
    EmptyCardPlaceholder,
    SelectedCardDisplay,
} from '@/components/payment/CardDisplayComponents';
import PaymentMethodOption from '@/components/payment/PaymentMethodOption';

// Hooks
import { usePaymentMethodSelector } from '@/hooks/usePaymentMethodSelector';

type PaymentMethodSelectorProps = {
    onMethodSelect?: (method: PaymentMethod, cardId?: string, stripePaymentMethodId?: string) => void;
};

export default function PaymentMethodSelector({ 
    onMethodSelect
}: PaymentMethodSelectorProps) {
    const {
        loading,
        savedCards,
        selectedMethod,
        selectedCard,
        showCardSelector,
        setShowCardSelector,
        handleMethodSelect,
        handleCardSelect,
        handleDeleteCard,
    } = usePaymentMethodSelector(onMethodSelect);

    if (loading) {
        return (
            <View className="bg-white rounded-2xl p-4 items-center">
                <ActivityIndicator size="small" color="#ea770c" />
                <Text className="text-gray-400 text-sm mt-2">Loading payment methods...</Text>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-2xl">
            <Text className="text-lg font-bold mb-4">Select Payment Method</Text>

            {/* Saved Cards Section */}
            {savedCards.length > 0 && (
                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-sm font-semibold text-gray-600">
                            Saved Cards
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setShowCardSelector(!showCardSelector)}
                            className="flex-row items-center"
                        >
                            <Text className="text-[#ea770c] font-bold text-sm mr-1">
                                {showCardSelector ? 'Done' : 'Change'}
                            </Text>
                            <Ionicons 
                                name={showCardSelector ? 'chevron-up' : 'chevron-down'} 
                                size={16} 
                                color="#ea770c" 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Show card selector or selected card */}
                    {showCardSelector ? (
                        <View>
                            {savedCards.map(card => (
                                <CardOption
                                    key={card.id}
                                    card={card}
                                    isSelected={selectedCard?.id === card.id}
                                    onSelect={() => handleCardSelect(card)}
                                    onDelete={() => handleDeleteCard(card.id)}
                                />
                            ))}
                            
                            {/* Add new card option in selector */}
                            <AddNewCardButton onPress={() => router.push('/PaymentMethods')} />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => setShowCardSelector(true)}>
                            {selectedMethod === 'saved-card' && selectedCard ? (
                                <SelectedCardDisplay card={selectedCard} />
                            ) : (
                                <EmptyCardPlaceholder cardCount={savedCards.length} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Other Payment Methods */}
            <View className="mb-2">
                <Text className="text-sm font-semibold text-gray-600 mb-3">
                    Other Payment Methods
                </Text>

                {savedCards.length === 0 && (
                    <PaymentMethodOption
                        icon="add-card"
                        iconType="material"
                        title="Add New Card"
                        subtitle="Credit or Debit card"
                        isSelected={selectedMethod === 'new-card'}
                        selectedColor="#ea770c"
                        onSelect={() => handleMethodSelect('new-card')}
                    />
                )}

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
        </View>
    );
}