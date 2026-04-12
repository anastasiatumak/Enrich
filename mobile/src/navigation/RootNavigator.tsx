import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/useAuthStore";
import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import { RestorePasswordScreen } from "../features/auth/screens/RestorePasswordScreen";
import { MainTabNavigator } from "./MainTabNavigator";
import { AddWordScreen } from "../features/words/screens/AddWordScreen";
import { EditWordScreen } from "../features/words/screens/EditWordScreen";
import { QuizScreen } from "../features/quiz/screens/QuizScreen";
import { theme } from "../constants/theme";
import { Flashcard } from "../store/useFlashcardStore";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RestorePassword: undefined;
  MainTabs: undefined;
  AddWord: undefined;
  EditWord: { flashcard: Flashcard };
  Quiz: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated Stack
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="AddWord" component={AddWordScreen} />
            <Stack.Screen name="EditWord" component={EditWordScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
          </Stack.Group>
        ) : (
          // Unauthenticated Stack
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="RestorePassword"
              component={RestorePasswordScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
