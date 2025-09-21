import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pressable, StyleSheet, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Sidebar.Provider>
        <Stack>
          {/* bottom tab screens */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="activities" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
          <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />

          {/* login / signup as standalone stack screens */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />

          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

        {/* sidebar */}
        <Sidebar.Content>
          <View style={styles.sidebarHeader}>
            <View style={styles.logoContainer}>
              <IconSymbol size={24} name="figure.strengthtraining.traditional" color="#3B82F6" />
              <ThemedText type="title" style={styles.logoText}>BodyMetrics</ThemedText>
            </View>
          </View>
          <SidebarLinks />
        </Sidebar.Content>

        <StatusBar style="auto" />
      </Sidebar.Provider>
    </ThemeProvider>
  );
}

function SidebarLinks() {
  const { close } = useSidebar();
  return (
    <View style={styles.navigationList}>
      <Pressable style={styles.navItem} onPress={() => { router.push('/(tabs)'); close(); }}>
        <IconSymbol size={20} name="house.fill" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Dashboard</ThemedText>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => { router.push('/(tabs)/activities'); close(); }}>
        <IconSymbol size={20} name="flame.fill" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Activities</ThemedText>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => { router.push('/leaderboard'); close(); }}>
        <IconSymbol size={20} name="trophy.fill" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Leaderboard</ThemedText>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => { router.push('/profile'); close(); }}>
        <IconSymbol size={20} name="person.crop.circle" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Profile</ThemedText>
      </Pressable>
      {/* ✅ keep login & signup in sidebar only */}
      <Pressable style={styles.navItem} onPress={() => { router.push('/signup'); close(); }}>
        <IconSymbol size={20} name="person.crop.circle.badge.plus" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Sign Up</ThemedText>
      </Pressable>
      <Pressable style={styles.navItem} onPress={() => { router.push('/login'); close(); }}>
        <IconSymbol size={20} name="arrow.right.square.fill" color="#9CA3AF" />
        <ThemedText type="defaultSemiBold" style={styles.navText}>Login</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarHeader: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationList: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
