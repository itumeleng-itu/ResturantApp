import { Order, OrderItem } from "@/types/order";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OrderDetailsModalProps {
  visible: boolean;
  order: Order | null;
  items: OrderItem[];
  onClose: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return { color: "#EAB308", icon: "time-outline", label: "Pending" };
    case "preparing":
      return {
        color: "#3B82F6",
        icon: "restaurant-outline",
        label: "Preparing",
      };
    case "out_for_delivery":
      return { color: "#8B5CF6", icon: "bicycle-outline", label: "On the way" };
    case "delivered":
      return {
        color: "#10B981",
        icon: "checkmark-circle-outline",
        label: "Delivered",
      };
    case "cancelled":
      return {
        color: "#EF4444",
        icon: "close-circle-outline",
        label: "Cancelled",
      };
    default:
      return { color: "#6B7280", icon: "help-circle-outline", label: status };
  }
};

const { width: screenWidth } = Dimensions.get("window");

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  visible,
  order,
  items,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const formattedDate = format(new Date(order.created_at), "MMM d, h:mm a");
  const etaTime = order.eta
    ? formatDistanceToNow(new Date(order.eta), { addSuffix: true })
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View 
            className="bg-white border-b border-gray-200 px-5 pb-4 flex-row justify-between items-center"
            style={{ paddingTop: insets.top + 10 }}
        >
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">{formattedDate}</Text>
          </View>
          <TouchableOpacity onPress={onClose} className="p-2">
            <MaterialIcons name="close" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 py-4">
          {/* Status Section */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-4">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: statusConfig.color + "20" }}
              >
                <Ionicons
                  name={statusConfig.icon as any}
                  size={24}
                  color={statusConfig.color}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Current Status</Text>
                <Text
                  className="text-lg font-bold capitalize"
                  style={{ color: statusConfig.color }}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            {/* Pickup Code - Show when available */}
            {order.pickup_code && (
              <View className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
                <Text className="text-xs text-gray-500 mb-1">Pickup Code</Text>
                <Text className="text-2xl font-bold text-gray-900 font-mono">
                  {order.pickup_code}
                </Text>
              </View>
            )}

            {/* ETA - Show when available */}
            {order.eta && (
              <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="time-outline" size={16} color="#ea770c" />
                  <Text className="text-xs text-orange-600 ml-2">
                    Estimated Arrival
                  </Text>
                </View>
                <Text className="text-lg font-bold text-gray-900">
                  {etaTime}
                </Text>
              </View>
            )}
          </View>

          {/* Order Items Section */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Order Items
            </Text>
            {items.length > 0 ? (
              <View className="gap-3">
                {items.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center border-b border-gray-100 pb-3 last:border-b-0"
                  >
                    {/* Item Image */}
                    {item.image_url && (
                      <Image
                        source={{ uri: item.image_url }}
                        className="w-16 h-16 rounded-lg bg-gray-100 mr-3"
                        resizeMode="cover"
                      />
                    )}

                    {/* Item Details */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </Text>
                    </View>

                    {/* Price */}
                    <Text className="text-base font-bold text-gray-900">
                      R{(item.price_at_time * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 text-center py-4">
                No items available
              </Text>
            )}
          </View>

          {/* Order Summary Section */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </Text>

            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold text-gray-900">
                  R{order.subtotal.toFixed(2)}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Delivery Fee</Text>
                <Text className="font-semibold text-gray-900">
                  R{order.delivery_fee.toFixed(2)}
                </Text>
              </View>

              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-lg font-bold text-gray-900">Total</Text>
                <Text className="text-lg font-bold text-rose-600">
                  R{order.total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Address Section */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Delivery Address
            </Text>

            <View className="flex-row items-flex-start">
              <Ionicons name="location-outline" size={20} color="#ea770c" />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900">
                  {order.delivery_street}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {order.delivery_city}, {order.delivery_postal_code}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Information Section */}
          <View className="bg-white rounded-2xl p-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Contact Information
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center">
                <MaterialIcons name="person-outline" size={20} color="#666" />
                <Text className="text-gray-700 ml-3">
                  {order.user_name} {order.user_surname}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text className="text-gray-700 ml-3">{order.user_contact}</Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#666" />
                <Text className="text-gray-700 ml-3">{order.user_email}</Text>
              </View>
            </View>
          </View>

          {/* Payment Information Section */}
          {order.payment_status && (
            <View className="bg-white rounded-2xl p-4 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Payment
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="credit-card" size={20} color="#666" />
                  <Text className="text-gray-700 ml-3">
                    Card ending in {order.card_last_four}
                  </Text>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${
                    order.payment_status === "paid"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold capitalize ${
                      order.payment_status === "paid"
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {order.payment_status}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Order Notes Section */}
          {order.notes && (
            <View className="bg-white rounded-2xl p-4 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Order Notes
              </Text>
              <Text className="text-gray-700 leading-6">{order.notes}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
