import { useCallback, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useGetData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loadingCounter = useRef(0);

    const startLoading = () => {
        loadingCounter.current += 1;
        setLoading(true);
    };

    const stopLoading = () => {
        loadingCounter.current = Math.max(0, loadingCounter.current - 1);
        if (loadingCounter.current === 0) {
            setLoading(false);
        }
    };

    //get all items in the menu
    const getAllItems = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*, categories(name)')

            if (error) {
                throw error
            }

            // Flatten the category name for easier access
            const flattenedData = data.map(item => ({
                ...item,
                category_name: item.categories?.name
            }))

            return flattenedData;
        }
        catch (e) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }

    }, []);

    //get all the categories of the menu
    const getCategories = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true })

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }

    }, []);

    //get drinks in the menu
    const getDrinks = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('drink_options')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    ///get extras offered
    const getExtras = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('extras')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    //get optional ingredients for a specific menu item
    const getOptionalIngredients = useCallback(async (menuItemId?: string) => {
        startLoading()
        setError(null)
        try {
            let query = supabase
                .from('optional_ingredients')
                .select('*')

            // Filter by menu item ID if provided
            if (menuItemId) {
                query = query.eq('menu_item_id', menuItemId)
            }

            const { data, error } = await query

            if (error) {
                throw new Error(error.message)
            }
            return data;
        }
        catch (error) {
            setError("Error fetching ingredients")
        }
        finally {
            stopLoading()
        }
    }, []);

    //get order items( after making an order)
    const getOrderItems = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('order_items')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    //get order details (e.g address)
    const getOrders = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    //get all the payment cards
    const getPaymentCards = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('payment_cards')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    //get side options
    const getSideOptions = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('side_options')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    const getProfile = useCallback(async () => {
        startLoading()
        setError(null)
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            setError("Error fetching items")
        }
        finally {
            stopLoading()
        }
    }, []);

    return {
        loading,
        error,
        getAllItems,
        getCategories,
        getSideOptions,
        getDrinks,
        getExtras,
        getOptionalIngredients,
    }
}