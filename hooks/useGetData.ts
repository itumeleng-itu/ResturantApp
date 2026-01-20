import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';  

export function useGetData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getAllItems = async () => {
        setLoading(true)
        setError(null)
        try{
            const {data, error} = await supabase
            .from('menu_items')
            .select('*')

            if(error){
                throw new Error
            }
            return data;
        }
        catch(e){
            console.error(e)
            setError("Error fetching items")
        }
        finally{
            setLoading(false)
        }
        
    }
    
    return {
        loading,
        error,
        getAllItems
    }
}