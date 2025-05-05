import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  FadeInDown,
} from "react-native-reanimated";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Dropdown = ({ label, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text
          style={
            value ? styles.dropdownSelectedText : styles.dropdownPlaceholder
          }
        >
          {value || label}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={styles.dropdownOptions}
          entering={FadeInDown.duration(200)}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropdownOption,
                value === option && styles.dropdownOptionSelected,
              ]}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownOptionText,
                  value === option && styles.dropdownOptionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const Checkbox = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const RadioButton = ({ label, checked, onSelect }) => {
  return (
    <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
      <View style={styles.radioOuter}>
        {checked && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function ConversationForm() {
  const [conversationType, setConversationType] = useState("");
  const [learningGoals, setLearningGoals] = useState({
    vocabulary: false,
    expressions: false,
    grammar: false,
    listening: false,
  });
  const [duration, setDuration] = useState("short");

  const scale = useSharedValue(1);

  const navigation = useNavigation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const toggleLearningGoal = (goal) => {
    setLearningGoals((prev) => ({
      ...prev,
      [goal]: !prev[goal],
    }));
  };
  const handleSubmit = () => {
    // console.log({
    //   conversationType,
    //   learningGoals,
    //   duration,
    // });
    navigation.navigate("ConversationScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={["#f0f8ff", "#ffffff"]}
          style={styles.gradientBackground}
        >
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <Text style={styles.title}>Conversation Setup</Text>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="comment-dots" size={32} color="#7b68ee" />
            </View>
          </Animated.View>

          <View style={styles.formContainer}>
            <Text style={styles.formDescription}>
              Set up the conversation according to your needs to practice with
              AI Buddy.
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>
                What type of conversation do you want to have?
              </Text>
              <Dropdown
                label="Select conversation type"
                options={[
                  "Daily Life",
                  "Travel",
                  "Finding Friends",
                  "Work & Career",
                  "Hobbies & Interests",
                ]}
                value={conversationType}
                onSelect={setConversationType}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>
                What do you want to learn in this conversation?
              </Text>
              <View style={styles.checkboxGroup}>
                <Checkbox
                  label="Vocabulary"
                  checked={learningGoals.vocabulary}
                  onToggle={() => toggleLearningGoal("vocabulary")}
                />
                <Checkbox
                  label="Expressions"
                  checked={learningGoals.expressions}
                  onToggle={() => toggleLearningGoal("expressions")}
                />
                <Checkbox
                  label="Grammar"
                  checked={learningGoals.grammar}
                  onToggle={() => toggleLearningGoal("grammar")}
                />
                <Checkbox
                  label="Listening Comprehension"
                  checked={learningGoals.listening}
                  onToggle={() => toggleLearningGoal("listening")}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>
                How long do you want to talk?
              </Text>
              <View style={styles.radioGroup}>
                <RadioButton
                  label="Short (2-5 Minutes)"
                  checked={duration === "short"}
                  onSelect={() => setDuration("short")}
                />
                <RadioButton
                  label="Medium (5-7 Minutes)"
                  checked={duration === "medium"}
                  onSelect={() => setDuration("medium")}
                />
                <RadioButton
                  label="Long (10+ Minutes)"
                  checked={duration === "long"}
                  onSelect={() => setDuration("long")}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!conversationType ||
                  !Object.values(learningGoals).some(Boolean)) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                !conversationType || !Object.values(learningGoals).some(Boolean)
              }
            >
              <Text style={styles.buttonText}>Start Conversation</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 10,
  },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdownPlaceholder: {
    color: "#999",
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: "#333",
    fontSize: 16,
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  dropdownOption: {
    padding: 12,
    borderRadius: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: "#f0f0ff",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownOptionTextSelected: {
    color: "#7b68ee",
    fontWeight: "600",
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7b68ee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#7b68ee",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  radioGroup: {
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7b68ee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#7b68ee",
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#7b68ee",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#7b68ee",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#c0c0c0",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
