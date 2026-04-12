import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../constants/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

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
  const navigation = useNavigation<any>();
  const route = useRoute<SummaryScreenRouteProp>();
  const { correct, total, percentage } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Quiz Completed!</Text>
          <Text style={styles.subtitle}>Here is how you did today</Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.accuracyLabel}>Accuracy</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correct}</Text>
              <Text style={styles.statLabel}>Knew that!</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{total - correct}</Text>
              <Text style={styles.statLabel}>Didn't know</Text>
            </View>
          </View>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            {percentage >= 80 ? "Amazing job! You're mastering these words." : 
             percentage >= 50 ? "Good effort! Keep practicing to improve." : 
             "Don't give up! Every session makes you better."}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.doneBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.doneBtnText}>Back to Library</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary },
  scoreCard: {
    width: '100%',
    backgroundColor: '#F5F5F7',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  percentageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginBottom: 24,
  },
  percentageText: { fontSize: 36, fontWeight: 'bold', color: theme.colors.primary },
  accuracyLabel: { fontSize: 12, color: theme.colors.textSecondary, textTransform: 'uppercase' },
  statsContainer: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary },
  statDivider: { width: 1, height: '100%', backgroundColor: '#DDD' },
  messageBox: { marginBottom: 40, paddingHorizontal: 20 },
  messageText: { fontSize: 18, textAlign: 'center', color: theme.colors.text, lineHeight: 26 },
  doneBtn: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  doneBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
