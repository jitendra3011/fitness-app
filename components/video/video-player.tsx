import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface VideoPlayerProps {
  uri: string;
  title: string;
  category: string;
  onAnalyze?: () => void;
}

export default function VideoPlayer({ uri, title, category, onAnalyze }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    Alert.alert('Video Player', `${isPlaying ? 'Paused' : 'Playing'} ${title}`);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert('AI Analysis Complete', 'Form analysis: Good posture, maintain consistent pace. Score: 8.5/10');
      onAnalyze?.();
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoPreview}>
        <View style={styles.playButton}>
          <Pressable onPress={handlePlay} style={styles.playIcon}>
            <IconSymbol 
              size={32} 
              name={isPlaying ? "pause.fill" : "play.fill"} 
              color="#FFFFFF" 
            />
          </Pressable>
        </View>
        <View style={styles.overlay}>
          <Text style={styles.categoryBadge}>{category.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        
        <View style={styles.actions}>
          <Pressable style={styles.playButton2} onPress={handlePlay}>
            <IconSymbol size={16} name="play.fill" color="#3B82F6" />
            <Text style={styles.actionText}>Play</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.analyzeButton, isAnalyzing && styles.analyzing]} 
            onPress={handleAnalyze}
            disabled={isAnalyzing}
          >
            <IconSymbol 
              size={16} 
              name={isAnalyzing ? "arrow.clockwise" : "brain.head.profile"} 
              color="#FFFFFF" 
            />
            <Text style={styles.analyzeText}>
              {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoPreview: {
    height: 200,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    padding: 16,
  },
  playIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  categoryBadge: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  actionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  analyzing: {
    backgroundColor: '#9CA3AF',
  },
  analyzeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});