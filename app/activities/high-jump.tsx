import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function HighJumpScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">High Jump</ThemedText>
			<ThemedText type="default">Test your vertical leap.</ThemedText>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 8,
	},
});


