import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";
import TabNavigator from "./TabNavigator";
import { deleteSecure, getSecure } from "../helpers/secureStore";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const [initialRoute, setInitialRoute] = useState(null); // State to hold the initial route
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const access_token = await getSecure("access_token");
        setInitialRoute(access_token ? "MainApp" : "Login");
      } catch (error) {
        console.error("Error checking auth:", error);
        setInitialRoute("Login"); // Fallback to Login screen if there's an error
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Show nothing or a splash screen while loading
  if (isLoading) {
    return null; // Or return a loading spinner/splash screen component
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}
