import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import UploadVideo from '../components/UploadVideo';
import { getAuth } from 'firebase/auth';

export default function ProfileScreen() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Upload Activity Videos</Text>

      <UploadVideo userId={currentUser.uid} activityName="Pushups" />
      <UploadVideo userId={currentUser.uid} activityName="ShuttleRun" />
      <UploadVideo userId={currentUser.uid} activityName="HighJump" />
      <UploadVideo userId={currentUser.uid} activityName="LongJump" />
      <UploadVideo userId={currentUser.uid} activityName="Running" />
    </ScrollView>
  );
}
