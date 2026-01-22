import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const faqs = [
        {
            question: 'How do I place an order?',
            answer: 'Browse the menu, tap on items to add them to your cart, then proceed to checkout.'
        },
        {
            question: 'What payment methods are accepted?',
            answer: 'We accept Visa, Mastercard, and cash on delivery.'
        },
        {
            question: 'How long does delivery take?',
            answer: 'Delivery typically takes 30-45 minutes depending on your location.'
        },
        {
            question: 'Can I cancel my order?',
            answer: 'Orders can be cancelled within 5 minutes of placing them. Contact support for assistance.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Go to the Orders tab to view your current order status and tracking information.'
        },
    ];

    const contactOptions = [
        {
            icon: 'call' as const,
            title: 'Call Us',
            subtitle: '+27 12 345 6789',
            onPress: () => Linking.openURL('tel:+27123456789'),
        },
        {
            icon: 'mail' as const,
            title: 'Email Us',
            subtitle: 'support@theeatery.co.za',
            onPress: () => Linking.openURL('mailto:support@theeatery.co.za'),
        },
        {
            icon: 'logo-whatsapp' as const,
            title: 'WhatsApp',
            subtitle: 'Chat with us',
            onPress: () => Linking.openURL('https://wa.me/27123456789'),
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
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Help & Support</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Contact Options */}
                    <View className="px-6 py-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Contact Us</Text>
                        <View className="flex-row gap-4">
                            {contactOptions.map((option, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    onPress={option.onPress}
                                    className="flex-1 bg-gray-50 rounded-2xl p-4 items-center"
                                >
                                    <View className="w-12 h-12 bg-[#ea770c] rounded-full items-center justify-center mb-2">
                                        <Ionicons name={option.icon} size={24} color="white" />
                                    </View>
                                    <Text className="font-medium text-gray-800 text-center">{option.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* FAQs */}
                    <View className="px-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</Text>
                        {faqs.map((faq, index) => (
                            <View key={index} className="bg-gray-50 rounded-2xl p-4 mb-3">
                                <Text className="font-bold text-gray-800 mb-2">{faq.question}</Text>
                                <Text className="text-gray-500">{faq.answer}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Business Hours */}
                    <View className="px-6 mt-6">
                        <Text className="text-lg font-bold text-gray-800 mb-4">Business Hours</Text>
                        <View className="bg-gray-50 rounded-2xl p-4">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-500">Monday - Friday</Text>
                                <Text className="font-medium text-gray-800">08:00 - 22:00</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-500">Saturday</Text>
                                <Text className="font-medium text-gray-800">09:00 - 23:00</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-500">Sunday</Text>
                                <Text className="font-medium text-gray-800">10:00 - 21:00</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}
