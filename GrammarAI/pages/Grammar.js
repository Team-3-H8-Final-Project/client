import { GEMINI_API } from "@env";
import { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure } from "../helpers/secureStore";

export default function App() {
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

  // const startListening = () => {
    
  //   setIsListening(true);
  //   setShowResult(false);

  //   setTimeout(() => {
  //     setIsListening(false);
  //     checkAnswer();
  //   }, 3000);
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
  const processAudioWithGemini = async (uri) => {
    try {
      setLoading(true);
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API}`, {
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
  
      const data = await response.json();
      const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setResult(transcript);
      setIsCorrect(transcript.toLowerCase().includes(targetSentence.toLowerCase()));
      setShowResult(true);
    } catch (err) {
      console.error("Gagal memproses audio dengan Gemini:", err);
    } finally {
      setLoading(false);
    }
  };
    
    

  const checkAnswer = () => {
    const randomCorrect = Math.random() > 0.3;

    setResult(randomCorrect ? targetSentence : "How is you today?");
    setIsCorrect(randomCorrect);
    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentIndex < grammarData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Sudah sampai soal terakhir");
    }
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
            // <View
            //   style={[
            //     styles.resultContainer,
            //     isCorrect ? styles.correctResult : styles.incorrectResult,
            //   ]}
            // >
            //   <Text style={styles.resultText}>{result}</Text>
            // </View>
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
          isPlaying ? styles.playButtonActive : styles.playButtonInactive, // Kondisi warna tombol
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
        !isPlaying ? styles.continueButtonActive : styles.continueButtonInactive, // Kondisi warna tombol
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
    backgroundColor: "#ff9600", // Warna tombol saat memutar rekaman
  },
  playButtonInactive: {
    backgroundColor: "#1cb0f6", // Warna tombol saat tidak memutar rekaman
  },
  continueButtonActive: {
    backgroundColor: "#58cc02", // Warna tombol "LANJUT" saat aktif
  },
  continueButtonInactive: {
    backgroundColor: "#ccc", // Warna tombol "LANJUT" saat tidak aktif
  },
});
