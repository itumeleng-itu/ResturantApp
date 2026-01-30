import { CartItem } from '@/hooks/useCart';
import { formatCustomizationSummary } from '@/types/customization';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type CartItemCardProps = {
    item: CartItem;
    onUpdateQuantity: (itemId: string, currentQty: number, change: number) => void;
    onRemove: (itemId: string) => void;
};

export const CartItemCard = ({ item, onUpdateQuantity, onRemove }: CartItemCardProps) => {
    // Calculate display price (base + customization)
    const unitPrice = item.price + (item.customizationPrice || 0);
    const totalPrice = item.totalItemPrice || unitPrice * item.quantity;
    const hasCustomizations = item.customizationPrice && item.customizationPrice > 0;

    const renderCustomizationDetails = (item: CartItem) => {
        if (!item.customization) return null;
    
        const summaryLines = formatCustomizationSummary(item.customization);
        if (summaryLines.length === 0) return null;
    
        return (
          <View className="mt-1">
            {summaryLines.slice(0, 3).map((line, index) => {
              const lineText = line && typeof line === "string" ? line : String(line || "");
              return (
                <Text
                  key={index}
                  className="text-gray-500 text-xs"
                  numberOfLines={1}
                >
                  {`• ${lineText}`}
                </Text>
              );
            })}
            {summaryLines.length > 3 && (
              <Text className="text-gray-400 text-xs">
                {`+${summaryLines.length - 3} more`}
              </Text>
            )}
          </View>
        );
      };

    return (
        <View className="flex-row bg-white border border-gray-200 rounded-2xl p-4 mb-3">
            {/* Item Image */}
            <View className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4">
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

                    {/* Price breakdown */}
                    <View className="flex-row items-center gap-2">
                        <Text className="text-gray-500 text-sm">
                            R{item.price.toFixed(2)}
                        </Text>
                        {hasCustomizations && (
                            <Text className="text-orange-500 text-sm">
                                +R{item.customizationPrice?.toFixed(2)}
                            </Text>
                        )}
                    </View>

                    {/* Customization details */}
                    {renderCustomizationDetails(item)}
                </View>

                {/* Quantity Controls */}
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => onUpdateQuantity(item.id, item.quantity, -1)}
                            className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center"
                        >
                            <MaterialIcons name="remove" size={18} color="white" />
                        </TouchableOpacity>

                        <Text className="text-black font-bold text-lg mx-4">
                            {item.quantity}
                        </Text>

                        <TouchableOpacity
                            onPress={() => onUpdateQuantity(item.id, item.quantity, 1)}
                            className="w-8 h-8 rounded-full bg-gray-800 items-center justify-center"
                        >
                            <MaterialIcons name="add" size={18} color="white" />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-black font-bold text-lg">
                        R{totalPrice.toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
                onPress={() => onRemove(item.id)}
                className="absolute top-2 right-2"
            >
                <Ionicons name="close-circle" size={22} color="#ef4444" />
            </TouchableOpacity>
        </View>
    );
};
