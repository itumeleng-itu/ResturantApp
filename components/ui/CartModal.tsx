/**
 * CART MODAL COMPONENT
 * 
 * Displays cart items when user clicks the cart icon.
 * 
 * FEATURES:
 * - Shows list of items in cart with images, names, prices
 * - Allows quantity adjustment (+/-)
 * - Shows total price
 * - Checkout button - disabled if not logged in
 * - If not logged in, shows message to login first
 * 
 * USAGE:
 * <CartModal visible={isOpen} onClose={() => setIsOpen(false)} />
 */

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { CartItem, useCart } from '@/hooks/useCart';
import { useRouter } from 'expo-router';

type CartModalProps = {
    visible: boolean;
    onClose: () => void;
};

const { width: screenWidth } = Dimensions.get('window');

export default function CartModal({ visible, onClose }: CartModalProps) {
    const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { getSession } = useAuth();
    const router = useRouter();
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check auth status when modal opens
    useEffect(() => {
        if (visible) {
            checkAuthStatus();
        }
    }, [visible]);

    const checkAuthStatus = async () => {
        setCheckingAuth(true);
        const session = await getSession();
        setIsLoggedIn(!!session);
        setCheckingAuth(false);
    };

    // Handle checkout press
    const handleCheckout = async () => {
        // Use getSession from useAuth hook
        const session = await getSession();
                
        if (!session) {
            // User is NOT logged in - show alert with login option
            Alert.alert(
                'Login Required',
                'Please login to proceed to checkout',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Go to Login', 
                        onPress: () => {
                            onClose();
                            router.push('/SignIn');
                        }
                    }
                ]
            );
            return;
        }
        
        // User IS logged in - proceed to checkout
        onClose();
        router.push('/checkout'); // Navigate to checkout screen
    };

    // Handle quantity change
    const handleQuantityChange = (itemId: string, currentQty: number, change: number) => {
        const newQty = currentQty + change;
        if (newQty <= 0) {
            removeFromCart(itemId);
        } else {
            updateQuantity(itemId, newQty);
        }
    };

    // Render single cart item
    const renderCartItem = (item: CartItem) => (
        <View 
            key={item.id} 
            className="flex-row bg-white border border-black rounded-2xl p-4 mb-3"
        >
            {/* Item Image */}
            <View className="w-20 h-20 bg-white rounded-xl overflow-hidden mr-4">
                {item.image_url ? (
                    <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-full items-center justify-center">
                        <MaterialIcons name="fastfood" size={30} color="#666" />
                    </View>
                )}
            </View>

            {/* Item Details */}
            <View className="flex-1 justify-between">
                <View>
                    <Text className="text-black font-bold text-base" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text className="text-gray-400 mb-2 text-sm">
                        R{item.price.toFixed(2)} each
                    </Text>
                </View>

                {/* Quantity Controls */}
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item.id, item.quantity, -1)}
                            className="w-8 h-8 rounded-full bg-black items-center justify-center"
                        >
                            <MaterialIcons name="remove" size={18} color="white" />
                        </TouchableOpacity>
                        
                        <Text className="text-black font-bold text-lg mx-4">
                            {item.quantity}
                        </Text>
                        
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item.id, item.quantity, 1)}
                            className="w-8 h-8 rounded-full bg-black items-center justify-center"
                        >
                            <MaterialIcons name="add" size={18} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-black font-bold text-lg">
                        R{(item.price * item.quantity).toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
                onPress={() => removeFromCart(item.id)}
                className="absolute top-2 right-2"
            >
                <Ionicons name="close-circle" size={22} color="#000000ff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1"
                style={{ backgroundColor: 'rgba(151, 151, 151, 0.7)' }}
                onPress={onClose}
            >
                {/* Modal Content - slides from bottom */}
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
                    style={{ maxHeight: '85%' }}
                >
                    {/* Handle Bar */}
                    <View className="items-center py-3">
                        <View className="w-12 h-1 bg-gray-600 rounded-full" />
                    </View>

                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 pb-4">
                        <Text className="text-black text-2xl font-bold">Your Cart</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Cart Items */}
                    {cartCount === 0 ? (
                        // Empty Cart State
                        <View className="items-center justify-center py-16 px-6">
                            <Ionicons name="cart-outline" size={80} color="#666" />
                            <Text className="text-gray-400 text-lg mt-4 text-center">
                                Your cart is empty
                            </Text>
                            <Text className="text-gray-500 text-sm mt-2 text-center">
                                Add some delicious items to get started!
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                                className="mt-6 bg-[#ea770c] px-8 py-3 rounded-full"
                            >
                                <Text className="text-white font-bold">Browse Menu</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {/* Items List */}
                            <ScrollView 
                                className="px-6"
                                style={{ maxHeight: 350 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {cartItems.map(renderCartItem)}
                            </ScrollView>

                            {/* Cart Summary */}
                            <View className="px-6 py-4 border-t border-gray-200">
                                {/* Subtotal */}
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-400">Subtotal ({cartCount} items)</Text>
                                    <Text className="text-black font-medium">R{cartTotal.toFixed(2)}</Text>
                                </View>
                                
                                {/* Delivery Fee */}
                                <View className="flex-row justify-between mb-4">
                                    <Text className="text-gray-400">Delivery Fee</Text>
                                    <Text className="text-black font-medium">R25.00</Text>
                                </View>

                                {/* Total */}
                                <View className="flex-row justify-between mb-4">
                                    <Text className="text-black text-lg font-bold">Total</Text>
                                    <Text className="text-[#ea770c] text-xl font-bold">
                                        R{(cartTotal + 25).toFixed(2)}
                                    </Text>
                                </View>

                                {/* Checkout Button */}
                                <TouchableOpacity
                                    onPress={handleCheckout}
                                    className={`w-full py-4 rounded-full items-center justify-center 
                                        ${isLoggedIn ? 'bg-[#ea770c]' : 'bg-black'}`}
                                >
                                    <Text className={`text-lg font-bold ${
                                        isLoggedIn ? 'text-white' : 'text-white'
                                    }`}>
                                        {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Clear Cart */}
                                <TouchableOpacity
                                    onPress={() => {
                                        Alert.alert(
                                            'Clear Cart',
                                            'Are you sure you want to remove all items?',
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                { text: 'Clear', style: 'destructive', onPress: clearCart }
                                            ]
                                        );
                                    }}
                                    className="mt-3 mb-3 items-center"
                                >
                                    <Text className="text-red-500 font-bold text-md">Clear Cart</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}