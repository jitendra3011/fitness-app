import AdminUsersClient from '@/components/admin/admin-users-client';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockUsers } from '@/src/lib/data';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function AdminUsersScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">User Management</ThemedText>
      <ThemedText type="default">Browse and manage user profiles and activities.</ThemedText>
      <AdminUsersClient
        users={mockUsers as any}
        onViewProfile={(userId) => router.push(`/admin/users/${userId}` as any)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
});

