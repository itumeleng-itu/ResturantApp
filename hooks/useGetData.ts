import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useGetData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //get all items in the menu
    const getAllItems = async () => {
        setLoading(true)
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
            console.error(e)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }

    }
    //get all the categories of the menu
    const getCategories = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }

    }
    //get drinks in the menu
    const getDrinks = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    ///get extras offered
    const getExtras = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    //get optional ingredients
    const getOPtionalIngredients = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('optional_ingredients')
                .select('*')

            if (error) {
                throw new Error
            }
            return data;
        }
        catch (error) {
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    //get order items( after making an order)
    const getOrderItems = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }

    //get order details (e.g address)
    const getOrders = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    //get all the payment cards
    const getPaymentCards = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    //get all the payment cards
    const getSideOptions = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }
    const getProfile = async () => {
        setLoading(true)
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
            console.error(error)
            setError("Error fetching items")
        }
        finally {
            setLoading(false)
        }
    }

    return {
        loading,
        error,
        getAllItems,
        getCategories,
        getSideOptions,
        getDrinks,
        getExtras,
        getOptionalIngredients: getOPtionalIngredients,
    }
}