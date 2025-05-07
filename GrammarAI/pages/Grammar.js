import { GEMINI_API } from "@env";
import { useEffect, useState, useRef } from "react";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";
import { useNavigation } from "@react-navigation/native";
import FeedbackGrammar from "./FeedbackGrammar";

export default function Grammar() {
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
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackPayload, setFeedbackPayload] = useState({ answers: [] });
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = grammarData[currentIndex] || {};
  const targetSentence = currentQuestion.answer || "";
  const audioPhrase = currentQuestion.question || "";

  useEffect(() => {
    const fetchGrammarData = async () => {
      try {
        const token = await getSecure("access_token");
        if (!token) throw new Error("Token not found");
        let level = "Pemula" //nanti di jadikan dinamis ya...
        const response = await axiosInstance.get(`/grammar?level=${level}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        });

        setGrammarData(response.data.data || []);
       
      } catch (error) {
        console.error("Error fetching grammar data:", error.message);
        console.error("Details:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrammarData();
  }, []);

  useEffect(() => {
    if (completed) {
      // Calculate score when completed
      const correctCount = userAnswers.filter(answer => 
        answer.userAnswer.toLowerCase().includes(answer.correctAnswer.toLowerCase())
      ).length;
      setScore(correctCount);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [completed]);

  const saveUserAnswer = () => {
    if (!currentQuestion || !currentQuestion.answer || !currentQuestion.question) {
      console.error("Invalid currentQuestion data:", currentQuestion);
      return;
    }
  
    const answerData = {
      questionId: currentQuestion.id || "unknown",
      question: currentQuestion.question || "unknown",
      correctAnswer: currentQuestion.answer || "unknown",
      userAnswer: result || "unknown",
    };
  
    setUserAnswers(prev => [...prev, answerData]);
  };
  
  
  // const submitFeedback = async () => {
  //   try {
  //     const token = await getSecure("access_token");
  //     await axiosInstance.post("/feedback/grammar", {
  //       answers: userAnswers,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("Feedback berhasil dikirim");
  //   } catch (error) {
  //     console.error("Gagal mengirim feedback:", error.response?.data || error);
  //   }
  // };

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

  // const processAudioWithGemini = async (uri) => {
  //   try {
  //     setLoading(true);
  //     const base64Audio = await FileSystem.readAsStringAsync(uri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  
  //     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API}`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         contents: [
  //           {
  //             role: 'user',
  //             parts: [
  //               {
  //                 inlineData: {
  //                   mimeType: 'audio/m4a',
  //                   data: base64Audio,
  //                 },
  //               },
  //               {
  //                 text: 'Transkripkan isi suara ini ke dalam teks bahasa Inggris tanpa penjelasan tambahan.',
  //               }
  //             ],
  //           },
  //         ],
  //       }),
  //     });
  
  //     const data = await response.json();
  //     const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  //     setResult(transcript);
  //     setIsCorrect(transcript.toLowerCase().includes(targetSentence.toLowerCase()));
  //     setShowResult(true);
  //   } catch (err) {
  //     console.error("Gagal memproses audio dengan Gemini:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const processAudioWithGemini = async (uri) => {
    try {
      setLoading(true);
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'audio/m4a',
                    data: base64Audio,
                  },
                },
                {
                  text: 'Transkripkan isi suara ini ke dalam teks bahasa Inggris tanpa penjelasan tambahan.',
                }
              ],
            },
          ],
        }),
      });
  
      if (!response.ok) {
        throw new Error('Gagal mendapatkan respons dari Gemini API');
      }
  
      const data = await response.json();
      const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!transcript) {
        throw new Error('Transkrip tidak ditemukan dalam respons');
      }
      setResult(transcript);
      setIsCorrect(transcript.toLowerCase().includes(targetSentence.toLowerCase()));
      setShowResult(true);
    } catch (err) {
      console.error("Gagal memproses audio dengan Gemini:", err);
      Alert.alert('Kesalahan', 'Terjadi masalah saat memproses audio. Silakan coba lagi.');
    } finally {
      setLoading(false);
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
    console.log(updatedAnswers)
  
    if (currentIndex < grammarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
      const finalScore = updatedAnswers.filter(a =>
        a.userAnswer.toLowerCase().includes(a.correctAnswer.toLowerCase())
      ).length;
      try {
        const token = await getSecure("access_token");
    
        const res = await axiosInstance.post(
          "/feedback/grammar",
          {
            answers: updatedAnswers,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (res?.data?.id) {
          const feedbackId = res.data.id;
          console.log("Feedback berhasil dikirim ke database: " + feedbackId);
    
          navigation.navigate("FeedbackGrammar", {
            score: Math.round((finalScore / grammarData.length) * 100),
            feedbackId,
          });
        } else {
          console.warn("Feedback response tidak sesuai:", res?.data);
        }
      } catch (error) {
        console.error("Gagal mengirim feedback:", error.message);
      }
    }
  // iya yang evaluation genrate
    setShowResult(false);
    setResult("");
  };
  
  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1cb0f6" />
          <Text style={{ marginTop: 10 }}>Memuat soal...</Text>
        </View>
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
            Your score: {score}/{grammarData.length} ({Math.round((score / grammarData.length) * 100)}%)
          </Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => navigation.navigate("FeedbackGrammar", {
              score: Math.round((score / grammarData.length) * 100),
  maxScore: 100,
            })}
          >
            <Text style={styles.restartButtonText}>See your feedback</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Bentuklah kalimat berikut dalam bahasa Inggris
          </Text>
        </View>

        <View style={styles.characterContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.characterImage}
          />
          <TouchableOpacity style={styles.audioButton}>
            <Ionicons name="volume-medium" size={20} color="#1cb0f6" />
            <Text style={styles.audioText}>{audioPhrase}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          {showResult ? (
            <View
              style={[
                styles.resultContainer,
                isCorrect ? styles.correctResult : styles.incorrectResult,
              ]}
            >
              <Text style={[styles.resultText, { fontWeight: 'bold' }]}>Kamu berkata:</Text>
              <Text style={styles.resultText}>{result}</Text>

              <View style={{ height: 12 }} />

              <Text style={[styles.resultText, { fontWeight: 'bold' }]}>Jawaban yang benar:</Text>
              <Text style={styles.resultText}>{targetSentence}</Text>
            </View>
          ) : (
            <View style={styles.emptyInputContainer}>
              <Text style={styles.placeholderText}>
                Ucapkan kalimat dalam bahasa Inggris
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.speakButton, isListening && styles.speakButtonActive]}
            onPress={isListening ? stopRecording : startListening}
            disabled={loading}
          >
            <Ionicons name="mic" size={24} color="white" />
            <Text style={styles.speakButtonText}>
              {isListening ? "Menghentikan..." : "Bicara Sekarang"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                isCorrect ? styles.correctText : styles.incorrectText,
              ]}
            >
              {isCorrect ? "Benar!" : "Kurang Benar"}
            </Text>
            {recordedUri && (
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isPlaying ? styles.playButtonActive : styles.playButtonInactive,
                ]}
                onPress={playRecording}
                disabled={isPlaying}
              >
                <Text style={styles.continueButtonText}>
                  {isPlaying ? "Memutar..." : "Putar Rekaman"}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isPlaying ? styles.continueButtonActive : styles.continueButtonInactive,
                {marginTop: 10}
              ]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  instructionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b4b4b",
  },
  characterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginLeft: 12,
    flex: 1,
  },
  audioText: {
    marginLeft: 8,
    color: "#4b4b4b",
    fontSize: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emptyInputContainer: {
    borderBottomWidth: 2,
    borderBottomColor: "#e5e5e5",
    paddingVertical: 12,
    minHeight: 50,
  },
  placeholderText: {
    color: "#ccc",
    fontSize: 16,
  },
  resultContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 50,
  },
  correctResult: {
    backgroundColor: "#e7f9e0",
  },
  incorrectResult: {
    backgroundColor: "#ffebeb",
  },
  resultText: {
    fontSize: 16,
    color: "#4b4b4b",
  },
  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 50,
  },
  speakButtonActive: {
    backgroundColor: "#ff9600",
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
  feedbackText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  correctText: {
    color: "#58cc02",
  },
  incorrectText: {
    color: "#ff4b4b",
  },
  continueButton: {
    backgroundColor: "#58cc02",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  playButtonActive: {
    backgroundColor: "#ff9600",
  },
  playButtonInactive: {
    backgroundColor: "#1cb0f6",
  },
  continueButtonActive: {
    backgroundColor: "#58cc02",
  },
  continueButtonInactive: {
    backgroundColor: "#ccc",
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#58cc02',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 22,
    color: '#4b4b4b',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#1cb0f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 20,
  },
  restartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
