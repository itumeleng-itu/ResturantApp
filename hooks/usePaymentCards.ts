import { supabase } from '@/lib/supabase';
import { PaymentCard, PaymentCardDB } from '@/types/payment';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function usePaymentCards() {
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<PaymentCard[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const transformCard = (card: PaymentCardDB): PaymentCard => ({
        id: card.id,
        card_number: card.card_last_four,
        card_holder: card.card_holder,
        expiry_date: `${card.expiry_month.toString().padStart(2, '0')}/${card.expiry_year.toString().slice(-2)}`,
        card_type: card.card_type || 'Card',
    });

    const loadCards = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setCards([]);
                setUserId(null);
                setLoading(false);
                return;
            }

            setUserId(session.user.id);

            const { data, error } = await supabase
                .from('payment_cards')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading cards:', error);
                setCards([]);
            } else {
                const transformedCards = (data || []).map(transformCard);
                setCards(transformedCards);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCards();
    }, [loadCards]);

    const addCard = async (
        cardNumber: string,
        cardHolder: string,
        expiryDate: string,
        cardType: string
    ): Promise<boolean> => {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                Alert.alert('Error', 'You must be logged in to add a card');
                return false;
            }

            const cleanedCardNumber = cardNumber.replace(/\s/g, '');
            const [monthStr, yearStr] = expiryDate.split('/');
            const expiryMonth = parseInt(monthStr, 10);
            const expiryYear = 2000 + parseInt(yearStr, 10);
            const cardLastFour = cleanedCardNumber.slice(-4);
            const isFirstCard = cards.length === 0;

            const { error } = await supabase
                .from('payment_cards')
                .insert({
                    user_id: session.user.id,
                    card_holder: cardHolder,
                    card_last_four: cardLastFour,
                    card_type: cardType,
                    expiry_month: expiryMonth,
                    expiry_year: expiryYear,
                    is_default: isFirstCard,
                })
                .select()
                .single();

            if (error) throw error;

            await loadCards();
            Alert.alert('Success', 'Card added successfully');
            return true;
        } catch (error: any) {
            console.error('Error adding card:', error);
            Alert.alert('Error', error.message || 'Failed to add card');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const deleteCard = async (cardId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from('payment_cards')
                .delete()
                .eq('id', cardId);

            if (error) throw error;

            await loadCards();
            Alert.alert('Success', 'Card removed successfully');
        } catch (error: any) {
            console.error('Error deleting card:', error);
            Alert.alert('Error', 'Failed to delete card');
        }
    };

    const confirmDeleteCard = (cardId: string): void => {
        Alert.alert(
            'Delete Card',
            'Are you sure you want to remove this card?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteCard(cardId)
                }
            ]
        );
    };

    return {
        loading,
        cards,
        saving,
        userId,
        addCard,
        confirmDeleteCard,
        refreshCards: loadCards,
    };
}
