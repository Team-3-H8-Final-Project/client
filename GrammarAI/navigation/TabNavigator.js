import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import Conversation from "../pages/Conversation";
import Grammar from "../pages/Grammar";
import Profile from "../pages/Profile";
import ChallengesStack from "./ChallengeStack";
import Feedback from "../pages/Feedback";
import ConversationWeb from "../pages/ConversationWeb";
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Challenges") {
            iconName = "puzzle-piece";
          } else if (route.name === "Conversation") {
            iconName = "chatbox-ellipses-outline";
          } else if (route.name === "Grammar") {
            iconName = "globe-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          if (route.name === "Challenges") {
            return <FontAwesome6 name={iconName} size={size} color={color} />;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2e64e5",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Challenges" component={ChallengesStack} />
      <Tab.Screen name="Conversation" component={ConversationWeb} />
      <Tab.Screen name="Grammar" component={Grammar} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
