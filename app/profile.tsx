import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Alert, Pressable, ScrollView, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { supabase } from '@/assets/supabaseClient';
import * as FileSystem from 'expo-file-system/legacy';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // Inputs (user fills manually)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [regionState, setRegionState] = useState('');
  const [village, setVillage] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Full name & email from logged-in user
  const registeredInfo = useMemo(() => ({
    fullname: user?.displayName || '',
    email: user?.email || '',
  }), [user]);

  // Load existing profile from Firestore
  const loadProfile = useCallback(async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.fullname || '');
        setPhone(data.phone || '');
        setWeight(data.weight ? String(data.weight) : ''); // Convert to string
        setHeight(data.height ? String(data.height) : ''); // Convert to string
        setAge(data.age ? String(data.age) : ''); // Convert to string
        setGender(data.gender || '');
        setCity(data.city || '');
        setRegionState(data.regionState || '');
        setVillage(data.village || '');
        setPhotoUri(data.photoURL || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Pick profile image
  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        allowsMultipleSelection: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, []);

// Upload image to Supabase Storage
const uploadProfilePhoto = async (uri: string) => {
  if (!user) {
    Alert.alert("Error", "User not authenticated");
    return null;
  }

  try {
    setUploading(true);
    setUploadProgress(10);

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64', // Changed from FileSystem.EncodingType.Base64
    });

    setUploadProgress(30);

    // Get file extension
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${user.uid}_${Date.now()}.${fileExt}`;
    const filePath = `profile_photos/${fileName}`;

    setUploadProgress(50);

    // Decode base64 to ArrayBuffer
    const arrayBuffer = decode(base64);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    setUploadProgress(80);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    setUploadProgress(100);
    setUploading(false);

    console.log('Upload successful:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (error: any) {
    setUploading(false);
    setUploadProgress(0);
    console.error("Upload failed:", error);
    
    Alert.alert("Upload Error", error.message || "Failed to upload photo");
    return null;
  }
};

// Helper function to decode base64 to ArrayBuffer
function decode(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

  // Save profile to Firestore
  const onSave = useCallback(async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    // Validations
    if (!fullName || !phone || !weight || !height || !age || !gender || !city || !regionState || !village) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    // Phone number validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Validation Error", "Phone number must be 10 digits.");
      return;
    }

    // Height validation (in cm, numeric & range check)
    const heightNum = parseInt(height, 10);
    if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
      Alert.alert("Validation Error", "Height must be a valid number between 50cm and 300cm.");
      return;
    }

    // Photo validation (required)
    if (!photoUri) {
      Alert.alert("Validation Error", "Profile photo is required (full-body photo).");
      return;
    }

    // Weight validation (in kg, numeric & range check)
    const weightNum = parseInt(weight, 10);
    if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
      Alert.alert("Validation Error", "Weight must be a valid number between 20kg and 500kg.");
      return;
    }

    // Age validation
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert("Validation Error", "Age must be a valid number between 1 and 120.");
      return;
    }

    if (!gender) {
      Alert.alert("Validation Error", "Please select your gender.");
      return;
    }

    let photoURL = photoUri;
    
    // Only upload if it's a new local photo (not already a Supabase URL)
    if (photoUri && !photoUri.startsWith('http')) {
      const uploaded = await uploadProfilePhoto(photoUri);
      if (!uploaded) {
        // Upload failed, don't proceed
        return;
      }
      photoURL = uploaded;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        fullname: fullName, 
        phone,
        weight: weightNum,
        height: heightNum,
        age: ageNum,
        gender,
        city,
        regionState,
        village,
        photoURL,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Firebase Auth user profile update
      await updateProfile(user, {
        displayName: fullName,
        photoURL: photoURL || user.photoURL,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  }, [user, fullName, phone, weight, height, age, gender, city, regionState, village, photoUri, router]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Registered Info */}
        <View style={styles.sectionCard}>
          <ThemedText type="defaultSemiBold">Registered Information</ThemedText>
          <ThemedText>Full Name: {fullName || registeredInfo.fullname}</ThemedText>
          <ThemedText>Email: {registeredInfo.email}</ThemedText>
        </View>

        {/* User Inputs */}
        <View style={styles.sectionCard}>
          <ThemedText>Phone Number</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <ThemedText>Weight (kg)</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <ThemedText>Profile Photo (Full Body)</ThemedText>
          <Pressable onPress={pickImage} style={styles.uploadButton} disabled={uploading}>
            <ThemedText>
              {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Profile Photo'}
            </ThemedText>
          </Pressable>
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={{ width: 100, height: 100, borderRadius: 50, marginTop: 8 }}
            />
          )}
          {photoUri && !uploading && <ThemedText style={{ color: 'green' }}>✓ Photo selected</ThemedText>}

          <ThemedText>Height (cm)</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your height (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <ThemedText>Age</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <ThemedText>Gender</ThemedText>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Male' && styles.genderButtonSelected]}
              onPress={() => setGender('Male')}
            >
              <ThemedText style={gender === 'Male' && styles.genderTextSelected}>Male</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Female' && styles.genderButtonSelected]}
              onPress={() => setGender('Female')}
            >
              <ThemedText style={gender === 'Female' && styles.genderTextSelected}>Female</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'Other' && styles.genderButtonSelected]}
              onPress={() => setGender('Other')}
            >
              <ThemedText style={gender === 'Other' && styles.genderTextSelected}>Other</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText>City</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            value={city}
            onChangeText={setCity}
          />

          <ThemedText>State</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your state"
            value={regionState}
            onChangeText={setRegionState}
          />

          <ThemedText>Village</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your village"
            value={village}
            onChangeText={setVillage}
          />

          <Pressable onPress={onSave} style={styles.saveButton} disabled={uploading}>
            <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
              {uploading ? `Uploading... ${uploadProgress}%` : 'Save Profile'}
            </ThemedText>
          </Pressable>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  sectionCard: { gap: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(127,127,127,0.08)' },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(127,127,127,0.08)',
    marginBottom: 8,
  },
  uploadButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(127,127,127,0.15)',
    marginVertical: 8,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(127,127,127,0.35)',
    backgroundColor: 'rgba(127,127,127,0.08)',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

// firebase storage - image upload
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Image, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import { auth, db, storage } from '@/firebase';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { updateProfile } from 'firebase/auth';
// import { Picker } from '@react-native-picker/picker';

// export default function ProfileScreen() {
//   const router = useRouter();
//   const user = auth.currentUser;

//   // Inputs (user fills manually)
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [weight, setWeight] = useState('');
//   const [height, setHeight] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [city, setCity] = useState('');
//   const [regionState, setRegionState] = useState('');
//   const [village, setVillage] = useState('');
//   const [photoUri, setPhotoUri] = useState<string | null>(null);

//   // Full name & email from logged-in user
//   const registeredInfo = useMemo(() => ({
//     fullname: user?.displayName || '',
//     email: user?.email || '',
//   }), [user]);

//   // Load existing profile from Firestore
//   const loadProfile = useCallback(async () => {
//     if (!user) return;
//     try {
//       const docRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setFullName(data.fullname || '');
//         setPhone(data.phone || '');
//         setWeight(data.weight || '');
//         setHeight(data.height || '');
//         setAge(data.age || '');
//         setGender(data.gender || '');
//         setCity(data.city || '');
//         setRegionState(data.regionState || '');
//         setVillage(data.village || '');
//         setPhotoUri(data.photoURL || null);
//       }
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     }
//   }, [user]);

//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // Pick profile image
//   const pickImage = useCallback(async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'We need access to your photos.');
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });
//     if (!result.canceled) {
//       setPhotoUri(result.assets[0].uri);
//     }
//   }, []);

//   // Upload image to Firebase Storage
//  const uploadProfilePhoto = async (uri: string) => {
//   if (!user) return null;

//   try {
//     // Expo URI to Blob
//     const response = await fetch(uri);
//     const blob = await response.blob();

//     // Firebase Storage reference
//     const storageRef = ref(storage, `profile_photos/${user.uid}.jpg`);

//     // Upload
//     await uploadBytes(storageRef, blob);

//     // Get downloadable URL
//     const downloadURL = await getDownloadURL(storageRef);
//     return downloadURL;
//   } catch (error) {
//     console.error("Upload failed:", error);
//     Alert.alert("Error", "Failed to upload photo.");
//     return null;
//   }
// };

//   // Save profile to Firestore
//   const onSave = useCallback(async () => {
//     if (!user) return;

//       // 🔹 Validations
//   if (!fullName || !phone || !weight || !height || !age || !gender || !city || !regionState || !village) {
//     Alert.alert("Validation Error", "All fields are required.");
//     return;
//   }

//   // Phone number validation (10 digits)
//   const phoneRegex = /^[0-9]{10}$/;
//   if (!phoneRegex.test(phone)) {
//     Alert.alert("Validation Error", "Phone number must be 10 digits.");
//     return;
//   }

//   // Height validation (in cm, numeric & range check)
//   const heightNum = parseInt(height, 10);
//   if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
//     Alert.alert("Validation Error", "Height must be a valid number between 50cm and 300cm.");
//     return;
//   }
// // Photo validation (required)
// if (!photoUri) {
//   Alert.alert("Validation Error", "Profile photo is required (full-body photo).");
//   return;
// }
//   // Weight validation (in kg, numeric & range check)
//   const weightNum = parseInt(weight, 10);
//   if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
//     Alert.alert("Validation Error", "Weight must be a valid number between 20kg and 500kg.");
//     return;
//   }

//   // Age validation
//   const ageNum = parseInt(age, 10);
//   if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
//     Alert.alert("Validation Error", "Age must be a valid number between 1 and 120.");
//     return;
//   }
//   if (!gender) {
//   Alert.alert("Validation Error", "Please select your gender.");
//   return;
// }

// let photoURL = photoUri;
// if (photoUri && !photoUri.startsWith('https://')) {
//   const uploaded = await uploadProfilePhoto(photoUri);
//   if (uploaded) {
//     photoURL = uploaded;
//   }
// }

//     try {
//       await setDoc(doc(db, 'users', user.uid), {
//         fullname: fullName, 
//         phone,
//         weight : weightNum,
//         height : heightNum,
//         age : ageNum,
//         gender,
//         city,
//         regionState,
//         village,
//         photoURL,
//         updatedAt: new Date().toISOString(),
//       }, { merge: true });

//        // 🔹 Firebase Auth user profile update
//     await updateProfile(user, {
//       displayName: fullName,
//       photoURL: photoURL || user.photoURL,
//     });

//       Alert.alert('Success', 'Profile updated successfully!', [
//         { text: 'OK', onPress: () => router.replace('/(tabs)') },
//       ]);
//     } catch (error) {
//       console.error('Error saving profile:', error);
//       Alert.alert('Error', 'Failed to save profile.');
//     }
//   }, [user, phone, weight, height, age, gender, city, regionState, village, photoUri, router]);

//   return (
//   <ThemedView style={{ flex: 1 }}>
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

//       {/* Registered Info */}
//       <View style={styles.sectionCard}>
//         <ThemedText type="defaultSemiBold">Registered Information</ThemedText>
//         <ThemedText>Full Name: {fullName || registeredInfo.fullname}</ThemedText>
//         <ThemedText>Email: {registeredInfo.email}</ThemedText>
//       </View>

//       {/* User Inputs */}
//       <View style={styles.sectionCard}>
//         <ThemedText>Phone Number</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your 10-digit phone number"
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />

//         <ThemedText>Weight</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your weight (kg)"
//           value={weight}
//           onChangeText={setWeight}
//           keyboardType="numeric"
//         />

//         <ThemedText>Profile Photo</ThemedText>
//         <Pressable onPress={pickImage} style={styles.uploadButton}>
//           <ThemedText>Upload Profile Photo</ThemedText>
//         </Pressable>
//         {photoUri && (
//           <Image
//             source={{ uri: photoUri }}
//             style={{ width: 100, height: 100, borderRadius: 50, marginTop: 8 }}
//           />
//         )}
//         {photoUri && <ThemedText>Photo selected</ThemedText>}

//         <ThemedText>Height</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your height (cm)"
//           value={height}
//           onChangeText={setHeight}
//           keyboardType="numeric"
//         />

//         <ThemedText>Age</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your age"
//           value={age}
//           onChangeText={setAge}
//           keyboardType="numeric"
//         />

//       <ThemedText>Gender</ThemedText>
// <View style={styles.pickerContainer}>
//   <Picker
//     selectedValue={gender}
//     onValueChange={(itemValue) => setGender(itemValue)}
//   >
//     <Picker.Item label="Select Gender" value="" />
//     <Picker.Item label="Male" value="Male" />
//     <Picker.Item label="Female" value="Female" />
//     <Picker.Item label="Other" value="Other" />
//   </Picker>
// </View>

//         <ThemedText>City</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your city"
//           value={city}
//           onChangeText={setCity}
//         />

//         <ThemedText>State</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your state"
//           value={regionState}
//           onChangeText={setRegionState}
//         />

//         <ThemedText>Village</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your village"
//           value={village}
//           onChangeText={setVillage}
//         />

//         <Pressable onPress={onSave} style={styles.saveButton}>
//           <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
//         </Pressable>
//       </View>

//     </ScrollView>
//   </ThemedView>
// );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16, gap: 16 },
//   sectionCard: { gap: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(127,127,127,0.08)' },
//   input: {
//     height: 44,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(127,127,127,0.35)',
//     paddingHorizontal: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//     marginBottom: 8,
//   },
//   uploadButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: 'rgba(127,127,127,0.15)',
//     marginVertical: 8,
//     alignItems: 'center',
//   },
//   saveButton: {
//     marginTop: 16,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#3B82F6',
//     alignItems: 'center',
//   },
//   pickerContainer: {
//   borderWidth: 1,
//   borderColor: 'rgba(127,127,127,0.35)',
//   borderRadius: 10,
//   marginBottom: 8,
//   backgroundColor: 'rgba(127,127,127,0.08)',
// },
// });



// 3rd supabase - image upload
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Image, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import * as ImagePicker from 'expo-image-picker';
// import { useRouter } from 'expo-router';
// import { auth, db } from '@/firebase';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { updateProfile } from 'firebase/auth';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { supabase } from '@/assets/supabaseClient';

// export default function ProfileScreen() {
//   const router = useRouter();
//   const user = auth.currentUser;

//   // Inputs (user fills manually)
//   const [fullName, setFullName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [weight, setWeight] = useState('');
//   const [height, setHeight] = useState('');
//   const [age, setAge] = useState('');
//   const [gender, setGender] = useState('');
//   const [city, setCity] = useState('');
//   const [regionState, setRegionState] = useState('');
//   const [village, setVillage] = useState('');
//   const [photoUri, setPhotoUri] = useState<string | null>(null);

//   // Full name & email from logged-in user
//   const registeredInfo = useMemo(() => ({
//     fullname: user?.displayName || '',
//     email: user?.email || '',
//   }), [user]);

//   // Load existing profile from Firestore
//   const loadProfile = useCallback(async () => {
//     if (!user) return;
//     try {
//       const docRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setFullName(data.fullname || '');
//         setPhone(data.phone || '');
//         setWeight(data.weight || '');
//         setHeight(data.height || '');
//         setAge(data.age || '');
//         setGender(data.gender || '');
//         setCity(data.city || '');
//         setRegionState(data.regionState || '');
//         setVillage(data.village || '');
//         setPhotoUri(data.photoURL || null);
//       }
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     }
//   }, [user]);

//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // Pick profile image
//   const pickImage = useCallback(async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'We need access to your photos.');
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });
//     if (!result.canceled) {
//       setPhotoUri(result.assets[0].uri);
//     }
//   }, []);

//   // Convert local URI to Blob
// const uriToBlob = async (uri: string): Promise<Blob> => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   return blob;
// };


// // Upload image to Supabase Storage
// const uploadProfilePhoto = async (uri: string) => {
//   if (!user) return null;

//   try {
//     // Convert local URI to Blob
//     const response = await fetch(uri);
//     const blob = await response.blob();

//     // Generate unique file name
//     const ext = uri.split('.').pop()?.split('?')[0] ?? 'jpg';
//     const storagePath = `profile_photos/${user.uid}.${ext}`;

//     // Upload to Supabase
//     const { error } = await supabase.storage
//       .from('ImageBucket') // <-- your bucket name
//       .upload(storagePath, blob, {
//         contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
//         upsert: true, // overwrite if exists
//       });

//     if (error) throw error;

//     // Get public URL
//     const { data } = supabase.storage
//       .from('ImageBucket')
//       .getPublicUrl(storagePath);

//     return data.publicUrl;
//   } catch (error) {
//     console.error('Supabase upload failed:', error);
//     Alert.alert('Error', 'Failed to upload photo.');
//     return null;
//   }
// };

// console.log("Uploading photo URI:", photoUri);

// //  const uploadProfilePhoto = async (uri: string) => {
// //   if (!user) return null;

// //   try {
// //     // Expo URI to Blob using XMLHttpRequest (alternative)
// //     const blob = await new Promise<Blob>((resolve, reject) => {
// //   const xhr = new XMLHttpRequest();
// //   xhr.onload = function() { resolve(xhr.response as Blob); }; // cast here
// //   xhr.onerror = function() { reject(new TypeError("Network request failed")); };
// //   xhr.responseType = 'blob';
// //   xhr.open("GET", uri, true);
// //   xhr.send(null);
// // });

// //     // Firebase Storage reference
// //     const storageRef = ref(storage, `profile_photos/${user.uid}.jpg`);

// //     // Upload
// //     await uploadBytes(storageRef, blob);

// //     // Get downloadable URL
// //     const downloadURL = await getDownloadURL(storageRef);
// //     return downloadURL;
// //   } catch (error) {
// //     console.error("Upload failed:", error);
// //     Alert.alert("Error", "Failed to upload photo.");
// //     return null;
// //   }
// // };

//   // Save profile to Firestore
//   const onSave = useCallback(async () => {
//     if (!user) return;

//       // 🔹 Validations
//   if (!fullName || !phone || !weight || !height || !age || !gender || !city || !regionState || !village) {
//     Alert.alert("Validation Error", "All fields are required.");
//     return;
//   }

//   // Phone number validation (10 digits)
//   const phoneRegex = /^[0-9]{10}$/;
//   if (!phoneRegex.test(phone)) {
//     Alert.alert("Validation Error", "Phone number must be 10 digits.");
//     return;
//   }

//   // Height validation (in cm, numeric & range check)
//   const heightNum = parseInt(height, 10);
//   if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
//     Alert.alert("Validation Error", "Height must be a valid number between 50cm and 300cm.");
//     return;
//   }

//   // Weight validation (in kg, numeric & range check)
//   const weightNum = parseInt(weight, 10);
//   if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
//     Alert.alert("Validation Error", "Weight must be a valid number between 20kg and 500kg.");
//     return;
//   }

//   // Age validation
//   const ageNum = parseInt(age, 10);
//   if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
//     Alert.alert("Validation Error", "Age must be a valid number between 1 and 120.");
//     return;
//   }
//   if (!gender) {
//   Alert.alert("Validation Error", "Please select your gender.");
//   return;
// }
//  // Upload profile photo only if local URI
// let photoURL: string | null = photoUri;
// if (photoURL && !photoURL.startsWith('https://')) {
//   const uploaded = await uploadProfilePhoto(photoURL);
//   if (!uploaded) return; // stop if upload failed
//   photoURL = uploaded;
// }

//     try {
//       await setDoc(doc(db, 'users', user.uid), {
//         fullname: fullName, 
//         phone,
//         weight : weightNum,
//         height : heightNum,
//         age : ageNum,
//         gender,
//         city,
//         regionState,
//         village,
//         photoURL,
//         updatedAt: new Date().toISOString(),
//       }, { merge: true });

//        // 🔹 Firebase Auth user profile update
//     await updateProfile(user, {
//       displayName: fullName,
//       photoURL: photoURL || user.photoURL,
//     });

//       Alert.alert('Success', 'Profile updated successfully!', [
//         { text: 'OK', onPress: () => router.replace('/(tabs)') },
//       ]);
//     } catch (error) {
//       console.error('Error saving profile:', error);
//       Alert.alert('Error', 'Failed to save profile.');
//     }
//   }, [user, phone, weight, height, age, gender, city, regionState, village, photoUri, router]);

//   return (
//   <ThemedView style={{ flex: 1 }}>
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

//       {/* Registered Info */}
//       <View style={styles.sectionCard}>
//         <ThemedText type="defaultSemiBold">Registered Information</ThemedText>
//         <ThemedText>Full Name: {fullName || registeredInfo.fullname}</ThemedText>
//         <ThemedText>Email: {registeredInfo.email}</ThemedText>
//       </View>

//       {/* User Inputs */}
//       <View style={styles.sectionCard}>
//         <ThemedText>Phone Number</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your 10-digit phone number"
//           value={phone}
//           onChangeText={setPhone}
//           keyboardType="phone-pad"
//         />

//         <ThemedText>Weight</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your weight (kg)"
//           value={weight}
//           onChangeText={setWeight}
//           keyboardType="numeric"
//         />

//         <ThemedText>Profile Photo</ThemedText>
//         <Pressable onPress={pickImage} style={styles.uploadButton}>
//           <ThemedText>Upload Profile Photo</ThemedText>
//         </Pressable>
//         {photoUri && (
//           <Image
//             source={{ uri: photoUri }}
//             style={{ width: 100, height: 100, borderRadius: 50, marginTop: 8 }}
//           />
//         )}
//         {photoUri && <ThemedText>Photo selected</ThemedText>}

//         <ThemedText>Height</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your height (cm)"
//           value={height}
//           onChangeText={setHeight}
//           keyboardType="numeric"
//         />

//         <ThemedText>Age</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your age"
//           value={age}
//           onChangeText={setAge}
//           keyboardType="numeric"
//         />

//       <ThemedText>Gender</ThemedText>
// <View style={styles.pickerContainer}>
//   <Picker
//     selectedValue={gender}
//     onValueChange={(itemValue) => setGender(itemValue)}
//   >
//     <Picker.Item label="Select Gender" value="" />
//     <Picker.Item label="Male" value="Male" />
//     <Picker.Item label="Female" value="Female" />
//     <Picker.Item label="Other" value="Other" />
//   </Picker>
// </View>

//         <ThemedText>City</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your city"
//           value={city}
//           onChangeText={setCity}
//         />

//         <ThemedText>State</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your state"
//           value={regionState}
//           onChangeText={setRegionState}
//         />

//         <ThemedText>Village</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your village"
//           value={village}
//           onChangeText={setVillage}
//         />

//         <Pressable onPress={onSave} style={styles.saveButton}>
//           <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
//         </Pressable>
//       </View>

//     </ScrollView>
//   </ThemedView>
// );
// }

// const styles = StyleSheet.create({
//   container: { padding: 16, gap: 16 },
//   sectionCard: { gap: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(127,127,127,0.08)' },
//   input: {
//     height: 44,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: 'rgba(127,127,127,0.35)',
//     paddingHorizontal: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//     marginBottom: 8,
//   },
//   uploadButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: 'rgba(127,127,127,0.15)',
//     marginVertical: 8,
//     alignItems: 'center',
//   },
//   saveButton: {
//     marginTop: 16,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: '#3B82F6',
//     alignItems: 'center',
//   },
//   pickerContainer: {
//   borderWidth: 1,
//   borderColor: 'rgba(127,127,127,0.35)',
//   borderRadius: 10,
//   marginBottom: 8,
//   backgroundColor: 'rgba(127,127,127,0.08)',
// },
// });









//1st code
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Image } from 'expo-image';
// import * as ImagePicker from 'expo-image-picker';
// import React, { useCallback, useMemo, useState } from 'react';
// import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Video, ResizeMode } from 'expo-av';
// import { Trash2, Video as VideoIcon } from 'lucide-react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { useRouter } from 'expo-router';

// type RegisteredInfo = {
//   fullName: string;
//   email: string;
//   phone: string;
// };

// type VideoData = {
//   id: string;
//   timestamp: string;
//   duration: number;
//   type: string;
//   activity?: string;
//   uri: string;
//   status?: string;
// };

// export default function ProfileScreen() {
//   const registeredInfo: RegisteredInfo = useMemo(
//     () => ({
//       fullName: 'Alex Johnson',
//       email: 'alex.j@example.com',
//       phone: '123-456-7890',
//     }),
//     []
//   );

//   const [weight, setWeight] = useState<string>('');
//   const [weightTouched, setWeightTouched] = useState<boolean>(false);
//   const [photoUri, setPhotoUri] = useState<string | null>(null);
//   const [height, setHeight] = useState<string>('');
//   const [heightTouched, setHeightTouched] = useState<boolean>(false);
//   const [age, setAge] = useState<string>('');
//   const [ageTouched, setAgeTouched] = useState<boolean>(false);
//   const [gender, setGender] = useState<string>('');
//   const [genderTouched, setGenderTouched] = useState<boolean>(false);
//   const [city, setCity] = useState<string>('');
//   const [cityTouched, setCityTouched] = useState<boolean>(false);
//   const [regionState, setRegionState] = useState<string>('');
//   const [regionStateTouched, setRegionStateTouched] = useState<boolean>(false);
//   const [village, setVillage] = useState<string>('');
//   const [villageTouched, setVillageTouched] = useState<boolean>(false);
//   const [bodyScanVideo, setBodyScanVideo] = useState<VideoData | null>(null);
//   const [activityReports, setActivityReports] = useState<VideoData[]>([]);

//   // Load profile and video data when screen focuses
//   useFocusEffect(
//     useCallback(() => {
//       loadProfileData();
//       loadBodyScanVideo();
//       loadActivityReports();
//     }, [])
//   );

//   const loadProfileData = async () => {
//     try {
//       const profileDataString = await AsyncStorage.getItem('user_profile');
//       if (profileDataString) {
//         const profileData = JSON.parse(profileDataString);
//         setWeight(profileData.weight || '');
//         setHeight(profileData.height || '');
//         setAge(profileData.age || '');
//         setGender(profileData.gender || '');
//         setCity(profileData.city || '');
//         setRegionState(profileData.regionState || '');
//         setVillage(profileData.village || '');
//         setPhotoUri(profileData.photoUri || null);
//       }
//     } catch (error) {
//       console.error('Error loading profile data:', error);
//     }
//   };

//   const loadBodyScanVideo = async () => {
//     try {
//       const videoDataString = await AsyncStorage.getItem('body_scan_video');
//       if (videoDataString) {
//         const videoData: VideoData = JSON.parse(videoDataString);
//         console.log('Loaded video data:', videoData); // Debug log
//         setBodyScanVideo(videoData);
//       } else {
//         setBodyScanVideo(null);
//       }
//     } catch (error) {
//       console.error('Error loading body scan video:', error);
//       setBodyScanVideo(null);
//     }
//   };

//   const loadActivityReports = async () => {
//     try {
//       const reportsString = await AsyncStorage.getItem('activity_reports');
//       if (reportsString) {
//         const reports: VideoData[] = JSON.parse(reportsString);
//         setActivityReports(reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
//       } else {
//         setActivityReports([]);
//       }
//     } catch (error) {
//       console.error('Error loading activity reports:', error);
//       setActivityReports([]);
//     }
//   };

//   const deleteActivityReport = async (reportId: string) => {
//     Alert.alert(
//       'Delete Activity Report',
//       'Are you sure you want to delete this activity report?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const updatedReports = activityReports.filter(report => report.id !== reportId);
//               await AsyncStorage.setItem('activity_reports', JSON.stringify(updatedReports));
//               await AsyncStorage.removeItem(`activity_video_${reportId}`);
//               setActivityReports(updatedReports);
//               Alert.alert('Success', 'Activity report has been deleted.');
//             } catch (error) {
//               console.error('Error deleting activity report:', error);
//               Alert.alert('Error', 'Failed to delete activity report.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const deleteBodyScanVideo = async () => {
//     Alert.alert(
//       'Delete Body Scan Video',
//       'Are you sure you want to delete this body scan video? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await AsyncStorage.removeItem('body_scan_video');
//               setBodyScanVideo(null);
//               Alert.alert('Success', 'Body scan video has been deleted.');
//             } catch (error) {
//               console.error('Error deleting body scan video:', error);
//               Alert.alert('Error', 'Failed to delete body scan video.');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const weightError = useMemo(() => {
//     if (!weightTouched) return '';
//     if (!weight.trim()) return 'Weight is required.';
//     const num = Number(weight);
//     if (!Number.isFinite(num) || num <= 0) return 'Enter a valid positive number.';
//     return '';
//   }, [weight, weightTouched]);

//   const pickImage = useCallback(async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'We need access to your photos to select an image.');
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });
//     if (!result.canceled) {
//       setPhotoUri(result.assets[0]?.uri ?? null);
//     }
//   }, []);

//   const heightError = useMemo(() => {
//     if (!heightTouched) return '';
//     if (!height.trim()) return 'Height is required.';
//     const num = Number(height);
//     if (!Number.isFinite(num) || num <= 0) return 'Enter a valid positive number.';
//     return '';
//   }, [height, heightTouched]);

//   const ageError = useMemo(() => {
//     if (!ageTouched) return '';
//     if (!age.trim()) return 'Age is required.';
//     const num = Number(age);
//     if (!Number.isInteger(num) || num <= 0) return 'Enter a valid age.';
//     return '';
//   }, [age, ageTouched]);

//   const genderError = useMemo(() => {
//     if (!genderTouched) return '';
//     if (!gender) return 'Please select a gender.';
//     return '';
//   }, [gender, genderTouched]);

//   const cityError = useMemo(() => {
//     if (!cityTouched) return '';
//     return city.trim() ? '' : 'Location is required.';
//   }, [city, cityTouched]);

//   const regionStateError = useMemo(() => {
//     if (!regionStateTouched) return '';
//     return regionState.trim() ? '' : 'State is required.';
//   }, [regionState, regionStateTouched]);

//   const villageError = useMemo(() => {
//     if (!villageTouched) return '';
//     return village.trim() ? '' : 'Village is required.';
//   }, [village, villageTouched]);

//   const router = useRouter();
//   const onSave = useCallback(async () => {
//     console.log('Save button pressed');
    
//     setWeightTouched(true);
//     setHeightTouched(true);
//     setAgeTouched(true);
//     setGenderTouched(true);
//     setCityTouched(true);
//     setRegionStateTouched(true);
//     setVillageTouched(true);

//     const errors = {
//       weightError,
//       heightError,
//       ageError,
//       genderError,
//       cityError,
//       regionStateError,
//       villageError,
//     };
    
//     console.log('Validation errors:', errors);
    
//     const hasError = Object.values(errors).some((e) => !!e);
//     if (hasError) {
//       console.log('Validation failed, not saving');
//       Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
//       return;
//     }

//     try {
//       const profileData = {
//         weight,
//         height,
//         age,
//         gender,
//         city,
//         regionState,
//         village,
//         photoUri,
//         updatedAt: new Date().toISOString()
//       };
      
//       console.log('Saving profile data:', profileData);
//       await AsyncStorage.setItem('user_profile', JSON.stringify(profileData));

//       // Show success alert first
//       Alert.alert('Success', 'Your profile has been saved successfully!', [
//         {
//           text: 'OK',
//           onPress: () => {

//             // Navigate to tabs (root screen)
//             router.replace('/(tabs)');
//           },
//         },
//       ]);
//     } catch (error) {
//       console.error('Error saving profile:', error);
//       Alert.alert('Error', 'Failed to save profile. Please try again.');
//     }
//   }, [
//     weight,
//     height,
//     age,
//     gender,
//     city,
//     regionState,
//     village,
//     photoUri,
//     weightError,
//     heightError,
//     ageError,
//     genderError,
//     cityError,
//     regionStateError,
//     villageError,
//     router,
//   ]);

//   return (
//     <ThemedView style={{ flex: 1 }}>
//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <View style={styles.card}>
//           <View style={styles.cardHeaderRow}>
//             <ThemedText type="subtitle">Your Profile</ThemedText>
//           </View>
//           <ThemedText type="default" style={styles.cardSubtext}>
//             Complete your profile to get personalized analysis.
//           </ThemedText>
//         </View>

//         {/* Activity Reports Section */}
//         {activityReports.length > 0 && (
//           <View style={styles.sectionCard}>
//             <View style={styles.videoSectionHeader}>
//               <VideoIcon size={20} color="#10B981" />
//               <ThemedText type="defaultSemiBold">Activity Reports ({activityReports.length})</ThemedText>
//             </View>
            
//             {activityReports.map((report) => (
//               <View key={report.id} style={styles.reportCard}>
//                 <View style={styles.reportHeader}>
//                   <View>
//                     <ThemedText type="defaultSemiBold">{report.activity || report.type}</ThemedText>
//                     <ThemedText style={styles.reportDate}>
//                       {formatDate(report.timestamp)}
//                     </ThemedText>
//                   </View>
//                   <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
//                     <ThemedText style={styles.statusText}>Completed</ThemedText>
//                   </View>
//                 </View>
                
//                 <View style={styles.reportStats}>
//                   <View style={styles.statItem}>
//                     <ThemedText style={styles.statLabel}>Duration</ThemedText>
//                     <ThemedText style={styles.statValue}>{formatDuration(report.duration)}</ThemedText>
//                   </View>
//                   <View style={styles.statItem}>
//                     <ThemedText style={styles.statLabel}>Type</ThemedText>
//                     <ThemedText style={styles.statValue}>{report.type}</ThemedText>
//                   </View>
//                 </View>
                
//                 <Pressable 
//                   style={styles.deleteButton} 
//                   onPress={() => deleteActivityReport(report.id)} 
//                   hitSlop={8}
//                 >
//                   <Trash2 size={16} color="#ef4444" />
//                   <ThemedText style={styles.deleteButtonText}>Delete Report</ThemedText>
//                 </Pressable>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Body Scan Video Section */}
//         {bodyScanVideo && (
//           <View style={styles.sectionCard}>
//             <View style={styles.videoSectionHeader}>
//               <VideoIcon size={20} color="#3B82F6" />
//               <ThemedText type="defaultSemiBold">Body Scan Video</ThemedText>
//             </View>

//             <View style={styles.videoCard}>
//               <Video
//                 source={{ uri: bodyScanVideo.uri }}
//                 style={styles.videoPlayer}
//                 useNativeControls
//                 resizeMode={ResizeMode.CONTAIN}
//                 shouldPlay={false}
//               />

//               <View style={styles.videoInfo}>
//                 <View>
//                   <ThemedText style={styles.videoSubtext}>
//                     Duration: {formatDuration(bodyScanVideo.duration)}
//                   </ThemedText>
//                   <ThemedText style={styles.videoTimestamp}>
//                     Recorded: {formatDate(bodyScanVideo.timestamp)}
//                   </ThemedText>
//                 </View>
//               </View>

//               <Pressable style={styles.deleteButton} onPress={deleteBodyScanVideo} hitSlop={8}>
//                 <Trash2 size={16} color="#ef4444" />
//                 <ThemedText style={styles.deleteButtonText}>Delete Video</ThemedText>
//               </Pressable>
//             </View>
//           </View>
//         )}

//         <View style={styles.sectionCard}>
//           <ThemedText type="defaultSemiBold">Personal Details</ThemedText>
//           <ThemedText type="default" style={styles.helperText}>
//             This information helps us tailor your experience.
//           </ThemedText>

//           {/* Registered Info */}
//           <View style={styles.infoCard}>
//             <ThemedText type="defaultSemiBold">Registered Information</ThemedText>
//             <View style={styles.infoRow}>
//               <ThemedText>Full Name</ThemedText>
//               <ThemedText style={styles.infoValue}>{registeredInfo.fullName}</ThemedText>
//             </View>
//             <View style={styles.infoRow}>
//               <ThemedText>Email</ThemedText>
//               <ThemedText style={styles.infoValue}>{registeredInfo.email}</ThemedText>
//             </View>
//             <View style={styles.infoRow}>
//               <ThemedText>Phone</ThemedText>
//               <ThemedText style={styles.infoValue}>{registeredInfo.phone}</ThemedText>
//             </View>
//           </View>

//           {/* Inputs */}
//           {/* Weight */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Weight (kg)</ThemedText>
//             <TextInput
//               style={[styles.input, weightError ? styles.inputError : null]}
//               keyboardType="numeric"
//               value={weight}
//               onChangeText={setWeight}
//               onBlur={() => setWeightTouched(true)}
//               placeholder="70"
//             />
//             {weightError ? <ThemedText style={styles.errorText}>{weightError}</ThemedText> : null}
//           </View>

//           {/* Weight Photo */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Weight Photo</ThemedText>
//             <Pressable onPress={pickImage} style={styles.uploadButton}>
//               <ThemedText type="defaultSemiBold">Choose File</ThemedText>
//             </Pressable>
//             {photoUri ? (
//               <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
//             ) : (
//               <ThemedText style={styles.helperText}>No file chosen</ThemedText>
//             )}
//             <ThemedText style={styles.helperText}>Upload a photo for verification.</ThemedText>
//           </View>

//           {/* Height */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Height (cm)</ThemedText>
//             <TextInput
//               style={[styles.input, heightError ? styles.inputError : null]}
//               keyboardType="numeric"
//               value={height}
//               onChangeText={setHeight}
//               onBlur={() => setHeightTouched(true)}
//               placeholder="175"
//             />
//             {heightError ? <ThemedText style={styles.errorText}>{heightError}</ThemedText> : null}
//           </View>

//           {/* Age */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Age</ThemedText>
//             <TextInput
//               style={[styles.input, ageError ? styles.inputError : null]}
//               keyboardType="numeric"
//               value={age}
//               onChangeText={setAge}
//               onBlur={() => setAgeTouched(true)}
//               placeholder="28"
//             />
//             {ageError ? <ThemedText style={styles.errorText}>{ageError}</ThemedText> : null}
//           </View>

//           {/* Gender */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Gender</ThemedText>
//             <View style={styles.genderRow}>
//               {['Male', 'Female', 'Other'].map((g) => (
//                 <Pressable
//                   key={g}
//                   style={[styles.genderPill, gender === g ? styles.genderPillActive : null]}
//                   onPress={() => {
//                     setGender(g);
//                     setGenderTouched(true);
//                   }}
//                 >
//                   <ThemedText style={styles.genderPillText}>{g}</ThemedText>
//                 </Pressable>
//               ))}
//             </View>
//             {!gender && genderError ? <ThemedText style={styles.errorText}>{genderError}</ThemedText> : null}
//           </View>

//           {/* City */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Location (City/Town)</ThemedText>
//             <TextInput
//               style={[styles.input, cityError ? styles.inputError : null]}
//               value={city}
//               onChangeText={setCity}
//               onBlur={() => setCityTouched(true)}
//               placeholder="Sunnyvale"
//             />
//             {cityError ? <ThemedText style={styles.errorText}>{cityError}</ThemedText> : null}
//           </View>

//           {/* State */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>State</ThemedText>
//             <TextInput
//               style={[styles.input, regionStateError ? styles.inputError : null]}
//               value={regionState}
//               onChangeText={setRegionState}
//               onBlur={() => setRegionStateTouched(true)}
//               placeholder="California"
//             />
//             {regionStateError ? <ThemedText style={styles.errorText}>{regionStateError}</ThemedText> : null}
//           </View>

//           {/* Village */}
//           <View style={styles.fieldBlock}>
//             <ThemedText>Village</ThemedText>
//             <TextInput
//               style={[styles.input, villageError ? styles.inputError : null]}
//               value={village}
//               onChangeText={setVillage}
//               onBlur={() => setVillageTouched(true)}
//               placeholder="Cherry Orchard"
//             />
//             {villageError ? <ThemedText style={styles.errorText}>{villageError}</ThemedText> : null}
//           </View>

//           {/* Save Button */}
//           <Pressable onPress={onSave} style={styles.saveButton}>
//             <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
//               Save Changes
//             </ThemedText>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     gap: 16,
//   },
//   card: {
//     gap: 6,
//   },
//   cardHeaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   cardSubtext: {
//     opacity: 0.8,
//   },
//   sectionCard: {
//     gap: 12,
//   },
//   helperText: {
//     opacity: 0.7,
//   },
//   infoCard: {
//     gap: 10,
//     padding: 12,
//     borderRadius: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   infoValue: {
//     opacity: 0.9,
//   },
//   fieldBlock: {
//     gap: 6,
//   },
//   input: {
//     height: 44,
//     borderRadius: 10,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: 'rgba(127,127,127,0.35)',
//     paddingHorizontal: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//   },
//   inputError: {
//     borderColor: '#ef4444',
//   },
//   errorText: {
//     color: '#ef4444',
//     fontSize: 12,
//   },
//   uploadButton: {
//     alignSelf: 'flex-start',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     backgroundColor: 'rgba(127,127,127,0.15)',
//   },
//   preview: {
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     marginTop: 8,
//     backgroundColor: '#e5e7eb',
//   },
//   genderRow: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   genderPill: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 999,
//     backgroundColor: 'rgba(127,127,127,0.15)',
//   },
//   genderPillActive: {
//     backgroundColor: 'rgba(59,130,246,0.25)',
//   },
//   genderPillText: {
//     opacity: 0.95,
//   },
//   saveButton: {
//     marginTop: 8,
//     alignSelf: 'flex-start',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: '#3B82F6',
//   },
//   saveButtonText: {
//     color: '#fff',
//   },
//   // 👇 Extra video styles (missing in your code, causing errors)
//   videoSectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   videoCard: {
//     gap: 10,
//     padding: 10,
//     borderRadius: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//   },
//   videoPlayer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     backgroundColor: '#000',
//   },
//   videoInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   videoSubtext: {
//     opacity: 0.8,
//     fontSize: 12,
//   },
//   videoTimestamp: {
//     opacity: 0.7,
//     fontSize: 11,
//   },
//   deleteButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingVertical: 6,
//   },
//   deleteButtonText: {
//     color: '#ef4444',
//     fontSize: 12,
//   },
//   reportCard: {
//     padding: 16,
//     borderRadius: 12,
//     backgroundColor: 'rgba(127,127,127,0.08)',
//     borderWidth: 1,
//     borderColor: 'rgba(127,127,127,0.15)',
//   },
//   reportHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 12,
//   },
//   reportDate: {
//     fontSize: 12,
//     opacity: 0.7,
//     marginTop: 2,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   reportStats: {
//     flexDirection: 'row',
//     gap: 24,
//     marginBottom: 12,
//   },
//   statItem: {
//     flex: 1,
//   },
//   statLabel: {
//     fontSize: 12,
//     opacity: 0.7,
//     marginBottom: 2,
//   },
//   statValue: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });