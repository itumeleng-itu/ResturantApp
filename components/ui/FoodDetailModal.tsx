import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Types
import {
    calculateCustomizationPrice,
    createEmptyCustomization,
    DrinkOption,
    ExtraOption,
    IngredientOption,
    ItemCustomization,
    SideOption,
} from '@/types/customization';

// Hooks
import { useGetData } from '@/hooks/useGetData';

export type FoodItem = {
    id: string;
    name: string;
    price: number;
    description?: string;
    image_url?: string;
    is_available?: boolean;
    is_spicy?: boolean;
    category?: string;
    category_name?: string;
};

type FoodDetailModalProps = {
    visible: boolean;
    item: FoodItem | null;
    onClose: () => void;
    onAddToCart: (item: FoodItem, quantity: number, customization: ItemCustomization) => void;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const modalWidth = screenWidth - 32;

export default function FoodDetailModal({
    visible,
    item,
    onClose,
    onAddToCart,
}: FoodDetailModalProps) {
    // State
    const [quantity, setQuantity] = useState(1);
    const [imageError, setImageError] = useState(false);
    const [customization, setCustomization] = useState<ItemCustomization>(createEmptyCustomization());
    const [specialInstructions, setSpecialInstructions] = useState('');

    // Options data
    const [sideOptions, setSideOptions] = useState<SideOption[]>([]);
    const [drinkOptions, setDrinkOptions] = useState<DrinkOption[]>([]);
    const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
    const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const { getSideOptions, getDrinks, getExtras, getOptionalIngredients } = useGetData();

    // Load customization options
    useEffect(() => {
        if (visible) {
            loadOptions();
        }
    }, [visible]);

    // Reset state when modal opens with a new item
    useEffect(() => {
        if (visible) {
            setQuantity(1);
            setImageError(false);
            setCustomization(createEmptyCustomization());
            setSpecialInstructions('');
        }
    }, [visible, item?.id]);

    const loadOptions = async () => {
        if (!item?.id) return;
        setLoadingOptions(true);
        try {
            const [sides, drinks, extras, ingredients] = await Promise.all([
                getSideOptions(),
                getDrinks(),
                getExtras(),
                getOptionalIngredients(item.id),
            ]);

            setSideOptions(sides || []);
            setDrinkOptions(drinks || []);
            setExtraOptions(extras || []);
            setIngredientOptions(ingredients || []);
        } catch (error) {
            console.error('Error loading options:', error);
        } finally {
            setLoadingOptions(false);
        }
    };

    if (!item) return null;

    // Determine if item is a meal (not a drink, beverage, dessert, or alcohol)
    // Customization options only appear for meals
    const nonMealCategories = ['drinks', 'beverages', 'beverage', 'drink', 'alcohol', 'alcohols', 'dessert', 'desserts'];
    const categoryLower = (item.category_name || item.category || '').toLowerCase();
    const isMealItem = !nonMealCategories.some(cat => categoryLower.includes(cat));

    const hasImage = item.image_url && !imageError;
    const customizationPrice = isMealItem ? calculateCustomizationPrice(customization) : 0;
    const itemTotalPrice = (item.price + customizationPrice) * quantity;

    // Handlers
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const finalCustomization = {
            ...customization,
            specialInstructions: specialInstructions.trim() || undefined,
        };
        onAddToCart(item, quantity, finalCustomization);
        onClose();
    };

    // Side selection (allow up to 2)
    const toggleSide = (side: SideOption) => {
        setCustomization(prev => {
            const isSelected = prev.selectedSides.some(s => s.id === side.id);
            if (isSelected) {
                return {
                    ...prev,
                    selectedSides: prev.selectedSides.filter(s => s.id !== side.id),
                };
            } else if (prev.selectedSides.length < 2) {
                return {
                    ...prev,
                    selectedSides: [...prev.selectedSides, side],
                };
            }
            return prev;
        });
    };

    // Drink selection (only one)
    const selectDrink = (drink: DrinkOption | undefined) => {
        setCustomization(prev => ({
            ...prev,
            selectedDrink: drink,
        }));
    };

    // Extra toggle/quantity
    const toggleExtra = (extra: ExtraOption) => {
        setCustomization(prev => {
            const existingIndex = prev.selectedExtras.findIndex(e => e.extra.id === extra.id);
            if (existingIndex >= 0) {
                return {
                    ...prev,
                    selectedExtras: prev.selectedExtras.filter(e => e.extra.id !== extra.id),
                };
            } else {
                return {
                    ...prev,
                    selectedExtras: [...prev.selectedExtras, { extra, quantity: 1 }],
                };
            }
        });
    };

    const updateExtraQuantity = (extraId: string, change: number) => {
        setCustomization(prev => {
            const newExtras = prev.selectedExtras.map(e => {
                if (e.extra.id === extraId) {
                    const newQty = Math.max(0, e.quantity + change);
                    return { ...e, quantity: newQty };
                }
                return e;
            }).filter(e => e.quantity > 0);
            return { ...prev, selectedExtras: newExtras };
        });
    };

    // Ingredient modification
    const toggleIngredient = (ingredient: IngredientOption, action: 'add' | 'remove') => {
        setCustomization(prev => {
            const existingIndex = prev.ingredientMods.findIndex(
                m => m.ingredient.id === ingredient.id && m.action === action
            );
            if (existingIndex >= 0) {
                return {
                    ...prev,
                    ingredientMods: prev.ingredientMods.filter((_, i) => i !== existingIndex),
                };
            } else {
                // Remove opposite action if exists
                const filtered = prev.ingredientMods.filter(m => m.ingredient.id !== ingredient.id);
                return {
                    ...prev,
                    ingredientMods: [...filtered, { ingredient, action }],
                };
            }
        });
    };

    const isIngredientModified = (ingredientId: string, action: 'add' | 'remove') => {
        return customization.ingredientMods.some(
            m => m.ingredient.id === ingredientId && m.action === action
        );
    };

    // Section Components
    const renderSectionHeader = (title: string, subtitle?: string) => (
        <View className="mt-6 mb-3">
            <Text className="text-white text-lg font-bold">{title}</Text>
            {subtitle && <Text className="text-gray-400 text-sm mt-1">{subtitle}</Text>}
        </View>
    );

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
                    {/* Image Section */}
                    <View className="w-full h-48 bg-gray-800 rounded-2xl overflow-hidden mb-4">
                        {hasImage ? (
                            <Image
                                source={{ uri: item.image_url }}
                                className="w-full h-full"
                                resizeMode="cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <MaterialIcons name="fastfood" size={60} color="#404040" />
                            </View>
                        )}
                        {item.is_spicy && (
                            <View className="absolute top-3 right-3 bg-red-600 rounded-full px-3 py-1">
                                <Text className="text-white font-semibold text-xs">🌶️ Spicy</Text>
                            </View>
                        )}
                    </View>

                    {/* Item Info */}
                    <Text className="text-white text-2xl font-bold">{item.name}</Text>
                    <Text className="text-gray-400 text-base mt-2 leading-6">
                        {item.description || 'A delicious meal prepared with the finest ingredients.'}
                    </Text>
                    <Text className="text-orange-500 text-xl font-bold mt-3">
                        R{item.price.toFixed(2)}
                    </Text>

                    {/* Only show customization options for meal items */}
                    {isMealItem && loadingOptions ? (
                        <View className="items-center py-10">
                            <ActivityIndicator size="large" color="#ea770c" />
                            <Text className="text-gray-400 mt-3">Loading options...</Text>
                        </View>
                    ) : isMealItem ? (
                        <>
                            {/* Side Options */}
                            {sideOptions.length > 0 && (
                                <>
                                    {renderSectionHeader('Choose Your Sides', 'Select up to 2 (included in price)')}
                                    <View className="flex-row flex-wrap gap-2">
                                        {sideOptions.map((side) => {
                                            const isSelected = customization.selectedSides.some(s => s.id === side.id);
                                            return (
                                                <TouchableOpacity
                                                    key={side.id}
                                                    onPress={() => toggleSide(side)}
                                                    className={`px-4 py-3 rounded-xl border ${
                                                        isSelected 
                                                            ? 'bg-orange-500 border-orange-500' 
                                                            : 'bg-gray-800 border-gray-700'
                                                    }`}
                                                >
                                                    <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {side.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            {/* Drink Options */}
                            {drinkOptions.length > 0 && (
                                <>
                                    {renderSectionHeader('Add a Drink', 'Optional')}
                                    <View className="flex-row flex-wrap gap-2">
                                        {/* No drink option */}
                                        <TouchableOpacity
                                            onPress={() => selectDrink(undefined)}
                                            className={`px-4 py-3 rounded-xl border ${
                                                !customization.selectedDrink 
                                                    ? 'bg-orange-500 border-orange-500' 
                                                    : 'bg-gray-800 border-gray-700'
                                            }`}
                                        >
                                            <Text className={`font-medium ${!customization.selectedDrink ? 'text-white' : 'text-gray-300'}`}>
                                                No Drink
                                            </Text>
                                        </TouchableOpacity>
                                        {drinkOptions.map((drink) => {
                                            const isSelected = customization.selectedDrink?.id === drink.id;
                                            const priceText = drink.price > 0 ? ` (+R${drink.price.toFixed(2)})` : ' (Free)';
                                            return (
                                                <TouchableOpacity
                                                    key={drink.id}
                                                    onPress={() => selectDrink(drink)}
                                                    className={`px-4 py-3 rounded-xl border ${
                                                        isSelected 
                                                            ? 'bg-orange-500 border-orange-500' 
                                                            : 'bg-gray-800 border-gray-700'
                                                    }`}
                                                >
                                                    <Text className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                        {drink.name}
                                                        <Text className="text-xs">{priceText}</Text>
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            {/* Extras */}
                            {extraOptions.length > 0 && (
                                <>
                                    {renderSectionHeader('Add Extras', 'Additional charges apply')}
                                    <View className="gap-2">
                                        {extraOptions.map((extra) => {
                                            const selected = customization.selectedExtras.find(e => e.extra.id === extra.id);
                                            return (
                                                <View 
                                                    key={extra.id}
                                                    className={`flex-row items-center justify-between p-4 rounded-xl border ${
                                                        selected ? 'bg-gray-800 border-orange-500' : 'bg-gray-800 border-gray-700'
                                                    }`}
                                                >
                                                    <TouchableOpacity 
                                                        onPress={() => toggleExtra(extra)}
                                                        className="flex-1 flex-row items-center"
                                                    >
                                                        <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
                                                            selected ? 'bg-orange-500 border-orange-500' : 'border-gray-600'
                                                        }`}>
                                                            {selected && <MaterialIcons name="check" size={16} color="white" />}
                                                        </View>
                                                        <View className="flex-1">
                                                            <Text className="text-white font-medium">{extra.name}</Text>
                                                            <Text className="text-orange-500 text-sm">+R{extra.price.toFixed(2)}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    {selected && (
                                                        <View className="flex-row items-center gap-3">
                                                            <TouchableOpacity 
                                                                onPress={() => updateExtraQuantity(extra.id, -1)}
                                                                className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                                            >
                                                                <MaterialIcons name="remove" size={18} color="white" />
                                                            </TouchableOpacity>
                                                            <Text className="text-white font-bold w-6 text-center">{selected.quantity}</Text>
                                                            <TouchableOpacity 
                                                                onPress={() => updateExtraQuantity(extra.id, 1)}
                                                                className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center"
                                                            >
                                                                <MaterialIcons name="add" size={18} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>
                            )}

                            {/* Ingredient Modifications */}
                            {ingredientOptions.length > 0 && (
                                <>
                                    {renderSectionHeader('Customize Ingredients', 'Remove or add items')}
                                    <View className="gap-2">
                                        {ingredientOptions.map((ingredient) => (
                                            <View key={ingredient.id} className="flex-row items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700">
                                                <Text className="text-white font-medium flex-1">{ingredient.name}</Text>
                                                <View className="flex-row gap-2">
                                                    {ingredient.can_remove && (
                                                        <TouchableOpacity
                                                            onPress={() => toggleIngredient(ingredient, 'remove')}
                                                            className={`px-3 py-2 rounded-lg ${
                                                                isIngredientModified(ingredient.id, 'remove')
                                                                    ? 'bg-red-500'
                                                                    : 'bg-gray-700'
                                                            }`}
                                                        >
                                                            <Text className="text-white text-sm font-medium">No</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {ingredient.can_add && (
                                                        <TouchableOpacity
                                                            onPress={() => toggleIngredient(ingredient, 'add')}
                                                            className={`px-3 py-2 rounded-lg ${
                                                                isIngredientModified(ingredient.id, 'add')
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-700'
                                                            }`}
                                                        >
                                                            <Text className="text-white text-sm font-medium">
                                                                Extra{ingredient.add_price ? ` +R${ingredient.add_price}` : ''}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Special Instructions */}
                            {renderSectionHeader('Special Instructions', 'Any special requests?')}
                            <TextInput
                                className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
                                placeholder="e.g., No mayo, extra sauce, cook well done..."
                                placeholderTextColor="#666"
                                value={specialInstructions}
                                onChangeText={setSpecialInstructions}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                maxLength={200}
                            />
                            <Text className="text-gray-500 text-xs text-right mt-1">
                                {specialInstructions.length}/200
                            </Text>
                        </>
                    ) : (
                        /* Non-meal items (drinks, desserts) - only show special instructions */
                        <>
                            {renderSectionHeader('Special Instructions', 'Any special requests?')}
                            <TextInput
                                className="bg-gray-800 rounded-xl p-4 text-white border border-gray-700"
                                placeholder="e.g., Extra ice, no straw..."
                                placeholderTextColor="#666"
                                value={specialInstructions}
                                onChangeText={setSpecialInstructions}
                                multiline
                                numberOfLines={2}
                                textAlignVertical="top"
                                maxLength={100}
                            />
                            <Text className="text-gray-500 text-xs text-right mt-1">
                                {specialInstructions.length}/100
                            </Text>
                        </>
                    )}
                </ScrollView>

                {/* Bottom Section - Quantity & Add to Cart */}
                <View className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 pt-4 pb-8">
                    {/* Price breakdown */}
                    {customizationPrice > 0 && (
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-400">Extras:</Text>
                            <Text className="text-gray-400">+R{customizationPrice.toFixed(2)}</Text>
                        </View>
                    )}

                    {/* Quantity selector and Add button */}
                    <View className="flex-row items-center gap-4">
                        {/* Quantity Selector */}
                        <View className="flex-row items-center bg-gray-800 rounded-full">
                            <TouchableOpacity
                                onPress={handleDecrement}
                                disabled={quantity <= 1}
                                className={`w-12 h-12 rounded-full items-center justify-center ${
                                    quantity <= 1 ? 'opacity-50' : ''
                                }`}
                            >
                                <MaterialIcons name="remove" size={24} color={quantity <= 1 ? '#666' : 'white'} />
                            </TouchableOpacity>
                            <Text className="text-white text-xl font-bold w-10 text-center">{quantity}</Text>
                            <TouchableOpacity
                                onPress={handleIncrement}
                                className="w-12 h-12 rounded-full items-center justify-center"
                            >
                                <MaterialIcons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Add to Cart Button */}
                        <TouchableOpacity
                            onPress={handleAddToCart}
                            disabled={!item.is_available}
                            className={`flex-1 py-4 rounded-full items-center justify-center ${
                                item.is_available ? 'bg-orange-500' : 'bg-gray-700'
                            }`}
                        >
                            <Text className={`text-lg font-bold ${item.is_available ? 'text-white' : 'text-gray-500'}`}>
                                {item.is_available
                                    ? `Add to Cart • R${itemTotalPrice.toFixed(2)}`
                                    : 'Out of Stock'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
