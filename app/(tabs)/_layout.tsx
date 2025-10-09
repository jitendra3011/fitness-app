// import { Tabs, router } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Sidebar } from '@/components/ui/sidebar';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
// import { Pressable, View } from 'react-native';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: true,
//         headerLeft: ({ tintColor }) => (
//           <View style={{ paddingLeft: 12 }}>
//             <Sidebar.Trigger>
//               <IconSymbol size={20} name="line.3.horizontal" color={tintColor ?? Colors[colorScheme ?? 'light'].tint} />
//             </Sidebar.Trigger>
//           </View>
//         ),
//         headerRight: ({ tintColor }) => (
//           <View style={{ paddingRight: 12 }}>
//             <Pressable onPress={() => router.push('/admin/users' as any)}>
//               <IconSymbol size={20} name="person.crop.circle" color={tintColor ?? Colors[colorScheme ?? 'light'].tint} />
//             </Pressable>
//           </View>
//         ),
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           // tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
//           tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={20} name="paperplane.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <IconSymbol size={20} name="person.crop.circle" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="activities"
//         options={{
//           title: 'Activities',
//           tabBarIcon: ({ color }) => <IconSymbol size={20} name="run" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="leaderboard"
//         options={{
//           title: 'Leaderboard',
//           tabBarIcon: ({ color }) => <IconSymbol size={20} name="trophy.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs, router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Sidebar } from '@/components/ui/sidebar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); // get safe area insets

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerLeft: ({ tintColor }) => (
          <View style={{ paddingLeft: 12 }}>
            <Sidebar.Trigger>
              <IconSymbol
                size={20}
                name="menu"
                color={tintColor ?? Colors[colorScheme ?? 'light'].tint}
              />
            </Sidebar.Trigger>
          </View>
        ),
        headerRight: ({ tintColor }) => (
          <View style={{ paddingRight: 12 }}>
            <Pressable onPress={() => router.push('/profile')}>
              <IconSymbol
                size={20}
                name="profile"
                color={tintColor ?? Colors[colorScheme ?? 'light'].tint}
              />
            </Pressable>
          </View>
        ),
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 0.3,
          borderTopColor: '#ccc',
          height: 60 + insets.bottom, // add safe area bottom
          paddingBottom: 6 + insets.bottom, // add safe area bottom
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <IconSymbol size={20} name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: ({ color }) => <IconSymbol size={20} name="send" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <IconSymbol size={20} name="profile" color={color} /> }}
      />
      <Tabs.Screen
        name="activities"
        options={{ title: 'Activities', tabBarIcon: ({ color }) => <IconSymbol size={20} name="run" color={color} /> }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ title: 'Leaderboard', tabBarIcon: ({ color }) => <IconSymbol size={20} name="trophy" color={color} /> }}
      />
      <Tabs.Screen
        name="blogs"
        options={{ title: 'Blogs', tabBarIcon: ({ color }) => <IconSymbol size={20} name="blog" color={color} /> }}
      />
    </Tabs>
  );
}
