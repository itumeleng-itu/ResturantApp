import { Ionicons } from '@expo/vector-icons';
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

export default function EditProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setEmail(session.user.email || '');
                setName(session.user.user_metadata?.name || '');
                setSurname(session.user.user_metadata?.surname || '');
                setContactNumber(session.user.user_metadata?.contact_number || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    name,
                    surname,
                    contact_number: contactNumber,
                }
            });

            if (error) throw error;

            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
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
            <View 
                className="flex-1 bg-white" 
                style={{ paddingTop: insets.top }}
            >
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="flex-1 text-xl font-bold text-center mr-10">Edit Profile</Text>
                </View>

                <ScrollView className="flex-1 px-6 py-6">
                    {/* Name */}
                    <View className="mb-6">
                        <Text className="text-gray-500 mb-2">First Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your first name"
                            className="border border-gray-200 rounded-xl px-4 py-4 text-base"
                        />
                    </View>

                    {/* Surname */}
                    <View className="mb-6">
                        <Text className="text-gray-500 mb-2">Last Name</Text>
                        <TextInput
                            value={surname}
                            onChangeText={setSurname}
                            placeholder="Enter your last name"
                            className="border border-gray-200 rounded-xl px-4 py-4 text-base"
                        />
                    </View>

                    {/* Contact Number */}
                    <View className="mb-6">
                        <Text className="text-gray-500 mb-2">Phone Number</Text>
                        <TextInput
                            value={contactNumber}
                            onChangeText={setContactNumber}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            className="border border-gray-200 rounded-xl px-4 py-4 text-base"
                        />
                    </View>

                    {/* Email (read-only) */}
                    <View className="mb-6">
                        <Text className="text-gray-500 mb-2">Email</Text>
                        <TextInput
                            value={email}
                            editable={false}
                            className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 text-gray-500"
                        />
                        <Text className="text-gray-400 text-sm mt-1">Email cannot be changed</Text>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity 
                        onPress={handleSave}
                        disabled={saving}
                        className="bg-[#ea770c] py-4 rounded-full items-center mt-4"
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}
