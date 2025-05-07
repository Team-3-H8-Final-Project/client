"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const LevelLanguage = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigation = useNavigation();

  const levels = [
    {
      id: "Pemula",
      name: "Pemula",
      description: "Baru mulai belajar bahasa Inggris",
    },
    {
      id: "Menengah",
      name: "Menengah",
      description: "Dapat berkomunikasi dalam situasi sehari-hari",
    },
    {
      id: "Lanjutan",
      name: "Lanjutan",
      description: "Dapat berdiskusi tentang topik yang kompleks",
    },
    { id: "Fasih", name: "Fasih", description: "Hampir seperti penutur asli" },
  ];

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    console.log(`Selected Level: ${level}`);

    setTimeout(() => {
      navigation.replace("MainApp");
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#AFAFAF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.owlImage}
          />
          <Text style={styles.title}>
            Seberapa mahir kemampuan bahasa Inggris Anda?
          </Text>
          <Text style={styles.subtitle}>
            Pilih level yang sesuai dengan kemampuan Anda saat ini
          </Text>
        </View>

        <View style={styles.levelsContainer}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelButton,
                selectedLevel === level.id && styles.selectedLevelButton,
              ]}
              onPress={() => handleSelectLevel(level.id)}
              activeOpacity={0.8}
            >
              <View style={styles.levelContent}>
                <Text
                  style={[
                    styles.levelText,
                    selectedLevel === level.id && styles.selectedLevelText,
                  ]}
                >
                  {level.name}
                </Text>
                <Text
                  style={[
                    styles.levelDescription,
                    selectedLevel === level.id &&
                      styles.selectedLevelDescription,
                  ]}
                >
                  {level.description}
                </Text>
              </View>
              {selectedLevel === level.id && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLevel && styles.continueButtonDisabled,
          ]}
          disabled={!selectedLevel}
          onPress={() => navigation.replace("MainApp")}
        >
          <Text style={styles.continueButtonText}>LANJUTKAN</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  owlImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C3C3C",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6F6F6F",
    textAlign: "center",
    lineHeight: 22,
  },
  levelsContainer: {
    width: "100%",
  },
  levelButton: {
    backgroundColor: "#F7F7F7",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedLevelButton: {
    backgroundColor: "#E7F9E0",
    borderColor: "#58CC02",
  },
  levelContent: {
    flex: 1,
  },
  levelText: {
    fontSize: 18,
    color: "#3C3C3C",
    fontWeight: "bold",
    marginBottom: 4,
  },
  selectedLevelText: {
    color: "#58CC02",
  },
  levelDescription: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  selectedLevelDescription: {
    color: "#3C3C3C",
  },
  checkmarkContainer: {
    marginLeft: 12,
  },
  continueButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#58CC02",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: "#E5E5E5",
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LevelLanguage;
