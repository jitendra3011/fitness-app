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

  const cameraRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto start recording after 1s if permission granted
  useEffect(() => {
    if (permission?.granted) {
      const timer = setTimeout(() => {
        startRecording();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [permission?.granted]);

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);

      // counter start
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      await cameraRef.current.startRecording({
        maxDuration: 30,
        onRecordingFinished: async (video: { uri: string }) => {
          console.log('Video recorded:', video?.uri);

          const videoData = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            duration: recordingTime,
            type: 'body_scan',
            uri: video?.uri,
          };

          await AsyncStorage.setItem(
            'body_scan_video',
            JSON.stringify(videoData)
          );

          Alert.alert(
            'Body Scan Complete',
            'Your body scan has been recorded successfully! The video has been saved to your profile.',
            [
              { text: 'Scan Again', style: 'cancel' },
              {
                text: 'View Profile',
                onPress: () => {
                  router.back();
                  setTimeout(() => {
                    router.push('/(tabs)/profile');
                  }, 100);
                },
              },
            ]
          );
        },
        onRecordingError: (error: any) => {
          console.error('Recording failed:', error);
          Alert.alert('Error', 'Failed to record video');
        },
      });
    } catch (error) {
      console.error('Recording failed:', error);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const stopRecording = async () => {
    try {
      if (cameraRef.current && isRecording) {
        await cameraRef.current.stopRecording();
      }
    } catch (error) {
      console.error('Stop recording failed:', error);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRecording(false);
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
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
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
          {/* Header */}
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

          {/* Scan Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Footer */}
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