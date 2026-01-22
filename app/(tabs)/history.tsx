import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Services
import { supabase } from '@/lib/supabase';

type OrderItem = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    created_at: string;
    status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
    total: number;
    items: OrderItem[];
};

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }
            
            setIsLoggedIn(true);
            
            // Fetch orders from database
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
                // Use mock data if table doesn't exist
                setOrders([]);
            } else {
                setOrders(data || []);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadOrders();
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'preparing': return 'bg-blue-100 text-blue-700';
            case 'delivering': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'time-outline';
            case 'preparing': return 'restaurant-outline';
            case 'delivering': return 'bicycle-outline';
            case 'completed': return 'checkmark-circle-outline';
            case 'cancelled': return 'close-circle-outline';
            default: return 'ellipse-outline';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state
    if (loading) {
        return (
            <SafeAreaProvider>
                <View className="flex-1 bg-white items-center justify-center">
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
                    className="flex-1 bg-white" 
                    style={{ paddingTop: insets.top }}
                >
                    <View className="px-6 py-4 border-b border-gray-100">
                        <Text className="text-2xl font-bold text-gray-800">Order History</Text>
                    </View>
                    <View className="flex-1 items-center justify-center px-6">
                        <MaterialIcons name="receipt-long" size={80} color="#e5e7eb" />
                        <Text className="text-gray-400 text-lg mt-4 text-center">
                            Sign in to view your order history
                        </Text>
                    </View>
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
                {/* Header */}
                <View className="px-6 py-4 border-b border-gray-100">
                    <Text className="text-2xl font-bold text-gray-800">Order History</Text>
                </View>

                <ScrollView 
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24, paddingTop: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ea770c']} />
                    }
                >
                    {orders.length === 0 ? (
                        // Empty state
                        <View className="items-center py-20">
                            <MaterialIcons name="receipt-long" size={80} color="#e5e7eb" />
                            <Text className="text-gray-400 text-lg mt-4 text-center">
                                No orders yet
                            </Text>
                            <Text className="text-gray-300 text-sm mt-2 text-center">
                                Your order history will appear here
                            </Text>
                        </View>
                    ) : (
                        // Orders list
                        orders.map((order) => (
                            <TouchableOpacity 
                                key={order.id}
                                className="bg-gray-50 rounded-2xl p-4 mb-4"
                            >
                                {/* Order header */}
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="text-gray-400 text-sm">Order #{order.id.slice(-6)}</Text>
                                        <Text className="text-gray-500 text-xs mt-1">
                                            {formatDate(order.created_at)}
                                        </Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full flex-row items-center ${getStatusColor(order.status).split(' ')[0]}`}>
                                        <Ionicons 
                                            name={getStatusIcon(order.status) as any} 
                                            size={14} 
                                            color={order.status === 'completed' ? '#15803d' : '#374151'} 
                                        />
                                        <Text className={`ml-1 text-xs font-medium capitalize ${getStatusColor(order.status).split(' ')[1]}`}>
                                            {order.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Order items */}
                                <View className="border-t border-gray-200 pt-3">
                                    {order.items?.slice(0, 3).map((item, index) => (
                                        <View key={index} className="flex-row justify-between mb-1">
                                            <Text className="text-gray-600">
                                                {item.quantity}x {item.name}
                                            </Text>
                                            <Text className="text-gray-600">
                                                R{(item.price * item.quantity).toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                    {order.items && order.items.length > 3 && (
                                        <Text className="text-gray-400 text-sm">
                                            +{order.items.length - 3} more items
                                        </Text>
                                    )}
                                </View>

                                {/* Order total */}
                                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                    <Text className="font-bold text-gray-800">Total</Text>
                                    <Text className="font-bold text-[#ea770c] text-lg">
                                        R{order.total?.toFixed(2) || '0.00'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}
