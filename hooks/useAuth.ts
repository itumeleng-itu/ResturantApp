// hooks/useAuth.ts
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // LOGIN
    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.replace('/(tabs)/home'); //to your menu page

            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed';
            setError(errorMessage);
            Alert.alert('Login Error', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // SIGNUP
    const signup = async (
        email: string,
        password: string,
        userData?: { name?: string; surname?: string; contact_number?: string; address?: object, card_details?: object }
    ) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData || {}
                }
            });
            if (error) throw error;

            Alert.alert(
                'Success!',
                'Account created! Please check your email for verification.'
            );

            return { success: true, data };
        } catch (err: any) {
            const errorMessage = err.message || 'Signup failed';
            setError(errorMessage);
            Alert.alert('Signup Error', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            Alert.alert('Success', 'Logged out successfully');
            router.replace('/(tabs)/home');

            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || 'Logout failed';
            setError(errorMessage);
            Alert.alert('Logout Error', errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // GET CURRENT USER
    const getCurrentUser = async () => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            return user;
        } catch (err: any) {
            console.error('Error getting user:', err.message);
            return null;
        }
    };

    // GET SESSION - more reliable for auth checking
    const getSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (err: any) {
            console.error('Error getting session:', err.message);
            return null;
        }
    };

    return {
        login,
        signup,
        logout,
        getCurrentUser,
        getSession,
        loading,
        error,
    };
}