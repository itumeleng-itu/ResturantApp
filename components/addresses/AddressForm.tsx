import { AddressFormData } from '@/types/address';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AddressFormProps = {
    onSave: (data: AddressFormData) => Promise<boolean>;
    onCancel: () => void;
    saving: boolean;
};

const LABEL_OPTIONS = ['Home', 'Work', 'Other'];

export default function AddressForm({ onSave, onCancel, saving }: AddressFormProps) {
    const [label, setLabel] = useState('Home');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handleSave = async () => {
        const success = await onSave({ label, street, city, postalCode });
        if (success) {
            // Reset form on success
            setLabel('Home');
            setStreet('');
            setCity('');
            setPostalCode('');
        }
    };

    return (
        <View className="bg-gray-50 rounded-2xl p-4 mt-4">
            <Text className="font-bold text-lg mb-4">Add New Address</Text>
            
            {/* Label Picker */}
            <View className="mb-4">
                <Text className="text-gray-500 mb-2">Label</Text>
                <View className="flex-row gap-2">
                    {LABEL_OPTIONS.map((option) => (
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
                    onPress={onCancel}
                    className="flex-1 py-3 rounded-full border border-gray-300 items-center"
                >
                    <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSave}
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
    );
}
