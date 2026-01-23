import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SuccessAnimationProps {
  onAnimationFinish: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onAnimationFinish }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          paddingTop: insets.top,
          paddingBottom: insets.bottom 
        }
      ]}
    >
      <View style={styles.content}>
        <LottieView
          source={require('../../assets/animations/Food delivered orng (1).json')}
          autoPlay
          loop={false}
          onAnimationFinish={onAnimationFinish}
          style={styles.lottie}
        />
        <Animated.Text style={styles.title}>
          Order Placed!
        </Animated.Text>
        <Text style={styles.subtitle}>
          Your delicious food is on the way.
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea770c',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
