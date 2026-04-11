import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../constants/theme";

export const RestorePasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reset your password</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Enter your user account's verified email address and we will send you
          a password reset link.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Send password reset email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.l,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: theme.spacing.s,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 24,
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.l,
  },
  description: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xxl,
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.sizes.regular,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.regular,
    fontWeight: theme.typography.weights.bold,
  },
});
