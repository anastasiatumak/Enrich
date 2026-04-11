import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from '../../../constants/theme';
import { useFlashcardStore, Flashcard } from '../../../store/useFlashcardStore';
import { FlashcardItem } from '../../../components/FlashcardItem';
import { useNavigation } from '@react-navigation/native';

type SortOrder = 'A-Z' | 'Z-A';

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
      return b.word.localeCompare(a.word);
    });
    
    return result;
  }, [personalFlashcards, searchQuery, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'A-Z' ? 'Z-A' : 'A-Z');
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
    <SafeAreaView style={styles.container} edges={['top']}>
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
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.actionBtnText}>Start a Quiz</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSortRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
            <Ionicons name="swap-vertical" size={20} color="#1C2024" />
            <Text style={styles.sortBtnText}>Sort by</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF' 
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.m,
  },
  screenTitle: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#DEDEDE',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C2024',
  },
  searchSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 14,
    color: '#1C2024',
    padding: 0,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  sortBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C2024',
    marginLeft: 6,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
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
