// Types for food item customization options

// Side option (chips, salad, pap, etc.) - usually included in price
export type SideOption = {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    is_available: boolean;
};

// Drink option - can be included or add-on
export type DrinkOption = {
    id: string;
    name: string;
    price: number;  // 0 if included, > 0 if add-on
    size?: string;  // e.g., "300ml", "500ml"
    image_url?: string;
    is_available: boolean;
};

// Extras (additional items with price add-on)
export type ExtraOption = {
    id: string;
    name: string;
    price: number;  // Always add-on price
    description?: string;
    image_url?: string;
    category?: string;  // e.g., "Sauces", "Sides", "Toppings"
    is_available: boolean;
};

// Optional ingredients (can be removed or added)
export type IngredientOption = {
    id: string;
    name: string;
    is_removable: boolean;  // Can remove from item (e.g., "No onions")
    is_addable: boolean;    // Can add to item (e.g., "Extra cheese")
    add_price?: number;     // Price if adding
};

// Selected customization for a cart item
export type ItemCustomization = {
    // Selected side options (usually 1-2 selections allowed)
    selectedSides: SideOption[];
    // Selected drink (optional)
    selectedDrink?: DrinkOption;
    // Selected extras with quantities
    selectedExtras: {
        extra: ExtraOption;
        quantity: number;
    }[];
    // Ingredient modifications
    ingredientMods: {
        ingredient: IngredientOption;
        action: 'add' | 'remove';
    }[];
    // Special instructions text
    specialInstructions?: string;
};

// Calculate total price of customizations
export function calculateCustomizationPrice(customization: ItemCustomization): number {
    let total = 0;

    // Drink price (if not included)
    if (customization.selectedDrink && customization.selectedDrink.price > 0) {
        total += customization.selectedDrink.price;
    }

    // Extras
    for (const { extra, quantity } of customization.selectedExtras) {
        total += extra.price * quantity;
    }

    // Ingredient add-ons
    for (const { ingredient, action } of customization.ingredientMods) {
        if (action === 'add' && ingredient.add_price) {
            total += ingredient.add_price;
        }
    }

    return total;
}

// Create empty customization
export function createEmptyCustomization(): ItemCustomization {
    return {
        selectedSides: [],
        selectedDrink: undefined,
        selectedExtras: [],
        ingredientMods: [],
        specialInstructions: undefined,
    };
}

// Format customization summary for display
export function formatCustomizationSummary(customization: ItemCustomization): string[] {
    const summary: string[] = [];

    // Sides
    if (customization.selectedSides.length > 0) {
        summary.push(`Sides: ${customization.selectedSides.map(s => s.name).join(', ')}`);
    }

    // Drink
    if (customization.selectedDrink) {
        const drinkText = customization.selectedDrink.price > 0
            ? `${customization.selectedDrink.name} (+R${customization.selectedDrink.price.toFixed(2)})`
            : customization.selectedDrink.name;
        summary.push(`Drink: ${drinkText}`);
    }

    // Extras
    for (const { extra, quantity } of customization.selectedExtras) {
        const text = quantity > 1
            ? `${quantity}x ${extra.name} (+R${(extra.price * quantity).toFixed(2)})`
            : `${extra.name} (+R${extra.price.toFixed(2)})`;
        summary.push(text);
    }

    // Ingredient modifications
    const removals = customization.ingredientMods
        .filter(m => m.action === 'remove')
        .map(m => m.ingredient.name);
    const additions = customization.ingredientMods
        .filter(m => m.action === 'add')
        .map(m => {
            const ing = m.ingredient;
            return ing.add_price ? `${ing.name} (+R${ing.add_price.toFixed(2)})` : ing.name;
        });

    if (removals.length > 0) {
        summary.push(`No: ${removals.join(', ')}`);
    }
    if (additions.length > 0) {
        summary.push(`Add: ${additions.join(', ')}`);
    }

    // Special instructions
    if (customization.specialInstructions?.trim()) {
        summary.push(`Note: ${customization.specialInstructions}`);
    }

    return summary;
}
