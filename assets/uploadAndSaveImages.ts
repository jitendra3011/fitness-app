// uploadAndSaveImage.ts
import { supabase } from './supabaseClient';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const db = getFirestore();

export async function uploadImageAndSave(
  userId: string,
  activityName: string,
  uri: string
) {
  try {
    // Convert image to binary
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // Get file extension
    const ext = uri.split('.').pop()?.split('?')[0] ?? 'jpg';
    const storagePath = `${userId}/${activityName}/${Date.now()}.${ext}`;
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from('ImageBucket') // your image bucket
      .upload(storagePath, arrayBuffer, { contentType });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('ImageBucket')
      .getPublicUrl(storagePath);

    const publicUrl = publicData.publicUrl;

    // Save in Firestore
    const imagesColRef = collection(db, 'users', userId, 'images');
    const docRef = await addDoc(imagesColRef, {
      activity: activityName,
      url: publicUrl,
      storagePath, // useful for deleting later
      uploadedAt: serverTimestamp(),
    });

    return { publicUrl, storagePath, docId: docRef.id };
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}
