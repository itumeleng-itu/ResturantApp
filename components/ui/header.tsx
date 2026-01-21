//libraries
import { Text, View,Pressable } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

//hooks
import { useRouter } from "expo-router";


export default function Header (){
    const router = useRouter();

    //navigate to orders onclick
    function navToOrders() {
    router.push('/orders')
  }

    return(
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
    )
}