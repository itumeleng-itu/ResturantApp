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

type Address = {
    id: string;
    user_id?: string;
    label: string;
    street: string;
    city: string;
    postal_code: string;
    is_default: boolean;
};

export default function DeliveryAddressesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    
    // Form fields
    const [label, setLabel] = useState('Home');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }
            
            setUserId(session.user.id);

            // Fetch addresses from the addresses table
            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false });

            if (error) {
                console.error('Error fetching addresses:', error);
                setAddresses([]);
            } else {
                setAddresses(data || []);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAddress = async () => {
        if (!street || !city || !postalCode) {
            Alert.alert('Error', 'Please fill in all address fields');
            return;
        }

        if (!userId) {
            Alert.alert('Error', 'Please sign in to add an address');
            return;
        }

        setSaving(true);
        try {
            // Insert new address into addresses table
            const { data, error } = await supabase
                .from('addresses')
                .insert({
                    user_id: userId,
                    label,
                    street,
                    city,
                    postal_code: postalCode,
                    is_default: addresses.length === 0, // First address is default
                })
                .select()
                .single();

            if (error) throw error;

            setAddresses([...addresses, data]);
            setShowAddForm(false);
            resetForm();
            Alert.alert('Success', 'Address added successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to add address');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setLabel('Home');
        setStreet('');
        setCity('');
        setPostalCode('');
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            // First, set all addresses to not default
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId);

            // Then set the selected address as default
            const { error } = await supabase
                .from('addresses')
                .update({ is_default: true })
                .eq('id', addressId);

            if (error) throw error;

            // Update local state
            const updatedAddresses = addresses.map(addr => ({
                ...addr,
                is_default: addr.id === addressId,
            }));
            setAddresses(updatedAddresses);
        } catch (error) {
            Alert.alert('Error', 'Failed to update default address');
        }
    };

    const handleDeleteAddress = (addressId: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to remove this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('addresses')
                                .delete()
                                .eq('id', addressId);

                            if (error) throw error;

                            const updatedAddresses = addresses.filter(a => a.id !== addressId);
                            
                            // If deleted was default, set first as default
                            if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.is_default)) {
                                await supabase
                                    .from('addresses')
                                    .update({ is_default: true })
                                    .eq('id', updatedAddresses[0].id);
                                updatedAddresses[0].is_default = true;
                            }
                            
                            setAddresses(updatedAddresses);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete address');
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
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Delivery Addresses</Text>
                </View>

                <ScrollView className="flex-1 px-6 py-6">
                    {/* Saved Addresses */}
                    {addresses.length === 0 && !showAddForm ? (
                        <View className="items-center py-10">
                            <MaterialIcons name="location-off" size={60} color="#d1d5db" />
                            <Text className="text-gray-400 mt-4">No addresses saved</Text>
                        </View>
                    ) : (
                        addresses.map((address) => (
                            <View 
                                key={address.id} 
                                className={`bg-gray-50 rounded-2xl p-4 mb-4 ${address.is_default ? 'border-2 border-[#ea770c]' : ''}`}
                            >
                                <View className="flex-row items-start">
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                                        <MaterialIcons 
                                            name={address.label === 'Home' ? 'home' : address.label === 'Work' ? 'work' : 'location-on'} 
                                            size={22} 
                                            color="#ea770c" 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Text className="font-bold text-gray-800">{address.label}</Text>
                                            {address.is_default && (
                                                <View className="ml-2 bg-[#ea770c] px-2 py-0.5 rounded">
                                                    <Text className="text-white text-xs">Default</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-gray-500 mt-1">{address.street}</Text>
                                        <Text className="text-gray-400">{address.city}, {address.postal_code}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeleteAddress(address.id)}>
                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                                
                                {!address.is_default && (
                                    <TouchableOpacity 
                                        onPress={() => handleSetDefault(address.id)}
                                        className="mt-3 py-2 border border-gray-300 rounded-full items-center"
                                    >
                                        <Text className="text-gray-600 text-sm">Set as Default</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    )}

                    {/* Add Address Form */}
                    {showAddForm && (
                        <View className="bg-gray-50 rounded-2xl p-4 mt-4">
                            <Text className="font-bold text-lg mb-4">Add New Address</Text>
                            
                            {/* Label Picker */}
                            <View className="mb-4">
                                <Text className="text-gray-500 mb-2">Label</Text>
                                <View className="flex-row gap-2">
                                    {['Home', 'Work', 'Other'].map((option) => (
                                        <TouchableOpacity 
                                            key={option}
                                            onPress={() => setLabel(option)}
                                            className={`flex-1 py-2 rounded-full items-center ${
                                                label === option ? 'bg-[#ea770c]' : 'bg-white border border-gray-200'
                                            }`}
                                        >
                                            <Text className={label === option ? 'text-white font-medium' : 'text-gray-600'}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-500 mb-2">Street Address</Text>
                                <TextInput
                                    value={street}
                                    onChangeText={setStreet}
                                    placeholder="e.g. 40a Thabo Mbeki Drive"
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                                />
                            </View>

                            <View className="flex-row gap-4 mb-4">
                                <View className="flex-1">
                                    <Text className="text-gray-500 mb-2">City</Text>
                                    <TextInput
                                        value={city}
                                        onChangeText={setCity}
                                        placeholder="Polokwane"
                                        className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-500 mb-2">Postal Code</Text>
                                    <TextInput
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                        placeholder="0700"
                                        keyboardType="numeric"
                                        className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
                                    />
                                </View>
                            </View>

                            <View className="flex-row gap-3 mt-2">
                                <TouchableOpacity 
                                    onPress={() => {
                                        setShowAddForm(false);
                                        resetForm();
                                    }}
                                    className="flex-1 py-3 rounded-full border border-gray-300 items-center"
                                >
                                    <Text className="text-gray-600 font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={handleSaveAddress}
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-full bg-[#ea770c] items-center"
                                >
                                    {saving ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <Text className="text-white font-bold">Save Address</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
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
