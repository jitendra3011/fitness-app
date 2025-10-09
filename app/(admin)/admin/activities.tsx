import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { db } from "@/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";

type VideoItem = {
  id: string;
  activity: string;
  url: string;
  uploadedAt?: any;
};

type Submission = {
  id: string;
  userId: string;
  userName: string;
  photo?: string;
  age?: number;
  height?: number;
  weight?: number;
  address?: string;
  videos: VideoItem[];
  status?: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  uploadedAt?: any;
};

export default function AdminActivitiesScreen() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const videoRef = useRef<Video>(null); // 🎬 Ref for controlling video

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "admin", "videos", "submissions"),
      (snap) => {
        const arr: Submission[] = snap.docs.map((d) => ({
          ...(d.data() as Submission),
          id: d.id,
        }));
        setSubmissions(arr);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "admin", "videos", "submissions", id), {
        status: "approved",
        reviewedBy: "Admin",
      });
      Alert.alert("✅ Success", "Submission approved successfully");
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", "Could not approve submission");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "admin", "videos", "submissions", id), {
        status: "rejected",
        reviewedBy: "Admin",
      });
      Alert.alert("⚠️ Rejected", "Submission rejected");
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error", "Could not reject submission");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved": return "#10B981";
      case "rejected": return "#EF4444";
      default: return "#F59E0B";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved": return "check-circle";
      case "rejected": return "cancel";
      default: return "pending";
    }
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => !s.status || s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const filtered = submissions.filter((s) =>
    filter === "all" ? true : (s.status || "pending") === filter
  );

  const formatAddress = (a: any) =>
    typeof a === "string"
      ? a
      : a
        ? [a.village, a.city, a.state, a.country].filter(Boolean).join(", ")
        : "N/A";

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <MaterialIcons name="dashboard" size={30} color="white" />
            <Text style={styles.headerTitle}>Video Submissions</Text>
          </View>
        </View>

        {/* STATS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {[
            { key: "all", icon: "assignment", color: "#6366F1", count: stats.total, label: "Total" },
            { key: "pending", icon: "pending", color: "#F59E0B", count: stats.pending, label: "Pending" },
            { key: "approved", icon: "check-circle", color: "#10B981", count: stats.approved, label: "Approved" },
            { key: "rejected", icon: "cancel", color: "#EF4444", count: stats.rejected, label: "Rejected" },
          ].map((item) => (
            <Pressable
              key={item.key}
              style={[styles.statCard, filter === item.key && styles.statCardActive]}
              onPress={() => setFilter(item.key as any)}
            >
              <View style={[styles.statIconBg, { backgroundColor: item.color + "15" }]}>
                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={styles.statNumber}>{item.count}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* SUBMISSIONS */}
        <View style={styles.listWrapper}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={80} color="#D1D5DB" />
              <Text style={styles.emptyText}>No submissions found</Text>
            </View>
          ) : (
            filtered.map((item) => (
              <View key={item.id} style={styles.card}>
                {/* STATUS BADGE */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "15" }]}>
                  <MaterialIcons name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
                  <Text style={[styles.statusLabel, { color: getStatusColor(item.status) }]}>
                    {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Pending"}
                  </Text>
                </View>

                {/* PROFILE */}
                <View style={styles.profileSection}>
                  <View style={styles.avatarWrapper}>
                    {item.photo ? (
                      <Image source={{ uri: item.photo }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <MaterialIcons name="person" size={40} color="white" />
                      </View>
                    )}
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.fullName}>{item.userName}</Text>
                    <View style={styles.infoRow}>
                      {item.age && <Text style={styles.infoText}>🎂 {item.age} yrs</Text>}
                      {item.height && <Text style={styles.infoText}>📏 {item.height} cm</Text>}
                      {item.weight && <Text style={styles.infoText}>⚖️ {item.weight} kg</Text>}
                    </View>
                    <Text style={styles.addressText}>📍 {formatAddress(item.address)}</Text>
                    <Text style={styles.dateText}>
                      ⏰ {item.uploadedAt?.toDate ? item.uploadedAt.toDate().toLocaleString() : "N/A"}
                    </Text>
                  </View>
                </View>

                {/* VIDEOS */}
                <View style={styles.activitiesSection}>
                  <View style={styles.activitiesHeader}>
                    <MaterialIcons name="video-library" size={20} color="#6366F1" />
                    <Text style={styles.activitiesTitle}>Activities</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{item.videos.length}</Text>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activitiesScroll}>
                    {item.videos.map((v) => (
                      <Pressable key={v.id} style={styles.activityCard} onPress={() => setSelectedVideo(v.url)}>
                        <MaterialIcons name="play-circle-filled" size={36} color="#6366F1" />
                        <Text style={styles.activityName} numberOfLines={2}>{v.activity}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.buttonRow}>
                  {item.status !== "approved" && (
                    <Pressable style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                      <MaterialIcons name="check" size={20} color="white" />
                      <Text style={styles.buttonText}>Approve</Text>
                    </Pressable>
                  )}
                  {item.status !== "rejected" && (
                    <Pressable style={styles.rejectButton} onPress={() => handleReject(item.id)}>
                      <MaterialIcons name="close" size={20} color="white" />
                      <Text style={styles.buttonText}>Reject</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* VIDEO OVERLAY */}
      {selectedVideo && (
        <View style={styles.videoOverlay}>
          <Pressable
            style={styles.overlayBg}
            onPress={() => {
              videoRef.current?.pauseAsync();
              setSelectedVideo(null);
            }}
          />
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: selectedVideo }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls
              style={{ width: "100%", height: 250, borderRadius: 12 }}
            />
            <Pressable
              onPress={() => {
                videoRef.current?.pauseAsync();
                setSelectedVideo(null);
              }}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#6B7280", fontSize: 16 },

  header: { backgroundColor: "#6366F1", paddingTop: 30, paddingBottom: 30 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20 },
  headerTitle: { color: "white", fontSize: 26, fontWeight: "800" },

  statsContainer: { paddingHorizontal: 16, gap: 12, marginVertical: 12 },
  statCard: { backgroundColor: "white", borderRadius: 16, padding: 18, alignItems: "center", minWidth: 110, elevation: 3 },
  statCardActive: { borderColor: "#6366F1", borderWidth: 2, transform: [{ scale: 1.03 }] },
  statIconBg: { padding: 10, borderRadius: 30, marginBottom: 8 },
  statNumber: { fontSize: 24, fontWeight: "900", color: "#111827" },
  statLabel: { fontSize: 13, color: "#6B7280", fontWeight: "700" },

  listWrapper: { padding: 16 },
  emptyState: { alignItems: "center", paddingVertical: 80 },
  emptyText: { fontSize: 16, color: "#9CA3AF", fontWeight: "600", marginTop: 10 },

  card: { backgroundColor: "white", borderRadius: 20, padding: 18, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 3, position: "relative" },
  statusBadge: { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, gap: 4 },
  statusLabel: { fontSize: 12, fontWeight: "700" },

  profileSection: { flexDirection: "row", marginTop: 16, marginBottom: 12 },
  avatarWrapper: { marginRight: 14 },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  avatarPlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#6366F1", alignItems: "center", justifyContent: "center" },
  profileInfo: { flex: 1, justifyContent: "center" },
  fullName: { fontSize: 18, fontWeight: "800", color: "#111827" },
  infoRow: { flexDirection: "row", gap: 8, marginVertical: 4 },
  infoText: { color: "#4B5563", fontSize: 13, fontWeight: "600" },
  addressText: { color: "#6B7280", fontSize: 13 },
  dateText: { color: "#9CA3AF", fontSize: 12, fontStyle: "italic", marginTop: 2 },

  activitiesSection: { marginTop: 12 },
  activitiesHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  activitiesTitle: { fontWeight: "800", fontSize: 16, color: "#374151" },
  countBadge: { backgroundColor: "#EEF2FF", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: "#6366F1", fontWeight: "800" },
  activitiesScroll: { gap: 12 },
  activityCard: { width: 110, alignItems: "center", backgroundColor: "#F3F4F6", padding: 10, borderRadius: 14 },
  activityName: { textAlign: "center", fontSize: 13, color: "#374151", fontWeight: "700" },

  buttonRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  approveButton: { flex: 1, backgroundColor: "#10B981", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 12, gap: 6 },
  rejectButton: { flex: 1, backgroundColor: "#EF4444", flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 12, gap: 6 },
  buttonText: { color: "white", fontWeight: "700", fontSize: 15 },

  videoOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 999 },
  overlayBg: { ...StyleSheet.absoluteFillObject },
  videoContainer: { width: "90%", backgroundColor: "#000", borderRadius: 12, overflow: "hidden" },
  closeButton: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 20, padding: 6 },
});








// // 2
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { db } from "@/firebase";
// import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Video } from "expo-av";

// type VideoItem = {
//   id: string;
//   activity: string;
//   url: string;
//   uploadedAt?: any;
// };

// type Submission = {
//   id: string;
//   userId: string;
//   userName: string;
//   photo?: string;
//   age?: number;
//   height?: number;
//   weight?: number;
//   address?: string;
//   videos: VideoItem[];
//   status?: "pending" | "approved" | "rejected";
//   reviewedBy?: string;
//   uploadedAt?: any;
// };

// export default function AdminActivitiesScreen() {
//   const [submissions, setSubmissions] = useState<Submission[]>([]);
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<
//     "all" | "pending" | "approved" | "rejected"
//   >("all");

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "admin", "videos", "submissions"),
//       (snap) => {
//         const arr: Submission[] = snap.docs.map((d) => ({
//           ...(d.data() as Submission),
//           id: d.id,
//         }));
//         setSubmissions(arr);
//         setLoading(false);
//       }
//     );
//     return () => unsub();
//   }, []);

//   const handleApprove = async (id: string) => {
//     try {
//       await updateDoc(doc(db, "admin", "videos", "submissions", id), {
//         status: "approved",
//         reviewedBy: "Admin",
//       });
//       Alert.alert("✅ Success", "Submission approved successfully");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("❌ Error", "Could not approve submission");
//     }
//   };

//   const handleReject = async (id: string) => {
//     try {
//       await updateDoc(doc(db, "admin", "videos", "submissions", id), {
//         status: "rejected",
//         reviewedBy: "Admin",
//       });
//       Alert.alert("⚠️ Rejected", "Submission rejected");
//     } catch (err) {
//       console.error(err);
//       Alert.alert("❌ Error", "Could not reject submission");
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case "approved":
//         return "#10B981";
//       case "rejected":
//         return "#EF4444";
//       default:
//         return "#F59E0B";
//     }
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status) {
//       case "approved":
//         return "check-circle";
//       case "rejected":
//         return "cancel";
//       default:
//         return "pending";
//     }
//   };

//   const stats = {
//     total: submissions.length,
//     pending: submissions.filter((s) => !s.status || s.status === "pending")
//       .length,
//     approved: submissions.filter((s) => s.status === "approved").length,
//     rejected: submissions.filter((s) => s.status === "rejected").length,
//   };

//   const filtered = submissions.filter((s) =>
//     filter === "all" ? true : (s.status || "pending") === filter
//   );

//   const formatAddress = (a: any) =>
//     typeof a === "string"
//       ? a
//       : a
//       ? [a.village, a.city, a.state, a.country].filter(Boolean).join(", ")
//       : "N/A";

//   if (loading)
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6366F1" />
//         <Text style={styles.loadingText}>Loading submissions...</Text>
//       </View>
//     );

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View style={styles.headerRow}>
//           <MaterialIcons name="dashboard" size={30} color="white" />
//           <Text style={styles.headerTitle}>Video Submissions</Text>
//         </View>
//       </View>

//       {/* STATS */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.statsContainer}
//       >
//         {[
//           { key: "all", icon: "assignment", color: "#6366F1", count: stats.total, label: "Total" },
//           { key: "pending", icon: "pending", color: "#F59E0B", count: stats.pending, label: "Pending" },
//           { key: "approved", icon: "check-circle", color: "#10B981", count: stats.approved, label: "Approved" },
//           { key: "rejected", icon: "cancel", color: "#EF4444", count: stats.rejected, label: "Rejected" },
//         ].map((item) => (
//           <Pressable
//             key={item.key}
//             style={[
//               styles.statCard,
//               filter === item.key && styles.statCardActive,
//             ]}
//             onPress={() => setFilter(item.key as any)}
//           >
//             <View
//               style={[
//                 styles.statIconBg,
//                 { backgroundColor: item.color + "15" },
//               ]}
//             >
//               <MaterialIcons name={item.icon as any} size={24} color={item.color} />
//             </View>
//             <Text style={styles.statNumber}>{item.count}</Text>
//             <Text style={styles.statLabel}>{item.label}</Text>
//           </Pressable>
//         ))}
//       </ScrollView>

//       {/* SUBMISSIONS */}
//       <View style={styles.listWrapper}>
//         {filtered.length === 0 ? (
//           <View style={styles.emptyState}>
//             <MaterialIcons name="inbox" size={80} color="#D1D5DB" />
//             <Text style={styles.emptyText}>No submissions found</Text>
//           </View>
//         ) : (
//           filtered.map((item) => (
//             <View key={item.id} style={styles.card}>
//               {/* STATUS BADGE */}
//               <View
//                 style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(item.status) + "15" },
//                 ]}
//               >
//                 <MaterialIcons
//                   name={getStatusIcon(item.status)}
//                   size={16}
//                   color={getStatusColor(item.status)}
//                 />
//                 <Text
//                   style={[
//                     styles.statusLabel,
//                     { color: getStatusColor(item.status) },
//                   ]}
//                 >
//                   {item.status
//                     ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
//                     : "Pending"}
//                 </Text>
//               </View>

//               {/* PROFILE */}
//               <View style={styles.profileSection}>
//                 <View style={styles.avatarWrapper}>
//                   {item.photo ? (
//                     <Image source={{ uri: item.photo }} style={styles.avatar} />
//                   ) : (
//                     <View style={styles.avatarPlaceholder}>
//                       <MaterialIcons name="person" size={40} color="white" />
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.profileInfo}>
//                   <Text style={styles.fullName}>{item.userName}</Text>

//                   <View style={styles.infoRow}>
//                     {item.age && (
//                       <Text style={styles.infoText}>🎂 {item.age} yrs</Text>
//                     )}
//                     {item.height && (
//                       <Text style={styles.infoText}>📏 {item.height} cm</Text>
//                     )}
//                     {item.weight && (
//                       <Text style={styles.infoText}>⚖️ {item.weight} kg</Text>
//                     )}
//                   </View>

//                   <Text style={styles.addressText}>
//                     📍 {formatAddress(item.address)}
//                   </Text>
//                   <Text style={styles.dateText}>
//                     ⏰{" "}
//                     {item.uploadedAt?.toDate
//                       ? item.uploadedAt.toDate().toLocaleString()
//                       : "N/A"}
//                   </Text>
//                 </View>
//               </View>

//               {/* VIDEOS */}
//               <View style={styles.activitiesSection}>
//                 <View style={styles.activitiesHeader}>
//                   <MaterialIcons
//                     name="video-library"
//                     size={20}
//                     color="#6366F1"
//                   />
//                   <Text style={styles.activitiesTitle}>Activities</Text>
//                   <View style={styles.countBadge}>
//                     <Text style={styles.countText}>{item.videos.length}</Text>
//                   </View>
//                 </View>

//                 <ScrollView
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.activitiesScroll}
//                 >
//                   {item.videos.map((v) => (
//                     <View key={v.id} style={styles.activityCard}>
//                       <MaterialIcons
//                         name="play-circle-filled"
//                         size={36}
//                         color="#6366F1"
//                       />
//                       <Text style={styles.activityName} numberOfLines={2}>
//                         {v.activity}
//                       </Text>
//                     </View>
//                   ))}
//                 </ScrollView>
//               </View>

//               {/* ACTION BUTTONS */}
//               <View style={styles.buttonRow}>
//                 {item.status !== "approved" && (
//                   <Pressable
//                     style={styles.approveButton}
//                     onPress={() => handleApprove(item.id)}
//                   >
//                     <MaterialIcons name="check" size={20} color="white" />
//                     <Text style={styles.buttonText}>Approve</Text>
//                   </Pressable>
//                 )}
//                 {item.status !== "rejected" && (
//                   <Pressable
//                     style={styles.rejectButton}
//                     onPress={() => handleReject(item.id)}
//                   >
//                     <MaterialIcons name="close" size={20} color="white" />
//                     <Text style={styles.buttonText}>Reject</Text>
//                   </Pressable>
//                 )}
//               </View>
//             </View>
//           ))
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   loadingText: { marginTop: 12, color: "#6B7280", fontSize: 16 },

//   header: { backgroundColor: "#6366F1", paddingTop: 30, paddingBottom: 30 },
//   headerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20 },
//   headerTitle: { color: "white", fontSize: 26, fontWeight: "800" },

//   statsContainer: { paddingHorizontal: 16, gap: 12, marginVertical: 12 },
//   statCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 18,
//     alignItems: "center",
//     minWidth: 110,
//     elevation: 3,
//   },
//   statCardActive: { borderColor: "#6366F1", borderWidth: 2, transform: [{ scale: 1.03 }] },
//   statIconBg: { padding: 10, borderRadius: 30, marginBottom: 8 },
//   statNumber: { fontSize: 24, fontWeight: "900", color: "#111827" },
//   statLabel: { fontSize: 13, color: "#6B7280", fontWeight: "700" },

//   listWrapper: { padding: 16 },
//   emptyState: { alignItems: "center", paddingVertical: 80 },
//   emptyText: { fontSize: 16, color: "#9CA3AF", fontWeight: "600", marginTop: 10 },

//   card: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 18,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//     position: "relative",
//   },
//   statusBadge: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 20,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     gap: 4,
//   },
//   statusLabel: { fontSize: 12, fontWeight: "700" },

//   profileSection: { flexDirection: "row", marginTop: 16, marginBottom: 12 },
//   avatarWrapper: { marginRight: 14 },
//   avatar: { width: 70, height: 70, borderRadius: 35 },
//   avatarPlaceholder: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "#6366F1",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   profileInfo: { flex: 1, justifyContent: "center" },
//   fullName: { fontSize: 18, fontWeight: "800", color: "#111827" },
//   infoRow: { flexDirection: "row", gap: 8, marginVertical: 4 },
//   infoText: { color: "#4B5563", fontSize: 13, fontWeight: "600" },
//   addressText: { color: "#6B7280", fontSize: 13 },
//   dateText: { color: "#9CA3AF", fontSize: 12, fontStyle: "italic", marginTop: 2 },

//   activitiesSection: { marginTop: 12 },
//   activitiesHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
//   activitiesTitle: { fontWeight: "800", fontSize: 16, color: "#374151" },
//   countBadge: { backgroundColor: "#EEF2FF", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
//   countText: { color: "#6366F1", fontWeight: "800" },
//   activitiesScroll: { gap: 12 },
//   activityCard: {
//     width: 110,
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     padding: 10,
//     borderRadius: 14,
//   },
//   activityName: { textAlign: "center", fontSize: 13, color: "#374151", fontWeight: "700" },

//   buttonRow: { flexDirection: "row", gap: 12, marginTop: 16 },
//   approveButton: {
//     flex: 1,
//     backgroundColor: "#10B981",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 12,
//     paddingVertical: 12,
//     gap: 6,
//   },
//   rejectButton: {
//     flex: 1,
//     backgroundColor: "#EF4444",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 12,
//     paddingVertical: 12,
//     gap: 6,
//   },
//   buttonText: { color: "white", fontWeight: "700", fontSize: 15 },
// });