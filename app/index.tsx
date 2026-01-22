import { Audio } from 'expo-av';
import { useRouter } from "expo-router";
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Landing() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Play splash sound with fade out effect
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/ambience.mp3'),
          { shouldPlay: true, volume: 1.0 } // Start at full volume
        );
        soundRef.current = sound;

        // Fade out the sound over the animation duration (6.5 seconds)
        let currentVolume = 1.0;
        const fadeSteps = 13; // Number of fade steps
        const fadeInterval = 6500 / fadeSteps; // ~500ms per step
        const volumeDecrement = 1.0 / fadeSteps;

        fadeIntervalRef.current = setInterval(async () => {
          currentVolume -= volumeDecrement;
          if (currentVolume <= 0) {
            currentVolume = 0;
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
          if (soundRef.current) {
            await soundRef.current.setVolumeAsync(Math.max(0, currentVolume));
          }
        }, fadeInterval);

      } catch (error) {
        console.log('Could not play splash sound:', error);
      }
    };

    playSound();

    // Animation duration: navigate after animation completes
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home'); 
    }, 6500);

    // Cleanup timer, sound, and fade interval on unmount
    return () => {
      clearTimeout(timer);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
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

