import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioRecorder, useAudioPlayer, AudioModule, RecordingPresets } from "expo-audio";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";

export default function Grammar() {
  const [isListening, setIsListening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [grammarData, setGrammarData] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [loading, setLoading] = useState(true);
const currentQuestion = grammarData[currentIndex] || {};
const targetSentence = currentQuestion.answer || "";
  const audioPhrase = currentQuestion.question || "";
// const targetSentence = "Bagaimana kabarmu hari ini?"; //question
  // const audioPhrase = "How are you today?"; //answer
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(recordingUri ? { uri: recordingUri } : null);
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Izin untuk mikrofon ditolak");
        return;
      }

      try {
        const token = await getSecure("access_token");
        const response = await axiosInstance.get(`/grammar?level=Pemula`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGrammarData(response.data.data);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching grammar data:", error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      setIsListening(true);
      await recorder.record();
    } catch (err) {
      console.error("Gagal merekam:", err);
      setIsListening(false);
    }
  };

  const stopRecording = async () => {
    try {
      const { uri } = await recorder.stop();
      setRecordingUri(uri);
      setIsListening(false);
      await checkAnswer(uri);
    } catch (err) {
      console.error("Gagal menghentikan rekaman:", err);
      setIsListening(false);
    }
  };

  const checkAnswer = () => {
    const randomCorrect = Math.random() > 0.3;
    if (randomCorrect) {
      setResult(targetSentence);
      setIsCorrect(true);
    } else {
      setResult("How is you today?");
      setIsCorrect(false);
    }
    setShowResult(true);
  };

  const playRecording = async () => {
    try {
      await player.play();
    } catch {
      Alert.alert("Tidak ada rekaman untuk diputar");
    }
  };

  const handleContinue = () => {
    if (currentIndex < grammarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Sudah sampai soal terakhir");
    }
    setShowResult(false);
    setResult("");
    setRecordingUri(null);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
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
              <Text style={styles.resultText}>{result}</Text>
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

   
        <TouchableOpacity style={styles.playButton} onPress={playRecording}>
          <Ionicons name="play" size={24} color="white" />
          <Text style={styles.playButtonText}>Putar Rekaman</Text>
        </TouchableOpacity>
   

      <View style={styles.buttonContainer}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.speakButton, isListening && styles.speakButtonActive]}
            onPress={isListening ? stopRecording : startRecording}
          >
            <Ionicons name="mic" size={24} color="white" />
            <Text style={styles.speakButtonText}>
              {isListening ? "Mendengar..." : "Bicara Sekarang"}
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
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1cb0f6",
    paddingVertical: 16,
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
