'use client';

import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import type { LeaderboardUser } from '@/src/lib/types';

type AdminUser = LeaderboardUser & { email?: string; phone?: string };

interface AdminUsersClientProps {
  users: AdminUser[];
  onViewProfile?: (userId: string) => void;
}

export default function AdminUsersClient({ users, onViewProfile }: AdminUsersClientProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.fullName, u.email, u.phone].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, query]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerGroup}>
        <ThemedText type="title">All Users</ThemedText>
        <TextInput
          style={styles.search}
          placeholder="Search by name or email..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.list}>
        {filtered.map((u) => (
          <View key={u.id} style={styles.row}>
            <Image source={{ uri: u.avatarUrl }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">{u.fullName}</ThemedText>
              <ThemedText type="default">{u.email ?? '—'}</ThemedText>
              <ThemedText type="default" style={{ color: '#999' }}>
                {[u.village, u.state].filter(Boolean).join(', ') || '—'}
              </ThemedText>
            </View>
            {onViewProfile && (
              <Pressable style={styles.action} onPress={() => onViewProfile?.(u.id)}>
                <ThemedText type="defaultSemiBold">View</ThemedText>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 12,
  },
  headerGroup: {
    gap: 8,
  },
  search: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 10,
    borderRadius: 8,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#ccc',
  },
  action: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
  },
});


