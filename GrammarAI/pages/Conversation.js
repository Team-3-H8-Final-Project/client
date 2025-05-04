import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserCard from "../components/UserCard";

const Conversation = () => {
  return (
    <View style={styles.container}>
      <UserCard label="Teman AI" />
      <UserCard label="Kamu" />
      <TouchableOpacity style={styles.callButton}>
        <Text style={styles.callButtonText}>Telepon</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    padding: 20,
  },
  callButton: {
    marginTop: 20,
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Conversation;
