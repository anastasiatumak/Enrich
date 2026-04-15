import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useAppTheme } from '../constants/theme';
import { Flashcard } from '../services/quizService';
import { useTranslation } from "react-i18next";

interface QuizCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ flashcard, isFlipped, onFlip }) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const [flipAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} onPress={onFlip} style={styles.cardContainer}>
        {/* Front Side */}
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle, { opacity: isFlipped ? 0 : 1 }]}>
          <Text style={styles.wordText}>{flashcard.word}</Text>
          <Text style={styles.tapHint}>{t("quiz.tapToReveal")}</Text>
        </Animated.View>

        {/* Back Side */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { opacity: isFlipped ? 1 : 0 }]}>
          <Text style={styles.translationText}>{flashcard.translation}</Text>
          {flashcard.meaning && <Text style={styles.meaningText}>{flashcard.meaning}</Text>}
          {flashcard.example && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>{t("common.example")}:</Text>
              <Text style={styles.exampleText}>{flashcard.example}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 2,
  },
  wordText: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 16,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  meaningText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  exampleContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: theme.isDark ? '#262626' : theme.colors.background,
    borderRadius: 12,
    marginTop: 'auto',
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
