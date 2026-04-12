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
import { theme } from '../../../constants/theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFlashcardStore, Flashcard } from '../../../store/useFlashcardStore';

import { Dropdown } from '../../../components/Dropdown';

const DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not Set'];
const PARTS_OF_SPEECH = [
  'Noun', 'Verb', 'Adjective', 'Adverb', 
  'Pronoun', 'Preposition', 'Conjunction', 'Interjection', 
  'Idiom', 'Phrase', 'Other'
];

export const EditWordScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { flashcard } = route.params || {};
  const { updateFlashcard, isLoading } = useFlashcardStore();

  const [word, setWord] = useState(flashcard?.word || '');
  const [translation, setTranslation] = useState(flashcard?.translation || '');
  const [difficultyLevel, setDifficultyLevel] = useState(flashcard?.difficultyLevel || 'B2');
  const [partOfSpeech, setPartOfSpeech] = useState(flashcard?.partOfSpeech || 'Adverb');
  const [transcription, setTranscription] = useState(flashcard?.transcription || '');
  const [meaning, setMeaning] = useState(flashcard?.meaning || '');
  const [example, setExample] = useState(flashcard?.example || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!word.trim()) {
      setError('Word field is required.');
      return;
    }
    if (!translation || !translation.trim()) {
      setError('Translation field is required.');
      return;
    }
    
    try {
      await updateFlashcard({
        id: flashcard.id,
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
      setError(err.message || 'Failed to update word.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit word</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Word</Text>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Word"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <Dropdown 
          label="Difficulty Level"
          value={difficultyLevel}
          options={DIFFICULTY_LEVELS}
          onSelect={setDifficultyLevel}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Translation</Text>
          <TextInput
            style={styles.input}
            value={translation}
            onChangeText={setTranslation}
            placeholder="Translation"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <Dropdown 
          label="Part of Speech"
          value={partOfSpeech}
          options={PARTS_OF_SPEECH}
          onSelect={setPartOfSpeech}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Transcription</Text>
          <TextInput
            style={styles.input}
            value={transcription}
            onChangeText={setTranscription}
            placeholder="Transcription"
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Meaning</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={meaning}
            onChangeText={setMeaning}
            placeholder="Meaning"
            placeholderTextColor="#8E8E93"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Example</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={example}
            onChangeText={setExample}
            placeholder="Example"
            placeholderTextColor="#8E8E93"
            multiline
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveBtn, isLoading && styles.loadingBtn]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1C2024' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    color: '#1C2024',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#DEDEDE',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  loadingBtn: { opacity: 0.7 },
  saveBtnText: { color: '#1C2024', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#FF3B30', marginBottom: 10, textAlign: 'center' }
});

