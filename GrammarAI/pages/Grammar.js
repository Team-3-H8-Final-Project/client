import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const targetSentence = "Bagaimana kabarmu hari ini?";
  const audioPhrase = "How are you today?";

  const startListening = () => {
    setIsListening(true);
    setShowResult(false);

    setTimeout(() => {
      setIsListening(false);
      checkAnswer();
    }, 3000);
  };

  const checkAnswer = () => {
    // in a real app, you'd compare the actual speech recognition result
    const randomCorrect = Math.random() > 0.3; // 70% chance of being correct for demo

    if (randomCorrect) {
      setResult(targetSentence);
      setIsCorrect(true);
    } else {
      setResult("How is you today?");
      setIsCorrect(false);
    }

    setShowResult(true);
  };

  const handleContinue = () => {
    setShowResult(false);
    setResult("");
    // In a real app, you would navigate to the next question here
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Bentuklah kalimat berikut dalam bahasa Inggris{" "}
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

      <View style={styles.buttonContainer}>
        {!showResult ? (
          <TouchableOpacity
            style={[
              styles.speakButton,
              isListening && styles.speakButtonActive,
            ]}
            onPress={startListening}
            disabled={isListening}
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  actionButton: {
    marginLeft: 16,
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
  helpButton: {
    position: "absolute",
    bottom: 24,
    left: 20,
  },
});
