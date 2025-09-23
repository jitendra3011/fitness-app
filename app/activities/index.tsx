import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ActivitiesIndex() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Activities</ThemedText>
			<View style={styles.list}>
				<Link href="/activities/running" style={styles.item}>Running</Link>
				<Link href="/activities/long-jump" style={styles.item}>Long Jump</Link>
				<Link href="/activities/sit-ups" style={styles.item}>Sit-ups</Link>
				<Link href="/activities/push-ups" style={styles.item}>Push-ups</Link>
				<Link href="/activities/high-jump" style={styles.item}>High Jump</Link>
				<Link href="/activities/shuttle-run" style={styles.item}>Shuttle Run</Link>
				<Link href="/activities/endurance-run" style={styles.item}>Endurance Run</Link>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 16,
	},
	list: {
		gap: 12,
	},
	item: {
		fontSize: 16,
	},
});


