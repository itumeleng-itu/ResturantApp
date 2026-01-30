import { useGetData } from '@/hooks/useGetData';
import {
    calculateCustomizationPrice,
    createEmptyCustomization,
    DrinkOption,
    ExtraOption,
    IngredientOption,
    ItemCustomization,
    SideOption
} from '@/types/customization';
import { FoodItem } from '@/types/food';
import { useCallback, useEffect, useState } from 'react';

export function useFoodCustomization(item: FoodItem | null, visible: boolean) {
    const [quantity, setQuantity] = useState(1);
    const [customization, setCustomization] = useState<ItemCustomization>(createEmptyCustomization());
    const [specialInstructions, setSpecialInstructions] = useState('');

    // Options data
    const [sideOptions, setSideOptions] = useState<SideOption[]>([]);
    const [drinkOptions, setDrinkOptions] = useState<DrinkOption[]>([]);
    const [extraOptions, setExtraOptions] = useState<ExtraOption[]>([]);
    const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const { getSideOptions, getDrinks, getExtras, getOptionalIngredients } = useGetData();

    const loadOptions = useCallback(async () => {
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
    }, [item?.id, getSideOptions, getDrinks, getExtras, getOptionalIngredients]);

    // Load customization options
    useEffect(() => {
        if (visible) {
            loadOptions();
        }
    }, [visible, loadOptions]);

    // Reset state when modal opens with a new item
    useEffect(() => {
        if (visible) {
            setQuantity(1);
            setCustomization(createEmptyCustomization());
            setSpecialInstructions('');
        }
    }, [visible, item?.id]);

    const isMealItem = () => {
        if (!item) return false;
        const nonMealCategories = ['drinks', 'beverages', 'beverage', 'drink', 'alcohol', 'alcohols', 'dessert', 'desserts'];
        const categoryLower = (item.category_name || item.category || '').toLowerCase();
        return !nonMealCategories.some(cat => categoryLower.includes(cat));
    };

    const customizationPrice = isMealItem() ? calculateCustomizationPrice(customization) : 0;

    // Handlers
    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

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

    const selectDrink = (drink: DrinkOption | undefined) => {
        setCustomization(prev => ({
            ...prev,
            selectedDrink: drink,
        }));
    };

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
                const filtered = prev.ingredientMods.filter(m => m.ingredient.id !== ingredient.id);
                return {
                    ...prev,
                    ingredientMods: [...filtered, { ingredient, action }],
                };
            }
        });
    };

    return {
        quantity,
        customization,
        specialInstructions,
        setSpecialInstructions,
        sideOptions,
        drinkOptions,
        extraOptions,
        ingredientOptions,
        loadingOptions,
        isMealItem: isMealItem(),
        customizationPrice,
        handleDecrement,
        handleIncrement,
        toggleSide,
        selectDrink,
        toggleExtra,
        updateExtraQuantity,
        toggleIngredient
    };
}
