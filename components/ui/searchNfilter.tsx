import {View,TextInput, TouchableOpacity} from "react-native";
import { Ionicons} from '@expo/vector-icons';

export default function SearchNFilter() {
    return(
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
    )
}