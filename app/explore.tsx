import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function ExploreRedirect() {
	useEffect(() => {
		// Redirect Explore → Activities
		router.replace('/(tabs)/activities');
	}, []);

	return (
		<ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
			<ThemedText type="default">Redirecting to Activities…</ThemedText>
		</ThemedView>
	);
}


