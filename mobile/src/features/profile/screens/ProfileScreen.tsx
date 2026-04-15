import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../../store/useAuthStore";
import { useAppTheme } from "../../../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const { t, i18n } = useTranslation();
  const { user, quizHistory, logout, fetchUserProfile, fetchQuizHistory } =
    useAuthStore();

  useEffect(() => {
    fetchUserProfile();
    fetchQuizHistory();
  }, [fetchUserProfile, fetchQuizHistory]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("profile.loadingDate");
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return t("profile.loadingDate");
    
    const month = d.toLocaleString(i18n.language === "uk" ? "uk-UA" : "en-US", { month: "long" });
    return `${t("profile.joined")} ${month} ${d.getFullYear()}`;
  };
  
  const formatHistoryDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(i18n.language === "uk" ? "uk-UA" : "en-US");
  };

  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutConfirmTitle"),
      t("profile.logoutConfirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.logout"),
          onPress: () => logout(),
          style: "destructive",
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t("profile.title")}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color={theme.isDark ? "#888" : theme.colors.gray2} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.username}>
                {user?.username || "username"}
              </Text>
              <Text style={styles.joinedText}>
                {user?.createdAt
                  ? formatDate(user.createdAt)
                  : t("profile.loadingDate")}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>{t("profile.quizHistory")}</Text>
          {quizHistory && quizHistory.length > 0 ? (
            quizHistory.map((item: any) => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={styles.historyDate}>
                  {formatHistoryDate(item.startedAt || item.finishedAt)}
                </Text>
                <Text style={styles.historyScore}>
                  {item.scorePercentage ?? 0}% {t("profile.correct")}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryText}>
                {t("profile.emptyHistory")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingTop: theme.spacing.m, paddingHorizontal: theme.spacing.xl },
  content: { paddingBottom: theme.spacing.xxl },
  screenTitle: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.s,
  },
  profileCard: {
    backgroundColor: theme.isDark ? theme.colors.card : theme.colors.grass3,
    borderRadius: 16,
    borderWidth: theme.isDark ? 1 : 0,
    borderColor: theme.colors.border,
    padding: theme.spacing.l,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.l,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.isDark ? "#2A2A2A" : theme.colors.gray,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.m,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  joinedText: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.m,
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutText: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.error,
    fontWeight: theme.typography.weights.bold,
    marginLeft: theme.spacing.xs,
  },
  historySection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  historyTitle: {
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  historyDate: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  historyScore: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.bold,
  },
  emptyHistoryContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHistoryText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.regular,
    textAlign: "center",
  },
});
