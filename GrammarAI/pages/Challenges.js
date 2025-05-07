import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import ChallengeCard from "../components/ChallengeCard";

const Challenges = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tantangan</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ChallengeCard
          title="Travel Essentials"
          description="Learn all you need to travel: moving through airports, finding your hotel, and more."
          backgroundColor="#10b981"
          imageSource={{
            uri: "https://static.vecteezy.com/system/resources/previews/019/818/401/non_2x/happy-family-with-children-mother-father-and-kids-cute-cartoon-characters-isolated-colorful-illustration-in-flat-style-free-png.png",
          }}
        />

        <ChallengeCard
          title="Family Conversations"
          description="Learn how to communicate with family members and discuss daily activities."
          backgroundColor="#f9a8d4"
          imageSource={{
            uri: "https://static.vecteezy.com/system/resources/previews/019/818/401/non_2x/happy-family-with-children-mother-father-and-kids-cute-cartoon-characters-isolated-colorful-illustration-in-flat-style-free-png.png",
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flagContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  flag: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
export default Challenges;
