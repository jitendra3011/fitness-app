// // assets/firebaseUpload.ts
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { app } from "@/firebase";

// const storage = getStorage(app);

// // Expo-compatible URI to Blob
// const uriToBlob = async (uri: string): Promise<Blob> => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   return blob;
// };

// export async function uploadVideoAndGetUrl(uri: string) {
//   try {
//     const blob = await uriToBlob(uri);
//     const filename = `videos/${Date.now()}.mp4`;
//     const storageRef = ref(storage, filename);

//     // Simple uploadBytes instead of resumable (Expo Go friendly)
//     await uploadBytes(storageRef, blob, { contentType: "video/mp4" });

//     const url = await getDownloadURL(storageRef);
//     return url;
//   } catch (err) {
//     console.error("Firebase upload error:", err);
//     throw err;
//   }
// }
