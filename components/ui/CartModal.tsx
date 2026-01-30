import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

// Components
import { CartHeader } from "@/components/cart/CartHeader";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCartView } from "@/components/cart/EmptyCartView";

type CartModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CartModal({ visible, onClose }: CartModalProps) {
  const {
    cartItems,
    cartTotal,
    cartCount,
    uniqueItemsCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { getSession } = useAuth();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status when modal opens
  useEffect(() => {
    if (visible) {
      checkAuthStatus();
    }
  }, [visible]);

  const checkAuthStatus = async () => {
    const session = await getSession();
    setIsLoggedIn(!!session);
  };

  // Handle checkout press
  const handleCheckout = async () => {
    const session = await getSession();

    if (!session) {
      Alert.alert("Login Required", "Please login to proceed to checkout", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go to Login",
          onPress: () => {
            onClose();
            router.push("/SignIn");
          },
        },
      ]);
      return;
    }

    onClose();
    router.push("/checkout");
  };

  const handleQuantityChange = (itemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
          style={{ maxHeight: "85%" }}
        >
          {/* Handle Bar */}
          <View className="items-center py-3">
            <View className="w-12 h-1 bg-gray-300 rounded-full" />
          </View>

          <CartHeader 
            cartCount={cartCount} 
            uniqueItemsCount={uniqueItemsCount} 
            onClose={onClose} 
          />

          {cartCount === 0 ? (
            <EmptyCartView onClose={onClose} />
          ) : (
            <>
              <ScrollView
                className="px-6"
                style={{ maxHeight: 350 }}
                showsVerticalScrollIndicator={false}
              >
                {cartItems.map((item) => (
                    <CartItemCard 
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleQuantityChange}
                        onRemove={removeFromCart}
                    />
                ))}
              </ScrollView>

              <CartSummary 
                cartCount={cartCount}
                cartTotal={cartTotal}
                isLoggedIn={isLoggedIn}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
              />
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
