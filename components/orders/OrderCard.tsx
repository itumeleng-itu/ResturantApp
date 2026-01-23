import { Order } from '@/types/order';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, ChevronRight, Clock, ShoppingBag, Truck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { color: '#EAB308', icon: Clock, label: 'Pending' };
    case 'preparing':
      return { color: '#3B82F6', icon: ShoppingBag, label: 'Preparing' };
    case 'on_the_way':
      return { color: '#8B5CF6', icon: Truck, label: 'On the way' };
    case 'delivered':
      return { color: '#10B981', icon: CheckCircle2, label: 'Delivered' };
    case 'cancelled':
      return { color: '#EF4444', icon: AlertCircle, label: 'Cancelled' };
    default:
      return { color: '#6B7280', icon: Clock, label: status };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  
  const formattedDate = format(new Date(order.created_at), 'MMM d, h:mm a');

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <StatusIcon size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.orderId}>Order #{order.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={styles.amount}>R {order.total_amount.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.itemsCount}>
          {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.viewDetails}>View Details</Text>
        <ChevronRight size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  content: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E11D48', // Primary color
  },
  itemsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 4,
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
