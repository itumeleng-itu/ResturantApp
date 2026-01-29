import { OrderCard } from "@/components/orders/OrderCard";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { useOrders } from "@/hooks/useOrders";
import { supabase } from "@/lib/supabase";
import { Order, OrderItem } from "@/types/order";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "active" | "history";

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const { loading, activeOrders, pastOrders, refreshOrders, error } =
    useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleOrderPress = async (order: Order) => {
    setLoadingDetails(true);
    setDetailsModalVisible(true);

    try {
      let enrichedOrder = { ...order };

      // Fetch driver details if order has a driver_id and is out for delivery
      if (order.driver_id && order.status === "out_for_delivery") {
        const { data: driverData, error: driverError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, phone")
          .eq("id", order.driver_id)
          .single();

        if (!driverError && driverData) {
          enrichedOrder = {
            ...enrichedOrder,
            driver_name: driverData.first_name,
            driver_surname: driverData.last_name,
            driver_contact: driverData.phone,
          };
        }
      }

      // Fetch order items with menu item details
      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          *,
          menu_items (
            name,
            image_url,
            price
          )
        `,
        )
        .eq("order_id", order.id);

      if (error) throw error;

      // Map the nested structure to flat OrderItem structure
      const formattedItems: OrderItem[] = (data || []).map((item: any) => ({
        ...item,
        name: item.menu_items?.name || "Unknown Item",
        image_url: item.menu_items?.image_url,
        // Ensure price_at_time is used if available, otherwise fallback to current menu price
        price_at_time: item.price_at_time || item.menu_items?.price || 0,
      }));

      setSelectedOrder(enrichedOrder);
      setOrderItems(formattedItems);
    } catch (err) {
      console.error("Error fetching order items:", err);
      setSelectedOrder(order);
      setOrderItems([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center pt-16">
      <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
        <MaterialIcons name="inventory" size={48} color="#D1D5DB" />
      </View>
      <Text className="text-xl font-bold text-gray-700 mb-2">
        No orders yet
      </Text>
      <Text className="text-base text-gray-500 text-center px-10 mb-6 leading-6">
        {activeTab === "active"
          ? "You don't have any active orders right now."
          : "Your order history is empty."}
      </Text>
      <TouchableOpacity
        className="bg-rose-600 px-6 py-3 rounded-xl"
        onPress={() => {
          /* Navigate to home/menu */
        }}
      >
        <Text className="text-white text-base font-semibold">Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 py-4 bg-white">
        <Text className="text-3xl font-extrabold text-gray-900">My Orders</Text>
      </View>

      {/* Tab Bar */}
      <View className="flex-row bg-white px-5 border-b border-gray-100">
        {/* Active Tab */}
        <TouchableOpacity
          className={`flex-row items-center py-4 mr-6 border-b-2 ${
            activeTab === "active" ? "border-orange-600" : "border-transparent"
          }`}
          onPress={() => setActiveTab("active")}
        >
          <MaterialIcons
            name="shopping-bag"
            size={20}
            color={activeTab === "active" ? "#E11D48" : "#9CA3AF"}
          />
          <Text
            className={`ml-2 text-base font-semibold ${
              activeTab === "active" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            Active
          </Text>
          {activeOrders.length > 0 && activeTab === "active" && (
            <View className="bg-orange-600 rounded-full px-1.5 py-0.5 min-w-[20px] items-center justify-center ml-2">
              <Text className="text-white text-[10px] font-bold">
                {activeOrders.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* History Tab */}
        <TouchableOpacity
          className={`flex-row items-center py-4 border-b-2 ${
            activeTab === "history" ? "border-orange-600" : "border-transparent"
          }`}
          onPress={() => setActiveTab("history")}
        >
          <MaterialIcons
            name="history"
            size={20}
            color={activeTab === "history" ? "#E11D48" : "#9CA3AF"}
          />
          <Text
            className={`ml-2 text-base font-semibold ${
              activeTab === "history" ? "text-gray-900" : "text-gray-400"
            }`}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading && !activeOrders.length && !pastOrders.length ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#E11D48" />
        </View>
      ) : (
        <FlatList
          data={activeTab === "active" ? activeOrders : pastOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={handleOrderPress} />
          )}
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshOrders}
              colors={["#E11D48"]} // Android
              tintColor="#E11D48" // iOS
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        visible={detailsModalVisible}
        order={selectedOrder}
        items={orderItems}
        onClose={handleCloseDetailsModal}
      />
    </SafeAreaView>
  );
}
