import React, { useState } from 'react';
import { View, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet } from 'react-native';

interface TrainingVideo {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'youtube' | 'pexels' | 'dailymotion' | 'military';
}

interface TrainingCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  videos: TrainingVideo[];
}

const trainingCategories: TrainingCategory[] = [
  {
    id: 'running',
    name: 'Running',
    icon: 'figure.run',
    color: '#3B82F6',
    description: 'Master proper running form and sprinting techniques',
    videos: [
      {
        id: 'r1',
        title: 'How to Run Properly - Running Technique',
        url: 'https://www.youtube.com/watch?v=_kGESn8ArrU',
        duration: '8:45',
        description: 'Learn the fundamentals of proper running form and technique',
        difficulty: 'Beginner',
        type: 'youtube'
      },
      {
        id: 'r2',
        title: 'Sprinting Technique Tutorial',
        url: 'https://www.youtube.com/watch?v=wszfRYTWzs8',
        duration: '12:30',
        description: 'Advanced sprinting techniques for maximum speed',
        difficulty: 'Advanced',
        type: 'youtube'
      },
      {
        id: 'r3',
        title: 'Running on the Bridge',
        url: 'https://www.pexels.com/video/a-person-running-on-the-bridge-3195257/',
        duration: '0:15',
        description: 'Professional running demonstration outdoors',
        difficulty: 'Intermediate',
        type: 'pexels'
      },
      {
        id: 'r4',
        title: 'Hill Running Technique',
        url: 'https://www.pexels.com/video/a-man-running-on-the-hill-2749373/',
        duration: '0:20',
        description: 'Uphill running form and endurance training',
        difficulty: 'Advanced',
        type: 'pexels'
      },
      {
        id: 'r5',
        title: 'Running Form Slow Motion',
        url: 'https://www.youtube.com/watch?v=wCVSv7UxB2E',
        duration: '6:15',
        description: 'Detailed slow-motion analysis of running mechanics',
        difficulty: 'Intermediate',
        type: 'youtube'
      }
    ]
  },
  {
    id: 'shuttle',
    name: 'Shuttle Run',
    icon: 'arrow.left.arrow.right',
    color: '#10B981',
    description: 'Agility training and shuttle run test preparation',
    videos: [
      {
        id: 's1',
        title: 'Shuttle Run Fitness Test Demo',
        url: 'https://www.youtube.com/watch?v=LUULZKtrvUQ',
        duration: '5:20',
        description: 'Complete guide to the shuttle run fitness test',
        difficulty: 'Beginner',
        type: 'youtube'
      },
      {
        id: 's2',
        title: 'Beep (Pacer) Test',
        url: 'https://www.youtube.com/watch?v=yU4ZY6XQ5pY',
        duration: '3:45',
        description: 'Understanding and preparing for the beep test',
        difficulty: 'Intermediate',
        type: 'youtube'
      },
      {
        id: 's3',
        title: 'Shuttle Drill Explained',
        url: 'https://www.youtube.com/watch?v=WadZY2sRxIU',
        duration: '7:10',
        description: 'Step-by-step shuttle drill breakdown',
        difficulty: 'Beginner',
        type: 'youtube'
      },
      {
        id: 's4',
        title: 'Agility Drill Training',
        url: 'https://www.pexels.com/video/man-doing-agility-drill-4744576/',
        duration: '0:30',
        description: 'Professional agility training demonstration',
        difficulty: 'Advanced',
        type: 'pexels'
      },
      {
        id: 's5',
        title: 'Basketball Shuttle Drill',
        url: 'https://www.youtube.com/watch?v=luIayhHefJ4',
        duration: '4:55',
        description: 'Sport-specific shuttle drills for basketball',
        difficulty: 'Intermediate',
        type: 'youtube'
      }
    ]
  },
  {
    id: 'longjump',
    name: 'Long Jump',
    icon: 'figure.jumprope',
    color: '#F59E0B',
    description: 'Long jump technique and form improvement',
    videos: [
      {
        id: 'lj1',
        title: 'Long Jump - Technique',
        url: 'https://www.youtube.com/watch?v=uZWLPWEEr58',
        duration: '9:20',
        description: 'Complete long jump technique breakdown',
        difficulty: 'Intermediate',
        type: 'youtube'
      },
      {
        id: 'lj2',
        title: 'Slow Motion Long Jump',
        url: 'https://www.dailymotion.com/video/x2ujemr',
        duration: '2:15',
        description: 'Detailed slow-motion long jump analysis',
        difficulty: 'Advanced',
        type: 'dailymotion'
      },
      {
        id: 'lj3',
        title: 'Track Field Jump Training',
        url: 'https://www.pexels.com/video/a-woman-jumping-over-a-barrier-on-the-track-field-4668773/',
        duration: '0:25',
        description: 'Professional track and field jumping demonstration',
        difficulty: 'Advanced',
        type: 'pexels'
      },
      {
        id: 'lj4',
        title: 'Jump Training Technique',
        url: 'https://www.pexels.com/video/man-doing-a-jump-4744573/',
        duration: '0:18',
        description: 'Basic jumping form and technique',
        difficulty: 'Beginner',
        type: 'pexels'
      },
      {
        id: 'lj5',
        title: 'Standing Long Jump',
        url: 'https://www.youtube.com/watch?v=z8bVhbbGe1g',
        duration: '6:30',
        description: 'Standing long jump technique and training',
        difficulty: 'Beginner',
        type: 'youtube'
      }
    ]
  },
  {
    id: 'highjump',
    name: 'High Jump',
    icon: 'figure.highintensity.intervaltraining',
    color: '#8B5CF6',
    description: 'High jump form and technique mastery',
    videos: [
      {
        id: 'hj1',
        title: 'High Jump Breakdown',
        url: 'https://www.youtube.com/watch?v=megvjf-mVCQ',
        duration: '11:45',
        description: 'Complete high jump technique analysis',
        difficulty: 'Intermediate',
        type: 'youtube'
      },
      {
        id: 'hj2',
        title: 'Slow Motion High Jump',
        url: 'https://www.youtube.com/watch?v=lLScOYQyaNE',
        duration: '3:20',
        description: 'Detailed slow-motion high jump form',
        difficulty: 'Advanced',
        type: 'youtube'
      },
      {
        id: 'hj3',
        title: 'Athletics Field High Jump',
        url: 'https://www.pexels.com/video/a-man-doing-a-high-jump-at-an-athletics-field-4668777/',
        duration: '0:22',
        description: 'Professional high jump demonstration',
        difficulty: 'Advanced',
        type: 'pexels'
      },
      {
        id: 'hj4',
        title: 'High Jump Training',
        url: 'https://www.youtube.com/watch?v=72LLINM8gEA',
        duration: '8:15',
        description: 'High jump training drills and exercises',
        difficulty: 'Intermediate',
        type: 'youtube'
      },
      {
        id: 'hj5',
        title: 'Fixing High Jump Form',
        url: 'https://www.youtube.com/watch?v=QfBtD8HB4xk',
        duration: '7:40',
        description: 'Common high jump mistakes and corrections',
        difficulty: 'Advanced',
        type: 'youtube'
      }
    ]
  },
  {
    id: 'endurance',
    name: 'Endurance Run',
    icon: 'figure.run.circle',
    color: '#EF4444',
    description: 'Long-distance running and endurance training',
    videos: [
      {
        id: 'e1',
        title: 'Endurance Running Workout',
        url: 'https://www.youtube.com/watch?v=9XqZRmeNvj8',
        duration: '15:30',
        description: 'Complete endurance running workout routine',
        difficulty: 'Intermediate',
        type: 'youtube'
      },
      {
        id: 'e2',
        title: 'Distance Running Tips',
        url: 'https://www.youtube.com/watch?v=V9JPwU4tPyk',
        duration: '10:25',
        description: 'Essential tips for long-distance running',
        difficulty: 'Beginner',
        type: 'youtube'
      },
      {
        id: 'e3',
        title: 'Uphill Running Training',
        url: 'https://www.pexels.com/video/a-man-running-up-a-hill-3195282/',
        duration: '0:28',
        description: 'Hill running for endurance building',
        difficulty: 'Advanced',
        type: 'pexels'
      },
      {
        id: 'e4',
        title: 'Track Endurance Training',
        url: 'https://www.pexels.com/video/a-man-running-on-an-athletics-track-4425597/',
        duration: '0:35',
        description: 'Professional track endurance training',
        difficulty: 'Intermediate',
        type: 'pexels'
      },
      {
        id: 'e5',
        title: 'Cross Country Running',
        url: 'https://www.youtube.com/watch?v=cbfZtJU5UpU',
        duration: '12:10',
        description: 'Cross country running techniques and strategies',
        difficulty: 'Advanced',
        type: 'youtube'
      }
    ]
  },
  {
    id: 'situps',
    name: 'Sit-ups',
    icon: 'figure.core.training',
    color: '#06B6D4',
    description: 'Core strengthening and sit-up technique',
    videos: [
      {
        id: 'su1',
        title: 'Proper Sit-Up Form',
        url: 'https://www.youtube.com/watch?v=1fbU_MkV7NE',
        duration: '7:30',
        description: 'Master the correct sit-up technique for maximum effectiveness',
        difficulty: 'Beginner',
        type: 'youtube'
      },
      {
        id: 'su2',
        title: 'Core Strength Sit-Ups',
        url: 'https://www.youtube.com/watch?v=F1S8vZrt2z4',
        duration: '10:15',
        description: 'Advanced sit-up variations for core strength development',
        difficulty: 'Advanced',
        type: 'youtube'
      },
      {
        id: 'su3',
        title: 'Gym Floor Sit-Up Training',
        url: 'https://www.pexels.com/video/a-woman-doing-sit-ups-on-a-gym-floor-3823058/',
        duration: '0:30',
        description: 'Professional sit-up demonstration in gym setting',
        difficulty: 'Intermediate',
        type: 'pexels'
      },
      {
        id: 'su4',
        title: 'Abdominal Exercise Technique',
        url: 'https://www.pexels.com/video/a-man-doing-abdominal-exercise-3852395/',
        duration: '0:25',
        description: 'Core strengthening exercises and proper form',
        difficulty: 'Beginner',
        type: 'pexels'
      },
      {
        id: 'su5',
        title: 'Military Sit-Up Standards',
        url: 'https://www.military.com/video/stew-smith-situps-demo',
        duration: '5:45',
        description: 'Military standard sit-up test requirements and technique',
        difficulty: 'Advanced',
        type: 'military'
      }
    ]
  }
];

export default function TrainingVideosSection() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Admin Header */}
        <View style={styles.adminHeader}>
          <ThemedText type="title" style={styles.adminTitle}>Admin</ThemedText>
          <View style={styles.headerActions}>
            <View style={styles.aiFlaggedBadge}>
              <ThemedText style={styles.aiFlaggedText}>AI Flagged: 1</ThemedText>
            </View>
            <Pressable style={styles.notificationButton}>
              <IconSymbol size={20} name="checkmark.circle.fill" color="#6B7280" />
            </Pressable>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Video Submissions</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>AI-powered video analysis and review system</ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>156</ThemedText>
            <ThemedText style={styles.statLabel} numberOfLines={1}>Total Videos</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>23</ThemedText>
            <ThemedText style={styles.statLabel} numberOfLines={1}>Pending Review</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>98</ThemedText>
            <ThemedText style={styles.statLabel} numberOfLines={1}>Approved</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>8</ThemedText>
            <ThemedText style={styles.statLabel} numberOfLines={1}>AI Flagged</ThemedText>
          </View>
        </View>

        {/* Recent Submissions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <IconSymbol size={20} name="checkmark.circle.fill" color="#3B82F6" />
            <ThemedText type="subtitle" style={styles.recentTitle}>Recent Submissions</ThemedText>
          </View>
          
          <View style={styles.submissionItem}>
            <View style={styles.submissionInfo}>
              <ThemedText style={styles.submissionName}>Rajesh Kumar - Vertical Jump</ThemedText>
              <ThemedText style={styles.submissionTime}>Submitted 2h ago</ThemedText>
            </View>
            <View style={styles.pendingBadge}>
              <ThemedText style={styles.pendingText}>Pending</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    padding: 12,
    gap: 20
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  aiFlaggedBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16
  },
  aiFlaggedText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500'
  },
  notificationButton: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 16
  },
  sectionTitleContainer: {
    gap: 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  recentSection: {
    gap: 12
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937'
  },
  submissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  submissionInfo: {
    flex: 1
  },
  submissionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2
  },
  submissionTime: {
    fontSize: 12,
    color: '#6B7280'
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16
  },
  pendingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600'
  }
});