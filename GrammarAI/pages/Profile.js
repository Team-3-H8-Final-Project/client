import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../helpers/axiosInstance";
import { getSecure, deleteSecure } from "../helpers/secureStore";
import { useNavigation } from "@react-navigation/native";
import ActivityItem from "../components/ActivityItem";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [history, setHistory] = useState(null);
  const handleLogout = async () => {
    try {
      await deleteSecure("access_token");
      await deleteSecure("userId");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = await getSecure("access_token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axiosInstance.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const feedbacks = await axiosInstance.get("/feedback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(feedbacks.data);
      setProfileData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
      console.error("Error details:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF4B4B" />
          <Text style={styles.errorText}>Failed to load profile data.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchProfile();
            }}
          >
            <Text style={styles.retryButtonText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate a random streak and XP for demo purposes
  const streak = Math.floor(Math.random() * 30) + 1;
  const xp = Math.floor(Math.random() * 5000) + 500;
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXP = level * 1000;
  const progressPercentage = ((xp % 1000) / 1000) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#AFAFAF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#AFAFAF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.avatar}
            resizeMode="contain"
          />
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.bio}>{profileData.motivation}</Text>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Riwayat</Text>

          {history && history.length > 0 ? (
            history.map((item) => (
              <ActivityItem
                key={item.id}
                id={item.id}
                date={item.createdAt}
                score={item.totalScore}
                type={item.testType}
              />
            ))
          ) : (
            <Text style={styles.noHistoryText}>Tidak ada riwayat</Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#3C3C3C",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#3C3C3C",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#58CC02",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  settingsButton: {
    padding: 4,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  profileContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#F7F7F7",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#58CC02",
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#6F6F6F",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  statLabel: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  levelContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  levelXP: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5E5E5",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#58CC02",
    borderRadius: 6,
  },
  achievementsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 16,
  },
  achievementsList: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 16,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementCompleted: {
    backgroundColor: "#58CC02",
  },
  achievementLocked: {
    backgroundColor: "#AFAFAF",
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C3C3C",
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: "#6F6F6F",
  },
  activityContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  noHistoryText: {
    fontSize: 16,
    color: "#6F6F6F",
    textAlign: "center",
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4B4B",
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#FF4B4B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Profile;
