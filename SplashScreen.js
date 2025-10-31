import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SplashScreen = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 2000, easing: Easing.out(Easing.exp) });
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, animatedBackgroundStyle]}>
        <View style={styles.ellipse1} />
        <View style={styles.ellipse2} />
        <View style={styles.rectangle3} />
        <View style={styles.rectangle4} />
      </Animated.View>
      <Animated.View style={[styles.logoContainer, animatedScaleStyle]}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  ellipse1: {
    position: 'absolute',
    width: 635,
    height: 635,
    left: -200,
    top: -400,
    backgroundColor: 'rgba(31, 137, 1, 0.1)',
    borderRadius: 317.5,
  },
  ellipse2: {
    position: 'absolute',
    width: 496,
    height: 496,
    right: -200,
    bottom: -200,
    borderWidth: 3,
    borderColor: 'rgba(31, 137, 1, 0.05)',
    borderRadius: 248,
  },
  rectangle3: {
    position: 'absolute',
    width: 372,
    height: 372,
    left: -200,
    bottom: -100,
    borderWidth: 2,
    borderColor: 'rgba(105, 165, 58, 0.3)',
    transform: [{ rotate: '27.09deg' }],
  },
  rectangle4: {
    position: 'absolute',
    width: 372,
    height: 372,
    right: -200,
    top: -100,
    borderWidth: 2,
    borderColor: 'rgba(105, 165, 58, 0.3)',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: SCREEN_WIDTH * 0.9, // 70% del ancho de la pantalla
    height: (SCREEN_WIDTH * 0.9 * 128) / 486.5, // Mantiene la proporción original
  },
});

export default SplashScreen;