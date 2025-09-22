import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { RotateCcw, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission?.granted) {
      // Auto start recording after 1 second
      const timer = setTimeout(() => {
        startRecording();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [permission?.granted]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;
    
    try {
      setIsRecording(true);
      setRecordingTime(0);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 30, // 30 seconds max
      });
      console.log('Video recorded:', video?.uri);
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;
    
    try {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      setRecordingTime(0);
      
      try {
        const videoData = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          duration: recordingTime,
          type: 'running',
          activity: 'Running',
          uri: 'recorded_video_uri',
          status: 'completed'
        };

        // Save individual video
        await AsyncStorage.setItem(
          `activity_video_${videoData.id}`,
          JSON.stringify(videoData)
        );

        // Update activity reports
        const existingReports = await AsyncStorage.getItem('activity_reports');
        const reports = existingReports ? JSON.parse(existingReports) : [];
        reports.push(videoData);
        await AsyncStorage.setItem('activity_reports', JSON.stringify(reports));

        Alert.alert(
          'Running Session Complete',
          'Your running session has been recorded and saved to your activity reports!',
          [
            { text: 'Record Again', style: 'cancel' },
            { 
              text: 'View Reports', 
              onPress: () => {
                router.back();
                setTimeout(() => {
                  router.push('/(tabs)/profile');
                }, 100);
              }
            }
          ]
        );
      } catch (error) {
        console.error('Failed to save activity data:', error);
        Alert.alert('Error', 'Failed to save activity data. Please try again.');
      }
    } catch (error) {
      console.error('Stop recording failed:', error);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading camera...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.permissionContainer}>
          <ThemedText type="subtitle">Camera Permission Required</ThemedText>
          <ThemedText type="default">
            We need camera access to perform your body scan before running.
          </ThemedText>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <ThemedText type="defaultSemiBold">Grant Camera Permission</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
        mode="video"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={() => router.back()}>
              <X size={24} color="white" />
            </Pressable>
            <View style={styles.scanInfo}>
              <Text style={styles.scanText}>AI Body Scan</Text>
              {isRecording && (
                <Text style={styles.recordingText}>
                  ● REC {formatRecordingTime(recordingTime)}
                </Text>
              )}
            </View>
            <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
              <RotateCcw size={24} color="white" />
            </Pressable>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.instructionText}>
              Stand in the frame for body analysis
            </Text>
            {isRecording ? (
              <Pressable style={styles.stopButton} onPress={stopRecording}>
                <Text style={styles.buttonText}>Stop Scan</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.startButton} onPress={startRecording}>
                <Text style={styles.buttonText}>Start Scan</Text>
              </Pressable>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  scanInfo: {
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  recordingText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  flipButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  scanFrame: {
    flex: 1,
    marginHorizontal: 40,
    marginVertical: 60,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#3B82F6',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});