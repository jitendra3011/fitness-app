import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Video, ResizeMode } from 'expo-av';
import { supabase } from '@/assets/supabaseClient';
import { MaterialIcons } from '@expo/vector-icons';

export default function MyActivities() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingItem, setPlayingItem] = useState<any | null>(null);

  const videoRef = useRef<Video>(null);
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const q = query(collection(db, 'users', uid, 'videos'), orderBy('uploadedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💪 My Activities 🏋️‍♀️</Text>
        <Text style={styles.headerSubtitle}>Track all your workouts and videos here!</Text>
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
});










// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Modal, Image, Alert } from 'react-native';
// import { getAuth } from 'firebase/auth';
// import { db } from '@/firebase';
// import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
// import { Video, ResizeMode } from 'expo-av';
// import { supabase } from '@/assets/supabaseClient';

// export default function MyActivities() {
//     const [videos, setVideos] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [playingItem, setPlayingItem] = useState<any | null>(null);

//     const videoRef = useRef<Video>(null);
//     const uid = getAuth().currentUser?.uid;

//     useEffect(() => {
//         if (!uid) return;

//         const q = query(collection(db, 'users', uid, 'videos'), orderBy('uploadedAt', 'desc'));
//         const unsub = onSnapshot(q, (snap) => {
//             const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//             setVideos(arr);
//             setLoading(false);
//         });

//         return () => unsub();
//     }, [uid]);

//     if (!uid) {
//         return (
//             <View style={styles.center}>
//                 <Text>Please login first.</Text>
//             </View>
//         );
//     }

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator />
//             </View>
//         );
//     }

//     // Delete function
//     const handleDelete = async (item: any) => {
//         Alert.alert(
//             'Delete Video',
//             'Are you sure you want to delete this video?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: async () => {
//                         try {
//                             // 1) Delete from Supabase
//                             const { error } = await supabase.storage.from('VideoBucket').remove([item.storagePath]);
//                             if (error) throw error;

//                             // 2) Delete Firestore document
//                             await deleteDoc(doc(db, 'users', uid, 'videos', item.id));
//                             Alert.alert('Deleted', 'Video deleted successfully.');
//                         } catch (err) {
//                             console.error('Delete failed:', err);
//                             Alert.alert('Error', 'Could not delete video.');
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     return (
//         <View style={styles.container}>
//             {/* Header / Heading */}
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>💪 My Activities 🏋️‍♀️</Text>
//                 <Text style={styles.headerSubtitle}>
//                     Track all your workouts and videos here!
//                 </Text>
//             </View>

//             <FlatList
//                 data={videos}
//                 keyExtractor={(item) => item.id}
//                 contentContainerStyle={{ padding: 16 }}
//                 renderItem={({ item }) => (
//                     <View style={styles.card}>
//                         <Image
//                             source={{ uri: item.thumbnailUrl || item.url }}
//                             style={styles.thumbnail}
//                             resizeMode="cover"
//                         />
//                         <View style={{ flex: 1, marginLeft: 10 }}>
//                             <Text style={styles.activity}>{item.activity}</Text>
//                             <Text style={styles.small}>
//                                 {item.uploadedAt?.toDate ? item.uploadedAt.toDate().toLocaleString() : ''}
//                             </Text>
//                         </View>

//                         <Pressable style={styles.playBtn} onPress={() => setPlayingItem(item)}>
//                             <Text style={styles.playText}>Play</Text>
//                         </Pressable>

//                         <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item)}>
//                             <Text style={styles.deleteText}>Delete</Text>
//                         </Pressable>
//                     </View>
//                 )}
//             />

//             {/* Video modal */}
//             <Modal
//                 visible={!!playingItem}
//                 animationType="slide"
//                 onRequestClose={() => {
//                     videoRef.current?.pauseAsync();
//                     setPlayingItem(null);
//                 }}
//             >
//                 <View style={{ flex: 1, backgroundColor: 'black', paddingTop: 40 }}>
//                     <Pressable
//                         onPress={() => {
//                             videoRef.current?.pauseAsync();
//                             setPlayingItem(null);
//                         }}
//                         style={{ paddingHorizontal: 16, paddingVertical: 8 }}
//                     >
//                         <Text style={{ color: 'white' }}>Close</Text>
//                     </Pressable>

//                     {playingItem && (
//                         <Video
//                             ref={videoRef}
//                             source={{ uri: playingItem.url }}
//                             style={{ width: '100%', height: 400 }}
//                             useNativeControls
//                             resizeMode={ResizeMode.CONTAIN}
//                             shouldPlay={false}
//                         />
//                     )}
//                 </View>
//             </Modal>
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: 'white' },
//     center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//     card: {
//         flexDirection: 'row',
//         backgroundColor: '#f8fafc',
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 12,
//         alignItems: 'center'
//     },
//     thumbnail: {
//         width: 80,
//         height: 60,
//         borderRadius: 6,
//         backgroundColor: '#ccc'
//     },
//     activity: { fontSize: 16, fontWeight: '600' },
//     small: { color: '#6b7280', marginTop: 4 },
//     playBtn: {
//         backgroundColor: '#3B82F6',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 6,
//         marginLeft: 8
//     },
//     playText: { color: 'white', fontWeight: '600' },
//     deleteBtn: {
//         backgroundColor: '#ef4444',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 6,
//         marginLeft: 8
//     },
//     deleteText: { color: 'white', fontWeight: '600' },
//     header: {
//         paddingVertical: 24,
//         paddingHorizontal: 20,
//         backgroundColor: '#f8fafc',
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//         alignItems: 'center', // center title
//     },
//     headerTitle: {
//         fontSize: 26,
//         fontWeight: '700',
//         color: '#111',
//         textAlign: 'center',
//         marginBottom: 6,
//         paddingTop: 40,
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         color: '#6b7280',
//         textAlign: 'center',
//     },
// });
