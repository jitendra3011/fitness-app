import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { RotateCcw, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { uploadVideoAndSave } from '@/assets/uploadVideoAndSave';

export default function Pushups() {
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

    const url = await uploadVideoAndSave(userId, 'Pushups', video.uri);

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
            <Text style={styles.scanText}>Pushups Scan</Text>
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
          <Text style={styles.instructionText}>Stand in the frame to record pushups</Text>
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










// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
// // import { usePermissions, PermissionStatus } from 'expo-permissions'; // optional for mic
// import { router } from 'expo-router';
// import { RotateCcw, X } from 'lucide-react-native';
// import { useEffect, useRef, useState } from 'react';
// import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
// import { uploadVideoAndGetUrl } from "@/assets/firebaseUpload"; // helper banayenge niche
// import { getAuth } from "firebase/auth";
// // import * as Audio from 'expo-av';
// import { Audio } from 'expo-av';


// export default function CameraScreen() {
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [permission, requestPermission] = useCameraPermissions();

//   // const [cameraPermission, requestCameraPermission] = useCameraPermissions();
//   // const [audioPermission, requestAudioPermission] = Audio.usePermissions(); // 👈 mic permission

//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);

//   const cameraRef = useRef<any>(null);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

// useEffect(() => {
//   const requestAudioPermission = async () => {
//     const { status } = await Audio.requestPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission required", "Microphone permission is required to record audio");
//     }
//   };
//   requestAudioPermission();
// }, []);


// useEffect(() => {
//   const requestPermissions = async () => {
//     const cameraPermission = await requestPermission();
//     if (!cameraPermission?.granted) {
//       Alert.alert('Camera (and microphone) permission required');
//     }
//   };
//   requestPermissions();
// }, []);


//   // Auto start recording after 1s if permission granted
//   useEffect(() => {
//     if (permission?.granted) {
//       const timer = setTimeout(() => {
//         startRecording();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [permission?.granted]);

//   type CameraRecording = {
//   uri: string;
//   codec?: string;
//   duration?: number;
//   fileSize?: number;
// };


//   const startRecording = async () => {
//     if (!cameraRef.current || isRecording) return;

//     try {
//       setIsRecording(true);
//       setRecordingTime(0);

//       // counter start
//       intervalRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1);
//       }, 1000);

//        const video = await cameraRef.current.recordAsync({ maxDuration: 30, mute: false });

//     const formData = new FormData();
//     formData.append("video", {
//       uri: video.uri,
//       type: "video/mp4",
//       name: `video-${Date.now()}.mp4`,
//     } as any);

//     const response = await fetch("https://zippered-subcriminally-melisa.ngrok-free.dev/analyze", {
//       method: "POST",
//       body: formData,
//       // headers: {
//       //   "Content-Type": "multipart/form-data",
//       // },
//     });

//       // Check if response is OK
//   if (!response.ok) {
//     const text = await response.text();
//     console.error("Backend error response:", text);
//     Alert.alert("Error", `Backend error: ${text}`);
//     return;
//   }

//     const data = await response.json();
//     Alert.alert("Result", `Pushups counted: ${data.pushupCount}`);
//   } catch (err) {
//     console.error(err);
//     Alert.alert("Error", "Recording failed");
//   } finally {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setIsRecording(false);
//   }
// };

//   const stopRecording = () => {
//     if (cameraRef.current && isRecording) {
//       cameraRef.current.stopRecording(); // this works
//     }
//   };

//   const formatRecordingTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = (seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };

//   if (!permission) {
//     return (
//       <ThemedView style={styles.container}>
//         <ThemedText>Loading camera...</ThemedText>
//       </ThemedView>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <ThemedView style={styles.container}>
//         <View style={styles.permissionContainer}>
//           <ThemedText type="subtitle">Camera Permission Required</ThemedText>
//           <ThemedText type="default">
//             We need camera access to perform your body scan before running.
//           </ThemedText>
//           <Pressable style={styles.permissionButton} onPress={requestPermission}>
//             <ThemedText type="defaultSemiBold">Grant Camera Permission</ThemedText>
//           </Pressable>
//         </View>
//       </ThemedView>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing((current) => (current === 'back' ? 'front' : 'back'));
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView
//         ref={cameraRef}
//         style={StyleSheet.absoluteFill}
//         facing={facing}
//         mode="video"
//       />
//         <View style={styles.overlay}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Pressable style={styles.closeButton} onPress={() => router.back()}>
//               <X size={24} color="white" />
//             </Pressable>
//             <View style={styles.scanInfo}>
//               <Text style={styles.scanText}>AI Body Scan</Text>
//               {isRecording && (
//                 <Text style={styles.recordingText}>
//                   ● REC {formatRecordingTime(recordingTime)}
//                 </Text>
//               )}
//             </View>
//             <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
//               <RotateCcw size={24} color="white" />
//             </Pressable>
//           </View>

//           {/* Scan Frame */}
//           <View style={styles.scanFrame}>
//             <View style={styles.corner} />
//             <View style={[styles.corner, styles.topRight]} />
//             <View style={[styles.corner, styles.bottomLeft]} />
//             <View style={[styles.corner, styles.bottomRight]} />
//           </View>

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.instructionText}>
//               Stand in the frame for body analysis
//             </Text>
//             {isRecording ? (
//               <Pressable style={styles.stopButton} onPress={stopRecording}>
//                 <Text style={styles.buttonText}>Stop Scan</Text>
//               </Pressable>
//             ) : (
//               <Pressable style={styles.startButton} onPress={startRecording}>
//                 <Text style={styles.buttonText}>Start Scan</Text>
//               </Pressable>
//             )}
//           </View>
//         </View>
//       {/* </CameraView> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   closeButton: {
//     padding: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//   },
//   scanInfo: {
//     alignItems: 'center',
//   },
//   scanText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   recordingText: {
//     color: '#ef4444',
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   flipButton: {
//     padding: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//   },
//   scanFrame: {
//     flex: 1,
//     marginHorizontal: 40,
//     marginVertical: 60,
//     position: 'relative',
//   },
//   corner: {
//     position: 'absolute',
//     width: 40,
//     height: 40,
//     borderColor: '#3B82F6',
//     borderWidth: 3,
//     top: 0,
//     left: 0,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   topRight: {
//     top: 0,
//     right: 0,
//     left: 'auto',
//     borderLeftWidth: 0,
//     borderRightWidth: 3,
//     borderBottomWidth: 0,
//   },
//   bottomLeft: {
//     bottom: 0,
//     top: 'auto',
//     left: 0,
//     borderRightWidth: 0,
//     borderTopWidth: 0,
//     borderBottomWidth: 3,
//   },
//   bottomRight: {
//     bottom: 0,
//     right: 0,
//     top: 'auto',
//     left: 'auto',
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     borderRightWidth: 3,
//     borderBottomWidth: 3,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingBottom: 50,
//     paddingHorizontal: 20,
//   },
//   instructionText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   startButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   stopButton: {
//     backgroundColor: '#ef4444',
//     paddingHorizontal: 40,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   permissionContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     gap: 16,
//   },
//   permissionButton: {
//     backgroundColor: '#3B82F6',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
// });