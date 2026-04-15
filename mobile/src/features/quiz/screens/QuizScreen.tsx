import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { quizService, Flashcard, QuizAnswer } from '../../../services/quizService';
import { QuizCard } from '../../../components/QuizCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

export const QuizScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(new Date());

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await quizService.generateQuiz(10);
      if (data.length === 0) {
        Alert.alert(
          t("common.error"), 
          t("saved.emptyList"),
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        setFlashcards(data);
      }
    } catch (error) {
      console.error('Quiz load error:', error);
      Alert.alert(t("common.error"), "Failed to load quiz words.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const currentCard = flashcards[currentIndex];

  const handleAnswer = async (isKnown: boolean) => {
    const newAnswers = [...answers, { flashcardId: currentCard.id, isKnown }];
    setAnswers(newAnswers);

    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      await finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: QuizAnswer[]) => {
    try {
      setLoading(true);
      const endTime = new Date();
      const correct = finalAnswers.filter(a => a.isKnown).length;
      const total = flashcards.length;
      const percentage = Math.round((correct / total) * 100);

      await quizService.submitResult({
        startedAt: startTime.toISOString(),
        finishedAt: endTime.toISOString(),
        answers: finalAnswers
      });

      navigation.replace('QuizSummary', {
        correct,
        total,
        percentage
      });
    } catch (error) {
      console.error('Quiz submission error:', error);
      const correct = finalAnswers.filter(a => a.isKnown).length;
      navigation.replace('QuizSummary', {
        correct,
        total: flashcards.length,
        percentage: Math.round((correct / flashcards.length) * 100)
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  if (loading && flashcards.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (flashcards.length === 0) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {flashcards.length}
        </Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.content}>
        <QuizCard 
          flashcard={currentCard} 
          isFlipped={isFlipped} 
          onFlip={() => setIsFlipped(!isFlipped)} 
        />

        {isFlipped && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.btn, styles.didntKnowBtn]} 
              onPress={() => handleAnswer(false)}
            >
              <Text style={styles.didntKnowText}>{t("quiz.dontKnow")}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, styles.knewThatBtn]} 
              onPress={() => handleAnswer(true)}
            >
              <Text style={styles.knewThatText}>{t("quiz.knowWord")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: { padding: 4 },
  progressText: { fontSize: 18, fontWeight: '600', color: theme.colors.textSecondary },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    flex: 0.48,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  didntKnowBtn: {
    backgroundColor: theme.isDark ? '#2A1A1A' : '#FFF5F5',
    borderColor: theme.isDark ? '#4A2A2A' : '#FED7D7',
  },
  knewThatBtn: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  didntKnowText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: theme.isDark ? '#FF9999' : '#C53030',
    textAlign: 'center',
  },
  knewThatText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

