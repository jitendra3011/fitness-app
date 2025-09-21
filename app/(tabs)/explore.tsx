import { Image, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#f0f0f0', dark: '#1a1a1a' }}
      headerImage={
        <Image
          source={require('../../assets/images/workout1.jpeg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 20 }}>
          Your Fitness Journey
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Discover comprehensive fitness guidance, nutrition tips, and progress tracking tools.
        </ThemedText>

        <View style={{ marginTop: 10 }}>
          <Collapsible title="Workout Plans & Exercises">
            <Image
              source={require('../../assets/images/workout2.png')}
              style={styles.sectionImage}
            />
            <ThemedText>
              Discover personalized workout routines for strength, cardio, and flexibility training.
            </ThemedText>
          </Collapsible>
        </View>

        <View style={{ marginTop: 10 }}>
          <Collapsible title="Nutrition & Recovery">
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
    marginTop: 40,
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