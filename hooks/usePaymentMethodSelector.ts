// Hook for managing saved payment cards
import { supabase } from '@/lib/supabase';
import { Card, PaymentMethod } from '@/types/payment';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

type UsePaymentMethodSelectorReturn = {
    loading: boolean;
    savedCards: Card[];
    selectedMethod: PaymentMethod | null;
    selectedCard: Card | null;
    showCardSelector: boolean;
    setShowCardSelector: (show: boolean) => void;
    handleMethodSelect: (method: PaymentMethod, card?: Card) => void;
    handleCardSelect: (card: Card) => void;
    handleDeleteCard: (cardId: string) => void;
    refreshCards: () => Promise<void>;
};

export function usePaymentMethodSelector(
    onMethodSelect?: (method: PaymentMethod, cardId?: string, stripePaymentMethodId?: string, cardLast4?: string) => void
): UsePaymentMethodSelectorReturn {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedCards, setSavedCards] = useState<Card[]>([]);
    const [showCardSelector, setShowCardSelector] = useState(false);

    const fetchCards = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('payment_cards')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false });

            if (error) {
                setSavedCards([]);
            } else {
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

                // Auto-select default card
                const defaultCard = transformedCards.find(c => c.isDefault) || transformedCards[0];
                if (defaultCard) {
                    setSelectedCard(defaultCard);
                    setSelectedMethod('saved-card');
                    if (onMethodSelect) {
                        onMethodSelect('saved-card', defaultCard.id, defaultCard.stripePaymentMethodId, defaultCard.last4);
                    }
                }
            }
        } catch (error) {
            setSavedCards([]);
        } finally {
            setLoading(false);
        }
    }, [onMethodSelect]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleMethodSelect = useCallback((method: PaymentMethod, card?: Card) => {
        setSelectedMethod(method);
        setSelectedCard(card || null);
        setShowCardSelector(false);

        if (onMethodSelect) {
            onMethodSelect(method, card?.id, card?.stripePaymentMethodId, card?.last4);
        }
    }, [onMethodSelect]);

    const handleCardSelect = useCallback((card: Card) => {
        handleMethodSelect('saved-card', card);
    }, [handleMethodSelect]);

    const handleDeleteCard = useCallback(async (cardId: string) => {
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
                                Alert.alert('Error', 'Failed to delete card');
                            } else {
                                // Clear selection if deleted card was selected
                                if (selectedCard?.id === cardId) {
                                    setSelectedCard(null);
                                    setSelectedMethod(null);
                                    if (onMethodSelect) {
                                        onMethodSelect('new-card', undefined, undefined);
                                    }
                                }
                                await fetchCards();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete card');
                        }
                    },
                },
            ]
        );
    }, [selectedCard, fetchCards, onMethodSelect]);

    return {
        loading,
        savedCards,
        selectedMethod,
        selectedCard,
        showCardSelector,
        setShowCardSelector,
        handleMethodSelect,
        handleCardSelect,
        handleDeleteCard,
        refreshCards: fetchCards,
    };
}
