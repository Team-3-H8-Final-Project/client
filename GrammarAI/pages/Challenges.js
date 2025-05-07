import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import ChallengeCard from "../components/ChallengeCard";
import { deleteSecure, getSecure } from "../helpers/secureStore";
import axiosInstance from "../helpers/axiosInstance";

const Challenges = () => {
  const [challengeTopics, setChallengeTopics] = useState([]);
  const fetchChallengeTopics = async () => {
    const token = await getSecure("access_token");
    try {
      const result = await axiosInstance({
        method: "GET",
        url: "/challenge-topics",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setChallengeTopics(result.data);
    } catch (error) {
      alert(`Something went wrong ${error}`);
    }
  }

  useEffect(() => {
    fetchChallengeTopics()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tantangan</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {challengeTopics.map((item, index) => (
          <ChallengeCard
            key={index}
            title={item.name}
            description={item.description}
            imgUrl={item.imgUrl}
          />
        ))}
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
