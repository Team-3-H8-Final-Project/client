import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import StackNav from "./StackNav";

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
