import { supabase } from './supabaseClient';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();

export async function uploadVideoAndSave(
  userId: string,
  activityName: string,
  uri: string
) {
  try {
    // Convert video to binary
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // Generate unique file name
    const ext = uri.split('.').pop()?.split('?')[0] ?? 'mp4';
    const storagePath = `${userId}/${activityName}/${Date.now()}.${ext}`;
    const contentType = 'video/mp4';

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from('VideoBucket')
      .upload(storagePath, arrayBuffer, { contentType });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('VideoBucket')
      .getPublicUrl(storagePath);

    const publicUrl = publicData.publicUrl;

    // Save in Firestore
    const videosColRef = collection(db, 'users', userId, 'videos');
    const docRef = await addDoc(videosColRef, {
      activity: activityName,
      url: publicUrl,
      storagePath, // ✅ Delete ke liye zaroori
      uploadedAt: serverTimestamp(),
    });

    return { publicUrl, storagePath, docId: docRef.id };
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}








// import { supabase } from './supabaseClient';
// import { getFirestore, doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// const db = getFirestore();

// export async function uploadVideoAndSave(userId: string, activityName: string, uri: string) {
//   // Fetch video as arrayBuffer
//   const response = await fetch(uri);
//   const arrayBuffer = await response.arrayBuffer();

//   const ext = uri.split('.').pop()?.split('?')[0] ?? 'mp4';
//   const filename = `${userId}/${activityName}/${Date.now()}.${ext}`;
//   const contentType = 'video/mp4';

//   // Upload to Supabase
//   const { data, error } = await supabase.storage
//     .from('VideoBucket')
//     .upload(filename, arrayBuffer, { contentType });

//   if (error) throw error;

//   // Get public URL
//   const { data: publicData } = supabase.storage.from('VideoBucket').getPublicUrl(filename);
//   const publicUrl = publicData.publicUrl;

//   // Firestore: save video URL in a subcollection
//   const videosColRef = collection(db, 'users', userId, 'videos');

//   await addDoc(videosColRef, {
//     activity: activityName,
//     url: publicUrl,
//     uploadedAt: serverTimestamp()
//   });

//   return publicUrl;
// }
