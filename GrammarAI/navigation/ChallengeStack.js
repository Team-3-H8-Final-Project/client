import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Challenges from "../pages/Challenges";
import ChallengeDetail from "../pages/ChallengeDetail";

const Stack = createNativeStackNavigator();

export default function ChallengesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChallengeMain" component={Challenges} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
    </Stack.Navigator>
  );
}
