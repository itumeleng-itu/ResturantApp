import {View,TextInput,Text, TouchableOpacity,ScrollView} from "react-native";
import { MaterialIcons} from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';

//hook
import { useGetData } from "@/hooks/useGetData";


export default function CircularCategories() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState<any[]>([]);
    const {getCategories} = useGetData()


    
        useEffect(() => {
            loadData();
          }, []);
        
          const loadData = async () => {
            const data = await getCategories();
            if (data) {
              setCategories(data);
            }
          };
    
    return(
    <View className="mt-8">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
        {categories.map((category) => {
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
                    shadowColor: '#fb8c00',
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

    )
}