import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AdminUsersScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Users</ThemedText>
			<ThemedText type="default">Manage users here.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 8,
	},
});


