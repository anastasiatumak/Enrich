import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Flashcard } from '../store/useFlashcardStore';

interface Props {
  flashcard: Flashcard;
  onToggleSave?: (id: number) => void;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (id: number) => void;
  variant?: 'global' | 'saved';
}

export const FlashcardItem: React.FC<Props> = React.memo(({ flashcard, onToggleSave, onEdit, onDelete, variant = 'global' }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <Text style={styles.word}>{flashcard.word}</Text>
          {flashcard.difficultyLevel && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{flashcard.difficultyLevel}</Text>
            </View>
          )}
        </View>
        <Text style={styles.translation}>{flashcard.translation}</Text>
      </View>

      <Text style={styles.partOfSpeech}>{flashcard.partOfSpeech}</Text>
      <Text style={styles.transcription}>[{flashcard.transcription}]</Text>

      <View style={styles.details}>
        <Text style={styles.label}>Meaning</Text>
        <Text style={styles.value}>{flashcard.meaning}</Text>
        
        <Text style={styles.label}>Example</Text>
        <Text style={styles.value}>{flashcard.example}</Text>
      </View>

      {variant === 'global' ? (
        <TouchableOpacity 
          style={styles.actionIcon} 
          onPress={() => onToggleSave?.(flashcard.id)}
        >
          <Ionicons 
            name={flashcard.isSaved ? "heart" : "heart-outline"} 
            size={24} 
            color={flashcard.isSaved ? theme.colors.primary : "#1C2024"} 
          />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.bottomActionIcon} 
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#1C2024" />
          </TouchableOpacity>

          {menuVisible && (
            <View style={styles.menuContainer}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onEdit?.(flashcard);
                }}
              >
                <Ionicons name="pencil-outline" size={18} color="#1C2024" />
                <Text style={styles.menuItemText}>Edit</Text>
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete?.(flashcard.id);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#DEDEDE', 
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  word: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  difficultyBadge: {
    backgroundColor: '#A0A0A0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 2,
  },
  transcription: {
    fontSize: 14,
    color: '#60646C',
    marginBottom: 8,
  },
  details: {
    marginTop: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 2,
    lineHeight: 18,
  },
  actionIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 4,
  },
  bottomActionIcon: {
    position: 'absolute',
    bottom: 12,
    right: 8,
    padding: 4,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 45,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C2024',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  }
});

