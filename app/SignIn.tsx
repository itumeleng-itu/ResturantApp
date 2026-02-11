import LoginForm from '@/components/ui/SignIn';
import { View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  


  return (
    <View 
      className="flex-1 bg-white items-center justify-between py-1" 
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom 
      }}
    >
        <LoginForm/>

    </View>
  );
}