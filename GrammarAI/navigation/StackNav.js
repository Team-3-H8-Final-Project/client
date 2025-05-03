import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}
