import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Dropdown = ({ label, options, value, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[
          styles.dropdownTrigger,
          value ? styles.dropdownTriggerSelected : {},
        ]}
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
          color={value ? "#3C3C3C" : "#AFAFAF"}
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
              {value === option && (
                <Ionicons name="checkmark" size={20} color="#58CC02" />
              )}
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
      <View style={[styles.radioOuter, checked && styles.radioOuterSelected]}>
        {checked && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.radioLabel, checked && styles.radioLabelSelected]}>
        {label}
      </Text>
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

  const navigation = useNavigation();

  const toggleLearningGoal = (goal) => {
    setLearningGoals((prev) => ({
      ...prev,
      [goal]: !prev[goal],
    }));
  };

  const handleSubmit = () => {
    navigation.navigate("ConversationScreen");
  };

  const isFormValid =
    conversationType && Object.values(learningGoals).some(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#AFAFAF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Percakapan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.iconHeader}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.owlImage}
            />
          </View>

          <Text style={styles.formDescription}>
            Atur percakapan sesuai kebutuhan Anda untuk berlatih dengan Teman
            AI.
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>
              Jenis percakapan apa yang ingin Anda lakukan?
            </Text>
            <Dropdown
              label="Pilih jenis percakapan"
              options={[
                "Kehidupan Sehari-hari",
                "Perjalanan",
                "Mencari Teman",
                "Pekerjaan & Karir",
                "Hobi & Minat",
              ]}
              value={conversationType}
              onSelect={setConversationType}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>
              Apa yang ingin Anda pelajari dalam percakapan ini?
            </Text>
            <View style={styles.checkboxGroup}>
              <Checkbox
                label="Kosakata"
                checked={learningGoals.vocabulary}
                onToggle={() => toggleLearningGoal("vocabulary")}
              />
              <Checkbox
                label="Ekspresi"
                checked={learningGoals.expressions}
                onToggle={() => toggleLearningGoal("expressions")}
              />
              <Checkbox
                label="Tata Bahasa"
                checked={learningGoals.grammar}
                onToggle={() => toggleLearningGoal("grammar")}
              />
              <Checkbox
                label="Pemahaman Mendengarkan"
                checked={learningGoals.listening}
                onToggle={() => toggleLearningGoal("listening")}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>
              Berapa lama Anda ingin berbicara?
            </Text>
            <View style={styles.radioGroup}>
              <RadioButton
                label="Singkat (2-5 Menit)"
                checked={duration === "short"}
                onSelect={() => setDuration("short")}
              />
              <RadioButton
                label="Sedang (5-7 Menit)"
                checked={duration === "medium"}
                onSelect={() => setDuration("medium")}
              />
              <RadioButton
                label="Panjang (10+ Menit)"
                checked={duration === "long"}
                onSelect={() => setDuration("long")}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>MULAI PERCAKAPAN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  formContainer: {
    padding: 20,
  },
  iconHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  owlImage: {
    width: 100,
    height: 100,
  },
  formDescription: {
    fontSize: 16,
    color: "#6F6F6F",
    marginBottom: 24,
    lineHeight: 22,
    textAlign: "center",
  },
  formSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C3C3C",
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
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  dropdownTriggerSelected: {
    borderColor: "#58CC02",
    backgroundColor: "#F7F7F7",
  },
  dropdownPlaceholder: {
    color: "#AFAFAF",
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: "#3C3C3C",
    fontSize: 16,
    fontWeight: "500",
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
    borderWidth: 2,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  dropdownOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  dropdownOptionSelected: {
    backgroundColor: "#E7F9E0",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#3C3C3C",
  },
  dropdownOptionTextSelected: {
    color: "#58CC02",
    fontWeight: "600",
  },
  checkboxGroup: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F7F7F7",
  },
  checkboxChecked: {
    backgroundColor: "#58CC02",
    borderColor: "#58CC02",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#3C3C3C",
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
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F7F7F7",
  },
  radioOuterSelected: {
    borderColor: "#58CC02",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#58CC02",
  },
  radioLabel: {
    fontSize: 16,
    color: "#3C3C3C",
  },
  radioLabelSelected: {
    fontWeight: "500",
  },
  button: {
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
  buttonDisabled: {
    backgroundColor: "#E5E5E5",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
