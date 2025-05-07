import { useState, useRef, useEffect } from "react";
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
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";
import { Ionicons } from "@expo/vector-icons";

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
  const [hearts, setHearts] = useState(3);
  const navigation = useNavigation();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const token = await getSecure("access_token");
        const desiredLevel = "Pemula";
        const response = await axiosInstance.get(`/challenge?theme=${theme}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        // filter berdasarkan level
        const filteredData = data.filter((item) => item.level === desiredLevel);
        // Transform the API data to match our quiz format
        const limitedData = filteredData.slice(0, 5);
        const formattedData = limitedData.map((item, index) => ({
          id: item.id,
          question: item.question,
          options: item.options.map((option, i) => ({
            id: String.fromCharCode(97 + i), // a, b, c, d
            text: option,
          })),
          correctAnswer: String.fromCharCode(
            97 + item.options.indexOf(item.answer)
          ),
        }));

        setQuizData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
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
    const isAnswerCorrect =
      optionId === quizData[currentQuestionIndex].correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
    } else {
      setHearts(hearts - 1);
    }

    setTimeout(() => {
      if (
        currentQuestionIndex < quizData.length - 1 &&
        (isAnswerCorrect || hearts > 1)
      ) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        if (!isAnswerCorrect && hearts <= 1) {
          // Game over due to no hearts
          setHearts(0);
        }
        setCompleted(true);
      }
    }, 1500);
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

    return [styles.option, styles.disabledOption];
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#58CC02" />
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
        <Text style={styles.emptyText}>
          No questions available for this theme.
        </Text>
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#AFAFAF" />
          </TouchableOpacity>

          <View style={styles.heartsContainer}>
            {[...Array(hearts)].map((_, i) => (
              <Ionicons
                key={i}
                name="heart"
                size={20}
                color="#FF4B4B"
                style={styles.heartIcon}
              />
            ))}
          </View>
        </View>

        <Animated.View style={styles.completedContainer}>
          <Image
            source={{
              uri: "https://d35aaqx5ub95lt.cloudfront.net/images/stars/398e4fac54a3e78e998a60cbfbf178b3.svg",
            }}
            style={styles.completionImage}
          />
          <Text style={styles.completedTitle}>
            {hearts > 0 ? "Great job!" : "Try again!"}
          </Text>
          <Text style={styles.scoreText}>
            Your score: {score}/{quizData.length}
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              if (hearts > 0) {
                navigation.navigate("ChallengeFeedback");
              } else {
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setIsCorrect(null);
                setScore(0);
                setHearts(3);
                setCompleted(false);
              }
            }}
          >
            <Text style={styles.continueButtonText}>
              {hearts > 0 ? "CONTINUE" : "TRY AGAIN"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#AFAFAF" />
        </TouchableOpacity>

        <View style={styles.heartsContainer}>
          {[...Array(hearts)].map((_, i) => (
            <Ionicons
              key={i}
              name="heart"
              size={20}
              color="#FF4B4B"
              style={styles.heartIcon}
            />
          ))}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      <View style={styles.content}>
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
          <Text style={styles.instructionText}>Choose the correct answer</Text>
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
              <Text
                style={[
                  styles.optionText,
                  selectedOption &&
                    selectedOption !== option.id &&
                    option.id !== currentQuestion.correctAnswer &&
                    styles.disabledOptionText,
                ]}
              >
                {option.text}
              </Text>
              {selectedOption === option.id &&
                option.id === currentQuestion.correctAnswer && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#58CC02"
                    style={styles.optionIcon}
                  />
                )}
              {selectedOption === option.id &&
                option.id !== currentQuestion.correctAnswer && (
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color="#FF4B4B"
                    style={styles.optionIcon}
                  />
                )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      {isCorrect !== null && (
        <View
          style={[
            styles.feedbackContainer,
            isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
          ]}
        >
          <Text style={styles.feedbackText}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </Text>
          {!isCorrect && (
            <Text style={styles.correctAnswerText}>
              Correct answer:{" "}
              {
                currentQuestion.options.find(
                  (opt) => opt.id === currentQuestion.correctAnswer
                )?.text
              }
            </Text>
          )}
        </View>
      )}

      {selectedOption !== null && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            if (
              currentQuestionIndex < quizData.length - 1 &&
              (isCorrect || hearts > 1)
            ) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              setSelectedOption(null);
              setIsCorrect(null);
            } else {
              if (!isCorrect && hearts <= 1) {
                setHearts(0);
              }
              setCompleted(true);
            }
          }}
        >
          <Text style={styles.continueButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  streakContainer: {
    backgroundColor: "#FFF9E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    color: "#FFB020",
    fontWeight: "bold",
    fontSize: 12,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: {
    marginLeft: 4,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#E5E5E5",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#58CC02",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  questionContainer: {
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 14,
    color: "#AFAFAF",
    marginBottom: 8,
    fontWeight: "500",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C3C3C",
    lineHeight: 28,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  correctOption: {
    backgroundColor: "#E7F9E0",
    borderColor: "#58CC02",
  },
  incorrectOption: {
    backgroundColor: "#FFEBEB",
    borderColor: "#FF4B4B",
  },
  disabledOption: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: "#3C3C3C",
    flex: 1,
  },
  disabledOptionText: {
    color: "#AFAFAF",
  },
  optionIcon: {
    marginLeft: 8,
  },
  feedbackContainer: {
    padding: 16,
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  correctFeedback: {
    backgroundColor: "#E7F9E0",
  },
  incorrectFeedback: {
    backgroundColor: "#FFEBEB",
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  correctAnswerText: {
    fontSize: 14,
    color: "#3C3C3C",
  },
  continueButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "flex-start",
  },
  helpButton: {
    padding: 4,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  completionImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3C3C3C",
  },
  scoreText: {
    fontSize: 18,
    marginBottom: 32,
    color: "#3C3C3C",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#3C3C3C",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#FF4B4B",
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
    color: "#3C3C3C",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChallengeDetail;
