import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";
import TabNavigator from "./TabNavigator";
import LevelLanguage from "../pages/LevelLanguage";
import { deleteSecure, getSecure } from "../helpers/secureStore";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  const [initialRoute, setInitialRoute] = useState(null); // State to hold the initial route
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // await deleteSecure("access_token"); // Clear the access token for testing purposes
        // await deleteSecure("userId"); // Clear the user ID for testing purposes
        // await deleteSecure("onboarded"); // Clear the onboarding status for testing purposes

        const onboarded = await getSecure("onboarded");
        if (!onboarded) {
          setInitialRoute("Onboarding");
          return;
        } else {
          const access_token = await getSecure("access_token");
          setInitialRoute(access_token ?  "LevelLanguage" : "Login");
        }

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
      <Stack.Screen name="LevelLanguage" component={LevelLanguage} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}
