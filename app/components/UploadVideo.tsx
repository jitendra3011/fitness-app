import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../assets/supabaseClient';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';

const db = getFirestore(); // assume firebase app already initialized

interface UploadVideoProps {
    userId: string;
    activityName: string;
}

export default function UploadVideo({ userId, activityName }: UploadVideoProps) {
    const [uploading, setUploading] = useState(false);

    const pickVideo = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                quality: 0.7,
            });


            // Check if user cancelled
            if (res.canceled) return; // old API
            // For new API, check assets
            const assets = (res as ImagePicker.ImagePickerSuccessResult).assets;
            if (!assets || assets.length === 0) return;

            const uri = assets[0].uri;

            // Check file size (optional)
            const fileInfo = await fetch(uri);
            const blob = await fileInfo.blob();
            const sizeMB = blob.size / (1024 * 1024);
            if (sizeMB > 50) { // bucket limit
                Alert.alert('Video too large', 'Maximum allowed size is 50 MB');
                return;
            }

            await uploadVideo(uri);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not pick video.');
        }
    };

    const uploadVideo = async (uri: string) => {
        setUploading(true);
        try {
            const response = await fetch(uri);
            const arrayBuffer = await response.arrayBuffer();

            const ext = uri.split('.').pop()?.split('?')[0] ?? 'mp4';
            const filename = `${userId}/${activityName}/${Date.now()}.${ext}`;
            const contentType = 'video/mp4';

            const { data, error } = await supabase.storage
                .from('VideoBucket')
                .upload(filename, arrayBuffer, { contentType });

            if (error) throw error;

            const { data: publicData } = supabase.storage.from('VideoBucket').getPublicUrl(filename);
            const publicUrl = publicData.publicUrl;
            // Firestore reference
            const userDocRef = doc(db, 'users', userId);

            // Read current document
            const userSnap = await getDoc(userDocRef);
            const currentVideos = userSnap.exists() ? (userSnap.data().videos || []) : [];

            // Update with new video
            await updateDoc(userDocRef, {
                videos: [
                    ...currentVideos,
                    { activity: activityName, url: publicUrl, uploadedAt: serverTimestamp() }
                ],
            });


            Alert.alert('Success', 'Video uploaded and saved to profile.');
        } catch (err) {
            console.error('Upload failed:', err);
            Alert.alert('Upload failed', String(err));
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={{ marginVertical: 10 }}>
            <Button title={`Upload ${activityName} video`} onPress={pickVideo} />
            {uploading && <ActivityIndicator style={{ marginTop: 12 }} />}
        </View>
    );
}
