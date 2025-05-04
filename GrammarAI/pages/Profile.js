import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.username}>Nama User</Text>
          <Text style={styles.bio}>bio user yang mungkin akan sangat panjang</Text>
        </View>

       
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Learning Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "75%" }]} />
          </View>
          <Text style={styles.progressPercentage}>75% Completed</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Challenges Done</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Conversations Tried</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>92%</Text>
            <Text style={styles.statLabel}>Grammar Accuracy</Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4285F4" />
            <Text style={styles.activityText}>Completed "Travel Essentials" challenge</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4285F4" />
            <Text style={styles.activityText}>Tried a conversation with AI Buddy</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="book-outline" size={24} color="#4285F4" />
            <Text style={styles.activityText}>Reviewed grammar tips</Text>
          </View>
        </View>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Bookmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#d1d1d1",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4285F4",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  activityContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
});

export default Profile;