import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";

const { width } = Dimensions.get("window");

const ChallengeDetail = () => {
  const route = useRoute();
  const { theme } = route.params;
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigation = useNavigation();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;


  // convert to desirable format (e.g Food and Drinks -> food-and-drinks)
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const token = await getSecure("access_token");
        const currentLevelId = await getSecure("currentLevelId");
        let levelString
        if (currentLevelId === "1") {
          levelString = "Pemula"
        } else if (currentLevelId === "2") {
          levelString = "Menengah"
        } else if (currentLevelId === "3") {
          levelString = "Lanjutan"
        } else if (currentLevelId === "4") {
          levelString = "Fasih"
        } else {
          levelString = "Pemula"
        }
        const formattedTheme = theme.toLowerCase().replace(/\s+/g, "-");
        const response = await axiosInstance.get(`/challenge?theme=${formattedTheme}&level=${levelString}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        // filter berdasarkan level
        const formattedData = data.map((item, index) => ({
          id: item.id,
          question: item.question,
          options: item.options.map((option, i) => ({
            id: String.fromCharCode(97 + i), // a, b, c, d
            text: option,
          })),
          correctAnswer: String.fromCharCode(97 + item.options.indexOf(item.answer)), // find index of correct answer
        }));

        setQuizData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.log(err.response); // Lihat response error lengkap
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchQuizData();
  }, [theme]);

  useEffect(() => {
    if (quizData.length > 0) {
      const progress = (currentQuestionIndex / quizData.length) * 100;

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();

      if (currentQuestionIndex > 0) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          slideAnim.setValue(0);
        });
      }
    }
  }, [currentQuestionIndex, quizData]);

  const handleOptionSelect = (optionId) => {
    if (!quizData[currentQuestionIndex]) return;

    setSelectedOption(optionId);
    const isAnswerCorrect = optionId === quizData[currentQuestionIndex].correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setCompleted(true);
      }
    }, 1000);
  };

  const getOptionStyle = (optionId) => {
    if (selectedOption === null) {
      return styles.option;
    }

    if (optionId === quizData[currentQuestionIndex]?.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (
      selectedOption === optionId &&
      optionId !== quizData[currentQuestionIndex]?.correctAnswer
    ) {
      return [styles.option, styles.incorrectOption];
    }

    return styles.option;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading challenge...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (quizData.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No questions available for this theme.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.completedContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.completedTitle}>Challenge Completed!</Text>
          <Text style={styles.scoreText}>
            Your score: {score}/{quizData.length}
          </Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => navigation.navigate("Feedback")}
          >
            <Text style={styles.restartButtonText}>See your feedback</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.2)"
      />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.counterText}>
              Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}
            </Text>
          </View>

          {/*TODO wrap below with scrollview */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>

          <Animated.View
            style={[
              styles.questionContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.optionsContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
              },
            ]}
          >
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={getOptionStyle(option.id)}
                onPress={() => handleOptionSelect(option.id)}
                disabled={selectedOption !== null}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 9999,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4285F4",
    borderRadius: 9999,
  },
  questionContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 24,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  correctOption: {
    backgroundColor: "rgba(220, 252, 231, 0.9)",
    borderColor: "#22c55e",
    borderWidth: 1,
  },
  incorrectOption: {
    backgroundColor: "rgba(254, 226, 226, 0.9)",
    borderColor: "#ef4444",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 24,
    color: "#333",
  },
  restartButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  restartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChallengeDetail;