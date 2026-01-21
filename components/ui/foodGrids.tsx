import { Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions,Pressable } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


//hooks
import { useGetData } from "@/hooks/useGetData";
import React, { useState, useEffect } from 'react';



export default function FoodGrids (){

    const { getAllItems } = useGetData();
    const [items, setItems] = useState<any[]>([]);
    const { width } = Dimensions.get('window');

    useEffect(() => {
        loadData();
      }, []);
    
      const loadData = async () => {
        const data = await getAllItems();
        if (data) {
          setItems(data);
        }
      };

    return(
        <View className="flex-row flex-wrap justify-between px-6 mt-10">
          {items.length === 0 ? (
            <View className="w-full items-center mt-10">
              <Text className="text-gray-400">Loading delicious food...</Text>
            </View>
          ) : (
            items.map((item) => (
              <View 
                key={item.id} 
                style={{ width: (width - 60) / 2 }} 
                className="bg-gray-50/50 rounded-[35px] p-4 mb-6 border border-gray-50"
              >
                {/* Sale Badge */}
                <View className="absolute top-4 left-4 bg-black rounded-full px-2 py-1 z-10">
                  <Text className="text-white text-[9px] font-bold">-25%</Text>
                </View>

                {/* Image Placeholder */}
                <View className="w-full h-28 bg-white rounded-3xl mb-4 overflow-hidden items-center justify-center">
                   {/* In a real app, use: <Image source={{ uri: item.image_url }} /> */}
                   <MaterialIcons name="fastfood" size={40} color="#e5e7eb" />
                </View>

                <Text className="text-[13px] font-bold text-center text-gray-800" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-[10px] text-gray-400 text-center mt-1">
                  Premium Quality
                </Text>

                <View className="flex-row justify-between items-center mt-4">
                  <Text className="font-extrabold text-sm text-black">
                    <Text className="text-orange-500 font-normal">R </Text>{item.price}
                  </Text>
                  <TouchableOpacity className="bg-black w-8 h-8 rounded-full items-center justify-center">
                    <Ionicons name="add" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
    )
}