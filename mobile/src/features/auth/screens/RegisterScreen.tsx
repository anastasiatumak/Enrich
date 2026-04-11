import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../store/useAuthStore";
import { theme } from "../../../constants/theme";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

export const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, error } = useAuthStore();

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setUsernameError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await register(email, username, password);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign up to Enrich</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? (
              <Text style={styles.validationText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, usernameError ? styles.inputError : null]}
              placeholder="Username"
              placeholderTextColor={theme.colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {usernameError ? (
              <Text style={styles.validationText}>{usernameError}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {passwordError ? (
              <Text style={styles.validationText}>{passwordError}</Text>
            ) : null}
          </View>

          <Text style={[styles.footerText, { marginBottom: theme.spacing.xl }]}>
            By creating an account, you agree to our{" "}
            <Text style={styles.footerLink} onPress={() => {}}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={styles.footerLink} onPress={() => {}}>
              Privacy Policy
            </Text>
            .
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, padding: theme.spacing.xl, justifyContent: "center" },
  title: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.m,
    textAlign: "center",
  },
  form: { width: "100%" },
  inputGroup: { marginBottom: theme.spacing.m },
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
  inputError: {
    borderColor: theme.colors.error,
  },
  validationText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.small,
    marginTop: theme.spacing.xs,
  },
  termsText: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    lineHeight: 18,
  },
  termsLink: { textDecorationLine: "underline" },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.regular,
    fontWeight: theme.typography.weights.bold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.regular,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.regular,
    fontWeight: theme.typography.weights.bold,
  },
});
