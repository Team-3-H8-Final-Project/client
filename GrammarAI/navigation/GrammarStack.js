
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Grammar from '../pages/Grammar';
import FeedbackGrammar from '../pages/FeedbackGrammar';

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GrammarScreen from "../pages/Grammar";
import GrammarFeedback from "../pages/GrammarFeedback";


const Stack = createNativeStackNavigator();

export default function GrammarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Grammar" component={Grammar} />
      <Stack.Screen name="FeedbackGrammar" component={FeedbackGrammar} />
     
      <Stack.Screen name="GrammarMain" component={GrammarScreen} />
      <Stack.Screen name="GrammarFeedback" component={GrammarFeedback} />

    </Stack.Navigator>
  );
}
