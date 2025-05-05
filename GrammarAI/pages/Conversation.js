import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UserCard from "../components/UserCard";
import Vapi from '@vapi-ai/react-native';

const Conversation = () => {
  const vapi = new Vapi('ebe5ae08-a062-4c3a-8748-ce618d7a2fab')

  const handleClick = () => {
    vapi.start('baaea691-670b-4d35-b7b8-2788ffed7ae8')
    console.log(vapi)
    console.log('VAPI started');
  }

  return (
    <View style={styles.container}>
      <UserCard label="Teman AI" />
      <UserCard label="Kamu" />
      <TouchableOpacity style={styles.callButton} onPress={handleClick}>
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