import SignUpForm from '@/components/ui/SignUp';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  

 

  return (
    <View 
      className="flex-1 bg-white items-center justify-between py-1" 
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom 
      }}
    >
        <SignUpForm/>

    </View>
  );
}