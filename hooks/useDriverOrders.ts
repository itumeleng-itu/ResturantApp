import { supabase } from "@/lib/supabase";
import { Order } from "@/types/order";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useDriverOrders() {
    const [loading, setLoading] = useState(true);
    const [availableJobs, setAvailableJobs] = useState<Order[]>([]);
    const [activeJob, setActiveJob] = useState<Order | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            // Fetch available jobs (preparing and no driver)
            const { data: availableData, error: availableError } = await supabase
                .from("orders")
                .select(`
            *,
            order_items(
                *,
                menu_items(
                    name,
                    price,
                    image_url
                )
            )
        `)
                .eq("status", "preparing")
                .is("driver_id", null)
                .order("created_at", { ascending: true });

            if (availableError) throw availableError;

            // Fetch active job (assigned to current user and not delivered)
            const { data: activeData, error: activeError } = await supabase
                .from("orders")
                .select(`
            *,
            order_items(
                *,
                menu_items(
                    name,
                    price,
                    image_url
                )
            )
        `)
                .eq("driver_id", session.user.id)
                .in("status", ["preparing", "out_for_delivery"]) // Assuming 'preparing' becomes 'out_for_delivery' once picked upp
                .maybeSingle();

            if (activeError && activeError.code !== 'PGRST116') throw activeError;

            const formatOrder = (order: any): Order => ({
                ...order,
                num_items: order.num_items ?? (order.order_items?.length || 0),
                unique_items: order.order_items?.length || 0,
            });

            setAvailableJobs(availableData ? availableData.map(formatOrder) : []);
            setActiveJob(activeData ? formatOrder(activeData) : null);

        } catch (err: any) {

            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const takeJob = async (orderId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error("Not authenticated");

            // Use .select() to get the updated row back and verify the update worked
            const { data, error } = await supabase
                .from("orders")
                .update({
                    driver_id: session.user.id,
                    status: 'out_for_delivery'
                })
                .eq("id", orderId)
                .eq("status", "preparing") // Only take jobs that are in preparing status
                .is("driver_id", null) // Ensure it hasn't been taken
                .select()
                .maybeSingle();

            if (error) throw error;

            // Check if the update actually affected a row
            if (!data) {
                throw new Error("Job is no longer available. It may have been taken by another driver or the order status has changed.");
            }

            await fetchJobs();
            return { success: true };
        } catch (err: any) {
            Alert.alert("Error taking job", err.message);
            return { success: false, error: err.message };
        }
    };

    const completeJob = async (orderId: string, pin: string) => {
        try {
            // Verify PIN first
            // Since we have the order loaded in activeJob, we can check client side if we trust it, 
            // OR better, do a database check. 
            // However, standard security practice is server-side verification. 
            // For this task, I will do a fetch to verify.

            const { data: order, error: fetchError } = await supabase
                .from("orders")
                .select("pickup_code")
                .eq("id", orderId)
                .single();

            if (fetchError) throw fetchError;

            if (order.pickup_code?.toUpperCase() !== pin.toUpperCase()) {
                throw new Error("Invalid code. Please try again.");
            }

            // Update status
            const { error: updateError } = await supabase
                .from("orders")
                .update({ status: 'delivered' })
                .eq("id", orderId);

            if (updateError) throw updateError;

            await fetchJobs();
            return { success: true };
        } catch (err: any) {
            Alert.alert("Error completing job", err.message);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        fetchJobs();

        // Subscribe to changes
        const subscription = supabase
            .channel("driver-updates")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "orders",
                },
                () => {
                    fetchJobs();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchJobs]);

    return {
        loading,
        availableJobs,
        activeJob,
        error,
        refreshJobs: fetchJobs,
        takeJob,
        completeJob
    };
}
