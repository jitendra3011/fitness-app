import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type HeaderProps = {
	title?: string;
	left?: React.ReactNode;
	right?: React.ReactNode;
};

export default function Header({ title, left, right }: HeaderProps) {
	return (
		<View style={styles.container}>
			<View style={styles.side}>{left}</View>
			<View style={styles.center}>
				{title ? <ThemedText type="title">{title}</ThemedText> : null}
			</View>
			<View style={styles.side}>{right}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 56,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		gap: 8,
	},
	side: {
		minWidth: 56,
		alignItems: 'flex-start',
	},
	center: {
		flex: 1,
		alignItems: 'center',
	},
});


