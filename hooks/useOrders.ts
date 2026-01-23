import { supabase } from '@/lib/supabase';
import { Order } from '@/types/order';
import { useCallback, useEffect, useState } from 'react';

export function useOrders() {
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
          order_items(count)
        `)
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedOrders = data.map(order => ({
                    ...order,
                    items_count: order.order_items?.[0]?.count || 0
                }));

                setActiveOrders(formattedOrders.filter(o =>
                    ['pending', 'preparing', 'on_the_way'].includes(o.status)
                ));

                setPastOrders(formattedOrders.filter(o =>
                    ['delivered', 'cancelled'].includes(o.status)
                ));
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
                event: '*',
                schema: 'public',
                table: 'orders'
            }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchOrders]);

    return {
        loading,
        activeOrders,
        pastOrders,
        error,
        refreshOrders: fetchOrders
    };
}
