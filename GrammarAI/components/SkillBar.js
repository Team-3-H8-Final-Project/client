import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const colors = [
  "#4ecdc4", // Fluency
  "#ff9f1c", // Pronunciation
  "#7b68ee", // Grammar in Speech
  "#ff6b6b"  // Relevance of Responses
];

const SkillBar = ({ label, score, maxScore, delay = 0 }) => {
  // Helper function to generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const SkillBar = ({ label, score, maxScore, color = getRandomColor(), delay = 0 }) => {
    const width = useSharedValue(0);

    // Randomly select a color from the colors array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

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
            style={[styles.barFill, { backgroundColor: randomColor }, animatedStyle]}
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
}

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
