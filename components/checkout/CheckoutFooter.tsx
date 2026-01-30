import { SelectedPaymentInfo } from '@/types/checkout';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CheckoutFooterProps = {
    onPress: () => void;
    disabled: boolean;
    loading: boolean;
    total: number;
    selectedPayment: SelectedPaymentInfo | null;
};

export const CheckoutFooter = ({
    onPress,
    disabled,
    loading,
    total,
    selectedPayment,
}: CheckoutFooterProps) => {
    const insets = useSafeAreaInsets();

    const getPayButtonText = () => {
        if (!selectedPayment) {
            return 'Select Payment Method';
        }

        switch (selectedPayment.method) {
            case 'new-card':
                return 'Add Card to Continue';
            case 'cash':
                return `Confirm Order (Cash) - R${total.toFixed(2)}`;
            case 'wallet':
                return `Pay with Wallet - R${total.toFixed(2)}`;
            case 'saved-card':
            default:
                return `Pay R${total.toFixed(2)}`;
        }
    };

    return (
        <View 
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4"
            style={{ paddingBottom: insets.bottom + 16 }}
        >
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled}
                className={`py-4 rounded-full items-center flex-row justify-center ${
                    disabled ? 'bg-gray-300' : 'bg-[#ea770c]'
                }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <>
                        <MaterialIcons 
                            name={selectedPayment?.method === 'cash' ? 'payments' : 'payment'} 
                            size={22} 
                            color="white" 
                        />
                        <Text className="text-white font-bold text-lg ml-2">
                            {getPayButtonText()}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};
