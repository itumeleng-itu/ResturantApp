import LottieView from 'lottie-react-native';
import { Button } from '@rneui/themed';
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LoginForm from '@/components/ui/SignIn';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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