'use client';

import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { User, MapPin, Shield, Activity, Trophy } from 'lucide-react';
import { VideoUploadSystem } from '../components/video/video-upload-system';
import { z } from 'zod';

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

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: 'Male' as const,
      mobileNumber: '',
      email: '',
      state: '',
      district: '',
      city: '',
      pincode: '',
      idType: 'Aadhaar' as const,
      idNumber: '',
      height: '',
      weight: '',
      trainingLevel: 'Beginner' as const,
      achievements: '',
      demoVideos: [],
    },
  });

  const watchedDOB = form.watch('dateOfBirth');
  const watchedHeight = form.watch('height');
  const watchedWeight = form.watch('weight');

  const age = useMemo(() => {
    if (!watchedDOB) return null;
    const birthDate = new Date(watchedDOB);
    const today = new Date();
    if (isNaN(birthDate.getTime())) return null;
    const calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? calculatedAge - 1 : calculatedAge;
  }, [watchedDOB]);

  const bmi = useMemo(() => {
    if (!watchedHeight || !watchedWeight) return null;
    const heightInM = parseFloat(watchedHeight) / 100;
    const weightInKg = parseFloat(watchedWeight);
    if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) return null;
    return Math.round((weightInKg / (heightInM * heightInM)) * 10) / 10;
  }, [watchedHeight, watchedWeight]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfilePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: ProfileValues) => {
    try {
      console.log(values);
      localStorage.removeItem('profileDraft');
      alert('Profile Submitted Successfully');
      router.push('/');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting profile. Please try again.');
    }
  };

  const saveDraft = () => {
    try {
      const values = form.getValues();
      localStorage.setItem('profileDraft', JSON.stringify(values));
      alert('Draft Saved');
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
        <p className="text-gray-600">Fill in your details to get started with your fitness journey</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'fullName'> }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'dateOfBirth'> }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <FormLabel>Age</FormLabel>
                  <div className="px-3 py-2 bg-gray-50 border rounded-md">
                    {age || 'Auto-calculated'}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'gender'> }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Profile Photo *</FormLabel>
                  <div className="flex items-center gap-4">
                    {profilePreview && (
                      <img src={profilePreview} alt="Profile preview" className="h-16 w-16 rounded-full object-cover border" />
                    )}
                    <Button
                      type="button"
                      onClick={async () => {
                        // Use a React Native image picker here
                        // Example using expo-image-picker:
                        // const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
                        // if (!result.canceled) {
                        //   form.setValue('profilePhoto', result.assets[0]);
                        //   setProfilePreview(result.assets[0].uri);
                        // }
                        alert('Image picker not implemented. Please integrate a React Native image picker.');
                      }}
                    >
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'mobileNumber'> }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'email'> }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'state'> }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'district'> }) => (
                    <FormItem>
                      <FormLabel>District *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'city'> }) => (
                    <FormItem>
                      <FormLabel>Village/City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city/village" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'pincode'> }) => (
                    <FormItem>
                      <FormLabel>Pincode *</FormLabel>
                      <FormControl>
                        <Input placeholder="6-digit pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'idType'> }) => (
                    <FormItem>
                      <FormLabel>Government ID Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="Passport">Passport</SelectItem>
                          <SelectItem value="PAN">PAN Card</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'idNumber'> }) => (
                    <FormItem>
                      <FormLabel>Government ID Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Physical Details */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Physical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'height'> }) => (
                    <FormItem>
                      <FormLabel>Height (cm) *</FormLabel>
                      <FormControl>
                        <Input placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }: { field: ControllerRenderProps<ProfileValues, 'weight'> }) => (
                    <FormItem>
                      <FormLabel>Weight (kg) *</FormLabel>
                      <FormControl>
                        <Input placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>BMI</FormLabel>
                  <div className="px-3 py-2 bg-gray-50 border rounded-md">
                    {bmi || 'Auto-calculated'}
                    {bmi && (
                      <span className="ml-2 text-sm">
                        ({bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Information */}
          <Card className="border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Training Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="trainingLevel"
                render={({ field }: { field: ControllerRenderProps<ProfileValues, 'trainingLevel'> }) => (
                  <FormItem>
                    <FormLabel>Training Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your training level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="achievements"
                render={({ field }: { field: ControllerRenderProps<ProfileValues, 'achievements'> }) => (
                  <FormItem>
                    <FormLabel>Achievements / Past Competitions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your fitness achievements..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormLabel>Demo Videos</FormLabel>
                <VideoUploadSystem userId="profile-user" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-between pt-6">
            <Button type="button" variant="outline" onClick={saveDraft}>
              Save as Draft
            </Button>
            <Button type="submit">
              Submit Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}