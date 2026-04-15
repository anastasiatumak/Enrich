import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../../constants/theme";
import { api } from "../../../services/api";

import { useAuthStore } from "../../../store/useAuthStore";
import { Dropdown } from "../../../components/Dropdown";

export const SettingsScreen = () => {
  const { user, fetchUserProfile } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [themeValue, setThemeValue] = useState("Light");
  const [languageValue, setLanguageValue] = useState("English");
  
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isSavingApp, setIsSavingApp] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("users/me/settings");
        if (response.data) {
          setThemeValue(response.data.theme || "Light");
          setLanguageValue(response.data.language || "English");
        }
      } catch (err) {
        console.warn("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveAccountSettings = async () => {
    try {
      setIsSavingAccount(true);
      if (username !== user?.username) {
        await api.put("users/me/profile", { username });
        await fetchUserProfile();
      }
      Alert.alert("Success", "Account settings updated.");
    } catch (err: any) {
      console.warn("Failed to update account", err);
      Alert.alert("Error", err.response?.data?.message || "Failed to update account settings.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Please fill in both current and new password.");
      return;
    }
    try {
      setIsSavingSecurity(true);
      await api.put("users/me/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert("Success", "Password updated successfully.");
    } catch (err: any) {
      console.warn("Failed to update password", err);
      Alert.alert("Error", err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleSaveAppSettings = async () => {
    try {
      setIsSavingApp(true);
      await api.put("users/me/settings", { theme: themeValue, language: languageValue });
      Alert.alert("Success", "App settings updated.");
    } catch (err: any) {
      console.warn("Failed to update app settings", err);
      Alert.alert("Error", "Failed to update app settings.");
    } finally {
      setIsSavingApp(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, styles.inputDisabled]} value={user?.email || "loading..."} editable={false} placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveAccountSettings} disabled={isSavingAccount}>
            <Text style={styles.buttonText}>{isSavingAccount ? "Saving..." : "Save changes"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Enter current password" placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="Enter new password" placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveSecuritySettings} disabled={isSavingSecurity}>
            <Text style={styles.buttonText}>{isSavingSecurity ? "Updating..." : "Update password"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.inputGroup}>
            <Dropdown label="Theme" value={themeValue} options={["Light", "Dark", "System"]} onSelect={setThemeValue} placeholder="Select theme" />
          </View>
          <View style={styles.inputGroup}>
            <Dropdown label="Language" value={languageValue} options={["English", "Ukrainian"]} onSelect={setLanguageValue} placeholder="Select language" />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveAppSettings} disabled={isSavingApp}>
            <Text style={styles.buttonText}>{isSavingApp ? "Saving..." : "Save changes"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingTop: theme.spacing.m, paddingHorizontal: theme.spacing.xl },
  content: { paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  screenTitle: { fontSize: theme.typography.sizes.header, fontWeight: theme.typography.weights.bold, color: theme.colors.text, textAlign: "center", marginBottom: theme.spacing.xl, marginTop: theme.spacing.s },
  section: { marginBottom: theme.spacing.l },
  sectionTitle: { fontSize: theme.typography.sizes.large, fontWeight: theme.typography.weights.medium, color: theme.colors.text, marginBottom: theme.spacing.l },
  inputGroup: { marginBottom: theme.spacing.m },
  label: { fontSize: theme.typography.sizes.regular, fontWeight: theme.typography.weights.medium, color: theme.colors.text, marginBottom: theme.spacing.xs },
  input: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, fontSize: theme.typography.sizes.regular, color: theme.colors.text },
  inputDisabled: { backgroundColor: '#F5F5F5', color: theme.colors.textSecondary, borderColor: '#EAEAEA' },
  button: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.xl, borderRadius: 8, alignItems: "center", alignSelf: "stretch", marginTop: theme.spacing.s, marginBottom: theme.spacing.xl },
  buttonText: { color: theme.colors.background, fontSize: theme.typography.sizes.regular, fontWeight: theme.typography.weights.bold },
});