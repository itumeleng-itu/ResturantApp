import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

interface JobLocationMapProps {
  street: string;
  city: string;
  postalCode: string;
  customerName: string;
  customerContact: string;
}

export const JobLocationMap: React.FC<JobLocationMapProps> = ({
  street,
  city,
  postalCode,
  customerName,
  customerContact,
}) => {
  const fullAddress = `${street}, ${city}, ${postalCode}`;

  // Open maps with the delivery address
  const openMaps = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
    Linking.openURL(url);
  };

  // Call customer
  const callCustomer = () => {
    Linking.openURL(`tel:${customerContact}`);
  };

  // SMS customer
  const smsCustomer = () => {
    Linking.openURL(`sms:${customerContact}`);
  };

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
          <MaterialIcons name="location-pin" size={20} color="#ef4444" />
        </View>
        <Text className="text-lg font-bold text-gray-900">
          Delivery Location
        </Text>
      </View>

      {/* Address Card */}
      <View className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
        <Text className="text-sm text-gray-500 mb-1">Address</Text>
        <Text className="text-base font-semibold text-gray-900 leading-5">
          {street}
        </Text>
        <Text className="text-sm text-gray-600 mt-2">
          {city}, {postalCode}
        </Text>
      </View>

      {/* Customer Info Card */}
      <View className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
        <Text className="text-xs text-blue-600 font-semibold mb-2 uppercase">
          Customer
        </Text>
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {customerName}
        </Text>
        <Text className="text-sm text-blue-600 font-medium">
          {customerContact}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {/* Open Maps Button */}
        <TouchableOpacity
          onPress={openMaps}
          className="flex-1 bg-blue-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
        >
          <MaterialIcons name="map" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">View Map</Text>
        </TouchableOpacity>

        {/* Call Customer Button */}
        <TouchableOpacity
          onPress={callCustomer}
          className="flex-1 bg-green-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
        >
          <Ionicons name="call" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Call</Text>
        </TouchableOpacity>

        {/* SMS Customer Button */}
        <TouchableOpacity
          onPress={smsCustomer}
          className="flex-1 bg-purple-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
        >
          <Ionicons name="mail" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Message</Text>
        </TouchableOpacity>
      </View>

      {/* PIN Note */}
      <View className="bg-yellow-50 rounded-xl p-3 mt-4 border border-yellow-200 flex-row items-flex-start">
        <Ionicons
          name="information-circle"
          size={18}
          color="#ca8a04"
          style={{ marginTop: 2 }}
        />
        <Text className="text-xs text-yellow-700 ml-2 flex-1">
          You'll need the customer's pickup PIN when delivering
        </Text>
      </View>
    </View>
  );
};
