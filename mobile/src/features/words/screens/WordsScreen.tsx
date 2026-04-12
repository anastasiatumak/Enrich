import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import { useFlashcardStore } from '../../../store/useFlashcardStore';
import { FlashcardItem } from '../../../components/FlashcardItem';

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

export const WordsScreen = () => {
  const { 
    globalFlashcards, 
    isLoading, 
    fetchGlobalFlashcards, 
    toggleSaveFlashcard 
  } = useFlashcardStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('A-Z');
  const [sortVisible, setSortVisible] = useState(false);
  const [sortCoords, setSortCoords] = useState({ top: 0, right: 0 });
  const sortBtnRef = useRef<View>(null);
  const SORT_OPTIONS = ['A-Z', 'Z-A', 'Hardest First', 'Easiest First'];

  useEffect(() => {
    fetchGlobalFlashcards();
  }, []);

  const filteredAndSortedWords = useMemo(() => {
    let result = [...globalFlashcards];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          (item.word?.toLowerCase() || '').includes(query) || 
          (item.translation?.toLowerCase() || '').includes(query)
      );
    }

    // Sort by word
    result.sort((a, b) => {
      if (sortOrder === 'A-Z') return a.word.localeCompare(b.word);
      if (sortOrder === 'Z-A') return b.word.localeCompare(a.word);
      
      const weightA = getDifficultyWeight(a.difficultyLevel);
      const weightB = getDifficultyWeight(b.difficultyLevel);
      
      if (sortOrder === 'Hardest First') {
        if (weightA === 0 && weightB !== 0) return 1;
        if (weightB === 0 && weightA !== 0) return -1;
        if (weightA !== weightB) return weightB - weightA;
        return a.word.localeCompare(b.word);
      }
      
      if (sortOrder === 'Easiest First') {
        if (weightA === 0 && weightB !== 0) return 1;
        if (weightB === 0 && weightA !== 0) return -1;
        if (weightA !== weightB) return weightA - weightB;
        return a.word.localeCompare(b.word);
      }
      
      return 0;
    });

    return result;
  }, [globalFlashcards, searchQuery, sortOrder]);

  const handleOpenSort = () => {
    sortBtnRef.current?.measureInWindow((x, y, width, height) => {
      const { width: windowWidth } = Dimensions.get('window');
      setSortCoords({
        top: y + height + 8,
        right: windowWidth - x - width,
      });
      setSortVisible(true);
    });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Words Library</Text>
      
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
        </View>
        
        <View style={styles.sortContainer}>
          <View ref={sortBtnRef}>
            <TouchableOpacity style={styles.sortBtn} onPress={handleOpenSort}>
              <Ionicons name="swap-vertical" size={20} color={theme.colors.text} />
              <Text style={styles.sortText}>Sort by</Text>
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
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {renderHeader()}
      <FlatList
        data={filteredAndSortedWords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FlashcardItem 
            flashcard={item} 
            onToggleSave={toggleSaveFlashcard} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading && globalFlashcards.length > 0} 
            onRefresh={fetchGlobalFlashcards}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? "No words match your search." : "The library is empty."}
              </Text>
            </View>
          ) : null
        }
      />
      {isLoading && globalFlashcards.length === 0 && (
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
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerContainer: {
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
  },
  screenTitle: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.s,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
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
  sortText: {
    marginLeft: 6,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});
