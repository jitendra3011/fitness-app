import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { ActivityType } from '@/src/lib/types';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View, Modal, Text } from 'react-native';

interface FitnessEntry {
	id: string;
	user: {
		id: string;
		fullName: string;
		avatarUrl: string;
		state: string;
		village?: string;
		age: number;
		weight: number;
	};
	score: number;
	metric: string;
	performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
	caloriesBurned: number;
	workoutDuration: number;
}

const fitnessNames = [
	'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vikram Reddy',
	'Kavya Nair', 'Arjun Gupta', 'Riya Joshi', 'Deepak Mehta', 'Ananya Roy',
	'Karan Shah', 'Maya Iyer', 'Rohit Verma', 'Neha Kapoor', 'Siddharth Rao',
	'Pooja Agarwal', 'Rahul Pandey', 'Shreya Malhotra', 'Varun Khanna', 'Divya Sinha'
];

const indianStates = [
	'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan',
	'Uttar Pradesh', 'West Bengal', 'Kerala', 'Punjab', 'Haryana',
	'Delhi', 'Madhya Pradesh', 'Andhra Pradesh', 'Telangana', 'Bihar'
];

const villages = [
	'Andheri', 'Koramangala', 'T Nagar', 'Bandra', 'Whitefield',
	'Jayanagar', 'Powai', 'Electronic City', 'Indiranagar', 'Malad',
	'HSR Layout', 'Vashi', 'Gachibowli', 'Sector 18', 'Cyber City'
];

function generateScore(activity: ActivityType): { score: number; metric: string; calories: number; duration: number } {
	switch (activity) {
		case 'Running':
			return {
				score: Math.floor(Math.random() * 15) + 5,
				metric: 'km',
				calories: Math.floor(Math.random() * 400) + 200,
				duration: Math.floor(Math.random() * 60) + 30
			};
		case 'Push-ups':
			return {
				score: Math.floor(Math.random() * 80) + 20,
				metric: 'reps',
				calories: Math.floor(Math.random() * 150) + 50,
				duration: Math.floor(Math.random() * 20) + 10
			};
		case 'Sit-ups':
			return {
				score: Math.floor(Math.random() * 100) + 30,
				metric: 'reps',
				calories: Math.floor(Math.random() * 120) + 40,
				duration: Math.floor(Math.random() * 25) + 15
			};
		case 'High Jump':
			return {
				score: Math.floor(Math.random() * 80) + 120,
				metric: 'cm',
				calories: Math.floor(Math.random() * 100) + 50,
				duration: Math.floor(Math.random() * 15) + 5
			};
		case 'Long Jump':
			return {
				score: Math.floor(Math.random() * 200) + 300,
				metric: 'cm',
				calories: Math.floor(Math.random() * 120) + 60,
				duration: Math.floor(Math.random() * 20) + 10
			};
		case 'Shuttle Run':
			return {
				score: Math.floor(Math.random() * 6) + 4, 
				metric: 'laps',
				calories: Math.floor(Math.random() * 200) + 100, 
				duration: Math.floor(Math.random() * 15) + 5 
			};
		case 'Endurance Run':
			return {
				score: Math.floor(Math.random() * 2000) + 1000, 
				metric: 'm',
				calories: Math.floor(Math.random() * 500) + 200,
				duration: Math.floor(Math.random() * 60) + 20 
			};
		default:
			return { score: 0, metric: 'pts', calories: 0, duration: 0 };
	}
}

function getPerformanceLevel(score: number, activity: ActivityType): 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite' {
	const thresholds = {
		'Running': { beginner: 7, intermediate: 12, advanced: 17 },
		'Push-ups': { beginner: 30, intermediate: 60, advanced: 90 },
		'Sit-ups': { beginner: 40, intermediate: 80, advanced: 120 },
		'High Jump': { beginner: 130, intermediate: 160, advanced: 190 },
		'Long Jump': { beginner: 350, intermediate: 450, advanced: 550 },
		'Shuttle Run': { beginner: 4, intermediate: 6, advanced: 8 },
		'Endurance Run': { beginner: 1000, intermediate: 2000, advanced: 3000 },
	};

	const threshold = thresholds[activity as keyof typeof thresholds] || thresholds['Running'];
	if (score >= threshold.advanced) return 'Elite';
	if (score >= threshold.intermediate) return 'Advanced';
	if (score >= threshold.beginner) return 'Intermediate';
	return 'Beginner';
}

function generateMockData(): Record<ActivityType, FitnessEntry[]> {
	const activities: ActivityType[] = ['Running', 'Push-ups', 'Sit-ups', 'High Jump', 'Long Jump', 'Shuttle Run', 'Endurance Run'];
	const data: Record<ActivityType, FitnessEntry[]> = {} as any;

	activities.forEach(activity => {
		data[activity] = fitnessNames.map((name, index) => {
			const scoreData = generateScore(activity);
			return {
				id: `${activity}-${index}`,
				user: {
					id: `user-${index}`,
					fullName: name,
					avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,
					state: indianStates[Math.floor(Math.random() * indianStates.length)],
					village: villages[Math.floor(Math.random() * villages.length)],
					age: Math.floor(Math.random() * 30) + 18,
					weight: Math.floor(Math.random() * 40) + 50
				},
				score: scoreData.score,
				metric: scoreData.metric,
				performanceLevel: getPerformanceLevel(scoreData.score, activity),
				caloriesBurned: scoreData.calories,
				workoutDuration: scoreData.duration
			};
		}).sort((a, b) => b.score - a.score);
	});

	return data;
}

const mockFitnessData = generateMockData();

export default function LeaderboardScreen() {
	const activities = Object.keys(mockFitnessData) as ActivityType[];
	const [activity, setActivity] = useState<ActivityType>(activities[0] ?? 'Running');
	const [refreshKey, setRefreshKey] = useState(0);
	const [selectedAthlete, setSelectedAthlete] = useState<FitnessEntry | null>(null);
	const allEntries = useMemo(() => {
		const data = generateMockData();
		return data[activity] ?? [];
	}, [activity, refreshKey]);

	const locations = useMemo(() => {
		const vals = new Set<string>();
		allEntries.forEach((e) => {
			const loc = [e.user.state, e.user.village].filter(Boolean).join(', ');
			if (loc) vals.add(loc);
		});
		return ['All', ...Array.from(vals)];
	}, [allEntries]);

	const [location, setLocation] = useState<string>('All');
	const filtered = useMemo(() => {
		if (location === 'All') return allEntries;
		return allEntries.filter((e) => {
			const loc = [e.user.state, e.user.village].filter(Boolean).join(', ');
			return loc === location;
		});
	}, [allEntries, location]);

	return (
		<ThemedView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.headerBlock}>
					<ThemedText type="title" style={styles.title}>🏆 Fitness Leaderboard</ThemedText>
					<ThemedText type="default" style={styles.headerSubtext}>
						Compete with athletes nationwide. Track performance and climb the rankings!
					</ThemedText>
					<View style={styles.statsRow}>
						<View style={styles.statCard}>
							<ThemedText style={styles.statNumber}>{filtered.length}</ThemedText>
							<ThemedText style={styles.statLabel}>Athletes</ThemedText>
						</View>
						<View style={styles.statCard}>
							<ThemedText style={styles.statNumber}>{Math.round(filtered.reduce((sum, e) => sum + e.caloriesBurned, 0) / filtered.length)}</ThemedText>
							<ThemedText style={styles.statLabel}>Avg Calories</ThemedText>
						</View>
						<View style={styles.statCard}>
							<ThemedText style={styles.statNumber}>{Math.round(filtered.reduce((sum, e) => sum + e.workoutDuration, 0) / filtered.length)}</ThemedText>
							<ThemedText style={styles.statLabel}>Avg Duration</ThemedText>
						</View>
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.cardHeader}>
						<ThemedText type="defaultSemiBold" style={styles.cardTitle}>🥇 Top Performers</ThemedText>
						<View style={styles.activityBadge}>
							<ThemedText style={styles.activityBadgeText}>{activity}</ThemedText>
						</View>
					</View>
					<View style={styles.filtersRow}>
						<View style={styles.filterGroup}>
							<ThemedText style={styles.filterLabel}>Activity</ThemedText>
							<Dropdown
								value={activity}
								options={activities}
								onChange={(v) => setActivity(v as ActivityType)}
							/>
						</View>
						<View style={styles.filterGroup}>
							<ThemedText style={styles.filterLabel}>Location</ThemedText>
							<Dropdown
								value={location}
								options={locations}
								onChange={setLocation}
							/>
						</View>
						<Pressable style={styles.actionBtn} onPress={() => {
							setRefreshKey(prev => prev + 1);
							Alert.alert('Summary Generated!', `New results for ${activity} activity have been generated with updated rankings and scores.`);
						}}>
							<ThemedText type="defaultSemiBold" style={styles.actionBtnText}>Generate Summary</ThemedText>
						</Pressable>
					</View>

					<View style={styles.listHeader}>
						<ThemedText style={styles.rankColHeader}>Rank</ThemedText>
						<ThemedText style={styles.athleteColHeader}>Athlete</ThemedText>
						<ThemedText style={styles.scoreColHeader}>Performance</ThemedText>
					</View>

					{filtered.map((entry, idx) => (
						<Row key={entry.user.id} index={idx} entry={entry} onPress={() => setSelectedAthlete(entry)} />
					))}
				</View>

				<AthleteModal
					visible={!!selectedAthlete}
					athlete={selectedAthlete}
					activity={activity}
					onClose={() => setSelectedAthlete(null)}
				/>
			</ScrollView>
		</ThemedView>
	);
}

function Row({ index, entry, onPress }: { index: number; entry: FitnessEntry; onPress: () => void }) {
	const rank = index + 1;
	const locationText = [entry.user.state, entry.user.village].filter(Boolean).join(', ');
	const getMedalEmoji = (rank: number) => {
		switch (rank) {
			case 1: return '🥇';
			case 2: return '🥈';
			case 3: return '🥉';
			default: return rank.toString();
		}
	};

	const getPerformanceColor = (level: string) => {
		switch (level) {
			case 'Elite': return '#FFD700';
			case 'Advanced': return '#FF6B35';
			case 'Intermediate': return '#4ECDC4';
			default: return '#95A5A6';
		}
	};

	return (
		<Pressable style={[styles.row, rank <= 3 && styles.topRow]} onPress={onPress}>
			<View style={styles.rankCol}>
				<View style={[styles.rankBadge, rank <= 3 && styles.topRankBadge]}>
					<ThemedText style={styles.rankText}>{getMedalEmoji(rank)}</ThemedText>
				</View>
			</View>
			<View style={styles.athleteCol}>
				<Image source={{ uri: entry.user.avatarUrl }} style={styles.avatar} contentFit="cover" />
				<View style={styles.athleteInfo}>
					<ThemedText type="defaultSemiBold" style={styles.athleteName}>{entry.user.fullName}</ThemedText>
					<ThemedText style={styles.locationText}>{locationText}</ThemedText>
					<View style={styles.athleteStats}>
						<ThemedText style={styles.statText}>Age: {entry.user.age}</ThemedText>
						<ThemedText style={styles.statText}>•</ThemedText>
						<ThemedText style={styles.statText}>{entry.caloriesBurned} cal</ThemedText>
					</View>
				</View>
			</View>
			<View style={styles.scoreCol}>
				<ThemedText type="defaultSemiBold" style={styles.scoreValue}>
					{entry.score} {entry.metric}
				</ThemedText>
				<View style={[styles.performanceBadge, { backgroundColor: getPerformanceColor(entry.performanceLevel) }]}>
					<ThemedText style={styles.performanceText}>{entry.performanceLevel}</ThemedText>
				</View>
				<ThemedText style={styles.durationText}>{entry.workoutDuration}min</ThemedText>
			</View>
		</Pressable>
	);
}

function AthleteModal({ visible, athlete, activity, onClose }: {
	visible: boolean;
	athlete: FitnessEntry | null;
	activity: ActivityType;
	onClose: () => void;
}) {
	if (!athlete) return null;

	return (
		<Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
			<View style={styles.modalContainer}>
				<ScrollView contentContainerStyle={styles.modalContent}>
					<Pressable style={styles.closeBtn} onPress={onClose}>
						<Text style={styles.closeBtnText}>✕</Text>
					</Pressable>

					<View style={styles.profileSection}>
						<Image source={{ uri: athlete.user.avatarUrl }} style={styles.profileAvatar} contentFit="cover" />
						<ThemedText type="title" style={styles.profileName}>{athlete.user.fullName}</ThemedText>
						<ThemedText style={styles.locationText}>📍 {athlete.user.state}, {athlete.user.village}</ThemedText>
					</View>

					<View style={styles.statsGrid}>
						<View style={styles.statBox}>
							<ThemedText style={styles.statValue}>{athlete.user.age}</ThemedText>
							<ThemedText style={styles.statLabel}>Age</ThemedText>
						</View>
						<View style={styles.statBox}>
							<ThemedText style={styles.statValue}>{athlete.score} {athlete.metric}</ThemedText>
							<ThemedText style={styles.statLabel}>{activity} Score</ThemedText>
						</View>
						<View style={styles.statBox}>
							<ThemedText style={styles.statValue}>{athlete.caloriesBurned}</ThemedText>
							<ThemedText style={styles.statLabel}>Calories Burned</ThemedText>
						</View>
						<View style={styles.statBox}>
							<ThemedText style={styles.statValue}>{athlete.workoutDuration}min</ThemedText>
							<ThemedText style={styles.statLabel}>Duration</ThemedText>
						</View>
					</View>

					<View style={styles.performanceCard}>
						<ThemedText type="subtitle" style={styles.cardTitle}>🏆 Performance Level</ThemedText>
						<View style={[styles.levelBadge, { backgroundColor: athlete.performanceLevel === 'Elite' ? '#FFD700' : '#4ECDC4' }]}>
							<ThemedText style={styles.levelText}>{athlete.performanceLevel}</ThemedText>
						</View>
					</View>

					<View style={styles.ctaSection}>
						<ThemedText style={styles.ctaTitle}>💪 Ready to Beat This Score?</ThemedText>
						<ThemedText style={styles.ctaSubtitle}>Join thousands of athletes and start your fitness journey today!</ThemedText>
						<Pressable style={styles.ctaButton}>
							<ThemedText style={styles.ctaButtonText}>🚀 Start My Journey</ThemedText>
						</Pressable>
					</View>
				</ScrollView>
			</View>
		</Modal>
	);
}

function Dropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
	const [open, setOpen] = useState(false);
	return (
		<View style={[styles.dropdownContainer, { zIndex: open ? 9999 : 1 }]}>
			<Pressable style={styles.select} onPress={() => setOpen((o) => !o)}>
				<ThemedText>{value}</ThemedText>
			</Pressable>
			{open ? (
				<View style={styles.dropdown}>
					{options.map((opt) => (
						<Pressable key={opt} style={styles.option} onPress={() => { onChange(opt); setOpen(false); }}>
							<ThemedText style={styles.optionText}>{opt}</ThemedText>
						</Pressable>
					))}
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		gap: 20,
		backgroundColor: '#F8FAFC',
	},
	headerBlock: {
		gap: 12,
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	title: {
		color: '#1E293B',
		fontSize: 28,
	},
	headerSubtext: {
		opacity: 0.7,
		fontSize: 16,
		lineHeight: 24,
	},
	statsRow: {
		flexDirection: 'row',
		gap: 16,
		marginTop: 8,
	},
	statCard: {
		flex: 1,
		padding: 16,
		backgroundColor: '#F1F5F9',
		borderRadius: 12,
		alignItems: 'center',
	},
	statNumber: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#3B82F6',
	},
	statLabel: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 4,
	},
	card: {
		gap: 16,
		padding: 20,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardTitle: {
		fontSize: 20,
		color: '#1E293B',
	},
	activityBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: '#3B82F6',
		borderRadius: 20,
	},
	activityBadgeText: {
		color: '#FFFFFF',
		fontSize: 12,
		fontWeight: 'bold',
	},
	filtersRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flexWrap: 'wrap',
		zIndex: 1,
	},
	filterGroup: {
		gap: 6,
		zIndex: 1,
	},
	filterLabel: {
		opacity: 0.8,
	},
	actionBtn: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: '#3B82F6',
		marginLeft: 'auto',
	},
	actionBtnText: {
		color: '#fff',
	},
	listHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 4,
		borderBottomWidth: 2,
		borderBottomColor: '#E2E8F0',
		marginBottom: 8,
		zIndex: -1,
	},
	rankColHeader: {
		width: 60,
		fontWeight: 'bold',
		color: '#64748B',
		fontSize: 14,
	},
	athleteColHeader: {
		flex: 1,
		fontWeight: 'bold',
		color: '#64748B',
		fontSize: 14,
	},
	scoreColHeader: {
		width: 100,
		fontWeight: 'bold',
		color: '#64748B',
		fontSize: 14,
		textAlign: 'center',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 4,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#E2E8F0',
		backgroundColor: '#FFFFFF',
	},
	topRow: {
		backgroundColor: '#FEF3C7',
		borderRadius: 8,
		marginVertical: 2,
	},
	rankCol: {
		width: 60,
		alignItems: 'center',
	},
	rankBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#E2E8F0',
		justifyContent: 'center',
		alignItems: 'center',
	},
	topRankBadge: {
		backgroundColor: '#FCD34D',
	},
	rankText: {
		fontWeight: 'bold',
		fontSize: 14,
	},
	athleteCol: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#ccc',
		borderWidth: 2,
		borderColor: '#E2E8F0',
	},
	athleteInfo: {
		flex: 1,
		gap: 4,
	},
	athleteName: {
		fontSize: 16,
		color: '#1E293B',
	},
	locationText: {
		fontSize: 12,
		color: '#64748B',
	},
	athleteStats: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
	},
	statText: {
		fontSize: 11,
		color: '#94A3B8',
	},
	scoreCol: {
		width: 100,
		alignItems: 'center',
		gap: 4,
	},
	scoreValue: {
		fontSize: 16,
		color: '#1E293B',
		textAlign: 'center',
	},
	performanceBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	performanceText: {
		fontSize: 10,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	durationText: {
		fontSize: 10,
		color: '#64748B',
	},
	dropdownContainer: {
		position: 'relative',
	},
	select: {
		height: 44,
		minWidth: 140,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#D1D5DB',
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},
	dropdown: {
		position: 'absolute',
		top: 46,
		left: 0,
		right: 0,
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#D1D5DB',
		overflow: 'hidden',
		zIndex: 9999,
		shadowColor: '#000',
		shadowOpacity: 0.15,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 9999,
		maxHeight: 200,
	},
	option: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#E5E7EB',
		backgroundColor: '#FFFFFF',
	},
	optionText: {
		color: '#374151',
		fontSize: 14,
		fontWeight: '500',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#F8FAFC',
	},
	modalContent: {
		padding: 20,
		gap: 20,
	},
	closeBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#E5E7EB',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
	},
	closeBtnText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#6B7280',
	},
	profileSection: {
		alignItems: 'center',
		gap: 12,
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
	},
	profileAvatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 4,
		borderColor: '#3B82F6',
	},
	profileName: {
		fontSize: 24,
		color: '#1E293B',
		textAlign: 'center',
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	statBox: {
		flex: 1,
		minWidth: '45%',
		padding: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		alignItems: 'center',
	},
	statValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#3B82F6',
	},
	performanceCard: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		alignItems: 'center',
		gap: 12,
	},
	levelBadge: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
	},
	levelText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	ctaSection: {
		padding: 24,
		backgroundColor: '#3B82F6',
		borderRadius: 16,
		alignItems: 'center',
		gap: 12,
	},
	ctaTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
		textAlign: 'center',
	},
	ctaSubtitle: {
		fontSize: 14,
		color: '#DBEAFE',
		textAlign: 'center',
	},
	ctaButton: {
		paddingHorizontal: 32,
		paddingVertical: 16,
		backgroundColor: '#FFFFFF',
		borderRadius: 25,
		marginTop: 8,
	},
	ctaButtonText: {
		color: '#3B82F6',
		fontWeight: 'bold',
		fontSize: 16,
	},
});


