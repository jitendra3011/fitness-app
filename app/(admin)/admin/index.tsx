import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AdminDashboardScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Dashboard</ThemedText>
			<ThemedText type="default">Welcome to the admin dashboard.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 8,
	},
});


