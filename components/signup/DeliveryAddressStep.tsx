import React from 'react';
import { Text, TextInput, View } from 'react-native';

type DeliveryAddressStepProps = {
    streetAddress: string;
    setStreetAddress: (value: string) => void;
    city: string;
    setCity: (value: string) => void;
    province: string;
    setProvince: (value: string) => void;
    postalCode: string;
    setPostalCode: (value: string) => void;
    loading: boolean;
};

export default function DeliveryAddressStep({
    streetAddress,
    setStreetAddress,
    city,
    setCity,
    province,
    setProvince,
    postalCode,
    setPostalCode,
    loading,
}: DeliveryAddressStepProps) {
    return (
        <View className="w-full">
            {/* Street Address */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Street Address</Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="123 Main Street"
                    placeholderTextColor="#9CA3AF"
                    value={streetAddress}
                    onChangeText={setStreetAddress}
                    editable={!loading}
                />
            </View>

            {/* City */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">City</Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="Polokwane"
                    placeholderTextColor="#9CA3AF"
                    value={city}
                    onChangeText={setCity}
                    editable={!loading}
                />
            </View>

            {/* Province & Postal Code Row */}
            <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                    <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Province</Text>
                    <TextInput
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        placeholder="Limpopo"
                        placeholderTextColor="#9CA3AF"
                        value={province}
                        onChangeText={setProvince}
                        editable={!loading}
                    />
                </View>
                
                <View className="flex-1">
                    <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Postal Code</Text>
                    <TextInput
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                        placeholder="0700"
                        placeholderTextColor="#9CA3AF"
                        value={postalCode}
                        onChangeText={setPostalCode}
                        keyboardType="numeric"
                        maxLength={4}
                        editable={!loading}
                    />
                </View>
            </View>

            <Text className="text-gray-400 text-xs italic">
                You can add or update your address later in settings
            </Text>
        </View>
    );
}
