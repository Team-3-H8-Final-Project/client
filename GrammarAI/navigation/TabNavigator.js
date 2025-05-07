import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";

import Profile from "../pages/Profile";
import ChallengesStack from "./ChallengeStack";
import ConversationStack from "./ConversationStack";
import GrammarStack from "./GrammarStack";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, color, size, name, label }) => {
  return (
    <View style={styles.tabBarIconContainer}>
      <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
        <Ionicons name={name} size={size} color={color} />
      </View>
    </View>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;

          if (route.name === "Challenges") {
            iconName = "trophy";
            label = "Tantangan";
          } else if (route.name === "Conversation") {
            iconName = "chatbubbles";
            label = "Percakapan";
          } else if (route.name === "Grammar") {
            iconName = "book";
            label = "Tata Bahasa";
          } else if (route.name === "Profile") {
            iconName = "person";
            label = "Profil";
          }

          return (
            <TabBarIcon
              focused={focused}
              name={iconName}
              color={color}
              size={size}
              label={label}
            />
          );
        },
        tabBarActiveTintColor: "#58CC02",
        tabBarInactiveTintColor: "#AFAFAF",
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="Challenges" component={ChallengesStack} />
      <Tab.Screen name="Conversation" component={ConversationStack} />
      <Tab.Screen name="Grammar" component={GrammarStack} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 70,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingTop: 10,
  },
  tabBarIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  activeIconWrapper: {
    backgroundColor: "#E7F9E0",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
