import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GrammarScreen from "../pages/Grammar";
import GrammarFeedback from "../pages/GrammarFeedback";

const Stack = createNativeStackNavigator();

export default function GrammarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GrammarMain" component={GrammarScreen} />
      <Stack.Screen name="GrammarFeedback" component={GrammarFeedback} />
    </Stack.Navigator>
  );
}
