import { useEffect, useState, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";
import Confetti from "react-native-confetti";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Grammar() {
  const navigation = useNavigation();
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [grammarData, setGrammarData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [hearts, setHearts] = useState(40);
  const [completed, setCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackPayload, setFeedbackPayload] = useState({ answers: [] });
  const confettiRef = useRef(null);
  const route = useRoute();

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = grammarData[currentIndex] || {};
  const targetSentence = currentQuestion.answer || "";
  const audioPhrase = currentQuestion.question || "";
  // const resetGrammarState = () => {
  //   setCurrentIndex(0);
  //   setUserAnswers([]);
  //   setScore(0);
  //   setHearts(40);
  //   setCompleted(false);
  //   setGameOver(false);
  //   setShowResult(false);
  //   setResult("");
  //   setRecordedUri(null);
  // };
  const resetGrammarState = useCallback(() => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setHearts(40);
    setCompleted(false);
    setGameOver(false);
    setShowResult(false);
    setResult("");
    setRecordedUri(null);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.reset) {
        resetGrammarState();
      }
    });
  
    return unsubscribe;
  }, [navigation, route.params]);
  const handleNavigateBack = useCallback(() => {
    resetGrammarState();
    navigation.goBack();
  }, [navigation]);
  useEffect(() => {
    const fetchGrammarData = async () => {
      try {
        const token = await getSecure("access_token");
        if (!token) throw new Error("Token not found");
        
        // Mengambil currentLevelId secara dinamis
        const currentLevelId = await getSecure("currentLevelId");
        let level = "Pemula"; // Default level
        if (currentLevelId === "1") {
          level = "Pemula";
        } else if (currentLevelId === "2") {
          level = "Menengah";
        } else if (currentLevelId === "3") {
          level = "Lanjutan";
        } else if (currentLevelId === "4") {
          level = "Fasih";
        }

        const response = await axiosInstance.get(`/grammar?level=${level}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    const allQuestions = response.data.data || [];
    const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    setGrammarData(selectedQuestions);
      } catch (error) {
        console.error("Error fetching grammar data:", error.message);
        console.error("Details:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrammarData();
  }, []);

  // Update progress bar when current index changes
  useEffect(() => {
    if (grammarData.length > 0) {
      const progress = (currentIndex / grammarData.length) * 100;

      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();

      if (currentIndex > 0) {
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
  }, [currentIndex, grammarData]);

  const startListening = async () => {
    try {
      setShowResult(false);
      setIsListening(true);
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      // Animate the bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (err) {
      console.error("Gagal memulai rekaman:", err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsListening(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);

      // Stop the bounce animation
      bounceAnim.setValue(1);
      Animated.timing(bounceAnim).stop();

      await processAudioWithGemini(uri);
    } catch (err) {
      console.error("Gagal menghentikan rekaman:", err);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordedUri) return;
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) setIsPlaying(false);
      });
    } catch (err) {
      console.error("Gagal memutar rekaman:", err);
    }
  };

  // Modify the processAudioWithGemini function to check for hearts
  const processAudioWithGemini = async (uri) => {
    try {
      setLoading(true);
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      mimeType: "audio/m4a",
                      data: base64Audio,
                    },
                  },
                  {
                    text: "Transkripkan isi suara ini ke dalam teks bahasa Inggris tanpa penjelasan tambahan.",
                  },
                ],
              },
            ],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!transcript) {
        throw new Error("Tidak mendapatkan transkrip dari Gemini");
      }
  
      setResult(transcript);
      const correct = transcript
        .toLowerCase()
        .includes(targetSentence.toLowerCase());
      setIsCorrect(correct);
      setShowResult(true);
  
      if (!correct) {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
      }
    } catch (err) {
      console.error("Gagal memproses audio dengan Gemini:", err);
      Alert.alert(
        "Error",
        "Gagal memproses audio. Silakan coba lagi."
      );
      // Fallback untuk testing
      const randomCorrect = Math.random() > 0.3;
      setResult(randomCorrect ? targetSentence : "Incorrect answer");
      setIsCorrect(randomCorrect);
      setShowResult(true);
  
      if (!randomCorrect) {
        const newHearts = Math.max(0, hearts - 1);
        setHearts(newHearts);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (answers) => {
    try {
      const token = await getSecure("access_token");
      if (!token) throw new Error("Token not found");
  
      const response = await axiosInstance.post(
        "/feedback/grammar",
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response?.data?.id) {
        return response.data;
      } else {
        throw new Error("Invalid feedback response");
      }
    } catch (error) {
      console.error("Gagal mengirim feedback:", error.message);
      Alert.alert(
        "Error",
        "Gagal mengirim feedback. Silakan coba lagi nanti."
      );
      throw error;
    }
  };

  const handleContinue = async () => {
    const answerData = {
      questionId: currentQuestion.id || "unknown",
      question: currentQuestion.question || "unknown",
      correctAnswer: currentQuestion.answer || "unknown",
      userAnswer: result || "unknown",
    };
    const updatedAnswers = [...userAnswers, answerData];
    setUserAnswers(updatedAnswers);
    const correctCount = updatedAnswers.filter(answer =>
      answer.userAnswer.toLowerCase().includes(answer.correctAnswer.toLowerCase())
    ).length;
    setScore(correctCount);
    if (hearts <= 0) {
      setGameOver(true);
      return;
    }

    if (currentIndex < grammarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
      setResult("");
      setRecordedUri(null);
    } else {
      setCompleted(true);
      if (confettiRef.current) {
        confettiRef.current.startConfetti();
      }
      try {
        const feedbackData = await submitFeedback(updatedAnswers);
        // await submitFeedback(updatedAnswers);
        
        navigation.navigate("GrammarFeedback", {
          score: Math.round((correctCount / grammarData.length) * 100),
          feedbackId: feedbackData.id,
          resetGrammar: resetGrammarState
        });
      } catch (error) {
        // Error is already handled in submitFeedback
        navigation.navigate("GrammarFeedback", {
          score: Math.round((correctCount / grammarData.length) * 100),
          feedbackId: null,
        });
      }
    }
    setShowResult(false);
    setResult("");
  };
// ini untuk mengatur ulang dan mendapatkan soal baru
const resetAndFetchNewQuestions = async () => {
  try {
    setLoading(true);
    
    // Reset semua state yang diperlukan
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setHearts(40);
    setCompleted(false);
    setGameOver(false);
    setShowResult(false);
    setResult("");
    setRecordedUri(null);
    
    const token = await getSecure("access_token");
    if (!token) throw new Error("Token not found");
    
    const currentLevelId = await getSecure("currentLevelId");
    let level = "Pemula";
    if (currentLevelId === "2") level = "Menengah";
    else if (currentLevelId === "3") level = "Lanjutan";
    else if (currentLevelId === "4") level = "Fasih";

    // Gunakan endpoint yang konsisten (/grammar dengan parameter level)
    const response = await axiosInstance.get(`/grammar?level=${level}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { refresh: Date.now() } // Tambahkan timestamp untuk hindari cache
    });

    const allQuestions = response.data.data || [];
    const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    
    setGrammarData(selectedQuestions);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching new questions:", error);
    Alert.alert("Error", "Gagal memuat soal baru. Silakan coba lagi.");
    setLoading(false);
  }
};
  useEffect(() => {
    if (hearts <= 0 && showResult && !isCorrect) {
      const timer = setTimeout(() => {
        setGameOver(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hearts, showResult, isCorrect]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  if (loading && grammarData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Memuat soal...</Text>
        </View>
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
            Coba lagi untuk meningkatkan kemampuan grammar Anda
          </Text>

          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => {
              setHearts(3);
              setCurrentIndex(0);
              setGameOver(false);
              setShowResult(false);
              setResult("");
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
            style={styles.gameOverImage}
          />
          <Text style={styles.completionTitle}>Selamat!</Text>
          <Text style={styles.completionText}>
            Anda telah menyelesaikan semua latihan grammar!
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{grammarData.length}</Text>
              <Text style={styles.statLabel}>Soal</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hearts}</Text>
              <Text style={styles.statLabel}>Nyawa</Text>
            </View>
          </View>

          <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          const correctCount = userAnswers.filter(answer =>
            answer.userAnswer.toLowerCase().includes(answer.correctAnswer.toLowerCase())
          ).length;
          navigation.navigate("GrammarFeedback", {
            score: Math.round((correctCount / grammarData.length) * 100),
            feedbackId: feedbackPayload.id || null,
            resetGrammar: resetGrammarState
          });
        }}
      >
        <Text style={styles.continueButtonText}>SELESAI</Text>
      </TouchableOpacity>
      {completed && (
  <TouchableOpacity 
    style={styles.refreshButton}
    onPress={resetAndFetchNewQuestions}
  >
    <Ionicons name="refresh" size={20} color="white" />
    <Text style={styles.refreshButtonText}>Coba Soal Baru</Text>
  </TouchableOpacity>
)}
        </View>
      </SafeAreaView>
    );
  }

  // Keep the original return for the main game screen
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

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.instructionContainer,
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
          <Text style={styles.instructionLabel}>Latihan Grammar</Text>
          <Text style={styles.instructionText}>
            Bentuklah kalimat berikut dalam bahasa Inggris
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.characterContainer,
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
          <Image
            source={require("../assets/logo.png")}
            style={styles.characterImage}
          />
          <TouchableOpacity style={styles.audioButton}>
            <Ionicons name="volume-medium" size={20} color="#1cb0f6" />
            <Text style={styles.audioText}>{audioPhrase}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.inputContainer,
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
          {showResult ? (
            <View
              style={[
                styles.resultContainer,
                isCorrect ? styles.correctResult : styles.incorrectResult,
              ]}
            >
              <Text style={[styles.resultText, { fontWeight: "bold" }]}>
                Kamu berkata:
              </Text>
              <Text style={styles.resultText}>{result}</Text>

              <View style={{ height: 12 }} />

              <Text style={[styles.resultText, { fontWeight: "bold" }]}>
                Jawaban yang benar:
              </Text>
              <Text style={styles.resultText}>{targetSentence}</Text>
            </View>
          ) : (
            <View style={styles.emptyInputContainer}>
              <Text style={styles.placeholderText}>
                Ucapkan kalimat dalam bahasa Inggris
              </Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        {!showResult ? (
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <TouchableOpacity
              style={[
                styles.speakButton,
                isListening && styles.speakButtonActive,
              ]}
              onPress={isListening ? stopRecording : startListening}
              disabled={loading}
            >
              <Ionicons name="mic" size={24} color="white" />
              <Text style={styles.speakButtonText}>
                {isListening ? "Menghentikan..." : "Bicara Sekarang"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.feedbackBanner,
                isCorrect ? styles.correctFeedback : styles.incorrectFeedback,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  isCorrect ? styles.correctText : styles.incorrectText,
                ]}
              >
                {isCorrect ? "Benar!" : "Kurang Benar"}
              </Text>
            </View>

            {recordedUri && (
              <TouchableOpacity
                style={[
                  styles.playButton,
                  isPlaying
                    ? styles.playButtonActive
                    : styles.playButtonInactive,
                ]}
                onPress={playRecording}
                disabled={isPlaying}
              >
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={20}
                  color="white"
                />
                <Text style={styles.playButtonText}>
                  {isPlaying ? "Memutar..." : "Putar Rekaman"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>LANJUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Add these new styles to the StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#3C3C3C",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  instructionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  instructionLabel: {
    fontSize: 14,
    color: "#AFAFAF",
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  characterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  characterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginLeft: 12,
    flex: 1,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  audioText: {
    marginLeft: 8,
    color: "#3C3C3C",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  emptyInputContainer: {
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 100,
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  placeholderText: {
    color: "#AFAFAF",
    fontSize: 16,
    textAlign: "center",
  },
  resultContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 100,
    borderWidth: 2,
  },
  correctResult: {
    backgroundColor: "#E7F9E0",
    borderColor: "#58CC02",
  },
  incorrectResult: {
    backgroundColor: "#FFEBEB",
    borderColor: "#FF4B4B",
  },
  resultText: {
    fontSize: 16,
    color: "#3C3C3C",
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  speakButtonActive: {
    backgroundColor: "#FF9600",
  },
  speakButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  feedbackContainer: {
    width: "100%",
  },
  feedbackBanner: {
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
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
  },
  correctText: {
    color: "#58CC02",
  },
  incorrectText: {
    color: "#FF4B4B",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  playButtonActive: {
    backgroundColor: "#FF9600",
  },
  playButtonInactive: {
    backgroundColor: "#1CB0F6",
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 32,
  },
  helpButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
  },
  // Add these new styles for completion and game over screens
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
  heartText: {
    color: "#AFAFAF",
    fontWeight: "bold",
    marginLeft: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1CB0F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  refreshButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
