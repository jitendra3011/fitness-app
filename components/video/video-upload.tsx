import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

type VideoCategory = 'running' | 'long-jump' | 'sit-ups' | 'high-jump' | 'endurance-run' | 'shuttle';

interface VideoUploadProps {
  category: VideoCategory;
  onUpload: (video: { uri: string; category: VideoCategory; name: string }) => void;
}

const SAMPLE_VIDEOS = {
  'running': 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'long-jump': 'https://videos.pexels.com/video-files/4752861/4752861-uhd_2560_1440_25fps.mp4',
  'sit-ups': 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4',
  'high-jump': 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4',
  'endurance-run': 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'shuttle': 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4'
};

export default function VideoUpload({ category, onUpload }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    setIsUploading(true);
    
    setTimeout(() => {
      const video = {
        uri: SAMPLE_VIDEOS[category],
        category,
        name: `${category.replace('-', ' ')} - ${new Date().toLocaleDateString()}`
      };
      onUpload(video);
      setIsUploading(false);
      Alert.alert('Success', 'Video uploaded successfully!');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol size={24} name="video.fill" color="#3B82F6" />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {category.replace('-', ' ').toUpperCase()}
        </ThemedText>
      </View>
      
      <Pressable 
        style={[styles.uploadButton, isUploading && styles.uploading]} 
        onPress={handleUpload}
        disabled={isUploading}
      >
        <IconSymbol 
          size={20} 
          name={isUploading ? "arrow.clockwise" : "plus.circle.fill"} 
          color="#FFFFFF" 
        />
        <Text style={styles.uploadText}>
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: '#1F2937',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploading: {
    backgroundColor: '#9CA3AF',
  },
  uploadText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});