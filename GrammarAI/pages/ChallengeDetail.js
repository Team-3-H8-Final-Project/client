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
import Confetti from "react-native-confetti";

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
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();
  const confettiRef = useRef(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
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
          setGameOver(true);
        } else {
          setCompleted(true);
          if (confettiRef.current) {
            confettiRef.current.startConfetti();
          }
        }
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

  if (gameOver) {
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
            <Ionicons
              name="heart"
              size={20}
              color="#AFAFAF"
              style={styles.heartIcon}
            />
            <Text style={styles.heartText}>0</Text>
          </View>
        </View>

        <View style={styles.gameOverContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.gameOverImage}
          />
          <Text style={styles.gameOverTitle}>Oops! Anda kehabisan nyawa</Text>
          <Text style={styles.gameOverText}>
            Coba lagi untuk meningkatkan kemampuan Anda
          </Text>

          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => {
              setHearts(3);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setIsCorrect(null);
              setScore(0);
              setGameOver(false);
            }}
          >
            <Text style={styles.tryAgainButtonText}>COBA LAGI</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (completed) {
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

        <Confetti ref={confettiRef} />

        <View style={styles.completionContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.completionImage}
          />
          <Text style={styles.completionTitle}>Selamat!</Text>
          <Text style={styles.completionText}>
            Anda telah menyelesaikan semua tantangan!
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{quizData.length}</Text>
              <Text style={styles.statLabel}>Soal</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Skor Benar</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hearts}</Text>
              <Text style={styles.statLabel}>Nyawa</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("ChallengeFeedback")}
          >
            <Text style={styles.continueButtonText}>SELESAI</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.instructionText}>Pilih jawaban yang benar</Text>
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
            {isCorrect ? "Benar!" : "Salah!"}
          </Text>
          {!isCorrect && (
            <Text style={styles.correctAnswerText}>
              Jawaban Benar:{" "}
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
                setGameOver(true);
              } else {
                setCompleted(true);
                if (confettiRef.current) {
                  confettiRef.current.startConfetti();
                }
              }
            }
          }}
        >
          <Text style={styles.continueButtonText}>LANJUT</Text>
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
  heartText: {
    color: "#AFAFAF",
    fontWeight: "bold",
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
  // New styles for completion and game over screens
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  gameOverImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.7,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4B4B",
    marginBottom: 12,
    textAlign: "center",
  },
  gameOverText: {
    fontSize: 16,
    color: "#3C3C3C",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  tryAgainButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF4B4B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tryAgainButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  completionContainer: {
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
  completionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#58CC02",
    marginBottom: 12,
    textAlign: "center",
  },
  completionText: {
    fontSize: 18,
    color: "#3C3C3C",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1CB0F6",
  },
  statLabel: {
    fontSize: 14,
    color: "#AFAFAF",
    marginTop: 4,
  },
});

export default ChallengeDetail;
