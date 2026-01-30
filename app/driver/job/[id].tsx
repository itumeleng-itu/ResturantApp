import { useDriverOrders } from '@/hooks/useDriverOrders';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JobDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { takeJob } = useDriverOrders();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [taking, setTaking] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items(
                        *,
                        menu_items(
                            name,
                            price,
                            image_url,
                            description
                        )
                    )
                `)
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            // Format order if needed (e.g. num_items)
            const formatted = {
                ...data,
                 num_items: data.num_items ?? (data.order_items?.length || 0),
            };

            setOrder(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setTaking(true);
        const result = await takeJob(id as string);
        setTaking(false);
        if (result.success) {
            router.replace('/driver/dashboard');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!order) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Job not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-blue-600">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <MaterialIcons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-bold ml-2">Job Details</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Status Badge */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="bg-gray-100 px-3 py-1 rounded-full">
                        <Text className="text-gray-600 text-xs font-bold uppercase">{order.status}</Text>
                    </View>
                    <Text className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleString()}</Text>
                </View>

                {/* Customer Info */}
                <View className="mb-6">
                    <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Delivery To</Text>
                    <Text className="text-xl font-bold text-gray-800">{order.user_name} {order.user_surname}</Text>
                    <Text className="text-lg text-gray-600 mt-1">{order.delivery_street}</Text>
                    <Text className="text-gray-500">{order.delivery_city}, {order.delivery_postal_code}</Text>
                </View>

                {/* Order Summary */}
                <View className="mb-6 bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Order Items</Text>
                    {order.order_items?.map((item, index: number) => (
                        <View key={item.id || index} className="flex-row items-center mb-3">
                            <View className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center mr-3">
                                <Text className="font-bold text-gray-600">{item.quantity}x</Text>
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">{item.menu_items?.name || 'Item'}</Text>
                        </View>
                    ))}
                    <View className="border-t border-gray-200 mt-2 pt-3 flex-row justify-between">
                        <Text className="font-bold text-gray-800">Total Earnings (Est.)</Text>
                        <Text className="font-bold text-green-600">R{order.delivery_fee.toFixed(2)}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Action Button */}
            <View className="p-4 border-t border-gray-100" style={{ paddingBottom: insets.bottom + 10 }}>
                { (!order.driver_id && order.status === 'preparing') ? (
                    <TouchableOpacity 
                        className="w-full bg-blue-600 py-4 rounded-xl items-center"
                        onPress={handleAccept}
                        disabled={taking}
                    >
                        {taking ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Accept Delivery</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View className="items-center">
                        <Text className="text-gray-500">This job is not available.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
