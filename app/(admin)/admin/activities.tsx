import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function AdminActivitiesScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="subtitle">Activities</ThemedText>
			<ThemedText type="default">Configure activities here.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		gap: 8,
	},
});


