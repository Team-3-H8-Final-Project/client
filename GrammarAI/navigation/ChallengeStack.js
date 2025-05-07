import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Challenges from "../pages/Challenges";
import ChallengeDetail from "../pages/ChallengeDetail";
import ChallengeFeedback from "../pages/ChallengeFeedback";

const Stack = createNativeStackNavigator();

export default function ChallengesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChallengeMain" component={Challenges} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
      <Stack.Screen name="ChallengeFeedback" component={ChallengeFeedback} />
    </Stack.Navigator>
  );
}
