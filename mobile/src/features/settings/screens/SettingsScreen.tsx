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
import { useAppTheme } from "../../../constants/theme";
import { api } from "../../../services/api";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../../store/useAuthStore";
import { useSettingsStore, AppTheme, AppLanguage } from "../../../store/useSettingsStore";
import { Dropdown } from "../../../components/Dropdown";

export const SettingsScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { user, fetchUserProfile } = useAuthStore();
  const { 
    theme: globalTheme, 
    language: globalLanguage, 
    setTheme: setGlobalTheme, 
    setLanguage: setGlobalLanguage 
  } = useSettingsStore();

  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [themeValue, setThemeValue] = useState<AppTheme>(globalTheme);
  const [languageValue, setLanguageValue] = useState<AppLanguage>(globalLanguage);
  
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isSavingApp, setIsSavingApp] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("users/me/settings");
        if (response.data) {
          const remoteTheme = response.data.theme as AppTheme;
          const remoteLang = response.data.language as AppLanguage;
          
          setThemeValue(remoteTheme || "Light");
          setLanguageValue(remoteLang || "English");
          
          // Sync global store if different
          if (remoteTheme && remoteTheme !== globalTheme) setGlobalTheme(remoteTheme);
          if (remoteLang && remoteLang !== globalLanguage) setGlobalLanguage(remoteLang);
        }
      } catch (err) {
        console.warn("Failed to fetch settings from server", err);
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
      Alert.alert(t("common.success"), t("settings.account") + " updated.");
    } catch (err: any) {
      console.warn("Failed to update account", err);
      Alert.alert(t("common.error"), err.response?.data?.message || "Failed to update account settings.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert(t("common.error"), "Please fill in both current and new password.");
      return;
    }
    try {
      setIsSavingSecurity(true);
      await api.put("users/me/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert(t("common.success"), "Password updated successfully.");
    } catch (err: any) {
      console.warn("Failed to update password", err);
      Alert.alert(t("common.error"), err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleSaveAppSettings = async () => {
    try {
      setIsSavingApp(true);
      // Save to backend
      await api.put("users/me/settings", { theme: themeValue, language: languageValue });
      
      // Update local global state
      setGlobalTheme(themeValue);
      setGlobalLanguage(languageValue);
      
      Alert.alert(t("common.success"), t("settings.app") + " updated.");
    } catch (err: any) {
      console.warn("Failed to update app settings", err);
      Alert.alert(t("common.error"), "Failed to update app settings.");
    } finally {
      setIsSavingApp(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t("settings.title")}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("settings.username")}</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("settings.email")}</Text>
            <TextInput style={[styles.input, styles.inputDisabled]} value={user?.email || "loading..."} editable={false} placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveAccountSettings} disabled={isSavingAccount}>
            <Text style={styles.buttonText}>{isSavingAccount ? t("common.saving") : t("common.save")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.security")}</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("settings.currentPassword")}</Text>
            <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Enter current password" placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("settings.newPassword")}</Text>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="Enter new password" placeholderTextColor={theme.colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveSecuritySettings} disabled={isSavingSecurity}>
            <Text style={styles.buttonText}>{isSavingSecurity ? t("settings.updating") : t("settings.updatePassword")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.app")}</Text>
          <View style={styles.inputGroup}>
            <Dropdown label={t("settings.theme")} value={themeValue} options={["Light", "Dark", "System"]} onSelect={(val) => setThemeValue(val as AppTheme)} placeholder={t("settings.selectTheme")} />
          </View>
          <View style={styles.inputGroup}>
            <Dropdown label={t("settings.language")} value={languageValue} options={["English", "Ukrainian"]} onSelect={(val) => setLanguageValue(val as AppLanguage)} placeholder={t("settings.selectLanguage")} />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveAppSettings} disabled={isSavingApp}>
            <Text style={styles.buttonText}>{isSavingApp ? t("common.saving") : t("common.save")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingTop: theme.spacing.m, paddingHorizontal: theme.spacing.xl },
  content: { paddingHorizontal: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  screenTitle: { fontSize: theme.typography.sizes.header, fontWeight: theme.typography.weights.bold, color: theme.colors.text, textAlign: "center", marginBottom: theme.spacing.xl, marginTop: theme.spacing.s },
  section: { marginBottom: theme.spacing.l },
  sectionTitle: { fontSize: theme.typography.sizes.large, fontWeight: theme.typography.weights.medium, color: theme.colors.text, marginBottom: theme.spacing.l },
  inputGroup: { marginBottom: theme.spacing.m },
  label: { fontSize: theme.typography.sizes.regular, fontWeight: theme.typography.weights.medium, color: theme.colors.text, marginBottom: theme.spacing.xs },
  input: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, fontSize: theme.typography.sizes.regular, color: theme.colors.text },
  inputDisabled: { backgroundColor: theme.isDark ? '#2A2A2A' : '#F5F5F5', color: theme.colors.textSecondary, borderColor: theme.colors.border },
  button: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.m, paddingHorizontal: theme.spacing.xl, borderRadius: 8, alignItems: "center", alignSelf: "stretch", marginTop: theme.spacing.s, marginBottom: theme.spacing.xl },
  buttonText: { color: "#FFFFFF", fontSize: theme.typography.sizes.regular, fontWeight: theme.typography.weights.bold },
});