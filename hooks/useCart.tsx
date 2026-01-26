import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Alert } from 'react-native';

// Type for items in the cart
export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    num_items: number;
    image_url?: string;
};

// Type for the cart context
type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: { id: string; name: string; price: number; num_items?: number; image_url?: string }, quantity: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Add item to cart (or update quantity if already exists)
    const addToCart = (
        item: { id: string; name: string; price: number; num_items?: number; image_url?: string },
        quantity: number
    ) => {
        setCartItems((prevItems) => {
            // Check if item already exists in cart
            const existingItem = prevItems.find((i) => i.id === item.id);

            if (existingItem) {
                // Update quantity of existing item
                return prevItems.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            } else {
                // Add new item to cart
                return [...prevItems, { ...item, quantity, num_items: item.num_items || quantity }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (itemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };

    // Update quantity of an item
    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId ? { ...item, quantity, num_items: quantity } : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate total number of items in cart
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Calculate total price
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook to use cart in components
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
