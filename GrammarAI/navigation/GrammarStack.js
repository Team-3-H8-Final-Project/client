import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Grammar from '../pages/Grammar';
import FeedbackGrammar from '../pages/FeedbackGrammar';

const Stack = createNativeStackNavigator();

export default function GrammarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Grammar" component={Grammar} />
      <Stack.Screen name="FeedbackGrammar" component={FeedbackGrammar} />
      {/* Tambah halaman lain di stack ini jika perlu */}
    </Stack.Navigator>
  );
}
