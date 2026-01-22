import { supabase } from '@/lib/supabase';
import { Address, AddressFormData } from '@/types/address';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useAddresses() {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const loadAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            setUserId(session.user.id);

            const { data, error } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_default', { ascending: false });

            if (error) {
                console.error('Error fetching addresses:', error);
                setAddresses([]);
            } else {
                setAddresses(data || []);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    const saveAddress = async (formData: AddressFormData): Promise<boolean> => {
        if (!formData.street || !formData.city || !formData.postalCode) {
            Alert.alert('Error', 'Please fill in all address fields');
            return false;
        }

        if (!userId) {
            Alert.alert('Error', 'Please sign in to add an address');
            return false;
        }

        setSaving(true);
        try {
            const { data, error } = await supabase
                .from('addresses')
                .insert({
                    user_id: userId,
                    label: formData.label,
                    street: formData.street,
                    city: formData.city,
                    postal_code: formData.postalCode,
                    is_default: addresses.length === 0,
                })
                .select()
                .single();

            if (error) throw error;

            setAddresses([...addresses, data]);
            Alert.alert('Success', 'Address added successfully');
            return true;
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to add address');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const setDefaultAddress = async (addressId: string): Promise<void> => {
        try {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId);

            const { error } = await supabase
                .from('addresses')
                .update({ is_default: true })
                .eq('id', addressId);

            if (error) throw error;

            const updatedAddresses = addresses.map(addr => ({
                ...addr,
                is_default: addr.id === addressId,
            }));
            setAddresses(updatedAddresses);
        } catch (error) {
            Alert.alert('Error', 'Failed to update default address');
        }
    };

    const deleteAddress = async (addressId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', addressId);

            if (error) throw error;

            const updatedAddresses = addresses.filter(a => a.id !== addressId);

            // If deleted was default, set first as default
            if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.is_default)) {
                await supabase
                    .from('addresses')
                    .update({ is_default: true })
                    .eq('id', updatedAddresses[0].id);
                updatedAddresses[0].is_default = true;
            }

            setAddresses(updatedAddresses);
        } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
        }
    };

    const confirmDeleteAddress = (addressId: string): void => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to remove this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteAddress(addressId)
                }
            ]
        );
    };

    return {
        loading,
        addresses,
        saving,
        saveAddress,
        setDefaultAddress,
        confirmDeleteAddress,
        refreshAddresses: loadAddresses,
    };
}
