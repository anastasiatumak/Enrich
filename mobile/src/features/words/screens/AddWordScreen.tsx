import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useFlashcardStore } from '../../../store/useFlashcardStore';
import { useTranslation } from "react-i18next";
import { Dropdown } from '../../../components/Dropdown';

const DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not Set'];
const PARTS_OF_SPEECH = [
  'Noun', 'Verb', 'Adjective', 'Adverb', 
  'Pronoun', 'Preposition', 'Conjunction', 'Interjection', 
  'Idiom', 'Phrase', 'Other'
];

export const AddWordScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { createFlashcard, isLoading } = useFlashcardStore();

  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('B2');
  const [partOfSpeech, setPartOfSpeech] = useState('Adverb');
  const [transcription, setTranscription] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);
    if (!word.trim()) {
      setError(t("common.error")); // Basic validation
      return;
    }
    if (!translation.trim()) {
      setError(t("common.error"));
      return;
    }

    try {
      await createFlashcard({
        word,
        translation,
        difficultyLevel: difficultyLevel === 'Not Set' ? null : difficultyLevel,
        partOfSpeech,
        transcription,
        meaning,
        example
      });
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to add word.');
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("wordForm.addTitle")}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("wordForm.labels.word")}</Text>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder={t("wordForm.placeholders.word")}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Dropdown 
            label={t("wordForm.labels.difficulty")}
            value={difficultyLevel}
            options={DIFFICULTY_LEVELS}
            onSelect={setDifficultyLevel}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("wordForm.labels.translation")}</Text>
          <TextInput
            style={styles.input}
            value={translation}
            onChangeText={setTranslation}
            placeholder={t("wordForm.placeholders.translation")}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Dropdown 
            label={t("wordForm.labels.partOfSpeech")}
            value={partOfSpeech}
            options={PARTS_OF_SPEECH}
            onSelect={setPartOfSpeech}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("wordForm.labels.transcription")}</Text>
          <TextInput
            style={styles.input}
            value={transcription}
            onChangeText={setTranscription}
            placeholder={t("wordForm.placeholders.transcription")}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("wordForm.labels.meaning")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={meaning}
            onChangeText={setMeaning}
            placeholder={t("wordForm.placeholders.meaning")}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("wordForm.labels.example")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={example}
            onChangeText={setExample}
            placeholder={t("wordForm.placeholders.example")}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.addBtn, isLoading && styles.loadingBtn]}
            onPress={handleAdd}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addBtnText}>{t("wordForm.buttons.save")}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: theme.typography.sizes.title, 
    fontWeight: theme.typography.weights.bold, 
    color: theme.colors.text 
  },
  scrollContent: { 
    paddingHorizontal: theme.spacing.xl, 
    paddingBottom: 40 
  },
  inputGroup: { 
    marginBottom: theme.spacing.m
  },
  label: { 
    fontSize: theme.typography.sizes.regular, 
    fontWeight: theme.typography.weights.medium, 
    color: theme.colors.text, 
    marginBottom: theme.spacing.xs 
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    height: 48,
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  footer: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  loadingBtn: { opacity: 0.7 },
  addBtnText: { 
    color: "#FFFFFF", 
    fontWeight: theme.typography.weights.bold, 
    fontSize: theme.typography.sizes.regular 
  },
  errorText: { 
    color: theme.colors.error, 
    marginBottom: 10, 
    textAlign: 'center',
    fontSize: theme.typography.sizes.small 
  }
});

