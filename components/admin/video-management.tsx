import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import VideoPlayer from '@/components/video/video-player';

interface AthleteVideo {
  id: string;
  athleteName: string;
  athleteId: string;
  uri: string;
  category: string;
  name: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const MOCK_VIDEOS: AthleteVideo[] = [
  {
    id: '1',
    athleteName: 'Rahul Sharma',
    athleteId: 'ATH001',
    uri: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
    category: 'running',
    name: 'Sprint Training Session',
    uploadDate: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    athleteName: 'Priya Patel',
    athleteId: 'ATH002',
    uri: 'https://videos.pexels.com/video-files/4752861/4752861-uhd_2560_1440_25fps.mp4',
    category: 'long-jump',
    name: 'Long Jump Practice',
    uploadDate: '2024-01-14',
    status: 'approved'
  },
  {
    id: '3',
    athleteName: 'Amit Kumar',
    athleteId: 'ATH003',
    uri: 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4',
    category: 'sit-ups',
    name: 'Core Strength Training',
    uploadDate: '2024-01-13',
    status: 'pending'
  }
];

export default function VideoManagement() {
  const [videos, setVideos] = useState<AthleteVideo[]>(MOCK_VIDEOS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const updateVideoStatus = (videoId: string, status: 'approved' | 'rejected') => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status } : video
    ));
  };

  const filteredVideos = videos.filter(video => 
    filter === 'all' || video.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol size={28} name="video.fill" color="#3B82F6" />
        <ThemedText type="title" style={styles.title}>Video Management</ThemedText>
      </View>

      <View style={styles.filters}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <Pressable
            key={status}
            style={[styles.filterButton, filter === status && styles.activeFilter]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.videoList}>
        {filteredVideos.map(video => (
          <View key={video.id} style={styles.videoCard}>
            <View style={styles.athleteInfo}>
              <ThemedText type="defaultSemiBold" style={styles.athleteName}>
                {video.athleteName} ({video.athleteId})
              </ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(video.status) }]}>
                <Text style={styles.statusText}>{video.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <VideoPlayer
              uri={video.uri}
              title={video.name}
              category={video.category}
            />
            
            {video.status === 'pending' && (
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => updateVideoStatus(video.id, 'approved')}
                >
                  <IconSymbol size={16} name="checkmark.circle.fill" color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => updateVideoStatus(video.id, 'rejected')}
                >
                  <IconSymbol size={16} name="xmark.circle.fill" color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filters: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  activeFilter: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  videoList: {
    padding: 20,
  },
  videoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  athleteInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  athleteName: {
    fontSize: 16,
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});