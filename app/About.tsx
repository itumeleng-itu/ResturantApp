import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const menuItems = [
        {
            icon: 'document-text-outline' as const,
            title: 'Terms of Service',
            onPress: () => {},
        },
        {
            icon: 'shield-checkmark-outline' as const,
            title: 'Privacy Policy',
            onPress: () => {},
        },
        {
            icon: 'star-outline' as const,
            title: 'Rate Our App',
            onPress: () => {},
        },
        {
            icon: 'share-social-outline' as const,
            title: 'Share App',
            onPress: () => {},
        },
    ];

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
                    <Text className="flex-1 text-xl font-bold text-center mr-10">About</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* App Logo & Info */}
                    <View className="items-center py-10">
                        <View className="w-24 h-24 bg-[#ea770c] rounded-3xl items-center justify-center mb-4">
                            <MaterialIcons name="delivery-dining" size={50} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-[#ea770c]">the eatery.</Text>
                        <Text className="text-gray-400 mt-1">deliciousness delivered fast.</Text>
                        <Text className="text-gray-300 mt-4">Version 1.0.0</Text>
                    </View>

                    {/* About Text */}
                    <View className="px-6 mb-6">
                        <View className="bg-gray-50 rounded-2xl p-6">
                            <Text className="text-gray-600 leading-6 text-center">
                                The Eatery is your go-to app for the best local fast bites. 
                                We bring delicious meals from your favorite restaurants straight 
                                to your doorstep. Fast, fresh, and flavorful - that's our promise.
                            </Text>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View className="px-6">
                        {menuItems.map((item, index) => (
                            <TouchableOpacity 
                                key={index}
                                onPress={item.onPress}
                                className="flex-row items-center py-4 border-b border-gray-100"
                            >
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                    <Ionicons name={item.icon} size={20} color="#374151" />
                                </View>
                                <Text className="flex-1 ml-4 font-medium text-gray-800">{item.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Social Links */}
                    <View className="px-6 mt-8">
                        <Text className="text-center text-gray-400 mb-4">Follow Us</Text>
                        <View className="flex-row justify-center gap-4">
                            <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Copyright */}
                    <View className="items-center mt-10">
                        <Text className="text-gray-300 text-sm">© 2026 The Eatery. All rights reserved.</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}
