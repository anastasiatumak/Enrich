import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuCoords, setMenuCoords] = useState({ bottom: 0, right: 0 });
  const triggerRef = useRef<View>(null);

  const handleOpenMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
      setMenuCoords({
        bottom: windowHeight - y + 8, // slight offset to appear just above the icon
        right: windowWidth - x - width, // aligns with the right edge of the icon
      });
      setMenuVisible(true);
    });
  };

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
            color={flashcard.isSaved ? theme.colors.primary : theme.colors.text} 
          />
        </TouchableOpacity>
      ) : (
        <>
          <View ref={triggerRef} style={styles.bottomActionIcon}>
            <TouchableOpacity onPress={handleOpenMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Modal
            transparent={true}
            visible={menuVisible}
            animationType="none"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={[styles.menuContainer, { bottom: menuCoords.bottom, right: menuCoords.right }]}>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        // Using setTimeout ensures the modal closing doesn't block the navigation transition
                        setTimeout(() => onEdit?.(flashcard), 0);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={18} color={theme.colors.text} />
                      <Text style={styles.menuItemText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.menuDivider} />
                    
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => {
                        setMenuVisible(false);
                        setTimeout(() => onDelete?.(flashcard.id), 0);
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                      <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card, 
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  difficultyBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium,
  },
  partOfSpeech: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 2,
  },
  transcription: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  details: {
    marginTop: 0,
  },
  label: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginTop: 4,
  },
  value: {
    fontSize: theme.typography.sizes.small,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  }
});

