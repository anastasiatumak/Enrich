import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from '../../../constants/theme';
import { useFlashcardStore, Flashcard } from '../../../store/useFlashcardStore';
import { FlashcardItem } from '../../../components/FlashcardItem';
import { useNavigation } from '@react-navigation/native';

type SortOrder = 'A-Z' | 'Z-A' | 'Hardest First' | 'Easiest First';

const getDifficultyWeight = (level?: string | null) => {
  switch (level) {
    case 'A1': return 1;
    case 'A2': return 2;
    case 'B1': return 3;
    case 'B2': return 4;
    case 'C1': return 5;
    case 'C2': return 6;
    default: return 0; // Not Set or null
  }
};

export const SavedScreen = () => {
  const navigation = useNavigation<any>();
  const { 
    personalFlashcards, 
    isLoading, 
    fetchPersonalFlashcards, 
    deleteFlashcard 
  } = useFlashcardStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('A-Z');

  useEffect(() => {
    fetchPersonalFlashcards();
  }, []);

  const filteredAndSortedWords = useMemo(() => {
    let result = [...personalFlashcards];
    
    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        (f.word?.toLowerCase() || '').includes(query) || 
        (f.translation?.toLowerCase() || '').includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.word.localeCompare(b.word);
      if (sortOrder === 'Z-A') return b.word.localeCompare(a.word);
      
      const weightA = getDifficultyWeight(a.difficultyLevel);
      const weightB = getDifficultyWeight(b.difficultyLevel);
      
      if (sortOrder === 'Hardest First') {
        // We want 'Not Set' (0) to always appear at the bottom
        if (weightA === 0 && weightB !== 0) return 1;
        if (weightB === 0 && weightA !== 0) return -1;
        if (weightA !== weightB) return weightB - weightA; // Higher weight first
        return a.word.localeCompare(b.word); // Fallback to A-Z
      }
      
      if (sortOrder === 'Easiest First') {
        // We want 'Not Set' (0) to always appear at the bottom
        if (weightA === 0 && weightB !== 0) return 1;
        if (weightB === 0 && weightA !== 0) return -1;
        if (weightA !== weightB) return weightA - weightB; // Lower weight first
        return a.word.localeCompare(b.word); // Fallback to A-Z
      }
      
      return 0;
    });
    
    return result;
  }, [personalFlashcards, searchQuery, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'A-Z' ? 'Z-A' : 'A-Z');
  };

  const [sortVisible, setSortVisible] = useState(false);
  const [sortCoords, setSortCoords] = useState({ top: 0, right: 0 });
  const sortBtnRef = useRef<View>(null);
  const SORT_OPTIONS = ['A-Z', 'Z-A', 'Hardest First', 'Easiest First'];

  const handleOpenSort = () => {
    sortBtnRef.current?.measureInWindow((x, y, width, height) => {
      const { width: windowWidth } = Dimensions.get('window');
      setSortCoords({
        top: y + height + 8, // Just below the button
        right: windowWidth - x - width, // Align with the right edge
      });
      setSortVisible(true);
    });
  };

  const handleEdit = React.useCallback((word: Flashcard) => {
    navigation.navigate('EditWord', { flashcard: word });
  }, [navigation]);

  const handleDelete = React.useCallback((id: number) => {
    deleteFlashcard(id);
  }, [deleteFlashcard]);

  const renderItem = React.useCallback(({ item }: { item: Flashcard }) => (
    <FlashcardItem 
      flashcard={item} 
      variant="saved"
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [handleEdit, handleDelete]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Saved Words</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddWord')}
          >
            <Text style={styles.actionBtnText}>Add new word</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.quizBtn]}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={[styles.actionBtnText, styles.quizBtnText]}>Start a Quiz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSortRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
          <View style={styles.sortContainer}>
            <View ref={sortBtnRef}>
              <TouchableOpacity style={styles.sortBtn} onPress={handleOpenSort}>
                <Ionicons name="swap-vertical" size={20} color={theme.colors.text} />
                <Text style={styles.sortBtnText}>Sort by</Text>
              </TouchableOpacity>
            </View>

            {sortVisible && (
              <Modal
                transparent={true}
                visible={sortVisible}
                animationType="fade"
                onRequestClose={() => setSortVisible(false)}
              >
                <TouchableWithoutFeedback onPress={() => setSortVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={[styles.dropdownMenu, { position: 'absolute', top: sortCoords.top, right: sortCoords.right }]}>
                        {SORT_OPTIONS.map((option) => (
                          <TouchableOpacity
                            key={option}
                            style={[styles.dropdownItem, sortOrder === option && styles.activeDropdownItem]}
                            onPress={() => {
                              setSortOrder(option as SortOrder);
                              setSortVisible(false);
                            }}
                          >
                            <Text style={[styles.dropdownText, sortOrder === option && styles.activeDropdownText]}>
                              {option}
                            </Text>
                            {sortOrder === option && (
                              <Ionicons name="checkmark" size={18} color={theme.colors.primary} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>
        </View>
      </View>

      <FlatList
        data={filteredAndSortedWords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading && personalFlashcards.length > 0} 
            onRefresh={fetchPersonalFlashcards}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? "No matches found." : "Your saved list is empty."}
              </Text>
            </View>
          ) : null
        }
      />
      {isLoading && personalFlashcards.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.m,
  },
  screenTitle: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.s,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.colors.card,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quizBtn: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionBtnText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  quizBtnText: {
    color: theme.colors.background,
  },
  searchSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
    padding: 0,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortBtnText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginLeft: 6,
  },
  sortContainer: {
    position: 'relative',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    width: 200,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
  },
  activeDropdownItem: {
    backgroundColor: theme.colors.background,
  },
  dropdownText: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.text,
  },
  activeDropdownText: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});
