import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';

export default function AdminDashboardScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>🏛️ SAI Admin Dashboard</ThemedText>
            <ThemedText style={styles.subtitle}>Sports Authority of India - Talent Assessment Portal</ThemedText>
          </View>
          <View style={styles.adminProfile}>
            <IconSymbol size={24} name="person.crop.circle.fill" color="#6B7280" />
            <ThemedText style={styles.adminName}>Admin User</ThemedText>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>📊 Key Metrics</ThemedText>
          <View style={styles.statsGrid}>
            <StatsCard icon="person.3.fill" title="Total Athletes" value="1,247" color="#3B82F6" subtitle="Registered" />
            <StatsCard icon="clock.fill" title="Pending Reviews" value="89" color="#F59E0B" subtitle="Awaiting approval" />
            <StatsCard icon="checkmark.circle.fill" title="Approved" value="892" color="#10B981" subtitle="Verified athletes" />
            <StatsCard icon="exclamationmark.triangle.fill" title="Flagged" value="12" color="#EF4444" subtitle="Suspicious activity" />
          </View>
        </View>

        {/* Regional Overview */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🗺️ Regional Overview</ThemedText>
          <View style={styles.regionGrid}>
            <RegionCard state="Punjab" athletes={156} pending={12} />
            <RegionCard state="Haryana" athletes={134} pending={8} />
            <RegionCard state="Maharashtra" athletes={189} pending={15} />
            <RegionCard state="Kerala" athletes={98} pending={6} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>⚡ Quick Actions</ThemedText>
          <View style={styles.actionGrid}>
            <ActionCard icon="eye.fill" title="Review Submissions" subtitle="89 pending videos" color="#3B82F6" />
            <ActionCard icon="chart.bar.fill" title="View Reports" subtitle="Performance analytics" color="#10B981" />
            <ActionCard icon="target" title="Manage Benchmarks" subtitle="Update standards" color="#F59E0B" />
            <ActionCard icon="map.fill" title="Regional Analysis" subtitle="State-wise insights" color="#8B5CF6" />
          </View>
        </View>

        {/* AI Detection Summary */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🤖 AI Detection Summary</ThemedText>
          <View style={styles.aiSummary}>
            <View style={styles.aiCard}>
              <IconSymbol size={32} name="eye.trianglebadge.exclamationmark" color="#EF4444" />
              <View style={styles.aiContent}>
                <ThemedText type="defaultSemiBold" style={styles.aiTitle}>12 Videos Flagged This Week</ThemedText>
                <ThemedText style={styles.aiSubtitle}>Potential cheating detected by AI analysis</ThemedText>
                <Pressable style={styles.aiButton}>
                  <ThemedText style={styles.aiButtonText}>Review Flagged Videos</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>🔄 Recent Activity</ThemedText>
          <View style={styles.activityList}>
            <ActivityItem 
              icon="checkmark.circle.fill" 
              text="Approved Rajesh Kumar from Punjab - Athletics" 
              time="2 minutes ago" 
              color="#10B981" 
            />
            <ActivityItem 
              icon="exclamationmark.triangle.fill" 
              text="AI flagged suspicious video from Mumbai athlete" 
              time="15 minutes ago" 
              color="#EF4444" 
            />
            <ActivityItem 
              icon="person.badge.plus" 
              text="New athlete registration from Kerala - Badminton" 
              time="1 hour ago" 
              color="#3B82F6" 
            />
            <ActivityItem 
              icon="chart.line.uptrend.xyaxis" 
              text="Weekly performance report generated" 
              time="2 hours ago" 
              color="#8B5CF6" 
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function StatsCard({ icon, title, value, color, subtitle }: { 
  icon: string; title: string; value: string; color: string; subtitle: string; 
}) {
  return (
    <View style={styles.statsCard}>
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol size={24} name={icon} color={color} />
      </View>
      <View style={styles.statsContent}>
        <ThemedText type="title" style={styles.statsValue}>{value}</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.statsTitle}>{title}</ThemedText>
        <ThemedText style={styles.statsSubtitle}>{subtitle}</ThemedText>
      </View>
    </View>
  );
}

function RegionCard({ state, athletes, pending }: { state: string; athletes: number; pending: number }) {
  return (
    <View style={styles.regionCard}>
      <ThemedText type="defaultSemiBold" style={styles.regionState}>{state}</ThemedText>
      <ThemedText style={styles.regionAthletes}>{athletes} athletes</ThemedText>
      <ThemedText style={styles.regionPending}>{pending} pending</ThemedText>
    </View>
  );
}

function ActionCard({ icon, title, subtitle, color }: { 
  icon: string; title: string; subtitle: string; color: string; 
}) {
  return (
    <Pressable style={styles.actionCard}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol size={28} name={icon} color={color} />
      </View>
      <ThemedText type="defaultSemiBold" style={styles.actionTitle}>{title}</ThemedText>
      <ThemedText style={styles.actionSubtitle}>{subtitle}</ThemedText>
    </Pressable>
  );
}

function ActivityItem({ icon, text, time, color }: { 
  icon: string; text: string; time: string; color: string; 
}) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol size={16} name={icon} color={color} />
      </View>
      <View style={styles.activityContent}>
        <ThemedText style={styles.activityText}>{text}</ThemedText>
        <ThemedText style={styles.activityTime}>{time}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  adminProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  adminName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 36,
  },
  statsTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  regionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  regionState: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  regionAthletes: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  regionPending: {
    fontSize: 12,
    color: '#F59E0B',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  aiSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  aiButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});


