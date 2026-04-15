import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../constants/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

type RootStackParamList = {
  QuizSummary: {
    correct: number;
    total: number;
    percentage: number;
  };
  MainTabs: any;
};

type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'QuizSummary'>;

export const SummaryScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<SummaryScreenRouteProp>();
  const { correct, total, percentage } = route.params;

  const getMessage = () => {
    if (percentage >= 80) return "quiz.summary.amazing";
    if (percentage >= 50) return "quiz.summary.good";
    return "quiz.summary.keepGoing";
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("quiz.summary.title")}</Text>
          <Text style={styles.subtitle}>{t("quiz.summary.score")}</Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correct}</Text>
              <Text style={styles.statLabel}>{t("quiz.summary.correct")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{total - correct}</Text>
              <Text style={styles.statLabel}>{t("quiz.summary.incorrect")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            {t(getMessage())}
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.doneBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.doneBtnText}>{t("quiz.summary.backToLibrary")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary },
  scoreCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  percentageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.isDark ? '#1A1A1A' : '#F9FBF9',
    marginBottom: 24,
  },
  percentageText: { fontSize: 36, fontWeight: 'bold', color: theme.colors.primary },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  statDivider: { width: 1, height: '100%', backgroundColor: theme.colors.border },
  messageBox: { marginBottom: 40, paddingHorizontal: 20 },
  messageText: { fontSize: 18, textAlign: 'center', color: theme.colors.text, lineHeight: 26, fontWeight: '500' },
  footer: { width: '100%', marginTop: 'auto' },
  doneBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});
