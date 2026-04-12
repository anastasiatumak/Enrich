import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

import { SavedScreen } from "../features/saved/screens/SavedScreen";
import { WordsScreen } from "../features/words/screens/WordsScreen";
import { ProfileScreen } from "../features/profile/screens/ProfileScreen";
import { SettingsScreen } from "../features/settings/screens/SettingsScreen";

export type MainTabParamList = {
  Saved: undefined;
  Words: undefined;
  Account: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-circle";

          if (route.name === "Saved") {
            iconName = focused ? "bookmarks" : "bookmarks-outline";
          } else if (route.name === "Words") {
            iconName = focused ? "library" : "library-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.navbarBackground,
          borderTopColor: theme.colors.border,
          paddingTop: theme.spacing.s,
          paddingBottom: theme.spacing.l,
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.small,
          fontWeight: theme.typography.weights.medium,
          paddingTop: theme.spacing.s,
        },
      })}
    >
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Words" component={WordsScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
