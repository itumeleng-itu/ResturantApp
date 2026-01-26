import {
    calculateCustomizationPrice,
    createEmptyCustomization,
    ItemCustomization
} from '@/types/customization';
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Type for items in the cart
export type CartItem = {
    id: string;               // Unique cart item ID (item + customization combo)
    menuItemId: string;       // Original menu item ID
    name: string;
    price: number;            // Base price
    quantity: number;
    image_url?: string;
    customization: ItemCustomization;
    customizationPrice: number;  // Extra price from customizations
    totalItemPrice: number;      // (price + customizationPrice) * quantity
};

// Type for the cart context
type CartContextType = {
    cartItems: CartItem[];
    addToCart: (
        item: { id: string; name: string; price: number; image_url?: string }, 
        quantity: number,
        customization?: ItemCustomization
    ) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    updateCustomization: (cartItemId: string, customization: ItemCustomization) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    uniqueItemsCount: number;
};

// Generate unique cart item ID based on item and customization
function generateCartItemId(menuItemId: string, customization: ItemCustomization): string {
    const customizationHash = JSON.stringify({
        sides: customization.selectedSides.map(s => s.id).sort(),
        drink: customization.selectedDrink?.id,
        extras: customization.selectedExtras.map(e => `${e.extra.id}:${e.quantity}`).sort(),
        mods: customization.ingredientMods.map(m => `${m.ingredient.id}:${m.action}`).sort(),
        notes: customization.specialInstructions,
    });
    return `${menuItemId}_${btoa(customizationHash).slice(0, 8)}`;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Add item to cart (or update quantity if same item with same customization exists)
    const addToCart = (
        item: { id: string; name: string; price: number; image_url?: string },
        quantity: number,
        customization: ItemCustomization = createEmptyCustomization()
    ) => {
        const customizationPrice = calculateCustomizationPrice(customization);
        const cartItemId = generateCartItemId(item.id, customization);

        setCartItems((prevItems) => {
            // Check if exact same item + customization exists
            const existingItem = prevItems.find((i) => i.id === cartItemId);

            if (existingItem) {
                // Update quantity of existing item
                return prevItems.map((i) =>
                    i.id === cartItemId
                        ? { 
                            ...i, 
                            quantity: i.quantity + quantity,
                            totalItemPrice: (i.price + customizationPrice) * (i.quantity + quantity)
                        }
                        : i
                );
            } else {
                // Add new item to cart
                const newItem: CartItem = {
                    id: cartItemId,
                    menuItemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity,
                    image_url: item.image_url,
                    customization,
                    customizationPrice,
                    totalItemPrice: (item.price + customizationPrice) * quantity,
                };
                return [...prevItems, newItem];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (cartItemId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    };

    // Update quantity of an item
    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === cartItemId 
                    ? { 
                        ...item, 
                        quantity,
                        totalItemPrice: (item.price + item.customizationPrice) * quantity
                    } 
                    : item
            )
        );
    };

    // Update customization of an item
    const updateCustomization = (cartItemId: string, customization: ItemCustomization) => {
        const customizationPrice = calculateCustomizationPrice(customization);
        
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id !== cartItemId) return item;
                
                // Generate new cart item ID based on new customization
                const newCartItemId = generateCartItemId(item.menuItemId, customization);
                
                return {
                    ...item,
                    id: newCartItemId,
                    customization,
                    customizationPrice,
                    totalItemPrice: (item.price + customizationPrice) * item.quantity,
                };
            })
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate total number of items in cart (sum of quantities)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Calculate number of unique items (distinct products/customizations)
    const uniqueItemsCount = cartItems.length;

    // Calculate total price
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.totalItemPrice,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateCustomization,
                clearCart,
                cartCount,
                cartTotal,
                uniqueItemsCount,
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
