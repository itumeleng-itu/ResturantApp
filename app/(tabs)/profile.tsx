import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Hooks & Services
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

type UserProfile = {
    id: string;
    email: string;
    name?: string;
    surname?: string;
    contact_number?: string;
    avatar_url?: string;
};

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { logout } = useAuth();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Refresh profile on focus
    useFocusEffect(
        useCallback(() => {
            checkAuthAndLoadProfile();
        }, [])
    );

    const checkAuthAndLoadProfile = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                setIsLoggedIn(true);
                setProfile({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || '',
                    surname: session.user.user_metadata?.surname || '',
                    contact_number: session.user.user_metadata?.contact_number || '',
                    avatar_url: session.user.user_metadata?.avatar_url,
                });
            } else {
                setIsLoggedIn(false);
                setProfile(null);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    // Menu item component
    const MenuItem = ({ 
        icon, 
        title, 
        subtitle,
        onPress,
        showArrow = true,
        danger = false
    }: {
        icon: keyof typeof MaterialIcons.glyphMap;
        title: string;
        subtitle?: string;
        onPress?: () => void;
        showArrow?: boolean;
        danger?: boolean;
    }) => (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center py-4 border-b border-gray-100"
        >
            <View className={`w-10 h-10 rounded-full items-center justify-center ${danger ? 'bg-red-100' : 'bg-gray-100'}`}>
                <MaterialIcons name={icon} size={22} color={danger ? '#ef4444' : '#374151'} />
            </View>
            <View className="flex-1 ml-4">
                <Text className={`font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{title}</Text>
                {subtitle && <Text className="text-gray-400 text-sm">{subtitle}</Text>}
            </View>
            {showArrow && <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />}
        </TouchableOpacity>
    );

    // Loading state
    if (loading) {
        return (
            <SafeAreaProvider>
                <View className="flex-1 bg-white items-center justify-center" style={{ paddingTop: insets.top }}>
                    <ActivityIndicator size="large" color="#ea770c" />
                </View>
            </SafeAreaProvider>
        );
    }

    // Not logged in state
    if (!isLoggedIn) {
        return (
            <SafeAreaProvider>
                <View 
                    className="flex-1 bg-white items-center justify-center px-6" 
                    style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
                >
                    <Ionicons name="person-circle-outline" size={100} color="#e5e7eb" />
                    <Text className="text-gray-800 text-xl font-bold mt-6">Welcome!</Text>
                    <Text className="text-gray-400 text-center mt-2">
                        Sign in to access your profile, orders, and more
                    </Text>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/SignIn')}
                        className="mt-8 bg-[#ea770c] px-12 py-4 rounded-full"
                    >
                        <Text className="text-white font-bold text-lg">Sign In</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={() => router.push('/SignUp')}
                        className="mt-4"
                    >
                        <Text className="text-[#ea770c] font-medium">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaProvider>
        );
    }

    // Logged in - show profile
    return (
        <SafeAreaProvider>
            <ScrollView 
                className="flex-1 bg-white" 
                style={{ paddingTop: insets.top }}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Header */}
                <View className="px-6 py-4">
                    <Text className="text-2xl font-bold text-gray-800">Profile</Text>
                </View>

                {/* Profile Card */}
                <View className="mx-6 bg-gray-50 rounded-3xl p-6 items-center">
                    {/* Avatar */}
                    <View className="w-24 h-24 rounded-full bg-[#ea770c] items-center justify-center mb-4">
                        {profile?.avatar_url ? (
                            <Image 
                                source={{ uri: profile.avatar_url }}
                                className="w-24 h-24 rounded-full"
                            />
                        ) : (
                            <Text className="text-white text-3xl font-bold">
                                {profile?.name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
                            </Text>
                        )}
                    </View>
                    
                    {/* Name */}
                    <Text className="text-xl font-bold text-gray-800">
                        {profile?.name && profile?.surname 
                            ? `${profile.name} ${profile.surname}` 
                            : profile?.name || 'User'}
                    </Text>
                    
                    {/* Email */}
                    <Text className="text-gray-400 mt-1">{profile?.email}</Text>
                    
                    {/* Edit Profile Button */}
                    <TouchableOpacity 
                        onPress={() => router.push('/EditProfile')}
                        className="mt-4 border border-gray-300 px-6 py-2 rounded-full"
                    >
                        <Text className="text-gray-600 font-medium">Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Items */}
                <View className="px-6 mt-6">
                    <Text className="text-gray-400 text-sm mb-2 uppercase">Account</Text>
                    
                    <MenuItem 
                        icon="person-outline" 
                        title="Personal Information"
                        subtitle="Name, email, phone"
                        onPress={() => router.push('/EditProfile')}
                    />
                    <MenuItem 
                        icon="location-on" 
                        title="Delivery Addresses"
                        subtitle="Manage your addresses"
                        onPress={() => router.push('/DeliveryAddresses')}
                    />
                    <MenuItem 
                        icon="credit-card" 
                        title="Payment Methods"
                        subtitle="Cards and payment options"
                        onPress={() => router.push('/PaymentMethods')}
                    />
                </View>

                <View className="px-6 mt-6">
                    <Text className="text-gray-400 text-sm mb-2 uppercase">Orders</Text>
                    
                    <MenuItem 
                        icon="receipt-long" 
                        title="Order History"
                        subtitle="View past orders"
                        onPress={() => router.push('/(tabs)/history')}
                    />
                    <MenuItem 
                        icon="favorite-border" 
                        title="Favorites"
                        subtitle="Your favorite items"
                        onPress={() => {}}
                    />
                </View>

                <View className="px-6 mt-6">
                    <Text className="text-gray-400 text-sm mb-2 uppercase">Settings</Text>
                    
                    <MenuItem 
                        icon="notifications-none" 
                        title="Notifications"
                        subtitle="Manage notifications"
                        onPress={() => {}}
                    />
                    <MenuItem 
                        icon="help-outline" 
                        title="Help & Support"
                        onPress={() => router.push('/HelpSupport')}
                    />
                    <MenuItem 
                        icon="info-outline" 
                        title="About"
                        onPress={() => router.push('/About')}
                    />
                </View>

                {/* Logout */}
                <View className="px-6 mt-6">
                    <MenuItem 
                        icon="logout" 
                        title="Logout"
                        onPress={handleLogout}
                        showArrow={false}
                        danger
                    />
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}
