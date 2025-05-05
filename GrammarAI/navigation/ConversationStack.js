import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConversationForm from "../pages/ConversationForm";
import Conversation from "../pages/Conversation";
import Feedback from "../pages/Feedback";

const Stack = createNativeStackNavigator();

export default function ConversationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConversationForm" component={ConversationForm} />
      <Stack.Screen name="ConversationScreen" component={Conversation} />
      <Stack.Screen name="Feedback" component={Feedback} />
    </Stack.Navigator>
  );
}
