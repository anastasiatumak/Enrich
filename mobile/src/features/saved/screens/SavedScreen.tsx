import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../../constants/theme';

export const SavedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Saved Flashcards</Text>
        <Text style={styles.subtitle}>Your saved flashcards will appear here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, padding: theme.spacing.m, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: theme.typography.sizes.title, fontWeight: theme.typography.weights.bold, color: theme.colors.text, marginBottom: theme.spacing.s },
  subtitle: { fontSize: theme.typography.sizes.regular, color: theme.colors.textSecondary, textAlign: 'center' },
});
