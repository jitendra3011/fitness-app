import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AdminSettingsScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Settings</ThemedText>
			<ThemedText type="default">Adjust admin settings here.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 8,
	},
});


