import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Landing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Animation duration: 240 frames ÷ 30 fps = 8000ms
    const timer = setTimeout(() => {
      router.replace('/SignIn'); 
    }, 6500);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <View 
      className="flex-1 bg-white items-center justify-between py-10" 
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom 
      }}
    >
      {/* Header */}
      <View className="items-center mt-10">
        <Text className="text-4xl font-bold text-orange-600">the eatery.</Text>
        <Text className="text-gray-500 text-lg">deliciousness delivered fast.</Text>
      </View>

      {/* Animation Section */}
      <View style={{ width: 510, height: 600 }}>
        <LottieView
          ref={animationRef}
          source={require('../assets/animations/food-delivery.json')}
          autoPlay
          loop={false} // Only play once
          style={{ width: 530, height: 560 }}
        />
      </View>

      {/* Tagline */}
      <View className="items-center">
        <Text className="text-gray-400 italic text-lg">the home of best local fast bites.</Text>
      </View>
    </View>
  );
}