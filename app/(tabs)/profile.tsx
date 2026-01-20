import { Text, View} from "react-native";

import{SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context'
  

export default function HomeScreen() {

  const insets = useSafeAreaInsets()
  return (
    <SafeAreaProvider>
      <View className="bg-white p-4" style={{ 
        flex: 1, 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right, 
      }}>
        
      </View>
    </SafeAreaProvider>
    )
  }
