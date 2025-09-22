import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  profilePhoto: z.any().optional(),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email: z.string().email('Invalid email address'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City/Village is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  idType: z.enum(['Aadhaar', 'Passport', 'PAN', 'Others']),
  idNumber: z.string().min(5, 'ID number is required'),
  height: z.string().min(1, 'Height is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Height must be a positive number'),
  weight: z.string().min(1, 'Weight is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Weight must be a positive number'),
  trainingLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  achievements: z.string().optional(),
  demoVideos: z.array(z.any()).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const router = useRouter();
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [demoVideos, setDemoVideos] = useState<any[]>([]);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      mobileNumber: '',
      email: '',
      state: '',
      district: '',
      city: '',
      pincode: '',
      idType: 'Aadhaar',
      idNumber: '',
      height: '',
      weight: '',
      trainingLevel: 'Beginner',
      achievements: '',
      demoVideos: [],
    },
  });

  const watchedDOB = watch('dateOfBirth');
  const watchedHeight = watch('height');
  const watchedWeight = watch('weight');

  const age = useMemo(() => {
    if (!watchedDOB) return null;
    const birthDate = new Date(watchedDOB);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return null;
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) calculatedAge--;
    return calculatedAge;
  }, [watchedDOB]);

  const bmi = useMemo(() => {
    if (!watchedHeight || !watchedWeight) return null;
    const heightInM = parseFloat(watchedHeight) / 100;
    const weightInKg = parseFloat(watchedWeight);
    if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) return null;
    return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
  }, [watchedHeight, watchedWeight]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePreview(uri);
      setValue('profilePhoto', uri);
    }
  };

  const pickVideos = async () => {
    const result = await DocumentPicker.getDocumentAsync({
  type: 'video/*',
  multiple: true,
});

// Handle multiple or single selection
if (!result.canceled) {
  const picked = result.assets ?? [result]; // normalize
  const newVideos = [...demoVideos, ...picked];
  setDemoVideos(newVideos);
  setValue('demoVideos', newVideos);
}

  };

  const onSubmit = async (values: ProfileValues) => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
      const user = JSON.parse(userStr);

      const formData = { userId: user.id, ...values };
      const res = await fetch('http://192.168.43.130:3002/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');

      Alert.alert('Success', 'Profile saved successfully!');
      router.push('/(tabs)');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  const saveDraft = async () => {
    try {
      const values = getValues();
      await AsyncStorage.setItem('profileDraft', JSON.stringify(values));
      Alert.alert('Draft Saved');
    } catch (error) {
      console.error(error);
      Alert.alert('Error saving draft');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>Fill in your details to get started with your fitness journey</Text>

      {/* Personal Info */}
      <Controller control={control} name="fullName" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} placeholder="Enter your full name" value={field.value} onChangeText={field.onChange} />
        </View>
      )} />
      <Controller control={control} name="dateOfBirth" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={field.value} onChangeText={field.onChange} />
        </View>
      )} />
      <View style={styles.field}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.readonly}>{age || 'Auto-calculated'}</Text>
      </View>
      <Controller control={control} name="gender" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Gender *</Text>
          <Picker selectedValue={field.value} onValueChange={field.onChange} style={styles.picker}>
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      )} />

      {/* Profile Photo */}
      <View style={styles.field}>
        <Text style={styles.label}>Profile Photo *</Text>
        {profilePreview ? <Image source={{ uri: profilePreview }} style={styles.profileImage} /> : null}
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      {['mobileNumber', 'email', 'state', 'district', 'city', 'pincode'].map((name, i) => (
        <Controller key={i} control={control} name={name as keyof ProfileValues} render={({ field }) => (
          <View style={styles.field}>
            <Text style={styles.label}>{name.replace(/([A-Z])/g, ' $1')} *</Text>
            <TextInput style={styles.input} placeholder={`Enter ${name}`} value={field.value} onChangeText={field.onChange} keyboardType={name === 'mobileNumber' || name === 'pincode' ? 'numeric' : 'default'} />
          </View>
        )} />
      ))}

      {/* Identity Verification */}
      <Controller control={control} name="idType" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>ID Type *</Text>
          <Picker selectedValue={field.value} onValueChange={field.onChange} style={styles.picker}>
            <Picker.Item label="Aadhaar" value="Aadhaar" />
            <Picker.Item label="Passport" value="Passport" />
            <Picker.Item label="PAN" value="PAN" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
        </View>
      )} />
      <Controller control={control} name="idNumber" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>ID Number *</Text>
          <TextInput style={styles.input} placeholder="Enter ID number" value={field.value} onChangeText={field.onChange} />
        </View>
      )} />

      {/* Physical Details */}
      <Controller control={control} name="height" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Height (cm) *</Text>
          <TextInput style={styles.input} placeholder="175" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
        </View>
      )} />
      <Controller control={control} name="weight" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Weight (kg) *</Text>
          <TextInput style={styles.input} placeholder="70" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
        </View>
      )} />
      <View style={styles.field}>
        <Text style={styles.label}>BMI</Text>
        <Text style={styles.readonly}>
          {bmi || 'Auto-calculated'} {bmi ? `(${bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'})` : ''}
        </Text>
      </View>

      {/* Training Info */}
      <Controller control={control} name="trainingLevel" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Training Level *</Text>
          <Picker selectedValue={field.value} onValueChange={field.onChange} style={styles.picker}>
            <Picker.Item label="Beginner" value="Beginner" />
            <Picker.Item label="Intermediate" value="Intermediate" />
            <Picker.Item label="Advanced" value="Advanced" />
          </Picker>
        </View>
      )} />
      <Controller control={control} name="achievements" render={({ field }) => (
        <View style={styles.field}>
          <Text style={styles.label}>Achievements / Past Competitions</Text>
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Share your achievements..." value={field.value} onChangeText={field.onChange} multiline />
        </View>
      )} />

      {/* Demo Videos */}
      <View style={styles.field}>
        <Text style={styles.label}>Demo Videos</Text>
        {demoVideos.map((video, i) => (
          <Text key={i} style={{ marginBottom: 4 }}>{video.name || video.uri}</Text>
        ))}
        <TouchableOpacity style={styles.button} onPress={pickVideos}>
          <Text style={styles.buttonText}>Upload Videos</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={saveDraft}>
          <Text style={styles.buttonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Submit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  readonly: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  outlineButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007bff' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  picker: { borderWidth: Platform.OS === 'android' ? 1 : 0, borderColor: '#ccc', borderRadius: 8 },
});













// 'use client';

// import { useForm, ControllerRenderProps } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useState, useMemo } from 'react';
// import { Button } from '../components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '../components/ui/form';
// import { Input } from '../components/ui/input';
// import { Textarea } from '../components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { User, MapPin, Shield, Activity, Trophy } from 'lucide-react';
// import { VideoUploadSystem } from '../components/video/video-upload-system';
// import { z } from 'zod';

// const profileSchema = z.object({
//   fullName: z.string().min(2, 'Full name is required'),
//   dateOfBirth: z.string().min(1, 'Date of birth is required'),
//   gender: z.enum(['Male', 'Female', 'Other']),
//   profilePhoto: z.any().optional(),
//   mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
//   email: z.string().email('Invalid email address'),
//   state: z.string().min(2, 'State is required'),
//   district: z.string().min(2, 'District is required'),
//   city: z.string().min(2, 'City/Village is required'),
//   pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
//   idType: z.enum(['Aadhaar', 'Passport', 'PAN', 'Others']),
//   idNumber: z.string().min(5, 'ID number is required'),
//   height: z.string().min(1, 'Height is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Height must be a positive number'),
//   weight: z.string().min(1, 'Weight is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Weight must be a positive number'),
//   trainingLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
//   achievements: z.string().optional(),
//   demoVideos: z.array(z.any()).optional(),
// });

// type ProfileValues = z.infer<typeof profileSchema>;

// export function ProfileForm() {
//   const router = useRouter();
//   const [profilePreview, setProfilePreview] = useState<string>('');

//   const form = useForm<ProfileValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       fullName: '',
//       dateOfBirth: '',
//       gender: 'Male' as const,
//       mobileNumber: '',
//       email: '',
//       state: '',
//       district: '',
//       city: '',
//       pincode: '',
//       idType: 'Aadhaar' as const,
//       idNumber: '',
//       height: '',
//       weight: '',
//       trainingLevel: 'Beginner' as const,
//       achievements: '',
//       demoVideos: [],
//     },
//   });

//   const watchedDOB = form.watch('dateOfBirth');
//   const watchedHeight = form.watch('height');
//   const watchedWeight = form.watch('weight');

//   const age = useMemo(() => {
//     if (!watchedDOB) return null;
//     const birthDate = new Date(watchedDOB);
//     const today = new Date();
//     if (isNaN(birthDate.getTime())) return null;
//     const calculatedAge = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
//       ? calculatedAge - 1 : calculatedAge;
//   }, [watchedDOB]);

//   const bmi = useMemo(() => {
//     if (!watchedHeight || !watchedWeight) return null;
//     const heightInM = parseFloat(watchedHeight) / 100;
//     const weightInKg = parseFloat(watchedWeight);
//     if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) return null;
//     return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
//   }, [watchedHeight, watchedWeight]);

//   const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       form.setValue('profilePhoto', file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           setProfilePreview(e.target.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = (values: ProfileValues) => {
//     try {
//       console.log(values);
//       localStorage.removeItem('profileDraft');
//       alert('Profile Submitted Successfully');
//       router.push('/');
//     } catch (error) {
//       console.error('Submission error:', error);
//       alert('Error submitting profile. Please try again.');
//     }
//   };

//   const saveDraft = () => {
//     try {
//       const values = form.getValues();
//       localStorage.setItem('profileDraft', JSON.stringify(values));
//       alert('Draft Saved');
//     } catch (error) {
//       console.error('Save draft error:', error);
//       alert('Error saving draft. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
//         <p className="text-gray-600">Fill in your details to get started with your fitness journey</p>
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Personal Information */}
//           <Card className="border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-5 w-5" />
//                 Personal Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="fullName"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'fullName'> }) => (
//                     <FormItem>
//                       <FormLabel>Full Name *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter your full name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="dateOfBirth"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'dateOfBirth'> }) => (
//                     <FormItem>
//                       <FormLabel>Date of Birth *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="YYYY-MM-DD" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
              
//               <div className="grid gap-6 md:grid-cols-3">
//                 <div className="space-y-2">
//                   <FormLabel>Age</FormLabel>
//                   <div className="px-3 py-2 bg-gray-50 border rounded-md">
//                     {age || 'Auto-calculated'}
//                   </div>
//                 </div>
//                 <FormField
//                   control={form.control}
//                   name="gender"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'gender'> }) => (
//                     <FormItem>
//                       <FormLabel>Gender *</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="Male">Male</SelectItem>
//                           <SelectItem value="Female">Female</SelectItem>
//                           <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="space-y-2">
//                   <FormLabel>Profile Photo *</FormLabel>
//                   <div className="flex items-center gap-4">
//                     {profilePreview && (
//                       <img src={profilePreview} alt="Profile preview" className="h-16 w-16 rounded-full object-cover border" />
//                     )}
//                     <Button
//                       type="button"
//                       onClick={async () => {
//                         // Use a React Native image picker here
//                         // Example using expo-image-picker:
//                         // const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
//                         // if (!result.canceled) {
//                         //   form.setValue('profilePhoto', result.assets[0]);
//                         //   setProfilePreview(result.assets[0].uri);
//                         // }
//                         alert('Image picker not implemented. Please integrate a React Native image picker.');
//                       }}
//                     >
//                       Upload Photo
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Contact Details */}
//           <Card className="border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <MapPin className="h-5 w-5" />
//                 Contact Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="mobileNumber"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'mobileNumber'> }) => (
//                     <FormItem>
//                       <FormLabel>Mobile Number *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="10-digit mobile number" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'email'> }) => (
//                     <FormItem>
//                       <FormLabel>Email Address *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="your.email@example.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
              
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//                 <FormField
//                   control={form.control}
//                   name="state"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'state'> }) => (
//                     <FormItem>
//                       <FormLabel>State *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter state" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="district"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'district'> }) => (
//                     <FormItem>
//                       <FormLabel>District *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter district" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="city"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'city'> }) => (
//                     <FormItem>
//                       <FormLabel>Village/City *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter city/village" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="pincode"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'pincode'> }) => (
//                     <FormItem>
//                       <FormLabel>Pincode *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="6-digit pincode" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Identity Verification */}
//           <Card className="border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Shield className="h-5 w-5" />
//                 Identity Verification
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="idType"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'idType'> }) => (
//                     <FormItem>
//                       <FormLabel>Government ID Type *</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select ID type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="Aadhaar">Aadhaar Card</SelectItem>
//                           <SelectItem value="Passport">Passport</SelectItem>
//                           <SelectItem value="PAN">PAN Card</SelectItem>
//                           <SelectItem value="Others">Others</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="idNumber"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'idNumber'> }) => (
//                     <FormItem>
//                       <FormLabel>Government ID Number *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter ID number" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Physical Details */}
//           <Card className="border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5" />
//                 Physical Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid gap-6 md:grid-cols-3">
//                 <FormField
//                   control={form.control}
//                   name="height"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'height'> }) => (
//                     <FormItem>
//                       <FormLabel>Height (cm) *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="175" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="weight"
//                   render={({ field }: { field: ControllerRenderProps<ProfileValues, 'weight'> }) => (
//                     <FormItem>
//                       <FormLabel>Weight (kg) *</FormLabel>
//                       <FormControl>
//                         <Input placeholder="70" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <div className="space-y-2">
//                   <FormLabel>BMI</FormLabel>
//                   <div className="px-3 py-2 bg-gray-50 border rounded-md">
//                     {bmi || 'Auto-calculated'}
//                     {bmi && (
//                       <span className="ml-2 text-sm">
//                         ({bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'})
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Training Information */}
//           <Card className="border">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Trophy className="h-5 w-5" />
//                 Training Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="trainingLevel"
//                 render={({ field }: { field: ControllerRenderProps<ProfileValues, 'trainingLevel'> }) => (
//                   <FormItem>
//                     <FormLabel>Training Level *</FormLabel>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select your training level" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="Beginner">Beginner</SelectItem>
//                         <SelectItem value="Intermediate">Intermediate</SelectItem>
//                         <SelectItem value="Advanced">Advanced</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="achievements"
//                 render={({ field }: { field: ControllerRenderProps<ProfileValues, 'achievements'> }) => (
//                   <FormItem>
//                     <FormLabel>Achievements / Past Competitions</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Share your fitness achievements..."
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="space-y-4">
//                 <FormLabel>Demo Videos</FormLabel>
//                 <VideoUploadSystem userId="profile-user" />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4 justify-between pt-6">
//             <Button type="button" variant="outline" onClick={saveDraft}>
//               Save as Draft
//             </Button>
//             <Button type="submit">
//               Submit Profile
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }