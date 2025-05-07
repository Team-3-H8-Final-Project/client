import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ActivityItem = () => {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIconContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          Completed "Travel Essentials" challenge
        </Text>
        <Text style={styles.activityTime}>2 days ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1CB0F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: "#3C3C3C",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: "#6F6F6F",
  },
});

export default ActivityItem;
