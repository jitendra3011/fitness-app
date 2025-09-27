import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { RotateCcw, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';

export default function ShuttleRun() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);

  const cameraRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await requestPermission();
      if (!cameraPermission?.granted) {
        Alert.alert('Camera permission required');
      }
    };
    requestPermissions();
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
  if (!cameraRef.current || isRecording) return;

  try {
    setIsRecording(true);
    setRecordingTime(0);

    intervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    const videoPromise = cameraRef.current.recordAsync({ maxDuration: 60, mute: false });

    // Wait for recording to finish (stopRecording will resolve this)
    const video = await videoPromise;

    if (!video?.uri) throw new Error("Recording failed");

    setUploading(true);

    // Upload to Supabase + Firestore
    const userId = getAuth().currentUser?.uid;
    if (!userId) throw new Error('User not logged in');

    const url = await uploadVideoAndSave(userId, 'Shuttle Run', video.uri);

    Alert.alert('Success', 'Video uploaded and saved to profile!');
  } catch (err) {
    console.error(err);
    Alert.alert('Error', String(err));
  } finally {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRecording(false);
    setUploading(false);
  }
};

const stopRecording = () => {
  if (cameraRef.current && isRecording) {
    cameraRef.current.stopRecording(); // resolves recordAsync
  }
};

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginBottom: 12 }}>Camera Permission Required</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="white" />
          </Pressable>

          <View style={styles.scanInfo}>
            <Text style={styles.scanText}>Shuttle Run</Text>
            {isRecording && (
              <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>
            )}
            {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
          </View>

          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="white" />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.instructionText}>Stand in the frame to record Shuttle Run</Text>
          {isRecording ? (
            <Pressable style={styles.stopButton} onPress={stopRecording}>
              <Text style={styles.buttonText}>Stop Recording</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.startButton} onPress={startRecording}>
              <Text style={styles.buttonText}>Start Recording</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  scanInfo: { alignItems: 'center' },
  scanText: { color: 'white', fontSize: 18, fontWeight: '600' },
  recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
  footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
  instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
});
