import { Icon } from "@rneui/themed";
import { 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  Pressable 
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useGetData } from "@/hooks/useGetData";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');


const CATEGORIES = [
  { id: 1, name: 'Fruits', icon: 'apple' },
  { id: 2, name: 'Drinks', icon: 'local-drink' },
  { id: 3, name: 'All', icon: 'restaurant' },
  { id: 4, name: 'Snack', icon: 'fastfood' },
  { id: 5, name: 'Food', icon: 'flatware' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { getAllItems } = useGetData();
  const [items, setItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter()

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllItems();
    if (data) {
      setItems(data);
    }
  };

  function navToOrders() {
    router.push('/orders')
  }
    

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: insets.top }}>
      
      {/* --- 1. HEADER SECTION --- */}
      <View className="flex-row items-center px-6 py-2 justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="delivery-dining" size={44} color="black" />
          <View>
            <Text className="text-gray-400 text-[10px]">Delivery to</Text>
            <Text className="text-black text-md font-bold">40a Thabo Mbeki, 0700</Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <Ionicons name="notifications-outline" size={26} color="black" />
          <Pressable onPress={navToOrders}>
             <Ionicons name="cart-outline" size={26} color="black" />
             {/* Red dot badge for cart */}
             <View className="absolute -top-1 -right-1 bg-orange-500 w-3 h-3 rounded-full border-2 border-white" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- 2. TITLE SECTION --- */}
        <View className="px-6 mt-6">
          <Text className="text-4xl font-light tracking-tight text-black">
            Hungry? <Text className="text-gray-300">Order & Eat.</Text>
          </Text>
        </View>

        {/* --- 3. SEARCH & FILTER --- */}
        <View className="px-6 mt-8 flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput 
              placeholder="Search for fast food..." 
              className="ml-2 flex-1 text-gray-600"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity className="bg-black p-4 rounded-2xl justify-center">
            <Ionicons name="options-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- 4. CIRCULAR CATEGORIES --- */}
        <View className="mt-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.name;
              return (
                <TouchableOpacity 
                  key={category.id} 
                  onPress={() => setActiveCategory(category.name)}
                  className="items-center mr-8"
                >
                  <View 
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: isActive ? 8 : 0,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isActive ? 0.1 : 0,
                      shadowRadius: 10,
                      borderWidth: isActive ? 0 : 1,
                      borderColor: '#f3f4f6',
                    }}
                  >
                    <View className={`w-12 h-12 rounded-full items-center justify-center ${isActive ? 'bg-orange-50' : 'bg-gray-50'}`}>
                      <MaterialIcons 
                        name={category.icon as any} 
                        size={22} 
                        color={isActive ? '#ea770c' : '#9ca3af'} 
                      />
                    </View>
                  </View>
                  <Text className={`text-[11px] mt-3 ${isActive ? 'font-bold text-black' : 'text-gray-400'}`}>
                    {category.name}
                  </Text>
                  {isActive && <View className="h-[2px] w-4 bg-black mt-1 rounded-full" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- 5. FOOD GRID (2 COLUMNS) --- */}
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
      </ScrollView>
    </View>
  );
}