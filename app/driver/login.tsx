import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
// import LottieView from 'lottie-react-native'; // Optional: Use different animation if available
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DriverLogin() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all the fields');
      return;
    }
    const result = await login(email, password, false);
    if (result.success) {
        router.replace('/driver/dashboard');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
      <View className="flex-1 items-center px-6 justify-center">
        
        <View className="items-center mb-10">
            <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                <MaterialIcons name="local-shipping" size={40} color="white" />
            </View>
          <Text className="text-3xl font-bold text-blue-800">Driver Portal</Text>
          <Text className="text-gray-500 text-base mt-2">Log in to view and accept jobs</Text>
        </View>

        <View className="w-full mb-4">
          <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Email</Text>
          <TextInput
            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg"
            placeholder="driver@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="w-full mb-8">
          <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">Password</Text>
          <TextInput
            className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-lg"
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
            className={`w-full h-16 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-200 ${loading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={loading}
            >
            <Text className="text-white text-lg font-bold">
                {loading ? 'Logging in...' : 'Login'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="mt-8">
            <Text className="text-gray-400 font-medium">Back to App</Text>
        </TouchableOpacity>

      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
