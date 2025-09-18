import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function SitUpsScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Sit-ups</ThemedText>
			<ThemedText type="default">Count your reps and check form.</ThemedText>
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


