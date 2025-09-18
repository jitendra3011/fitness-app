import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

function formatTime(totalSeconds: number) {
	const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
	const secs = (totalSeconds % 60).toString().padStart(2, '0');
	return `${mins}:${secs}`;
}

export default function RunningScreen() {
	const [phase, setPhase] = useState<'scan' | 'countdown' | 'active' | 'finished'>('scan');
	const [countdown, setCountdown] = useState(3);
	const [time, setTime] = useState(0);
	const [distance, setDistance] = useState(0);
	const [stamina, setStamina] = useState(100);

	const startBodyScan = () => {
		Alert.alert(
			'Body Scan', 
			'Body scan simulation completed! Ready to start running?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Continue', onPress: () => setPhase('countdown') }
			]
		);
	};

	useEffect(() => {
		if (phase === 'countdown') {
			if (countdown > 0) {
				const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
				return () => clearTimeout(t);
			} else {
				setPhase('active');
			}
		}
	}, [phase, countdown]);

	useEffect(() => {
		if (phase !== 'active') return;
		const id = setInterval(() => {
			setTime((t) => t + 1);
			setDistance((d) => d + 0.003);
			setStamina((s) => Math.max(0, s - 0.2));
		}, 1000);
		return () => clearInterval(id);
	}, [phase]);

	if (phase === 'scan') {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.scanBox}>
					<ThemedText type="subtitle">Prepare for Running</ThemedText>
					<ThemedText type="default">Begin with an AI-powered body scan to check your readiness.</ThemedText>
					<Pressable style={styles.primaryBtn} onPress={startBodyScan}>
						<ThemedText type="defaultSemiBold">Start with Body Scan</ThemedText>
					</Pressable>
				</View>
			</ThemedView>
		);
	}

	if (phase === 'countdown') {
		return (
			<ThemedView style={[styles.container, styles.center]}>
				<ThemedText type="default">Get Ready...</ThemedText>
				<ThemedText type="title">{countdown}</ThemedText>
			</ThemedView>
		);
	}

	if (phase === 'finished') {
		const pace = distance > 0 ? ((time / 60) / distance).toFixed(2) : '0.00';
		return (
			<ThemedView style={styles.container}>
				<ThemedText type="title">Run Complete!</ThemedText>
				<View style={styles.row}>
					<ThemedText type="defaultSemiBold">Time: {formatTime(time)}</ThemedText>
					<ThemedText type="defaultSemiBold">Distance: {distance.toFixed(2)} km</ThemedText>
					<ThemedText type="defaultSemiBold">Avg Pace: {pace} min/km</ThemedText>
				</View>
				<Pressable style={styles.primaryBtn} onPress={() => { setPhase('scan'); setTime(0); setDistance(0); setStamina(100); }}>
					<ThemedText type="defaultSemiBold">Start New Run</ThemedText>
				</Pressable>
			</ThemedView>
		);
	}

	const pace = distance > 0 ? ((time / 60) / distance).toFixed(2) : '0.00';

	return (
		<ThemedView style={styles.container}>
			<View style={styles.row}>
				<ThemedText type="defaultSemiBold">Time: {formatTime(time)}</ThemedText>
				<ThemedText type="defaultSemiBold">Distance: {distance.toFixed(2)} km</ThemedText>
				<ThemedText type="defaultSemiBold">Current Pace: {pace} min/km</ThemedText>
			</View>
			<View style={styles.staminaBox}>
				<ThemedText type="default">Stamina: {stamina.toFixed(0)}%</ThemedText>
			</View>
			<Pressable style={[styles.primaryBtn, { backgroundColor: '#ef4444' }]} onPress={() => setPhase('finished')}>
				<ThemedText type="defaultSemiBold">End Run</ThemedText>
			</Pressable>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 12,
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	row: {
		gap: 8,
	},
	scanBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: 'rgba(127,127,127,0.3)',
		borderStyle: 'dashed',
		backgroundColor: 'rgba(127,127,127,0.08)',
		padding: 16,
	},
	staminaBox: {
		padding: 12,
		borderRadius: 8,
		backgroundColor: 'rgba(127,127,127,0.08)',
	},
	primaryBtn: {
		marginTop: 8,
		alignSelf: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: '#3B82F6',
	},
});


