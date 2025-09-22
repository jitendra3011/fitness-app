import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

type AdminNavItem = {
  title: string;
  href: string;
  icon: string;
};

const NAV_ITEMS: AdminNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: 'house.fill' },
  { title: 'Athletes', href: '/admin/users', icon: 'person.3.fill' },
  { title: 'Submissions', href: '/admin/activities', icon: 'video.fill' },
  { title: 'Training Videos', href: '/admin/videos', icon: 'play.rectangle.fill' },
  { title: 'Settings', href: '/admin/settings', icon: 'gear.circle.fill' },
];

export default function AdminSidebarNav() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol size={28} name="figure.strengthtraining.traditional" color="#3B82F6" />
        <ThemedText type="title" style={styles.headerText}>🏛️ SAI Admin</ThemedText>
      </View>
      <View style={styles.menu}>
        {NAV_ITEMS.map((item) => (
          <Pressable key={item.href} style={styles.link} onPress={() => router.push(item.href as any)}>
            <IconSymbol size={20} name={item.icon} color="#FFFFFF" />
            <ThemedText type="defaultSemiBold" style={styles.linkText}>{item.title}</ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  menu: {
    gap: 8,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  linkText: {
    color: '#FFFFFF',
  },
});


