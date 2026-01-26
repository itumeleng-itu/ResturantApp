import { Order } from '@/types/order';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':
      return { color: '#EAB308', icon: 'time-outline', library: 'Ionicons', label: 'Pending' };
    case 'preparing':
      return { color: '#3B82F6', icon: 'restaurant-outline', library: 'Ionicons', label: 'Preparing' };
    case 'out_for_delivery':
      return { color: '#8B5CF6', icon: 'bicycle-outline', library: 'Ionicons', label: 'On the way' };
    case 'delivered':
      return { color: '#10B981', icon: 'checkmark-circle-outline', library: 'Ionicons', label: 'Delivered' };
    case 'cancelled':
      return { color: '#EF4444', icon: 'close-circle-outline', library: 'Ionicons', label: 'Cancelled' };
    default:
      return { color: '#6B7280', icon: 'help-circle-outline', library: 'Ionicons', label: status };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const statusConfig = getStatusConfig(order.status);
  const IconComponent = statusConfig.library === 'Ionicons' ? Ionicons : MaterialIcons;
  
  const formattedDate = format(new Date(order.created_at), 'MMM d, h:mm a');

  return (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm active:opacity-70"
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center bg-gray-50 px-2 py-1 rounded-md gap-1">
          <IconComponent name={statusConfig.icon as any} size={14} color={statusConfig.color} />
          <Text 
            className="text-xs font-semibold capitalize"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </Text>
        </View>
        <Text className="text-xs text-gray-500">{formattedDate}</Text>
      </View>

      {/* Content */}
      <View className="mb-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text className="text-base font-bold text-rose-600">
            R {(order.total ?? 0).toFixed(2)}
          </Text>
        </View>
        <Text className="text-sm text-gray-500">
          {order.num_items || 0} {(order.num_items || 0) === 1 ? 'item' : 'items'}
          {order.unique_items !== undefined && order.unique_items > 0 && (
            <Text className="text-gray-400"> • {order.unique_items} {order.unique_items === 1 ? 'product' : 'products'}</Text>
          )}
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row justify-end items-center border-t border-gray-100 pt-3 gap-1">
        <Text className="text-sm font-semibold text-gray-400">View Details</Text>
        <MaterialIcons name="chevron-right" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};