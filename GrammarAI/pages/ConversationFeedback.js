import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import SkillBar from "../components/SkillBar";
import BulletPoint from "../components/BulletPoint";
export default function ConversationFeedback() {
  const [expanded, setExpanded] = useState({
    strengths: true,
    improvements: true,
    verdict: true,
  });
  const navigation = useNavigation();

  const toggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scale = useSharedValue(1);

  const pulseAnimation = () => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={["#f0f8ff", "#ffffff"]}
          style={styles.gradientBackground}
        >
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <Text style={styles.title}>Session Feedback</Text>
            <TouchableOpacity
              style={styles.scoreContainer}
              onPress={pulseAnimation}
            >
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>54</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.sessionDetail}>
              <Text style={styles.sessionText}>Conversation Practice</Text>

              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.dateText}>Apr 08, 2025</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evaluation Breakdown</Text>
            <SkillBar
              label="Fluency"
              score={60}
              maxScore={100}
              color="#4ecdc4"
              delay={0}
            />
            <SkillBar
              label="Pronunciation"
              score={50}
              maxScore={100}
              color="#ff9f1c"
              delay={100}
            />
            <SkillBar
              label="Grammar in Speech"
              score={70}
              maxScore={100}
              color="#7b68ee"
              delay={200}
            />
            <SkillBar
              label="Relevance of Responses"
              score={50}
              maxScore={100}
              color="#ff6b6b"
              delay={300}
            />
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("strengths")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesome5 name="medal" size={18} color="#7b68ee" />
                <Text style={styles.sectionTitle}>Strengths</Text>
              </View>
              <Ionicons
                name={expanded.strengths ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {expanded.strengths && (
              <View style={styles.bulletList}>
                <BulletPoint
                  text="Used correct past tense in most responses."
                  delay={100}
                />
                <BulletPoint
                  text="Chose appropriate vocabulary for a casual conversation."
                  delay={200}
                />
                <BulletPoint
                  text="Pronunciation was clear and understandable."
                  delay={200}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("improvements")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesome5 name="lightbulb" size={18} color="#ff9f1c" />
                <Text style={styles.sectionTitle}>Areas for Improvement</Text>
              </View>
              <Ionicons
                name={expanded.improvements ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {expanded.improvements && (
              <View style={styles.bulletList}>
                <BulletPoint
                  text="Incorrect subject-verb agreement in 3 sentences."
                  delay={100}
                />
                <BulletPoint
                  text="Used “is” instead of “are” in plural context."
                  delay={200}
                />
                <BulletPoint
                  text="Could improve vocabulary for expressing opinions (e.g., “I think…” / “In my opinion…”)."
                  delay={300}
                />
                <BulletPoint
                  text="Misused modal verbs like “should” and “could”."
                  delay={400}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("verdict")}
            >
              <View style={styles.sectionTitleContainer}>
                <FontAwesome5 name="gavel" size={18} color="#ff6b6b" />
                <Text style={styles.sectionTitle}>Final Verdict</Text>
              </View>
              <Ionicons
                name={expanded.verdict ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {expanded.verdict && (
              <Animated.View style={styles.verdictContainer}>
                <Text style={styles.verdictText}>
                  Summarize overall performance, tone can be friendly and
                  encouraging: "Great effort! You're progressing well in using
                  proper sentence structure. Focus on past tense verbs and
                  plural forms in your next session."
                </Text>
              </Animated.View>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("ConversationForm");
            }}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  scoreContainer: {
    marginBottom: 10,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  scoreText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  scoreMax: {
    fontSize: 16,
    color: "#666",
    marginLeft: 2,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  sessionDetail: {
    justifyContent: "center",
    alignItems: "center",
  },
  sessionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginTop: 5,
  },
  disclaimerText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },

  bulletList: {
    marginTop: 15,
  },

  verdictContainer: {
    marginTop: 15,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  verdictText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#7b68ee",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#7b68ee",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
