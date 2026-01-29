import { useAuth } from "@/hooks/useAuth";
import { useDriverOrders } from "@/hooks/useDriverOrders";
import { JobLocationMap } from "@/components/driver/JobLocationMap";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DriverDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  const {
    availableJobs,
    activeJob,
    loading: jobsLoading,
    takeJob,
    completeJob,
    refreshJobs,
  } = useDriverOrders();

  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout(); // This handles replace to home
  };

  const handleTakeJob = async (orderId: string) => {
    await takeJob(orderId);
  };

  const handleCompleteJob = async () => {
    if (pin.length < 3) {
      Alert.alert("Invalid PIN", "Please enter a valid pickup code.");
      return;
    }
    setIsSubmitting(true);
    const result = await completeJob(activeJob!.id, pin);
    setIsSubmitting(false);
    if (result.success) {
      setPin("");
      Alert.alert("Success", "Job completed successfully!", [{ text: "OK" }]);
    }
  };

  if (jobsLoading && !activeJob) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // ACTIVE JOB VIEW
  if (activeJob) {
    return (
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <View className="px-6 py-4 bg-white shadow-sm flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Current Job</Text>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Location Map Component */}
          <JobLocationMap
            street={activeJob.delivery_street}
            city={activeJob.delivery_city}
            postalCode={activeJob.delivery_postal_code}
            customerName={`${activeJob.user_name} ${activeJob.user_surname}`}
            customerContact={activeJob.user_contact}
          />

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-semibold text-xs uppercase">
                  {activeJob.status.replace("_", " ")}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">
                #{activeJob.id.slice(0, 8)}
              </Text>
            </View>

            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {activeJob.user_name} {activeJob.user_surname}
            </Text>

            <View className="border-t border-gray-100 my-4 pt-4">
              <Text className="font-semibold text-gray-700 mb-2">
                Order Items ({activeJob.num_items})
              </Text>
              {/* Simple list of items if needed, or just summary */}
              <Text className="text-gray-500">
                {activeJob.unique_items} unique items
              </Text>
              <Text className="text-xl font-bold text-gray-800 mt-2">
                Total: R{activeJob.total.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Complete Delivery
            </Text>
            <Text className="text-gray-500 mb-4">
              Enter the PIN provided by the customer to complete this order.
            </Text>

            <TextInput
              className="w-full h-16 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl tracking-widest font-bold mb-6"
              placeholder="PIN"
              keyboardType="number-pad"
              maxLength={6}
              value={pin}
              onChangeText={setPin}
            />

            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center flex-row justify-center ${
                pin.length >= 3 ? "bg-green-600" : "bg-gray-300"
              }`}
              disabled={pin.length < 3 || isSubmitting}
              onPress={handleCompleteJob}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-white font-bold text-lg">
                    Verify & Complete
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // AVAILABLE JOBS VIEW
  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 bg-white shadow-sm flex-row justify-between items-center z-10">
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            Available Jobs
          </Text>
          <Text className="text-gray-500 text-sm">
            {availableJobs.length} orders nearby
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 p-2 rounded-full"
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={jobsLoading} onRefresh={refreshJobs} />
        }
      >
        {availableJobs.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="hourglass-empty" size={64} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-center">
              No jobs available right now.
            </Text>
            <Text className="text-gray-400 text-center">Pull to refresh.</Text>
          </View>
        ) : (
          availableJobs.map((job) => (
            <View
              key={job.id}
              className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text
                    className="text-lg font-bold text-gray-800"
                    numberOfLines={1}
                  >
                    {job.delivery_street}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {job.delivery_city}
                  </Text>
                </View>
                <View className="bg-orange-100 px-3 py-1 rounded-full">
                  <Text className="text-orange-700 font-bold">
                    R{job.delivery_fee.toFixed(2)} Fee
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mb-4">
                <MaterialIcons name="access-time" size={16} color="#9ca3af" />
                <Text className="text-gray-500 ml-1 text-xs">
                  {new Date(job.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text className="text-gray-300 mx-2">|</Text>
                <MaterialIcons name="shopping-bag" size={16} color="#9ca3af" />
                <Text className="text-gray-500 ml-1 text-xs">
                  {job.num_items} items
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-orange-600 py-3 rounded-xl items-center"
                  onPress={() => handleTakeJob(job.id)}
                >
                  <Text className="text-white font-bold">Accept Job</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-3 bg-gray-100 rounded-xl items-center justify-center"
                  onPress={() => router.push(`/driver/job/${job.id}`)}
                >
                  <MaterialIcons
                    name="info-outline"
                    size={24}
                    color="#4b5563"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
