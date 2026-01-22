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
import { useAddresses } from '@/hooks/useAddresses';

// Components
import AddressCard from '@/components/addresses/AddressCard';
import AddressForm from '@/components/addresses/AddressForm';

export default function DeliveryAddressesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [showAddForm, setShowAddForm] = useState(false);
    
    const {
        loading,
        addresses,
        saving,
        saveAddress,
        setDefaultAddress,
        confirmDeleteAddress,
    } = useAddresses();

    const handleSaveAddress = async (formData: { label: string; street: string; city: string; postalCode: string }) => {
        const success = await saveAddress(formData);
        if (success) {
            setShowAddForm(false);
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
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Delivery Addresses</Text>
                </View>

                <ScrollView className="flex-1 px-6 py-6">
                    {/* Empty State */}
                    {addresses.length === 0 && !showAddForm ? (
                        <View className="items-center py-10">
                            <MaterialIcons name="location-off" size={60} color="#d1d5db" />
                            <Text className="text-gray-400 mt-4">No addresses saved</Text>
                        </View>
                    ) : (
                        /* Address List */
                        addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                onSetDefault={setDefaultAddress}
                                onDelete={confirmDeleteAddress}
                            />
                        ))
                    )}

                    {/* Add Address Form */}
                    {showAddForm && (
                        <AddressForm
                            onSave={handleSaveAddress}
                            onCancel={() => setShowAddForm(false)}
                            saving={saving}
                        />
                    )}

                    {/* Add Address Button */}
                    {!showAddForm && (
                        <TouchableOpacity 
                            onPress={() => setShowAddForm(true)}
                            className="flex-row items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-2xl mt-4"
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
                            <Text className="text-gray-500 font-medium ml-2">Add New Address</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}
