/**
 * CART HOOK - useCart
 * 
 * This hook manages the shopping cart state across the entire app.
 * 
 * HOW IT WORKS:
 * - Uses React Context to share cart state globally
 * - Any component wrapped in CartProvider can access cart data
 * - Cart items are stored in memory (you can extend to persist in AsyncStorage)
 * 
 * USAGE:
 * 1. Wrap your app with <CartProvider> in _layout.tsx
 * 2. In any component, use: const { cartItems, addToCart, cartCount } = useCart();
 * 
 * AVAILABLE FUNCTIONS:
 * - addToCart(item, quantity) - Add item to cart
 * - removeFromCart(itemId) - Remove item from cart
 * - updateQuantity(itemId, quantity) - Update item quantity
 * - clearCart() - Empty the cart
 * - cartCount - Total number of items
 * - cartTotal - Total price of all items
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';

// Type for items in the cart
export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
};

// Type for the cart context
type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: { id: string; name: string; price: number; image_url?: string }, quantity: number) => void;
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
        item: { id: string; name: string; price: number; image_url?: string },
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
                return [...prevItems, { ...item, quantity }];
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
                item.id === itemId ? { ...item, quantity } : item
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
