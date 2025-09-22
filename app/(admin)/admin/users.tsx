import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AthleteDetailModal from '@/components/admin/athlete-detail-modal';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native';

interface Athlete {
  id: string;
  // Personal Information
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: {
    state: string;
    district: string;
    village: string;
  };
  photo: string;
  aadhaarId?: string;
  
  // Sports/Interest Details
  preferredSports: string[];
  trainingBackground: 'Beginner' | 'Intermediate' | 'Advanced';
  currentTrainingLocation?: string;
  
  // Physical Details
  height: number; // in cm
  weight: number; // in kg
  
  // Fitness Test Data
  fitnessTests: {
    verticalJump?: { height: number; videoUrl: string; aiAnalyzed: boolean };
    shuttleRun?: { time: number; videoUrl: string; aiAnalyzed: boolean };
    sitUps?: { count: number; videoUrl: string; aiAnalyzed: boolean };
    enduranceRun?: { distance: number; time: number; videoUrl: string; aiAnalyzed: boolean };
    pushUps?: { count: number; videoUrl: string; aiAnalyzed: boolean };
  };
  
  // Demo Videos
  demoVideos?: { name: string; url: string; size: string; uploadDate: string }[];
  
  // Device/Submission Metadata
  submissionDate: string;
  deviceType: string;
  gpsLocation: { lat: number; lng: number; address: string };
  networkStrength: string;
  
  // Gamification
  badges: string[];
  leaderboardPosition?: number;
  progressHistory: { date: string; score: number }[];
  
  // Admin fields
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  aiScore?: number;
}

const mockAthletes: Athlete[] = [
  { 
    id: '001', name: 'Rajesh Kumar', age: 18, dateOfBirth: '2005-03-15', gender: 'Male',
    phoneNumber: '+91-98765-43210', email: 'rajesh.kumar@email.com',
    address: { state: 'Punjab', district: 'Ludhiana', village: 'Model Town' },
    photo: '/photos/rajesh_001.jpg', aadhaarId: '1234-5678-9012',
    preferredSports: ['Athletics', 'Running'], trainingBackground: 'Intermediate',
    currentTrainingLocation: 'SAI Ludhiana Center', height: 175, weight: 68,
    fitnessTests: {
      verticalJump: { height: 45, videoUrl: '/videos/rajesh_jump.mp4', aiAnalyzed: true },
      shuttleRun: { time: 12.5, videoUrl: '/videos/rajesh_shuttle.mp4', aiAnalyzed: true },
      sitUps: { count: 35, videoUrl: '/videos/rajesh_situps.mp4', aiAnalyzed: true }
    },
    demoVideos: [
      { name: 'Push-up Demo', url: '/demo/rajesh_pushup.mp4', size: '15MB', uploadDate: '2024-01-15' },
      { name: 'Running Form', url: '/demo/rajesh_running.mp4', size: '25MB', uploadDate: '2024-01-15' }
    ],
    submissionDate: '2024-01-15', deviceType: 'Android 13', 
    gpsLocation: { lat: 30.9010, lng: 75.8573, address: 'Ludhiana, Punjab' },
    networkStrength: 'Strong (4G)', badges: ['First Submission', 'Consistent Performer'],
    leaderboardPosition: 15, progressHistory: [{ date: '2024-01-15', score: 85 }],
    status: 'pending', aiScore: 85
  },
  { 
    id: '002', name: 'Priya Sharma', age: 17, dateOfBirth: '2006-07-22', gender: 'Female',
    phoneNumber: '+91-98765-43211', email: 'priya.sharma@email.com',
    address: { state: 'Haryana', district: 'Gurgaon', village: 'Sector 14' },
    photo: '/photos/priya_002.jpg', aadhaarId: '2345-6789-0123',
    preferredSports: ['Wrestling', 'Judo'], trainingBackground: 'Advanced',
    currentTrainingLocation: 'Chhatrasal Stadium', height: 162, weight: 55,
    fitnessTests: {
      verticalJump: { height: 38, videoUrl: '/videos/priya_jump.mp4', aiAnalyzed: true },
      sitUps: { count: 42, videoUrl: '/videos/priya_situps.mp4', aiAnalyzed: true },
      pushUps: { count: 28, videoUrl: '/videos/priya_pushups.mp4', aiAnalyzed: true }
    },
    demoVideos: [
      { name: 'Yoga Flow', url: '/demo/priya_yoga.mp4', size: '30MB', uploadDate: '2024-01-14' },
      { name: 'Strength Training', url: '/demo/priya_strength.mp4', size: '20MB', uploadDate: '2024-01-14' },
      { name: 'Cardio Routine', url: '/demo/priya_cardio.mp4', size: '18MB', uploadDate: '2024-01-14' }
    ],
    submissionDate: '2024-01-14', deviceType: 'iOS 17',
    gpsLocation: { lat: 28.4595, lng: 77.0266, address: 'Gurgaon, Haryana' },
    networkStrength: 'Excellent (5G)', badges: ['Top Performer', 'Wrestling Champion', 'AI Verified'],
    leaderboardPosition: 3, progressHistory: [{ date: '2024-01-14', score: 92 }],
    status: 'approved', aiScore: 92
  },
  { 
    id: '003', name: 'Arjun Singh', age: 19, dateOfBirth: '2004-11-08', gender: 'Male',
    phoneNumber: '+91-98765-43212', email: 'arjun.singh@email.com',
    address: { state: 'Rajasthan', district: 'Jaipur', village: 'Malviya Nagar' },
    photo: '/photos/arjun_003.jpg',
    preferredSports: ['Boxing', 'MMA'], trainingBackground: 'Intermediate',
    currentTrainingLocation: 'Rajasthan Boxing Academy', height: 180, weight: 75,
    fitnessTests: {
      shuttleRun: { time: 15.2, videoUrl: '/videos/arjun_shuttle.mp4', aiAnalyzed: true },
      pushUps: { count: 18, videoUrl: '/videos/arjun_pushups.mp4', aiAnalyzed: true }
    },
    demoVideos: [
      { name: 'Basic Workout', url: '/demo/arjun_basic.mp4', size: '12MB', uploadDate: '2024-01-13' }
    ],
    submissionDate: '2024-01-13', deviceType: 'Android 12',
    gpsLocation: { lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
    networkStrength: 'Moderate (3G)', badges: ['Flagged Review'],
    progressHistory: [{ date: '2024-01-13', score: 45 }],
    status: 'flagged', aiScore: 45
  },
  { 
    id: '004', name: 'Sneha Patel', age: 16, dateOfBirth: '2007-09-12', gender: 'Female',
    phoneNumber: '+91-98765-43213', email: 'sneha.patel@email.com',
    address: { state: 'Gujarat', district: 'Ahmedabad', village: 'Navrangpura' },
    photo: '/photos/sneha_004.jpg', aadhaarId: '3456-7890-1234',
    preferredSports: ['Badminton', 'Table Tennis'], trainingBackground: 'Beginner',
    height: 158, weight: 48,
    fitnessTests: {
      verticalJump: { height: 32, videoUrl: '/videos/sneha_jump.mp4', aiAnalyzed: true },
      enduranceRun: { distance: 1500, time: 420, videoUrl: '/videos/sneha_run.mp4', aiAnalyzed: true }
    },
    submissionDate: '2024-01-12', deviceType: 'Android 14',
    gpsLocation: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
    networkStrength: 'Good (4G)', badges: ['Young Talent', 'First Timer'],
    leaderboardPosition: 28, progressHistory: [{ date: '2024-01-12', score: 78 }],
    status: 'pending', aiScore: 78
  },
  { 
    id: '005', name: 'Vikram Reddy', age: 20, dateOfBirth: '2003-12-05', gender: 'Male',
    phoneNumber: '+91-98765-43214', email: 'vikram.reddy@email.com',
    address: { state: 'Telangana', district: 'Hyderabad', village: 'Banjara Hills' },
    photo: '/photos/vikram_005.jpg', aadhaarId: '4567-8901-2345',
    preferredSports: ['Cricket', 'Athletics'], trainingBackground: 'Advanced',
    currentTrainingLocation: 'Rajiv Gandhi Stadium', height: 178, weight: 72,
    fitnessTests: {
      verticalJump: { height: 48, videoUrl: '/videos/vikram_jump.mp4', aiAnalyzed: true },
      shuttleRun: { time: 11.8, videoUrl: '/videos/vikram_shuttle.mp4', aiAnalyzed: true },
      sitUps: { count: 45, videoUrl: '/videos/vikram_situps.mp4', aiAnalyzed: true },
      pushUps: { count: 35, videoUrl: '/videos/vikram_pushups.mp4', aiAnalyzed: true }
    },
    submissionDate: '2024-01-11', deviceType: 'iOS 16',
    gpsLocation: { lat: 17.3850, lng: 78.4867, address: 'Hyderabad, Telangana' },
    networkStrength: 'Excellent (5G)', badges: ['All-Rounder', 'Top 10', 'Verified Athlete'],
    leaderboardPosition: 7, progressHistory: [{ date: '2024-01-11', score: 88 }],
    status: 'approved', aiScore: 88
  },
  { 
    id: '006', name: 'Anita Kumari', age: 18, dateOfBirth: '2005-05-18', gender: 'Female',
    phoneNumber: '+91-98765-43215', email: 'anita.kumari@email.com',
    address: { state: 'Bihar', district: 'Patna', village: 'Boring Road' },
    photo: '/photos/anita_006.jpg',
    preferredSports: ['Athletics'], trainingBackground: 'Beginner',
    height: 160, weight: 52,
    fitnessTests: {
      enduranceRun: { distance: 1500, time: 480, videoUrl: '/videos/anita_run.mp4', aiAnalyzed: true }
    },
    submissionDate: '2024-01-10', deviceType: 'Android 11',
    gpsLocation: { lat: 25.5941, lng: 85.1376, address: 'Patna, Bihar' },
    networkStrength: 'Weak (2G)', badges: [],
    progressHistory: [{ date: '2024-01-10', score: 35 }],
    status: 'rejected', aiScore: 35
  },
];

export default function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>(mockAthletes);

  const handleApprove = (athleteId: string) => {
    setAthletes(prev => prev.map(athlete => 
      athlete.id === athleteId ? { ...athlete, status: 'approved' } : athlete
    ));
  };

  const handleReject = (athleteId: string) => {
    setAthletes(prev => prev.map(athlete => 
      athlete.id === athleteId ? { ...athlete, status: 'rejected' } : athlete
    ));
  };

  const handleFlag = (athleteId: string) => {
    setAthletes(prev => prev.map(athlete => 
      athlete.id === athleteId ? { ...athlete, status: 'flagged' } : athlete
    ));
  };

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.address.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         athlete.preferredSports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || athlete.status === filterStatus;
    const matchesState = filterState === 'all' || athlete.address.state === filterState;
    return matchesSearch && matchesStatus && matchesState;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'flagged': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'checkmark.circle.fill';
      case 'rejected': return 'xmark.circle.fill';
      case 'flagged': return 'exclamationmark.triangle.fill';
      default: return 'clock.fill';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const uniqueStates = [...new Set(athletes.map(a => a.address.state))];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.title}>👥 Athlete Management</ThemedText>
            <ThemedText style={styles.subtitle}>Review and manage athlete submissions across India</ThemedText>
          </View>
          <Pressable style={styles.exportButton}>
            <IconSymbol size={16} name="square.and.arrow.up" color="#FFFFFF" />
            <ThemedText style={styles.exportText}>Export</ThemedText>
          </Pressable>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <StatItem label="Total" value={athletes.length.toString()} color="#3B82F6" />
          <StatItem label="Pending" value={athletes.filter(a => a.status === 'pending').length.toString()} color="#F59E0B" />
          <StatItem label="Approved" value={athletes.filter(a => a.status === 'approved').length.toString()} color="#10B981" />
          <StatItem label="Flagged" value={athletes.filter(a => a.status === 'flagged').length.toString()} color="#EF4444" />
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.searchBar}>
            <IconSymbol size={20} name="magnifyingglass" color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, state, district, or sport..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <ThemedText style={styles.filterLabel}>Status:</ThemedText>
              <View style={styles.filterButtons}>
                {['all', 'pending', 'approved', 'flagged', 'rejected'].map(status => (
                  <Pressable
                    key={status}
                    style={[styles.filterButton, filterStatus === status && styles.activeFilter]}
                    onPress={() => setFilterStatus(status)}
                  >
                    <ThemedText style={[styles.filterText, filterStatus === status && styles.activeFilterText]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <ThemedText style={styles.filterLabel}>State:</ThemedText>
              <View style={styles.filterButtons}>
                <Pressable
                  style={[styles.filterButton, filterState === 'all' && styles.activeFilter]}
                  onPress={() => setFilterState('all')}
                >
                  <ThemedText style={[styles.filterText, filterState === 'all' && styles.activeFilterText]}>All</ThemedText>
                </Pressable>
                {uniqueStates.slice(0, 3).map(state => (
                  <Pressable
                    key={state}
                    style={[styles.filterButton, filterState === state && styles.activeFilter]}
                    onPress={() => setFilterState(state)}
                  >
                    <ThemedText style={[styles.filterText, filterState === state && styles.activeFilterText]}>
                      {state}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Athletes Table */}
        <View style={styles.tableContainer}>
          <ThemedText type="defaultSemiBold" style={styles.tableTitle}>
            Athletes ({filteredAthletes.length})
          </ThemedText>
          
          {filteredAthletes.map(athlete => (
            <View key={athlete.id} style={styles.athleteCard}>
              <View style={styles.athleteMainInfo}>
                <View style={styles.athleteHeader}>
                  <View style={styles.athleteNameSection}>
                    <ThemedText type="defaultSemiBold" style={styles.athleteName}>{athlete.name}</ThemedText>
                    <ThemedText style={styles.athleteId}>ID: {athlete.id}</ThemedText>
                  </View>
                  
                  <View style={styles.statusSection}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(athlete.status) + '20' }]}>
                      <IconSymbol size={12} name={getStatusIcon(athlete.status)} color={getStatusColor(athlete.status)} />
                      <ThemedText style={[styles.statusText, { color: getStatusColor(athlete.status) }]}>
                        {athlete.status.toUpperCase()}
                      </ThemedText>
                    </View>
                    
                    {athlete.aiScore && (
                      <View style={[styles.aiScoreBadge, { backgroundColor: getAIScoreColor(athlete.aiScore) + '20' }]}>
                        <ThemedText style={[styles.aiScoreText, { color: getAIScoreColor(athlete.aiScore) }]}>
                          AI: {athlete.aiScore}%
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.athleteDetails}>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>🎂 {athlete.age} years • {athlete.gender}</ThemedText>
                    <ThemedText style={styles.detailText}>🏃 {athlete.preferredSports.join(', ')}</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>📍 {athlete.address.district}, {athlete.address.state}</ThemedText>
                    <ThemedText style={styles.detailText}>📅 {athlete.submissionDate}</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>📞 {athlete.phoneNumber}</ThemedText>
                    <ThemedText style={styles.detailText}>📧 {athlete.email}</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>📏 {athlete.height}cm • {athlete.weight}kg</ThemedText>
                    <ThemedText style={styles.detailText}>🎯 {athlete.trainingBackground}</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>📱 {athlete.deviceType}</ThemedText>
                    <ThemedText style={styles.detailText}>🏆 {athlete.badges.length} badges</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailText}>🎥 {athlete.demoVideos?.length || 0} demo videos</ThemedText>
                    <ThemedText style={styles.detailText}>🏃 {Object.keys(athlete.fitnessTests).length} fitness tests</ThemedText>
                  </View>
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <Pressable 
                  style={[styles.actionBtn, styles.viewBtn]}
                  onPress={() => setSelectedAthlete(athlete)}
                >
                  <IconSymbol size={16} name="eye.fill" color="#3B82F6" />
                  <ThemedText style={styles.actionBtnText}>View</ThemedText>
                </Pressable>
                
                <Pressable 
                  style={[styles.actionBtn, styles.videoBtn]}
                  onPress={() => {
                    const videoCount = (athlete.demoVideos?.length || 0) + Object.keys(athlete.fitnessTests).length;
                    alert(`${athlete.name} has ${videoCount} videos:\n${athlete.demoVideos?.map(v => `• ${v.name} (${v.size})`).join('\n') || 'No demo videos'}\n\nFitness test videos: ${Object.keys(athlete.fitnessTests).length}`);
                  }}
                >
                  <IconSymbol size={16} name="video.fill" color="#8B5CF6" />
                  <ThemedText style={styles.actionBtnText}>Videos ({(athlete.demoVideos?.length || 0) + Object.keys(athlete.fitnessTests).length})</ThemedText>
                </Pressable>
                
                {athlete.status === 'pending' && (
                  <>
                    <Pressable 
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(athlete.id)}
                    >
                      <IconSymbol size={16} name="checkmark" color="#10B981" />
                      <ThemedText style={styles.actionBtnText}>Approve</ThemedText>
                    </Pressable>
                    
                    <Pressable 
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(athlete.id)}
                    >
                      <IconSymbol size={16} name="xmark" color="#EF4444" />
                      <ThemedText style={styles.actionBtnText}>Reject</ThemedText>
                    </Pressable>
                  </>
                )}
                
                {athlete.status === 'flagged' && (
                  <Pressable 
                    style={[styles.actionBtn, styles.flagBtn]}
                    onPress={() => handleFlag(athlete.id)}
                  >
                    <IconSymbol size={16} name="flag.fill" color="#F59E0B" />
                    <ThemedText style={styles.actionBtnText}>Review</ThemedText>
                  </Pressable>
                )}
                
                {(athlete.status === 'approved' || athlete.status === 'rejected') && (
                  <Pressable 
                    style={[styles.actionBtn, styles.flagBtn]}
                    onPress={() => handleFlag(athlete.id)}
                  >
                    <IconSymbol size={16} name="flag.fill" color="#F59E0B" />
                    <ThemedText style={styles.actionBtnText}>Flag</ThemedText>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <AthleteDetailModal
        athlete={selectedAthlete}
        visible={selectedAthlete !== null}
        onClose={() => setSelectedAthlete(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onFlag={handleFlag}
      />
    </ThemedView>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText type="title" style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
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
    marginBottom: 24,
    paddingBottom: 16,
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  exportText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  filtersSection: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterRow: {
    gap: 16,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  tableContainer: {
    gap: 16,
  },
  tableTitle: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  athleteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    gap: 16,
  },
  athleteMainInfo: {
    flex: 1,
  },
  athleteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  athleteNameSection: {
    flex: 1,
  },
  athleteName: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 2,
  },
  athleteId: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  aiScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiScoreText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  athleteDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewBtn: {
    backgroundColor: '#EBF4FF',
  },
  videoBtn: {
    backgroundColor: '#F3E8FF',
  },
  approveBtn: {
    backgroundColor: '#ECFDF5',
  },
  rejectBtn: {
    backgroundColor: '#FEF2F2',
  },
  flagBtn: {
    backgroundColor: '#FFFBEB',
  },
});

