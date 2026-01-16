import { Text, View, Button} from "react-native";
import{SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context'
import {useRouter } from "expo-router";
  

export default function Landing() {

  const insets = useSafeAreaInsets()
  const router = useRouter()
  return (
    <SafeAreaProvider>
      <View className="bg-white p-4" style={{ 
        flex: 1, 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right, 
      }}>
        <Text>Restaurant App Intro</Text>
      <Button 
        title="Enter App" 
        onPress={() => router.replace('/(tabs)/home')} 
      />
    </View>
    </SafeAreaProvider>
    )
  }
