import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LevelLanguage = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigation = useNavigation();

  const levels = ["Pemula", "Menengah", "Lanjutan", "Fasih"];

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    console.log(`Selected Level: ${level}`);
    navigation.replace("MainApp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Seberapa mahir kemampuan bahasa Inggris Anda?
          </Text>
        </View>

        <View style={styles.levelsContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.selectedLevelButton,
              ]}
              onPress={() => handleSelectLevel(level)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.levelText,
                  selectedLevel === level && styles.selectedLevelText,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedLevel && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedText}>
              Anda memilih level:{" "}
              <Text style={styles.selectedLevel}>{selectedLevel}</Text>
            </Text>
          </View>
        )}
      </View>
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
    justifyContent: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
  },
  levelsContainer: {
    marginTop: 10,
    width: "100%",
  },
  levelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  selectedLevelButton: {
    backgroundColor: "#D1FAE5",
    borderColor: "#34D399",
    borderWidth: 1,
  },
  levelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  selectedLevelText: {
    color: "#065F46",
    fontWeight: "700",
  },
  selectedContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLevel: {
    fontWeight: "bold",
    color: "#10B981",
  },
});

export default LevelLanguage;
