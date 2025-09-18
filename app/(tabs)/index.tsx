import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { mockLeaderboard } from '@/src/lib/data';
import { PlaceHolderImages } from '@/src/lib/placeholder-images';
import type { ActivityType } from '@/src/lib/types';
// type import intentionally removed; paths below are cast for compatibility
import { router } from 'expo-router';
const activities: { name: ActivityType; href: string; description: string; imageId: string }[] = [
	{ name: 'Running', href: '/activities/running', description: 'Track your pace and distance.', imageId: 'running-card' },
	{ name: 'Long Jump', href: '/activities/long-jump', description: 'Measure your explosive power.', imageId: 'long-jump-card' },
	{ name: 'Sit-ups', href: '/activities/sit-ups', description: 'Count your reps and check form.', imageId: 'sit-ups-card' },
	{ name: 'Push-ups', href: '/activities/push-ups', description: 'Build upper body strength.', imageId: 'push-ups-card' },
	{ name: 'High Jump', href: '/activities/high-jump', description: 'Test your vertical leap.', imageId: 'high-jump-card' },
];

export default function HomeScreen() {
	const topRunning = mockLeaderboard['Running'].slice(0, 5);

	return (
		<ScrollView contentContainerStyle={styles.container}>
    <ThemedView style={styles.section}>
				<ThemedText type="title">Welcome back, Athlete!</ThemedText>
				<ThemedText type="default">Here’s your performance overview. Ready to set a new record?</ThemedText>
			</ThemedView>

			{/* Stat Cards */}
			<View style={styles.cardsRow}>
				<StatCard title="Total Activities" value="12" subtitle="+2 this month" />
				<StatCard title="Calories Burned" value="5,231" subtitle="+180.1 since last week" />
				<StatCard title="Stamina Level" value="88%" subtitle="Trending up" />
			</View>

			{/* Activities */}
			<ThemedView style={styles.section}>
				<ThemedText type="subtitle">Start a New Activity</ThemedText>
				<View style={styles.activityGrid}>
					{activities.map((a) => (
						<ActivityCard key={a.name} name={a.name} description={a.description} imageId={a.imageId} />
					))}
				</View>
			</ThemedView>

			{/* Social Proof */}
			<View style={styles.cardsRow}>
				<StatCard title="Satisfied Customers" value="10K+" subtitle="Join our happy community" />
				<StatCard title="Valued Clients" value="500+" subtitle="Trusted by organizations" />
			</View>

			{/* Top Performers (simple list) */}
			<ThemedView style={styles.section}>
				<ThemedText type="subtitle">Top Performers · Running</ThemedText>
				{topRunning.map((entry) => (
					<View key={entry.user.id} style={styles.leaderRow}>
						<View style={styles.leaderLeft}>
							<Image source={{ uri: entry.user.avatarUrl }} style={styles.avatar} contentFit="cover" />
							<View>
								<ThemedText type="defaultSemiBold">{entry.user.fullName}</ThemedText>
								<ThemedText type="default">
									{entry.user.state}{entry.user.village ? `, ${entry.user.village}` : ''}
								</ThemedText>
							</View>
						</View>
						<ThemedText type="defaultSemiBold">
							{entry.score}
							<ThemedText> {entry.metric}</ThemedText>
						</ThemedText>
					</View>
				))}
			</ThemedView>
		</ScrollView>
	);
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
	return (
		<ThemedView style={styles.card}>
			<ThemedText type="default" style={styles.cardTitle}>{title}</ThemedText>
			<ThemedText type="title" style={styles.cardValue}>{value}</ThemedText>
			<ThemedText type="default" style={styles.cardSubtitle}>{subtitle}</ThemedText>
		</ThemedView>
	);
}



function ActivityCard({ name, description, imageId }: { name: ActivityType; description: string; imageId: string }) {
	const placeholder = PlaceHolderImages.find((p) => p.id === imageId);
	return (
    <Pressable style={styles.activityCard} onPress={() => {
            const map: Record<ActivityType, string> = {
                'Running': '/activities/running',
                'Long Jump': '/activities/long-jump',
                'Sit-ups': '/activities/sit-ups',
                'Push-ups': '/activities/push-ups',
                'High Jump': '/activities/high-jump',
            };
            router.push(map[name] as any);
        }}>
			{placeholder?.imageUrl ? (
				<Image source={{ uri: placeholder.imageUrl }} style={styles.activityImage} contentFit="cover" />
			) : null}
			<View style={styles.activityBody}>
				<ThemedText type="defaultSemiBold">{name}</ThemedText>
				<ThemedText type="default" numberOfLines={2}>{description}</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 16,
	},
	section: {
		gap: 8,
	},
	cardsRow: {
		flexDirection: 'row',
		gap: 12,
		flexWrap: 'wrap',
	},
	card: {
		flexGrow: 1,
		minWidth: '30%',
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(127,127,127,0.08)',
		gap: 6,
	},
	cardTitle: {
		opacity: 0.8,
	},
	cardValue: {
		marginTop: 2,
	},
	cardSubtitle: {
		opacity: 0.7,
	},
	activityGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	activityCard: {
		width: '48%',
		borderRadius: 12,
		overflow: 'hidden',
		backgroundColor: 'rgba(127,127,127,0.08)',
	},
	activityImage: {
		width: '100%',
		height: 100,
	},
	activityBody: {
		padding: 10,
		gap: 4,
	},
	leaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(127,127,127,0.25)',
	},
	leaderLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#ccc',
	},
});
