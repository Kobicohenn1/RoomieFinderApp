import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  useAnimatedStyle,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../constants'; // Make sure this path is correct

const LogoAnimation = ({ onAnimationEnd }) => {
  const scale = useSharedValue(0.5); // Start smaller for a reveal effect
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  const animationConfig = {
    duration: 1500,
    easing: Easing.bezier(0.4, 0, 0.2, 1), // Smoother easing curve
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` }, // Rotate Z-axis for a 3D feel
    ],
    opacity: opacity.value,
  }));

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, animationConfig), // Overshoot for a bounce effect
      withTiming(1, animationConfig)
    );
    opacity.value = withTiming(1, animationConfig);
    rotate.value = withDelay(500, withTiming(360, animationConfig));

    // Call the onAnimationEnd callback after the animation completes
    setTimeout(() => {
      onAnimationEnd();
    }, 2000);
  }, []);

  return (
    <LinearGradient
      colors={['#B7B8B0', '#9C9791', '#9B8669', '#82663F']}
      style={styles.container}
    >
      <Animated.Image
        source={images.logo}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    marginTop: 150,
    width: 200, // Slightly larger for emphasis
    height: 200,
  },
});

export default LogoAnimation;
