import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Slot, router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import AdminSidebarNav from '@/components/admin/admin-sidebar-nav';
import Header from '@/components/layout/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Sidebar } from '@/components/ui/sidebar';

export default function AdminGroupLayout() {
	const colorScheme = useColorScheme();
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<Sidebar.Provider>
			<Sidebar.Content>
				<AdminSidebarNav />
			</Sidebar.Content>
			<ThemedView style={styles.container}>
				<Header
					title="Admin"
					left={<Sidebar.Trigger><ThemedText type="defaultSemiBold">☰</ThemedText></Sidebar.Trigger>}
					right={
						<Pressable onPress={() => setMenuOpen((v) => !v)}>
							<IconSymbol size={28} name="person.crop.circle" color={Colors[colorScheme ?? 'light'].tint} />
						</Pressable>
					}
				/>
				{menuOpen ? (
					<View style={styles.menu}>
						<Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push('/profile' as any); }}>
							<ThemedText type="defaultSemiBold">Profile</ThemedText>
						</Pressable>
						<Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push('/admin/users' as any); }}>
							<ThemedText type="defaultSemiBold">Admin Panel</ThemedText>
						</Pressable>
						<Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); }}>
							<ThemedText type="default">Logout</ThemedText>
						</Pressable>
					</View>
				) : null}
				<View style={styles.body}>
					<Slot />
				</View>
			</ThemedView>
		</Sidebar.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 24,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingBottom: 8,
	},
	body: {
		flex: 1,
		padding: 16,
		gap: 12,
	},
	menu: {
		position: 'absolute',
		top: 56,
		right: 16,
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 10,
		overflow: 'hidden',
	},
	menuItem: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(255,255,255,0.1)',
	},
});


