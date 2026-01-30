import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useFoodCustomization } from '@/hooks/useFoodCustomization';
import { ItemCustomization } from '@/types/customization';
import { FoodItem } from '@/types/food';

// Sub-components
import { DrinkSelection } from '@/components/food/DrinkSelection';
import { ExtraSelection } from '@/components/food/ExtraSelection';
import { FoodImageHeader } from '@/components/food/FoodImageHeader';
import { FoodModalFooter } from '@/components/food/FoodModalFooter';
import { IngredientSelection } from '@/components/food/IngredientSelection';
import { SideSelection } from '@/components/food/SideSelection';
import { SpecialInstructions } from '@/components/food/SpecialInstructions';

type FoodDetailModalProps = {
    visible: boolean;
    item: FoodItem | null;
    onClose: () => void;
    onAddToCart: (item: FoodItem, quantity: number, customization: ItemCustomization) => void;
};

export default function FoodDetailModal({
    visible,
    item,
    onClose,
    onAddToCart,
}: FoodDetailModalProps) {
    const {
        quantity,
        customization,
        specialInstructions,
        setSpecialInstructions,
        sideOptions,
        drinkOptions,
        extraOptions,
        ingredientOptions,
        loadingOptions,
        isMealItem,
        customizationPrice,
        handleDecrement,
        handleIncrement,
        toggleSide,
        selectDrink,
        toggleExtra,
        updateExtraQuantity,
        toggleIngredient
    } = useFoodCustomization(item, visible);

    if (!item) return null;

    const handleAddToCartClick = () => {
        const finalCustomization = {
            ...customization,
            specialInstructions: specialInstructions.trim() || undefined,
        };
        onAddToCart(item, quantity, finalCustomization);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80">
                {/* Header with close button */}
                <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <MaterialIcons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">
                        {isMealItem ? 'Customize Order' : 'Add to Order'}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView 
                    className="flex-1 px-4" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 200 }}
                >
                    <FoodImageHeader item={item} />
                    
                    {/* Item Info */}
                    <Text className="text-white text-2xl font-bold">{item.name}</Text>
                    <Text className="text-gray-400 text-base mt-2 leading-6">
                        {item.description || 'A delicious meal prepared with the finest ingredients.'}
                    </Text>
                    <Text className="text-orange-500 text-xl font-bold mt-3">
                        R{item.price.toFixed(2)}
                    </Text>

                    {isMealItem && loadingOptions ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#ea770c" />
                            <Text className="text-gray-400 mt-3">Loading options...</Text>
                        </View>
                    ) : (
                        <>
                            {isMealItem && (
                                <>
                                    <SideSelection 
                                        options={sideOptions} 
                                        selectedSides={customization.selectedSides} 
                                        onToggle={toggleSide} 
                                    />
                                    <DrinkSelection 
                                        options={drinkOptions} 
                                        selectedDrink={customization.selectedDrink} 
                                        onSelect={selectDrink} 
                                    />
                                    <ExtraSelection 
                                        options={extraOptions} 
                                        selectedExtras={customization.selectedExtras} 
                                        onToggle={toggleExtra} 
                                        onUpdateQuantity={updateExtraQuantity} 
                                    />
                                    <IngredientSelection 
                                        options={ingredientOptions} 
                                        modifications={customization.ingredientMods} 
                                        onToggle={toggleIngredient} 
                                    />
                                </>
                            )}
                            
                            <SpecialInstructions 
                                value={specialInstructions} 
                                onChange={setSpecialInstructions} 
                                isMealItem={isMealItem} 
                            />
                        </>
                    )}
                </ScrollView>

                <FoodModalFooter 
                    quantity={quantity}
                    customizationPrice={customizationPrice}
                    basePrice={item.price}
                    isAvailable={!!item.is_available}
                    onDecrement={handleDecrement}
                    onIncrement={handleIncrement}
                    onAddToCart={handleAddToCartClick}
                />
            </View>
        </Modal>
    );
}
