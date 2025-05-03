import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../pages/Profile";
import History from "../pages/History";
const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="History" component={History} />
    </Stack.Navigator>
  );
}
