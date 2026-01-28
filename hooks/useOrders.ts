import { useNotification } from '@/hooks/useNotification';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

export function useOrders() {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [pastOrders, setPastOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items(
                        *,
                        menu_items(
                            id,
                            name,
                            price,
                            image_url,
                            description
                        )
                    )
                `)
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })

            if (error) throw error;

            console.log("Fetched orders:", data?.length || 0);

            if (data) {
                const formattedOrders: Order[] = data.map(order => ({
                    ...order,
                    // Use stored num_items from database, fallback to calculating from order_items
                    num_items: order.num_items ??
                        (order.order_items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0),
                    // Unique items = count of distinct products in the order
                    unique_items: Array.isArray(order.order_items) ? order.order_items.length : 0
                }));
                const active = formattedOrders.filter(o =>
                    ['pending', 'preparing', 'out_for_delivery'].includes(o.status)
                );
                const past = formattedOrders.filter(o =>
                    ['delivered', 'cancelled'].includes(o.status)
                );
                setActiveOrders(active);
                setPastOrders(past);
            }


        } catch (err: any) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();

        // Subscribe to order updates
        const subscription = supabase
            .channel('order-updates')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders'
            }, (payload: any) => {
                console.log('Order update received:', payload);
                const newOrder = payload.new;

                // Check for approval update
                if (newOrder.status === 'preparing' && newOrder.pickup_code && newOrder.eta) {
                    // Calculate relative time
                    const arrivalTime = formatDistanceToNow(new Date(newOrder.eta), { addSuffix: false });

                    showNotification(
                        "Order Approved!",
                        `Code: ${newOrder.pickup_code}. Arriving in ${arrivalTime}.`,
                        "success"
                    );
                }

                fetchOrders();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchOrders, showNotification]);

    return {
        loading,
        activeOrders,
        pastOrders,
        error,
        refreshOrders: fetchOrders
    };
}
