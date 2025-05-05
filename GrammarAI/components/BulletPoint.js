import React, { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { View, Text, StyleSheet } from "react-native";

const BulletPoint = ({ text, delay = 0 }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={[styles.bulletContainer, animatedStyle]}>
      <View style={styles.bullet} />
      <Text style={styles.bulletText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
    marginTop: 6,
    marginRight: 10,
  },

  bulletText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
});

export default BulletPoint;
