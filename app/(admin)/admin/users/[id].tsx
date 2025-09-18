import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockUsers } from '@/src/lib/data';
import type { LeaderboardUser } from '@/src/lib/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type AdminUser = LeaderboardUser & { email?: string; phone?: string };

export default function AdminUserProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const user = useMemo(() => (mockUsers as AdminUser[]).find(u => u.id === String(id)), [id]);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">User not found</ThemedText>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <ThemedText type="defaultSemiBold">Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerCard}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <View style={{ gap: 4 }}>
          <ThemedText type="title">{user.fullName}</ThemedText>
          <ThemedText type="default">{user?.email ?? '—'}</ThemedText>
          <ThemedText type="default">{[user.village, user.state].filter(Boolean).join(', ') || '—'}</ThemedText>
        </View>
      </View>

      <Pressable style={styles.back} onPress={() => router.push('/admin/users' as any)}>
        <ThemedText type="defaultSemiBold">Back to Users</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  headerCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#ccc',
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});


