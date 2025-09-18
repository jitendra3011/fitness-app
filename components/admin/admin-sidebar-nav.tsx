import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type AdminNavItem = {
  title: string;
  href: string;
};

const NAV_ITEMS: AdminNavItem[] = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Users', href: '/admin/users' },
  { title: 'Activities', href: '/admin/activities' },
  { title: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebarNav() {
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.header}>Admin</ThemedText>
      <View style={styles.menu}>
        {NAV_ITEMS.map((item) => (
          <Pressable key={item.href} style={styles.link} onPress={() => router.push(item.href as any)}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  menu: {
    gap: 8,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});


