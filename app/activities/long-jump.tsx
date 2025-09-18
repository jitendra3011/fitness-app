import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function LongJumpScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Long Jump</ThemedText>
			<ThemedText type="default">Measure your explosive power.</ThemedText>
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


