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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Dummy Data
const quizData = [
  {
    id: 1,
    question: "Bagaimana cara menanyakan nama seseorang dalam bahasa Inggris?",
    options: [
      { id: "a", text: "What are you name?" },
      { id: "b", text: "What name are you?" },
      { id: "c", text: "Who are name?" },
      { id: "d", text: "What is your name?" },
    ],
    correctAnswer: "d",
  },
  {
    id: 2,
    question:
      "Bagaimana cara mengatakan 'Saya suka belajar bahasa' dalam bahasa Inggris?",
    options: [
      { id: "a", text: "I like learning languages" },
      { id: "b", text: "I am like learn language" },
      { id: "c", text: "Me like language learning" },
      { id: "d", text: "I learning like languages" },
    ],
    correctAnswer: "a",
  },
  {
    id: 3,
    question: "Apa bahasa Inggris dari 'Selamat pagi'?",
    options: [
      { id: "a", text: "Good afternoon" },
      { id: "b", text: "Good evening" },
      { id: "c", text: "Good morning" },
      { id: "d", text: "Good night" },
    ],
    correctAnswer: "c",
  },
  {
    id: 4,
    question:
      "Bagaimana cara bertanya 'Jam berapa sekarang?' dalam bahasa Inggris?",
    options: [
      { id: "a", text: "What is the hour now?" },
      { id: "b", text: "What time is it?" },
      { id: "c", text: "How many hours now?" },
      { id: "d", text: "When is the time?" },
    ],
    correctAnswer: "b",
  },
  {
    id: 5,
    question: "Apa bahasa Inggris dari kata 'Terima kasih'?",
    options: [
      { id: "a", text: "Please" },
      { id: "b", text: "Sorry" },
      { id: "c", text: "Excuse me" },
      { id: "d", text: "Thank you" },
    ],
    correctAnswer: "d",
  },
];

const { width } = Dimensions.get("window");

const ChallengeDetail = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const navigation = useNavigation();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = (currentQuestionIndex / quizData.length) * 100;

  useEffect(() => {
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
  }, [currentQuestionIndex]);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    const isAnswerCorrect = optionId === currentQuestion.correctAnswer;
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

    if (optionId === currentQuestion.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (
      selectedOption === optionId &&
      optionId !== currentQuestion.correctAnswer
    ) {
      return [styles.option, styles.incorrectOption];
    }

    return styles.option;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

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
            onPress={() => navigation.navigate("ChallengeMain")}
          >
            <Text style={styles.restartButtonText}>Try Another Challenge</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(0, 0, 0, 0.2)"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.counterText}>
            Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}
          </Text>
        </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "f9f9f9",
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    lineHeight: 26,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 50,
    marginBottom: 20,
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
    fontSize: 16,
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
});

export default ChallengeDetail;
