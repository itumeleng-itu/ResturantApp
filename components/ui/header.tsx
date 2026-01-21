//libraries
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

//hooks
import { useCart } from "@/hooks/useCart";
import { useRouter } from "expo-router";

//components
import CartModal from "./CartModal";


export default function Header (){
    const router = useRouter();
    
    // Get cart count from cart hook
    const { cartCount } = useCart();
    
    // Check if cart has items
    const hasItemsInCart = cartCount > 0;
    
    // Cart modal state
    const [cartModalVisible, setCartModalVisible] = useState(false);

    return(
        <>
            <View className="flex-row items-center px-6 py-2 justify-between">
                <View className="flex-row items-center gap-2">
                    <MaterialIcons name="delivery-dining" size={44} color="black" />
                    <View>
                        <Text className="text-gray-400 text-[10px]">Delivery to</Text>
                        <Text className="text-black text-md font-bold">40a Thabo Mbeki, 0700</Text>
                    </View>
                </View>
                <View className="flex-row gap-4">
                    <Ionicons name="notifications-outline" size={26} color="black" />
                    <Pressable onPress={() => setCartModalVisible(true)}>
                        {/* Cart icon - filled when items exist, outline when empty */}
                        <Ionicons 
                            name={hasItemsInCart ? "cart" : "cart-outline"} 
                            size={26} 
                            color="black" 
                        />
                        {/* Red dot badge - only shows when cart has items */}
                        {hasItemsInCart && (
                            <View className="absolute -top-1 -right-1 bg-orange-500 w-4 h-4 rounded-full border-2 border-white items-center justify-center">
                                <Text className="text-white text-[8px] font-bold">{cartCount > 9 ? '9+' : cartCount}</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Cart Modal */}
            <CartModal 
                visible={cartModalVisible} 
                onClose={() => setCartModalVisible(false)} 
            />
        </>
    )
}

