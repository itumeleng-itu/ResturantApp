import { supabase } from "@/lib/supabase";
import { Address } from "@/types/checkout";
import { useCallback, useEffect, useState } from "react";

export function useCheckoutAddresses() {
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const loadAddresses = useCallback(async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", session.user.id)
                .order("is_default", { ascending: false });

            if (!error && data) {
                setAddresses(data);
                // Auto-select default address
                const defaultAddr = data.find((a) => a.is_default) || data[0];
                if (defaultAddr) setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error("Error loading addresses:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAddresses();
    }, [loadAddresses]);

    return {
        loading,
        addresses,
        selectedAddress,
        setSelectedAddress,
        refreshAddresses: loadAddresses,
    };
}
