import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from '../../../store/useAuthStore';
import { theme } from '../../../constants/theme';

export const HomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.username}!</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to your app</Text>
          <Text style={styles.cardText}>
            This is the Home screen. From here you can build out your feature modules.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
  },
  content: {
    flex: 1,
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  greeting: {
    fontSize: theme.typography.sizes.header,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  email: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: theme.spacing.xl,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  cardText: {
    fontSize: theme.typography.sizes.regular,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: theme.spacing.l,
  },
  logoutText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.regular,
    fontWeight: theme.typography.weights.bold,
  },
});
