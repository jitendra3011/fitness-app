import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function PushUpsScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Push-ups</ThemedText>
			<ThemedText type="default">Build upper body strength.</ThemedText>
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


