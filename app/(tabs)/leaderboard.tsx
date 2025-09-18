import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { mockLeaderboard } from '@/src/lib/data';
import type { ActivityType, LeaderboardEntry } from '@/src/lib/types';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function LeaderboardScreen() {
	const activities = Object.keys(mockLeaderboard) as ActivityType[];
	const [activity, setActivity] = useState<ActivityType>(activities[0] ?? 'Running');
	const allEntries = useMemo(() => mockLeaderboard[activity] ?? [], [activity]);

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
					<ThemedText type="title">Leaderboard</ThemedText>
					<ThemedText type="default" style={styles.headerSubtext}>
						See who is topping the charts. Filter by activity and location.
					</ThemedText>
				</View>

				<View style={styles.card}>
					<ThemedText type="defaultSemiBold" style={styles.cardTitle}>Top Performers</ThemedText>
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
						<Pressable style={styles.actionBtn} onPress={() => Alert.alert('Summary', 'Summary generated!')}>
							<ThemedText type="defaultSemiBold" style={styles.actionBtnText}>Generate Summary</ThemedText>
						</Pressable>
					</View>

					<View style={styles.listHeader}>
						<ThemedText style={styles.rankCol}>Rank</ThemedText>
						<ThemedText style={styles.athleteCol}>Athlete</ThemedText>
						<ThemedText>Score</ThemedText>
					</View>

					{filtered.map((entry, idx) => (
						<Row key={entry.user.id} index={idx} entry={entry} />
					))}
				</View>
			</ScrollView>
		</ThemedView>
	);
}

function Row({ index, entry }: { index: number; entry: LeaderboardEntry }) {
	const rank = index + 1;
	const locationText = [entry.user.state, entry.user.village].filter(Boolean).join(', ');
	return (
		<View style={styles.row}>
			<View style={styles.rankCol}><ThemedText>{rank}</ThemedText></View>
			<View style={styles.athleteCol}>
				<Image source={{ uri: entry.user.avatarUrl }} style={styles.avatar} contentFit="cover" />
				<View style={{ gap: 2 }}>
					<ThemedText type="defaultSemiBold">{entry.user.fullName}</ThemedText>
					{locationText ? <ThemedText style={{ opacity: 0.8 }}>{locationText}</ThemedText> : null}
				</View>
			</View>
			<ThemedText type="defaultSemiBold">
				{entry.score}
				<ThemedText> {entry.metric}</ThemedText>
			</ThemedText>
		</View>
	);
}

function Dropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
	const [open, setOpen] = useState(false);
	return (
		<View style={{ position: 'relative' }}>
			<Pressable style={styles.select} onPress={() => setOpen((o) => !o)}>
				<ThemedText>{value}</ThemedText>
			</Pressable>
			{open ? (
				<View style={styles.dropdown}>
					{options.map((opt) => (
						<Pressable key={opt} style={styles.option} onPress={() => { onChange(opt); setOpen(false); }}>
							<ThemedText>{opt}</ThemedText>
						</Pressable>
					))}
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 16,
	},
	headerBlock: {
		gap: 6,
	},
	headerSubtext: {
		opacity: 0.8,
	},
	card: {
		gap: 12,
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(127,127,127,0.08)',
	},
	cardTitle: {
		marginBottom: 2,
	},
	filtersRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flexWrap: 'wrap',
	},
	filterGroup: {
		gap: 6,
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
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 6,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(127,127,127,0.25)',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(127,127,127,0.25)',
	},
	rankCol: {
		width: 40,
	},
	athleteCol: {
		flex: 1,
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
	select: {
		height: 40,
		minWidth: 160,
		paddingHorizontal: 12,
		borderRadius: 8,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(127,127,127,0.35)',
		backgroundColor: 'rgba(127,127,127,0.08)',
		justifyContent: 'center',
	},
	dropdown: {
		position: 'absolute',
		top: 44,
		left: 0,
		right: 0,
		borderRadius: 8,
		backgroundColor: 'rgba(20,20,20,0.98)',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(127,127,127,0.35)',
		overflow: 'hidden',
		zIndex: 10,
	},
	option: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: 'rgba(127,127,127,0.15)',
	},
});


