import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const ActivityItem = ({ id, date, score, type }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Feedback", { id })}>
      <View style={styles.activityItem}>
        <View style={styles.activityIconContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>
            Menyelesaikan {type} dengan skor {Math.round(score)}%
          </Text>
          <Text style={styles.activityTime}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
