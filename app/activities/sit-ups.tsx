import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import { RotateCcw, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';

export default function SitUpsActivity() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [count, setCount] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [movement, setMovement] = useState(false);

  const cameraRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accelerometerSub = useRef<{ remove: () => void } | null>(null);

  // 👇 add these refs at the top
const countRef = useRef(0);
const durationRef = useRef(0);

// whenever count or recordingTime updates, keep refs synced
useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  durationRef.current = recordingTime;
}, [recordingTime]);

  // Ask for permissions on mount
  useEffect(() => {
    (async () => {
      const cam = await requestCameraPermission();
      if (!cam?.granted) Alert.alert('Camera permission required');

      const mic = await requestMicPermission();
      if (!mic?.granted) Alert.alert('Microphone permission required');
    })();
  }, []);

  // Sit-up counting logic using accelerometer
  useEffect(() => {
    if (isRecording) {
      accelerometerSub.current = Accelerometer.addListener((data: AccelerometerMeasurement) => {
        const diff = data.y - lastY;

        if (!movement && diff < -0.3) setMovement(true);
        else if (movement && diff > 0.3) {
          setCount(prev => prev + 1);
          setMovement(false);
        }
        setLastY(data.y);
      });

      Accelerometer.setUpdateInterval(200);
    } else {
      accelerometerSub.current?.remove();
      accelerometerSub.current = null;
    }

    return () => accelerometerSub.current?.remove();
  }, [isRecording, lastY, movement]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleCameraFacing = () => setFacing(cur => (cur === 'back' ? 'front' : 'back'));

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      setIsRecording(true);
      setRecordingTime(0);
      setCount(0);

      intervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

      const videoPromise = cameraRef.current.recordAsync({
        maxDuration: 60,
        mute: true,
      });

      const video = await videoPromise;
      if (!video?.uri) throw new Error('Recording failed');

      await new Promise(resolve => setTimeout(resolve, 500)); // wait for last few sit-ups

      setUploading(true);

      const userId = getAuth().currentUser?.uid;
      if (!userId) throw new Error('User not logged in');

      // just before uploadVideoAndSave()
const finalCount = countRef.current;
const finalDuration = durationRef.current;

console.log('🔥 Final Sit-Ups Data:', {
  userId,
  activityName: 'Sit-Ups',
  situpCount: finalCount,
  duration: finalDuration,
});

      await uploadVideoAndSave(userId, 'Sit-Ups', video.uri, {
        situpCount: finalCount,
        duration: finalDuration,
      });

      Alert.alert('Session Completed', `You did ${finalCount} sit-ups!\nVideo uploaded successfully ✅`);
    } catch (err: any) {
      console.error('❌ Recording error:', err);
      Alert.alert('Error', err.message || String(err));
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRecording(false);
      setUploading(false);
    }
  };

  const stopRecording = async () => {
    accelerometerSub.current?.remove();
    accelerometerSub.current = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (cameraRef.current && isRecording) {
      await new Promise(resolve => setTimeout(resolve, 300)); // small delay for last count
      cameraRef.current.stopRecording();
    }
  };

  if (!cameraPermission || !micPermission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginBottom: 12 }}>Camera Permission Required</Text>
        <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Camera Permission</Text>
        </Pressable>
      </View>
    );
  }

  if (!micPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white', marginBottom: 12 }}>Microphone Permission Required</Text>
        <Pressable onPress={requestMicPermission} style={styles.permissionButton}>
          <Text style={{ color: 'white' }}>Grant Microphone Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="white" />
          </Pressable>

          <View style={styles.info}>
            <Text style={styles.title}>Sit Ups</Text>
            {isRecording && <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>}
            {isRecording && <Text style={styles.countText}>Count: {count}</Text>}
            {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
          </View>

          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="white" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.instructionText}>Make sure your upper body is visible while recording</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  info: { alignItems: 'center' },
  title: { color: 'white', fontSize: 20, fontWeight: '700' },
  recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
  countText: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 4 },
  footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
  instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
});

















//2.2 - Counting situps using accelerometer sensor - stop record error solved
// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
// import { RotateCcw, X } from 'lucide-react-native';
// import { router } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';

// export default function SitUpsActivity() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [micPermission, requestMicPermission] = useMicrophonePermissions();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [count, setCount] = useState(0);
//   const [lastY, setLastY] = useState(0);
//   const [movement, setMovement] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const accelerometerSub = useRef<{ remove: () => void } | null>(null);

//   // Request permissions
//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cam = await requestCameraPermission();
//       if (!cam?.granted) Alert.alert('Camera permission required');
//       const mic = await requestMicPermission();
//       if (!mic?.granted) Alert.alert('Microphone permission required');
//     };
//     requestPermissions();
//   }, []);

//   // Accelerometer sit-up counting
//   useEffect(() => {
//     if (isRecording) {
//       accelerometerSub.current = Accelerometer.addListener((data: AccelerometerMeasurement) => {
//         const diff = data.y - lastY;
//         if (!movement && diff < -0.3) setMovement(true);
//         else if (movement && diff > 0.3) {
//           setCount(prev => prev + 1);
//           setMovement(false);
//         }
//         setLastY(data.y);
//       });
//       Accelerometer.setUpdateInterval(200);
//     } else {
//       accelerometerSub.current?.remove();
//     }

//     return () => accelerometerSub.current?.remove();
//   }, [isRecording, lastY, movement]);

//   const formatRecordingTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };

//   const toggleCameraFacing = () => setFacing(cur => (cur === 'back' ? 'front' : 'back'));

//   const startRecording = async () => {
//     if (!cameraRef.current || isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
//       setCount(0);

//       intervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

//       const videoPromise = cameraRef.current.recordAsync({ maxDuration: 60, mute: true });

//       // Wait until stopRecording resolves
//       const video = await videoPromise;
//       if (!video?.uri) throw new Error('Recording failed');

//       // Wait a short delay to ensure count updates finish
//       await new Promise(resolve => setTimeout(resolve, 500));

//       setUploading(true);

//       const userId = getAuth().currentUser?.uid;
//       if (!userId) throw new Error('User not logged in');

//         // ✅ use finalCount snapshot to avoid losing last updates
//       const finalCount = count;
//       const finalDuration = recordingTime;

//       console.log('🔥 Final Sit-Ups Data:', {
//       userId,
//       activityName: 'Sit-Ups',
//       situpCount: finalCount,
//       duration: finalDuration,
//     });

//       // ✅ Use same upload method as High Jump
//       // const url = await uploadVideoAndSave(userId, 'Sit-Ups', video.uri);
//       await uploadVideoAndSave(userId, 'Sit-Ups', video.uri, {
//         situpCount: finalCount,
//         duration: recordingTime,
//       });

//       Alert.alert('Session Completed', `You did ${finalCount} sit-ups!\nVideo uploaded successfully ✅`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', String(err));
//     } finally {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       setIsRecording(false);
//       setUploading(false);
//     }
//   };

//   const stopRecording = async () => {
//      // Stop accelerometer first
//     accelerometerSub.current?.remove();
//     accelerometerSub.current = null;

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     if (cameraRef.current && isRecording) {
//     await new Promise(resolve => setTimeout(resolve, 300)); // small delay for last count
//     cameraRef.current.stopRecording(); // triggers resolve in startRecording
//   }
//   };

//   if (!cameraPermission || !micPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white' }}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!cameraPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Camera Permission Required</Text>
//         <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Camera Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   if (!micPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Microphone Permission Required</Text>
//         <Pressable onPress={requestMicPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Microphone Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

//       <View style={styles.overlay}>
//         <View style={styles.header}>
//           <Pressable style={styles.closeButton} onPress={() => router.back()}>
//             <X size={24} color="white" />
//           </Pressable>

//           <View style={styles.info}>
//             <Text style={styles.title}>Sit Ups</Text>
//             {isRecording && <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>}
//             {isRecording && <Text style={styles.countText}>Count: {count}</Text>}
//             {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
//           </View>

//           <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
//             <RotateCcw size={24} color="white" />
//           </Pressable>
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.instructionText}>Make sure your upper body is visible while recording</Text>
//           {isRecording ? (
//             <Pressable style={styles.stopButton} onPress={stopRecording}>
//               <Text style={styles.buttonText}>Stop Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable style={styles.startButton} onPress={startRecording}>
//               <Text style={styles.buttonText}>Start Recording</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
//   closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   info: { alignItems: 'center' },
//   title: { color: 'white', fontSize: 20, fontWeight: '700' },
//   recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
//   countText: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 4 },
//   footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
//   instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
//   startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
// });





// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
// import { RotateCcw, X } from 'lucide-react-native';
// import { router } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';
// import { db } from '@/firebase';
// import { getFirestore, doc, setDoc } from 'firebase/firestore';

// const db = getFirestore();

// export default function SitUpsActivity() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [micPermission, requestMicPermission] = useMicrophonePermissions();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [count, setCount] = useState(0);
//   const [lastY, setLastY] = useState(0);
//   const [movement, setMovement] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const accelerometerSub = useRef<{ remove: () => void } | null>(null);

//   // Request permissions
//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cam = await requestCameraPermission();
//       if (!cam?.granted) Alert.alert('Camera permission required');
//       const mic = await requestMicPermission();
//       if (!mic?.granted) Alert.alert('Microphone permission required');
//     };
//     requestPermissions();
//   }, []);

//   // Accelerometer sit-up counting
//   useEffect(() => {
//     if (isRecording) {
//       accelerometerSub.current = Accelerometer.addListener((data: AccelerometerMeasurement) => {
//         const diff = data.y - lastY;
//         if (!movement && diff < -0.3) setMovement(true);
//         else if (movement && diff > 0.3) {
//           setCount(prev => prev + 1);
//           setMovement(false);
//         }
//         setLastY(data.y);
//       });
//       Accelerometer.setUpdateInterval(200);
//     } else {
//       accelerometerSub.current?.remove();
//     }

//     return () => accelerometerSub.current?.remove();
//   }, [isRecording, lastY, movement]);

//   const formatRecordingTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };

//   const toggleCameraFacing = () => setFacing(cur => (cur === 'back' ? 'front' : 'back'));

//   const startRecording = async () => {
//     if (!cameraRef.current || isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
//       setCount(0);

//       intervalRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);

//       const videoPromise = cameraRef.current.recordAsync({ maxDuration: 60, mute: true });

//       // Wait until stopRecording resolves
//       const video = await videoPromise;
//       if (!video?.uri) throw new Error('Recording failed');

//       setUploading(true);

//       const userId = getAuth().currentUser?.uid;
//       if (!userId) throw new Error('User not logged in');

//       const videoUrl = await uploadVideoAndSave(userId, 'Sit Ups', video.uri);

//       // Save activity to Firestore
//       await setDoc(doc(db, 'users', userId, 'activities', `situps_${Date.now()}`), {
//         activity: 'Sit Ups',
//         count,
//         videoUrl,
//         recordedAt: new Date().toISOString(),
//       });

//       Alert.alert('Session Completed', `You did ${count} sit-ups!\nVideo uploaded successfully ✅`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', String(err));
//     } finally {
//       stopRecording();
//       setUploading(false);
//     }
//   };

//   const stopRecording = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     if (accelerometerSub.current) {
//       accelerometerSub.current.remove();
//       accelerometerSub.current = null;
//     }
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording();
//     }
//     setIsRecording(false);
//   };

//   if (!cameraPermission || !micPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white' }}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!cameraPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Camera Permission Required</Text>
//         <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Camera Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   if (!micPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Microphone Permission Required</Text>
//         <Pressable onPress={requestMicPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Microphone Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

//       <View style={styles.overlay}>
//         <View style={styles.header}>
//           <Pressable style={styles.closeButton} onPress={() => router.back()}>
//             <X size={24} color="white" />
//           </Pressable>

//           <View style={styles.info}>
//             <Text style={styles.title}>Sit Ups</Text>
//             {isRecording && <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>}
//             {isRecording && <Text style={styles.countText}>Count: {count}</Text>}
//             {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
//           </View>

//           <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
//             <RotateCcw size={24} color="white" />
//           </Pressable>
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.instructionText}>Make sure your upper body is visible while recording</Text>
//           {isRecording ? (
//             <Pressable style={styles.stopButton} onPress={stopRecording}>
//               <Text style={styles.buttonText}>Stop Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable style={styles.startButton} onPress={startRecording}>
//               <Text style={styles.buttonText}>Start Recording</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
//   closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   info: { alignItems: 'center' },
//   title: { color: 'white', fontSize: 20, fontWeight: '700' },
//   recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
//   countText: { color: 'white', fontSize: 16, fontWeight: '600', marginTop: 4 },
//   footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
//   instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
//   startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
// });









// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
// import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
// import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
// import { RotateCcw, X } from "lucide-react-native";
// import { router } from "expo-router";
// import { getAuth } from "firebase/auth";
// import { uploadVideoAndSave } from "@/assets/uploadVideoAndSave";
// import { db } from "@/firebase";
// import { doc, setDoc } from "firebase/firestore";

// export default function SitUpsActivity() {
//   // 🔧 States
//   const [facing, setFacing] = useState<"front" | "back">("front");
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [micPermission, requestMicPermission] = useMicrophonePermissions();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [count, setCount] = useState(0);
//   const [lastY, setLastY] = useState(0);
//   const [movement, setMovement] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const subscription = useRef<{ remove: () => void } | null>(null);

//   // 📷 Ask for permissions
//   useEffect(() => {
//     const getPermissions = async () => {
//       const cam = await requestCameraPermission();
//       const mic = await requestMicPermission();
//       if (!cam?.granted || !mic?.granted) {
//         Alert.alert("Permissions Required", "Camera and microphone access are needed.");
//       }
//     };
//     getPermissions();
//   }, []);

//   // 🤸 Sit-up counting logic using accelerometer
//   useEffect(() => {
//     if (isRecording) {
//       subscription.current = Accelerometer.addListener((data: AccelerometerMeasurement) => {
//         const diff = data.y - lastY;

//         if (!movement && diff < -0.3) {
//           setMovement(true);
//         } else if (movement && diff > 0.3) {
//           setCount((prev) => prev + 1);
//           setMovement(false);
//         }

//         setLastY(data.y);
//       });

//       Accelerometer.setUpdateInterval(200);
//     } else {
//       subscription.current?.remove();
//     }

//     return () => {
//       subscription.current?.remove();
//     };
//   }, [isRecording, lastY, movement]);

//   // 🎥 Start recording & count sit-ups
//   const startRecording = async () => {
//     if (!cameraRef.current) return;
//     if (!cameraPermission?.granted || !micPermission?.granted) {
//       await requestCameraPermission();
//       await requestMicPermission();
//       return;
//     }

//     try {
//       setIsRecording(true);
//       setCount(0);
//       setRecordingTime(0);

//       intervalRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);

//       const video = await cameraRef.current.recordAsync({ maxDuration: 60, mute: false });
//       if (!video?.uri) throw new Error("Recording failed.");

//       // 🧩 Upload to Supabase and save URL to Firestore
//       setUploading(true);
//       const userId = getAuth().currentUser?.uid;
//       if (!userId) throw new Error("User not logged in");

//       const videoUrl = await uploadVideoAndSave(userId, "Sit Ups", video.uri);

//       await setDoc(doc(db, "users", userId, "activities", "situps_" + Date.now()), {
//         activity: "Sit Ups",
//         count,
//         videoUrl,
//         recordedAt: new Date().toISOString(),
//       });

//       Alert.alert("Session Completed", `You did ${count} sit-ups!\nVideo uploaded successfully ✅`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", String(err));
//     } finally {
//       stopRecording();
//       setUploading(false);
//     }
//   };

//   // 🛑 Stop recording
//   const stopRecording = async () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     if (cameraRef.current && isRecording) {
//   try {
//     await cameraRef.current.stopRecording();
//   } catch (e) {
//     console.warn("Stop recording ignored:", e);
//   }
// }

//     setIsRecording(false);
//   };

//   const toggleCameraFacing = () =>
//     setFacing((cur) => (cur === "front" ? "back" : "front"));

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60).toString().padStart(2, "0");
//     const s = (sec % 60).toString().padStart(2, "0");
//     return `${m}:${s}`;
//   };

//   if (!cameraPermission || !micPermission) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color="white" />
//       </View>
//     );
//   }

//   if (!cameraPermission.granted || !micPermission.granted) {
//     return (
//       <View style={styles.center}>
//         <Text style={{ color: "white", marginBottom: 10 }}>Permissions required</Text>
//         <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
//           <Text style={{ color: "white" }}>Grant Permissions</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

//       <View style={styles.overlay}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Pressable style={styles.iconButton} onPress={() => router.back()}>
//             <X color="white" size={24} />
//           </Pressable>

//           <View style={{ alignItems: "center" }}>
//             <Text style={styles.title}>Sit Ups</Text>
//             {isRecording && (
//               <>
//                 <Text style={styles.recText}>● REC {formatTime(recordingTime)}</Text>
//                 <Text style={styles.countText}>Count: {count}</Text>
//               </>
//             )}
//             {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
//           </View>

//           <Pressable style={styles.iconButton} onPress={toggleCameraFacing}>
//             <RotateCcw color="white" size={24} />
//           </Pressable>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.tip}>Make sure your upper body is visible while recording</Text>

//           {isRecording ? (
//             <Pressable style={styles.stopButton} onPress={stopRecording}>
//               <Text style={styles.buttonText}>Stop Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable style={styles.startButton} onPress={startRecording}>
//               <Text style={styles.buttonText}>Start Recording</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// // 🎨 Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "black" },
//   overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   title: { color: "white", fontSize: 20, fontWeight: "bold" },
//   recText: { color: "#ef4444", fontSize: 14, marginTop: 4 },
//   countText: { color: "white", fontSize: 16, marginTop: 4, fontWeight: "700" },
//   iconButton: {
//     padding: 10,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     borderRadius: 20,
//   },
//   footer: {
//     alignItems: "center",
//     paddingBottom: 50,
//     paddingHorizontal: 20,
//   },
//   tip: { color: "white", textAlign: "center", marginBottom: 20 },
//   startButton: {
//     backgroundColor: "#3B82F6",
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   stopButton: {
//     backgroundColor: "#ef4444",
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
//   center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black" },
//   permissionButton: {
//     backgroundColor: "#3B82F6",
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
// });










// 3 - Counting situps using camera frame differencing
// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { RotateCcw, X } from 'lucide-react-native';
// import { router } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';
// import { db } from '@/firebase';
// import { doc, setDoc } from 'firebase/firestore';

// // Helper: convert small picture to grayscale pixels
// const getGrayscale = async (uri: string) => {
//   // take small resolution picture
//   // we will downsample to 64x64
//   // use react-native built-in fetch -> convert to blob -> arrayBuffer
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   const arrayBuffer = await blob.arrayBuffer();
//   const bytes = new Uint8Array(arrayBuffer);
//   // simple fake grayscale for prototype: sum bytes mod 256
//   const pixels = new Uint8Array(64 * 64);
//   for (let i = 0; i < pixels.length; i++) {
//     pixels[i] = bytes[i % bytes.length] % 256;
//   }
//   return pixels;
// };

// export default function Situps() {
//   const [facing, setFacing] = useState<CameraType>('front');
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [micPermission, requestMicPermission] = useMicrophonePermissions();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [uploading, setUploading] = useState(false);
//   const [situpCount, setSitupCount] = useState(0);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const frameIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const prevFrameRef = useRef<Uint8Array | null>(null);
//   const goingUp = useRef(false);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cam = await requestCameraPermission();
//       if (!cam?.granted) Alert.alert('Camera permission required');
//       const mic = await requestMicPermission();
//       if (!mic?.granted) Alert.alert('Microphone permission required');
//     };
//     requestPermissions();
//   }, []);

//   // Frame-based motion detection
//   const processFrame = async (uri: string) => {
//     const gray = await getGrayscale(uri);

//     if (prevFrameRef.current) {
//       let diff = 0;
//       for (let i = 0; i < gray.length; i++) {
//         diff += Math.abs(gray[i] - prevFrameRef.current[i]);
//       }
//       const motion = diff / gray.length;

//       if (motion > 20 && !goingUp.current) {
//         goingUp.current = true; // moving up
//       } else if (motion < 5 && goingUp.current) {
//         goingUp.current = false; // moving down -> count
//         setSitupCount((c) => c + 1);
//       }
//     }

//     prevFrameRef.current = gray;
//   };

//   useEffect(() => {
//   if (isRecording) {
//     frameIntervalRef.current = setInterval(async () => {
//       if (cameraRef.current) {
//         const frame = await cameraRef.current.takePictureAsync({ quality: 0.1, skipProcessing: true });
//         await processFrame(frame.uri);
//       }
//     }, 300);
//   } else if (frameIntervalRef.current) {
//     clearInterval(frameIntervalRef.current);
//     frameIntervalRef.current = null;
//   }

//   return () => {
//     if (frameIntervalRef.current) {
//       clearInterval(frameIntervalRef.current);
//       frameIntervalRef.current = null;
//     }
//   };
// }, [isRecording]);


//   const formatRecordingTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };

//   const toggleCameraFacing = () => setFacing((current) => (current === 'back' ? 'front' : 'back'));

//   const startRecording = async () => {
//     if (!cameraRef.current || isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);
//       setSitupCount(0);

//       intervalRef.current = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);

//       const videoPromise = cameraRef.current.recordAsync({ maxDuration: 60, mute: true });
//       const video = await videoPromise;

//       if (!video?.uri) throw new Error("Recording failed");

//       setUploading(true);
//       const userId = getAuth().currentUser?.uid;
//       if (!userId) throw new Error('User not logged in');

//       const url = await uploadVideoAndSave(userId, 'Sit Ups', video.uri);

//       await setDoc(doc(db, 'users', userId, 'activities', 'situps_' + Date.now()), {
//         activity: 'Sit Ups',
//         videoUrl: url,
//         count: situpCount,
//         recordedAt: new Date().toISOString(),
//       });

//       Alert.alert('Success', `Sit-ups: ${situpCount}\nVideo uploaded successfully!`);
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', String(err));
//     } finally {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       setIsRecording(false);
//       setUploading(false);
//     }
//   };

//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) cameraRef.current.stopRecording();
//   };

//   if (!cameraPermission || !micPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white' }}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!cameraPermission.granted || !micPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Camera & Mic Permission Required</Text>
//         <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Permissions</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />
//       <View style={styles.overlay}>
//         <View style={styles.header}>
//           <Pressable style={styles.closeButton} onPress={() => router.back()}>
//             <X size={24} color="white" />
//           </Pressable>

//           <View style={styles.scanInfo}>
//             <Text style={styles.scanText}>Sit Ups</Text>
//             {isRecording && (
//               <>
//                 <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>
//                 <Text style={styles.countText}>Count: {situpCount}</Text>
//               </>
//             )}
//             {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
//           </View>

//           <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
//             <RotateCcw size={24} color="white" />
//           </Pressable>
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.instructionText}>Place phone on floor facing you</Text>
//           {isRecording ? (
//             <Pressable style={styles.stopButton} onPress={stopRecording}>
//               <Text style={styles.buttonText}>Stop Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable style={styles.startButton} onPress={startRecording}>
//               <Text style={styles.buttonText}>Start Recording</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
//   header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
//   closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   scanInfo: { alignItems: 'center' },
//   scanText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
//   countText: { color: 'white', fontSize: 16, fontWeight: '700', marginTop: 4 },
//   footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
//   instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
//   startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
// });







// 1. only recording video without counting situps 
// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
// import { RotateCcw, X } from 'lucide-react-native';
// import { router } from 'expo-router';
// import { getAuth } from 'firebase/auth';
// import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';

// export default function Situps() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   const [micPermission, requestMicPermission] = useMicrophonePermissions();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const cam = await requestCameraPermission();
//       if (!cam?.granted) {
//         Alert.alert('Camera permission required');
//       }
//       const mic = await requestMicPermission();
//       if (!mic?.granted) {
//         Alert.alert('Microphone permission required');
//       }
//     };
//     requestPermissions();
//   }, []);

//   const formatRecordingTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };

//   const toggleCameraFacing = () => {
//     setFacing((current) => (current === 'back' ? 'front' : 'back'));
//   };

//   const startRecording = async () => {
//     if (!cameraRef.current || isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);

//       intervalRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1);
//       }, 1000);

//       const videoPromise = cameraRef.current.recordAsync({ maxDuration: 60, mute: true });

//       // Wait for recording to finish (stopRecording will resolve this)
//       const video = await videoPromise;

//       if (!video?.uri) throw new Error("Recording failed");

//       setUploading(true);

//       // Upload to Supabase + Firestore
//       const userId = getAuth().currentUser?.uid;
//       if (!userId) throw new Error('User not logged in');

//       const url = await uploadVideoAndSave(userId, 'Sit Ups', video.uri);

//       Alert.alert('Success', 'Video uploaded and saved to profile!');
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', String(err));
//     } finally {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       setIsRecording(false);
//       setUploading(false);
//     }
//   };

//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording(); // resolves recordAsync
//     }
//   };

//   if (!cameraPermission || !micPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white' }}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!cameraPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Camera Permission Required</Text>
//         <Pressable onPress={requestCameraPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Camera Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }
//   if (!micPermission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: 'white', marginBottom: 12 }}>Microphone Permission Required</Text>
//         <Pressable onPress={requestMicPermission} style={styles.permissionButton}>
//           <Text style={{ color: 'white' }}>Grant Microphone Permission</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

//       <View style={styles.overlay}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Pressable style={styles.closeButton} onPress={() => router.back()}>
//             <X size={24} color="white" />
//           </Pressable>

//           <View style={styles.scanInfo}>
//             <Text style={styles.scanText}>Sit Ups</Text>
//             {isRecording && (
//               <Text style={styles.recordingText}>● REC {formatRecordingTime(recordingTime)}</Text>
//             )}
//             {uploading && <ActivityIndicator color="white" style={{ marginTop: 4 }} />}
//           </View>

//           <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
//             <RotateCcw size={24} color="white" />
//           </Pressable>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.instructionText}>Stand in the frame to record Sit Ups</Text>
//           {isRecording ? (
//             <Pressable style={styles.stopButton} onPress={stopRecording}>
//               <Text style={styles.buttonText}>Stop Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable style={styles.startButton} onPress={startRecording}>
//               <Text style={styles.buttonText}>Start Recording</Text>
//             </Pressable>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'black' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
//   scanInfo: { alignItems: 'center' },
//   scanText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   recordingText: { color: '#ef4444', fontSize: 14, fontWeight: '600', marginTop: 4 },
//   footer: { alignItems: 'center', paddingBottom: 50, paddingHorizontal: 20 },
//   instructionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 },
//   startButton: { backgroundColor: '#3B82F6', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   stopButton: { backgroundColor: '#ef4444', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 25 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
//   permissionButton: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
// });
