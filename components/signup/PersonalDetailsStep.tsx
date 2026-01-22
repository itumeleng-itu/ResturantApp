import React from 'react';
import { Text, TextInput, View } from 'react-native';

type PersonalDetailsStepProps = {
    name: string;
    setName: (value: string) => void;
    surname: string;
    setSurname: (value: string) => void;
    contactNumber: string;
    setContactNumber: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    loading: boolean;
};

export default function PersonalDetailsStep({
    name,
    setName,
    surname,
    setSurname,
    contactNumber,
    setContactNumber,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
}: PersonalDetailsStepProps) {
    return (
        <View className="w-full">
            {/* Name */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Name <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="John"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />
            </View>

            {/* Surname */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Surname <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="Doe"
                    placeholderTextColor="#9CA3AF"
                    value={surname}
                    onChangeText={setSurname}
                    editable={!loading}
                />
            </View>

            {/* Contact Number */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Contact Number <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="0712345678"
                    placeholderTextColor="#9CA3AF"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!loading}
                />
            </View>

            {/* Email */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Email <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="john@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            {/* Password */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Password <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            {/* Confirm Password */}
            <View className="mb-4">
                <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">
                    Confirm Password <Text className="text-orange-600">*</Text>
                </Text>
                <TextInput
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>
        </View>
    );
}
