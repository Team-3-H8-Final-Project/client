import React, { useState, useEffect } from "react";
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
} from "react-native-reanimated";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import SkillBar from "../components/SkillBar";
import BulletPoint from "../components/BulletPoint";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";

export default function FeedbackGrammar() {
  const route = useRoute();
  const { score, feedbackId } = route.params;
  const [feedback, setFeedback] = useState(null);
  const barColors = ["#4ecdc4", "#ff9f1c", "#7b68ee", "#ff6b6b"];

  const fetchFeedback = async () => {
    try {
      const token = await getSecure("access_token");
      const response = await axiosInstance.get("/feedback/" + feedbackId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedback(response.data);
    } catch (error) {
    // console.log(error)
    console.error("error fetch feedback id", error.message); // <= apa ga usah pake try catch
      console.error("Error details:", error.response?.data || error); // <= yang ini kak
    }
  };
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
//   useEffect(() => {
//     fetchFeedback();
//   }, [feedbackId]);
useEffect(() => {
    if (feedbackId) {
        fetchFeedback();
    }
  }, [feedbackId]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {feedback && (
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
                  <Text style={styles.scoreText}>
                    {Math.round(feedback.totalScore)}
                  </Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.sessionDetail}>
                <Text style={styles.sessionText}>
                Grammar Practice
                </Text>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.dateText}>{feedback.createdAt}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Evaluation Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evaluation Breakdown</Text>
              {Object.entries(feedback.categoryScores).map(
                ([label, score], index) => (
                  <SkillBar
                    key={label}
                    label={label}
                    score={score}
                    maxScore={100}
                    color={barColors[index % barColors.length]}
                    delay={index * 100}
                  />
                )
              )}
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
                  {feedback.strengths.length > 0 ? (
                    feedback.strengths.map((point, index) => (
                      <BulletPoint
                        key={index}
                        text={point}
                        delay={index * 100}
                      />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      Tidak ada data untuk ditampilkan.
                    </Text>
                  )}
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
                  <Text style={styles.sectionTitle}>
                  Areas for Improvement
                  </Text>
                </View>
                <Ionicons
                  name={expanded.improvements ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
              {expanded.improvements && (
                <View style={styles.bulletList}>
                  {feedback.areasForImprovement.length > 0 ? (
                    feedback.areasForImprovement.map((point, index) => (
                      <BulletPoint
                        key={index}
                        text={point}
                        delay={index * 100}
                      />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      Tidak ada data untuk ditampilkan.
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* Final Verdict */}
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
                    {feedback.finalAssessment ||
                      "Tidak ada data untuk ditampilkan."}
                  </Text>
                </Animated.View>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Back to Grammar</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      )}
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
  emptyText: {
    fontStyle: "italic",
    color: "#999",
    paddingLeft: 10,
    marginTop: 5,
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