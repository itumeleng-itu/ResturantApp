import { Address } from '@/types/address';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type AddressCardProps = {
    address: Address;
    onSetDefault: (id: string) => void;
    onDelete: (id: string) => void;
};

const getAddressIcon = (label: string): 'home' | 'work' | 'location-on' => {
    if (label === 'Home') return 'home';
    if (label === 'Work') return 'work';
    return 'location-on';
};

export default function AddressCard({ address, onSetDefault, onDelete }: AddressCardProps) {
    return (
        <View 
            className={`bg-gray-50 rounded-2xl p-4 mb-4 ${address.is_default ? 'border-2 border-[#ea770c]' : ''}`}
        >
            <View className="flex-row items-start">
                <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                    <MaterialIcons 
                        name={getAddressIcon(address.label)} 
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
                <TouchableOpacity onPress={() => onDelete(address.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
            
            {!address.is_default && (
                <TouchableOpacity 
                    onPress={() => onSetDefault(address.id)}
                    className="mt-3 py-2 border border-gray-300 rounded-full items-center"
                >
                    <Text className="text-gray-600 text-sm">Set as Default</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
