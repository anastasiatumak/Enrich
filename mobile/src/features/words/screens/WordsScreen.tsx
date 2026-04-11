import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../constants/theme';
import { useFlashcardStore } from '../../../store/useFlashcardStore';
import { FlashcardItem } from '../../../components/FlashcardItem';

export const WordsScreen = () => {
  const { 
    globalFlashcards, 
    isLoading, 
    fetchGlobalFlashcards, 
    toggleSaveFlashcard 
  } = useFlashcardStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAscending, setIsAscending] = useState(true);

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
      const comparison = a.word.localeCompare(b.word);
      return isAscending ? comparison : -comparison;
    });

    return result;
  }, [globalFlashcards, searchQuery, isAscending]);

  const toggleSort = () => {
    setIsAscending(!isAscending);
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
        
        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Ionicons 
            name={isAscending ? "arrow-down" : "arrow-up"} 
            size={18} 
            color={theme.colors.text} 
          />
          <Text style={styles.sortText}>Sort by</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? "No words matches your search." : "The library is empty."}
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
    backgroundColor: '#FFFFFF' 
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  headerContainer: {
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.xl,
  },
  screenTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  sortText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  list: {
    flex: 1,
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
