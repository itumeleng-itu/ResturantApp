import { useAudioPlayer } from 'expo-audio';
import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Landing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  
  // Use the new expo-audio hook - player is auto-managed
  const player = useAudioPlayer(require('../assets/sounds/ambience.mp3'));

  useEffect(() => {
    // Set volume to 100% and start playing
    player.volume = 1.0;
    player.play();

    // Fade out the sound over the animation duration (6.5 seconds)
    let currentVolume = 1.0;
    const fadeSteps = 13; // Number of fade steps
    const fadeInterval = 6500 / fadeSteps; // ~500ms per step
    const volumeDecrement = 1.0 / fadeSteps;

    fadeIntervalRef.current = setInterval(() => {
      currentVolume -= volumeDecrement;
      if (currentVolume <= 0) {
        currentVolume = 0;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
      player.volume = Math.max(0, currentVolume);
    }, fadeInterval);

    // Animation duration: navigate after animation completes
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home'); 
    }, 6500);

    // Cleanup timer and fade interval on unmount
    // Note: player cleanup is automatic with useAudioPlayer hook
    return () => {
      clearTimeout(timer);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
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

