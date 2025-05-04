import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserCard = ({ label }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={24} color="#555" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#edf1f4",
    borderRadius: 10,
    padding: 30,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    height: 250,
    borderColor: "#ccc",
  },
  avatar: {
    backgroundColor: "#d1d5db",
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default UserCard;
