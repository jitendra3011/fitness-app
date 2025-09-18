import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import AdminSidebarNav from '@/components/admin/admin-sidebar-nav';
import Header from '@/components/layout/header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Sidebar } from '@/components/ui/sidebar';

export default function AdminGroupLayout() {
	return (
		<Sidebar.Provider>
			<Sidebar.Content>
				<AdminSidebarNav />
			</Sidebar.Content>
			<ThemedView style={styles.container}>
				<Header
					title="Admin"
					left={<Sidebar.Trigger><ThemedText type="defaultSemiBold">☰</ThemedText></Sidebar.Trigger>}
				/>
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
});


