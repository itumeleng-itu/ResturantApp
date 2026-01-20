import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function LoginForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all the fields');
      return;
    }
    await login(email, password);
  };

  return (
    <View 
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      {/* Content Container */}
      <View className="flex-1 items-center px-8 pt-1">
        {/* Logo & Tagline */}
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-orange-600">the eatery</Text>
          <Text className="text-gray-400 text-base mt-1">deliciousness delivered fast</Text>
        </View>

        {/* Animation/Image Placeholder */}
        <View style={{ width: 400, height: 300 }}>
            <LottieView
                source={require('../../assets/animations/fastfood.json')}
                autoPlay
                loop
                style={{ width: 400, height: 350 }}
            />
        </View>

        {/* Subtitle */}
        <Text className="text-black/40 italic font-semibold text-md mt-4 mb-8">Login to your account</Text>

        {/* Email Input */}
        <View className="w-full px-6 mb-4">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Email</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="userjohn@gmail.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="w-full px-6 mb-4">
          <Text className="text-black/80 text-sm font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg"
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <View className="w-full px-6 mb-4">
            <TouchableOpacity 
            className="w-full h-14 bg-orange-600 rounded-full items-center justify-center mt-4"
            onPress={handleLogin}
            activeOpacity={0.8}
            >
            <Text className="text-white text-base font-semibold">Login</Text>
            </TouchableOpacity>
        </View>
        

        {/* Sign Up Link */}
        <View className="flex-row items-center mt-6">
          <Text className="text-gray-500 text-sm">Dont have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/SignUp')}>
            <Text className="text-orange-600 text-sm font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}