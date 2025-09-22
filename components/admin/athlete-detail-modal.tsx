import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Modal, Image, TextInput } from 'react-native';

interface Athlete {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: { state: string; district: string; village: string };
  photo: string;
  aadhaarId?: string;
  preferredSports: string[];
  trainingBackground: 'Beginner' | 'Intermediate' | 'Advanced';
  currentTrainingLocation?: string;
  height: number;
  weight: number;
  fitnessTests: {
    verticalJump?: { height: number; videoUrl: string; aiAnalyzed: boolean };
    shuttleRun?: { time: number; videoUrl: string; aiAnalyzed: boolean };
    sitUps?: { count: number; videoUrl: string; aiAnalyzed: boolean };
    enduranceRun?: { distance: number; time: number; videoUrl: string; aiAnalyzed: boolean };
    pushUps?: { count: number; videoUrl: string; aiAnalyzed: boolean };
  };
  submissionDate: string;
  deviceType: string;
  gpsLocation: { lat: number; lng: number; address: string };
  networkStrength: string;
  badges: string[];
  leaderboardPosition?: number;
  progressHistory: { date: string; score: number }[];
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  aiScore?: number;
}

interface AthleteDetailModalProps {
  athlete: Athlete | null;
  visible: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFlag: (id: string) => void;
}

export default function AthleteDetailModal({ 
  athlete, 
  visible, 
  onClose, 
  onApprove, 
  onReject, 
  onFlag 
}: AthleteDetailModalProps) {
  const [editingPhoto, setEditingPhoto] = useState(false);

  if (!athlete) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'flagged': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'verticalJump': return 'arrow.up.circle.fill';
      case 'shuttleRun': return 'figure.run';
      case 'sitUps': return 'figure.core.training';
      case 'enduranceRun': return 'figure.outdoor.cycle';
      case 'pushUps': return 'figure.strengthtraining.traditional';
      default: return 'play.circle.fill';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <IconSymbol size={24} name="xmark" color="#6B7280" />
            </Pressable>
            <ThemedText type="title" style={styles.title}>Athlete Profile</ThemedText>
            <View style={styles.headerActions}>
              <Pressable style={styles.editButton}>
                <IconSymbol size={16} name="pencil" color="#3B82F6" />
              </Pressable>
            </View>
          </View>

          {/* Photo Section */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: athlete.photo }} style={styles.photo} />
              <Pressable 
                style={styles.photoEditButton}
                onPress={() => setEditingPhoto(true)}
              >
                <IconSymbol size={16} name="camera.fill" color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.photoInfo}>
              <ThemedText type="title" style={styles.athleteName}>{athlete.name}</ThemedText>
              <ThemedText style={styles.athleteId}>ID: {athlete.id}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(athlete.status) + '20' }]}>
                <ThemedText style={[styles.statusText, { color: getStatusColor(athlete.status) }]}>
                  {athlete.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>👤 Personal Information</ThemedText>
            <View style={styles.infoGrid}>
              <InfoItem label="Full Name" value={athlete.name} />
              <InfoItem label="Age" value={`${athlete.age} years`} />
              <InfoItem label="Date of Birth" value={athlete.dateOfBirth} />
              <InfoItem label="Gender" value={athlete.gender} />
              <InfoItem label="Phone" value={athlete.phoneNumber} />
              <InfoItem label="Email" value={athlete.email} />
              <InfoItem label="Address" value={`${athlete.address.village}, ${athlete.address.district}, ${athlete.address.state}`} />
              {athlete.aadhaarId && <InfoItem label="Aadhaar ID" value={athlete.aadhaarId} />}
            </View>
          </View>

          {/* Sports Details */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🏃 Sports & Training</ThemedText>
            <View style={styles.infoGrid}>
              <InfoItem label="Preferred Sports" value={athlete.preferredSports.join(', ')} />
              <InfoItem label="Training Level" value={athlete.trainingBackground} />
              {athlete.currentTrainingLocation && (
                <InfoItem label="Training Location" value={athlete.currentTrainingLocation} />
              )}
            </View>
          </View>

          {/* Physical Details */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📏 Physical Measurements</ThemedText>
            <View style={styles.physicalStats}>
              <View style={styles.statCard}>
                <IconSymbol size={24} name="ruler" color="#3B82F6" />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>{athlete.height} cm</ThemedText>
                <ThemedText style={styles.statLabel}>Height</ThemedText>
              </View>
              <View style={styles.statCard}>
                <IconSymbol size={24} name="scalemass" color="#10B981" />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>{athlete.weight} kg</ThemedText>
                <ThemedText style={styles.statLabel}>Weight</ThemedText>
              </View>
              <View style={styles.statCard}>
                <IconSymbol size={24} name="chart.bar.fill" color="#F59E0B" />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>{(athlete.weight / ((athlete.height/100) ** 2)).toFixed(1)}</ThemedText>
                <ThemedText style={styles.statLabel}>BMI</ThemedText>
              </View>
            </View>
          </View>

          {/* Fitness Tests */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🎯 Fitness Test Results</ThemedText>
            <View style={styles.testsGrid}>
              {Object.entries(athlete.fitnessTests).map(([testType, testData]) => (
                <View key={testType} style={styles.testCard}>
                  <View style={styles.testHeader}>
                    <IconSymbol size={20} name={getTestIcon(testType)} color="#3B82F6" />
                    <ThemedText type="defaultSemiBold" style={styles.testName}>
                      {testType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </ThemedText>
                    {testData.aiAnalyzed && (
                      <View style={styles.aiVerified}>
                        <IconSymbol size={12} name="checkmark.seal.fill" color="#10B981" />
                      </View>
                    )}
                  </View>
                  <View style={styles.testResults}>
                    {testData.height && <ThemedText style={styles.testValue}>Height: {testData.height} cm</ThemedText>}
                    {testData.time && <ThemedText style={styles.testValue}>Time: {testData.time} sec</ThemedText>}
                    {testData.count && <ThemedText style={styles.testValue}>Count: {testData.count}</ThemedText>}
                    {testData.distance && <ThemedText style={styles.testValue}>Distance: {testData.distance}m</ThemedText>}
                  </View>
                  <Pressable style={styles.videoButton}>
                    <IconSymbol size={14} name="play.circle.fill" color="#8B5CF6" />
                    <ThemedText style={styles.videoText}>View Video</ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Device & Submission Info */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>📱 Submission Details</ThemedText>
            <View style={styles.infoGrid}>
              <InfoItem label="Submission Date" value={athlete.submissionDate} />
              <InfoItem label="Device Type" value={athlete.deviceType} />
              <InfoItem label="Location" value={athlete.gpsLocation.address} />
              <InfoItem label="Network Strength" value={athlete.networkStrength} />
              <InfoItem label="GPS Coordinates" value={`${athlete.gpsLocation.lat}, ${athlete.gpsLocation.lng}`} />
            </View>
          </View>

          {/* Gamification */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>🏆 Achievements & Progress</ThemedText>
            <View style={styles.achievementSection}>
              {athlete.leaderboardPosition && (
                <View style={styles.leaderboardCard}>
                  <IconSymbol size={24} name="trophy.fill" color="#F59E0B" />
                  <ThemedText type="defaultSemiBold" style={styles.leaderboardText}>
                    Rank #{athlete.leaderboardPosition}
                  </ThemedText>
                </View>
              )}
              
              <View style={styles.badgesContainer}>
                <ThemedText style={styles.badgesTitle}>Badges Earned:</ThemedText>
                <View style={styles.badgesList}>
                  {athlete.badges.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{badge}</ThemedText>
                    </View>
                  ))}
                  {athlete.badges.length === 0 && (
                    <ThemedText style={styles.noBadges}>No badges earned yet</ThemedText>
                  )}
                </View>
              </View>

              {athlete.aiScore && (
                <View style={styles.aiScoreCard}>
                  <ThemedText style={styles.aiScoreLabel}>AI Analysis Score</ThemedText>
                  <ThemedText type="title" style={[styles.aiScoreValue, { color: getStatusColor(athlete.status) }]}>
                    {athlete.aiScore}%
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            {athlete.status === 'pending' && (
              <View style={styles.actionButtons}>
                <Pressable 
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => onApprove(athlete.id)}
                >
                  <IconSymbol size={20} name="checkmark.circle.fill" color="#FFFFFF" />
                  <ThemedText style={styles.actionBtnText}>Approve</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => onReject(athlete.id)}
                >
                  <IconSymbol size={20} name="xmark.circle.fill" color="#FFFFFF" />
                  <ThemedText style={styles.actionBtnText}>Reject</ThemedText>
                </Pressable>
              </View>
            )}
            
            <Pressable 
              style={[styles.actionBtn, styles.flagBtn]}
              onPress={() => onFlag(athlete.id)}
            >
              <IconSymbol size={20} name="flag.fill" color="#FFFFFF" />
              <ThemedText style={styles.actionBtnText}>Flag for Review</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <ThemedText style={styles.infoLabel}>{label}:</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  photoSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    gap: 16,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  photoEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 4,
  },
  photoInfo: {
    flex: 1,
  },
  athleteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  athleteId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  physicalStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  testsGrid: {
    gap: 12,
  },
  testCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testName: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  aiVerified: {
    padding: 2,
  },
  testResults: {
    gap: 4,
  },
  testValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  videoText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  achievementSection: {
    gap: 16,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
  },
  leaderboardText: {
    fontSize: 16,
    color: '#92400E',
  },
  badgesContainer: {
    gap: 8,
  },
  badgesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  noBadges: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  aiScoreCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 4,
  },
  aiScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  aiScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  actionSection: {
    padding: 20,
    gap: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  approveBtn: {
    backgroundColor: '#10B981',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  flagBtn: {
    backgroundColor: '#F59E0B',
  },
});