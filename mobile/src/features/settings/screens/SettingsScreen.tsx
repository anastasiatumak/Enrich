import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  ScrollView,
} from "react-native";
import { theme } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
});
