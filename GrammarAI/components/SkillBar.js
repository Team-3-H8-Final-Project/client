import React, { useEffect } from "react";

import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
const SkillBar = ({ label, score, maxScore, color, delay = 0 }) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      300 + delay,
      withTiming((score / maxScore) * 100, { duration: 1000 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  return (
    <View style={styles.skillContainer}>
      <View style={styles.skillLabelContainer}>
        <Text style={styles.skillLabel}>{label}</Text>
        <Text style={styles.skillScore}>
          {score}/{maxScore}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[styles.barFill, { backgroundColor: color }, animatedStyle]}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  skillContainer: {
    marginTop: 15,
  },
  skillLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  skillLabel: {
    fontSize: 14,
    color: "#555",
  },
  skillScore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  barBackground: {
    height: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
});
export default SkillBar;
