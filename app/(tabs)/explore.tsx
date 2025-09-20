import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('../../assets/images/workout1.jpeg')}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Explore Your Fitness Journey
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover workouts, tips, and motivation to reach your goals.
        </ThemedText>

        {/* ✅ Place your new images & collapsible sections here */}
        <View style={{ marginTop: 10 }}>
          <Collapsible title="Workout Routines">
            <Image
              source={require('../../assets/images/workout2.png')}
              style={styles.sectionImage}
            />
            <ThemedText>
              Our curated routines include strength training, cardio, and flexibility exercises for all levels.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={{ marginTop: 10 }}>
          <Collapsible title="Nutrition Tips">
            <Image
              source={require('../../assets/images/nuitrition2.png')}
              style={styles.sectionImage}
            />
            <ThemedText>
              Fuel your body with the right nutrients. Learn about balanced meals and recovery tips.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={{ marginTop: 10 }}>
          <Collapsible title="Track Your Progress">
            <Image
              source={require('../../assets/images/progress3.png')}
              style={styles.sectionImage}
            />
            <ThemedText>
              Monitor strength, endurance, and flexibility. Set goals, log workouts, and celebrate milestones.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={{ marginTop: 10 }}>
          <Collapsible title="Community & Motivation">
            <Image
              source={require('../../assets/images/community.jpeg')}
              style={styles.sectionImage}
            />
            <ThemedText>
              Join a community of fitness enthusiasts. Share milestones, get inspired, and encourage others.
            </ThemedText>
          </Collapsible>
        </View>

        <ThemedText style={styles.footer}>
          🌟 Commit to your growth, focus on your journey, and unlock your true potential. 💪
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 12,
    color: '#555',
  },
  footer: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40, // darker, professional color
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  sectionImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: 'cover',
  },
});









// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { ExternalLink } from '@/components/external-link';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Collapsible } from '@/components/ui/collapsible';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Fonts } from '@/constants/theme';

// export default function TabTwoScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
//       headerImage={
//         <IconSymbol
//           size={310}
//           color="#808080"
//           name="chevron.left.forwardslash.chevron.right"
//           style={styles.headerImage}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText
//           type="title"
//           style={{
//             fontFamily: Fonts.rounded,
//           }}>
//           Explore
//         </ThemedText>
//       </ThemedView>
//       <ThemedText>This app includes example code to help you get started.</ThemedText>
//       <Collapsible title="File-based routing">
//         <ThemedText>
//           This app has two screens:{' '}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
//           <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
//         </ThemedText>
//         <ThemedText>
//           The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
//           sets up the tab navigator.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/router/introduction">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Android, iOS, and web support">
//         <ThemedText>
//           You can open this project on Android, iOS, and the web. To open the web version, press{' '}
//           <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
//         </ThemedText>
//       </Collapsible>
//       <Collapsible title="Images">
//         <ThemedText>
//           For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
//           <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
//           different screen densities
//         </ThemedText>
//         <Image
//           source={require('@/assets/images/react-logo.png')}
//           style={{ width: 100, height: 100, alignSelf: 'center' }}
//         />
//         <ExternalLink href="https://reactnative.dev/docs/images">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Light and dark mode components">
//         <ThemedText>
//           This template has light and dark mode support. The{' '}
//           <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
//           what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Animations">
//         <ThemedText>
//           This template includes an example of an animated component. The{' '}
//           <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
//           the powerful{' '}
//           <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
//             react-native-reanimated
//           </ThemedText>{' '}
//           library to create a waving hand animation.
//         </ThemedText>
//         {Platform.select({
//           ios: (
//             <ThemedText>
//               The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
//               component provides a parallax effect for the header image.
//             </ThemedText>
//           ),
//         })}
//       </Collapsible>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });








// import React, { useState } from 'react';

// const Collapsible = ({ title, children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const ChevronDown = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-500 transition-transform duration-300">
//       <path d="M6 9l6 6 6-6" />
//     </svg>
//   );

//   const ChevronUp = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-500 transition-transform duration-300">
//       <path d="M18 15l-6-6-6 6" />
//     </svg>
//   );

//   return (
//     <div className="border border-gray-200 rounded-3xl p-5 my-5 shadow-lg bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 hover:shadow-2xl transition-all duration-300">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center w-full text-lg font-bold text-gray-800 focus:outline-none"
//       >
//         {title}
//         <span className={`${isOpen ? 'transform rotate-180' : ''}`}>
//           {isOpen ? <ChevronUp /> : <ChevronDown />}
//         </span>
//       </button>
//       <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
//         <div className="pt-3 text-gray-700 border-t border-gray-300 mt-3 space-y-2">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const heroImageUrl = "https://images.unsplash.com/photo-1549060292-62a2652b047a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1080&fit=crop";
//   const reactLogoUrl = "https://cdn.iconscout.com/icon/free/png-512/react-1-282599.png";

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-100 font-sans antialiased text-gray-800">
//       <div className="relative">
//         {/* Hero Section */}
//         <div
//           className="w-full h-96 bg-cover bg-center relative overflow-hidden rounded-b-3xl shadow-xl"
//           style={{ backgroundImage: `url(${heroImageUrl})` }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
//           <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
//             <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-2xl">
//               Explore Your Fitness Journey
//             </h1>
//             <p className="mt-4 text-xl sm:text-2xl font-medium drop-shadow-lg">
//               Discover workouts, tips, and motivation to reach your goals.
//             </p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
//           <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-200">
//             <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto text-center leading-relaxed">
//               Welcome to your personalized fitness hub! Explore workouts, learn healthy habits, and track your progress.
//               Each section below will guide you through tips, tools, and inspiration to help you stay motivated and consistent.
//             </p>

//             <Collapsible title="Workout Routines">
//               <p>
//                 Our curated routines include strength training, cardio, and flexibility exercises for all levels. Find the plan that fits your lifestyle and start today.
//               </p>
//               <p>
//                 Consistency is key! Even 20 minutes a day can create long-term results.
//               </p>
//             </Collapsible>

//             <Collapsible title="Nutrition Tips">
//               <p>
//                 Fuel your body with the right nutrients. Learn about balanced meals, pre-workout snacks, and post-workout recovery meals to boost your performance.
//               </p>
//               <p>
//                 Stay hydrated and enjoy delicious, healthy recipes designed to energize your day.
//               </p>
//             </Collapsible>

//             <Collapsible title="Track Your Progress">
//               <p>
//                 Monitor your strength, endurance, and flexibility. Set achievable goals, log your workouts, and celebrate small victories along the way.
//               </p>
//               <p>
//                 Progress tracking keeps you motivated and helps you adapt your routine for maximum results.
//               </p>
//             </Collapsible>

//             <Collapsible title="Community & Motivation">
//               <p>
//                 Join a vibrant community of fitness enthusiasts. Share your milestones, get inspired by others, and never miss a chance to encourage someone else.
//               </p>
//               <p>
//                 Motivation is contagious! Stay accountable with friends and fellow fitness explorers.
//               </p>
//             </Collapsible>

//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="container mx-auto p-6 text-center text-gray-600 mt-16">
//           <p>
//             Designed with ❤️ by Fitness Explorers using React and Tailwind CSS.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default App;
