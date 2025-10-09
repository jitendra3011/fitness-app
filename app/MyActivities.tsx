import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, getDocs, getDoc } from 'firebase/firestore';
import { Video, ResizeMode } from 'expo-av';
import { supabase } from '@/assets/supabaseClient';
import { MaterialIcons } from '@expo/vector-icons';

type VideoItem = {
  id: string;
  activity: string;
  url: string;
  uploadedAt?: any;  // Firestore timestamp
  storagePath?: string;
};

export default function MyActivities() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [playingItem, setPlayingItem] = useState<any | null>(null);
  const [playingItem, setPlayingItem] = useState<VideoItem | null>(null);


  const videoRef = useRef<Video>(null);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, 'users', uid, 'videos'), orderBy('uploadedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr: VideoItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<VideoItem, "id">),
      }));
      setVideos(arr);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);


  if (!uid) {
    return (
      <View style={styles.center}>
        <Text>Please login first.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // ✅ Delete handler
  const handleDelete = async (item: any) => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Delete from Supabase
            const { error } = await supabase.storage
              .from('VideoBucket')
              .remove([item.storagePath]);
            if (error) throw error;

            // Delete Firestore document
            await deleteDoc(doc(db, 'users', uid, 'videos', item.id));
            Alert.alert('Deleted', 'Video deleted successfully.');
          } catch (err) {
            console.error('Delete failed:', err);
            Alert.alert('Error', 'Could not delete video.');
          }
        },
      },
    ]);
  };


  // ✅ Upload ALL handler
  const handleUploadAll = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return Alert.alert("Error", "User not logged in");

      // 1️⃣ Get user profile
      const profileRef = doc(db, "users", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        return Alert.alert("Error", "Profile not found. Please complete your profile first.");
      }

      const profile = profileSnap.data();

      // 2️⃣ Get all user videos
      const videosSnap = await getDocs(collection(db, "users", user.uid, "videos"));
      const allVideos: VideoItem[] = videosSnap.docs.map(
        (d) => ({ id: d.id, ...(d.data() as Omit<VideoItem, "id">) })
      );


      // const videosCount = videosSnap.size;
      const videosCount = allVideos.length;

      if (videosCount === 0) {
        return Alert.alert("No Videos", "You don't have any videos to upload.");
      }
      const activities = allVideos.map((v) => v.activity);
      // 3️⃣ Upload ALL videos once
      await addDoc(collection(db, "admin", "videos", "submissions"), {
        userId: user.uid,
        userName: profile.fullname || "Anonymous",
        photo: profile.photoURL || "",
        age: profile.age || null,
        height: profile.height || null,
        weight: profile.weight || null,
        address: [profile.village, profile.city, profile.regionState].filter(Boolean).join(", "),
        mobile: profile.phone || "",
        email: profile.email || user.email,
        videosCount,
        activities,
        videos: allVideos,   // 🔥 Store all videos here
        uploadedAt: new Date(),
      });

      Alert.alert("Uploaded", "All your videos shared with admin successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Error", "Could not upload videos to admin page.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💪 My Activities 🏋️‍♀️</Text>
        <Text style={styles.headerSubtitle}>Track all your workouts and videos here!</Text>
      </View>

      {/* ✅ Upload All Button (only once) */}
      <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
        <Pressable style={styles.uploadAllBtn} onPress={handleUploadAll}>
          <Text style={styles.uploadAllText}>Upload All</Text>
        </Pressable>
      </View>

      {/* Video list */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.thumbnail}>
              <MaterialIcons name="play-circle-outline" size={50} color="#3B82F6" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.activity}>{item.activity}</Text>
              <Text style={styles.small}>
                {item.uploadedAt?.toDate ? item.uploadedAt.toDate().toLocaleString() : ''}
              </Text>
            </View>
            <View style={styles.cardButtons}>
              <Pressable style={styles.playBtn} onPress={() => setPlayingItem(item)}>
                <Text style={styles.playText}>Play</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Video modal */}
      <Modal
        visible={!!playingItem}
        animationType="slide"
        onRequestClose={() => {
          videoRef.current?.pauseAsync();
          setPlayingItem(null);
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'black', paddingTop: 40 }}>
          <Pressable
            onPress={() => {
              videoRef.current?.pauseAsync();
              setPlayingItem(null);
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
          </Pressable>

          {playingItem && (
            <Video
              ref={videoRef}
              source={{ uri: playingItem.url }}
              style={{ width: '100%', height: 400 }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingVertical: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, marginLeft: 12 },
  activity: { fontSize: 16, fontWeight: '600', color: '#111' },
  small: { color: '#6b7280', marginTop: 4, fontSize: 12 },
  cardButtons: { flexDirection: 'row', marginLeft: 8 },
  playBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  playText: { color: 'white', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteText: { color: 'white', fontWeight: '600' },
  uploadAllBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadAllText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
