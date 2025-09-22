'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { User, Video, Eye, Download, Play } from 'lucide-react';

// Mock user data with demo videos
const mockUsers = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    age: 25,
    gender: 'Male',
    trainingLevel: 'Intermediate',
    height: '175',
    weight: '70',
    bmi: 22.9,
    demoVideos: [
      { 
        name: 'Push-up Demo', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', 
        size: '15MB',
        thumbnail: '/demo-thumbnails/pushup.jpg',
        duration: '2:30'
      },
      { 
        name: 'Running Form', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', 
        size: '25MB',
        thumbnail: '/demo-thumbnails/running.jpg',
        duration: '3:45'
      }
    ],
    profilePhoto: '/avatars/john.jpg'
  },
  {
    id: 2,
    fullName: 'Sarah Smith',
    email: 'sarah@example.com',
    age: 28,
    gender: 'Female',
    trainingLevel: 'Advanced',
    height: '165',
    weight: '58',
    bmi: 21.3,
    demoVideos: [
      { 
        name: 'Yoga Flow', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4', 
        size: '30MB',
        thumbnail: '/demo-thumbnails/yoga.jpg',
        duration: '5:20'
      },
      { 
        name: 'Strength Training', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4', 
        size: '20MB',
        thumbnail: '/demo-thumbnails/strength.jpg',
        duration: '4:15'
      },
      { 
        name: 'Cardio Routine', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_2mb.mp4', 
        size: '18MB',
        thumbnail: '/demo-thumbnails/cardio.jpg',
        duration: '3:30'
      }
    ],
    profilePhoto: '/avatars/sarah.jpg'
  },
  {
    id: 3,
    fullName: 'Mike Johnson',
    email: 'mike@example.com',
    age: 32,
    gender: 'Male',
    trainingLevel: 'Beginner',
    height: '180',
    weight: '85',
    bmi: 26.2,
    demoVideos: [
      { 
        name: 'Basic Workout', 
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4', 
        size: '12MB',
        thumbnail: '/demo-thumbnails/basic.jpg',
        duration: '2:00'
      }
    ],
    profilePhoto: '/avatars/mike.jpg'
  }
];

export default function UsersWithVideos() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const handleVideoPlay = (videoUrl) => {
    setPlayingVideo(videoUrl);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Profiles with Demo Videos</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {mockUsers.length} Users
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockUsers.map((user) => (
          <Card key={user.id} className="border hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{user.fullName}</CardTitle>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge variant="outline" className="mt-1">{user.trainingLevel}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Age:</span> {user.age}</div>
                <div><span className="font-medium">Gender:</span> {user.gender}</div>
                <div><span className="font-medium">Height:</span> {user.height}cm</div>
                <div><span className="font-medium">BMI:</span> {user.bmi}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">Demo Videos ({user.demoVideos.length})</span>
                </div>
                <div className="space-y-2">
                  {user.demoVideos.slice(0, 2).map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center gap-2">
                        <Play className="h-3 w-3 text-blue-600" />
                        <span className="truncate">{video.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{video.duration}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleVideoPlay(video.url)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {user.demoVideos.length > 2 && (
                    <p className="text-xs text-gray-500">+{user.demoVideos.length - 2} more videos</p>
                  )}
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setSelectedUser(user)}
                variant="outline"
              >
                View All Videos
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{selectedUser.fullName} - Demo Videos</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedUser(null)}>×</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                    <div><span className="font-medium">Age:</span> {selectedUser.age}</div>
                    <div><span className="font-medium">Gender:</span> {selectedUser.gender}</div>
                    <div><span className="font-medium">Training Level:</span> {selectedUser.trainingLevel}</div>
                    <div><span className="font-medium">Height:</span> {selectedUser.height} cm</div>
                    <div><span className="font-medium">Weight:</span> {selectedUser.weight} kg</div>
                    <div><span className="font-medium">BMI:</span> {selectedUser.bmi}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Demo Videos ({selectedUser.demoVideos.length})</h3>
                  <div className="grid gap-4">
                    {selectedUser.demoVideos.map((video, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{video.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{video.duration}</span>
                            <span>•</span>
                            <span>{video.size}</span>
                          </div>
                        </div>
                        <div className="bg-gray-200 rounded h-32 flex items-center justify-center mb-3 relative">
                          <Video className="h-8 w-8 text-gray-400" />
                          <Button 
                            className="absolute inset-0 bg-black bg-opacity-50 text-white"
                            onClick={() => handleVideoPlay(video.url)}
                          >
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleVideoPlay(video.url)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full">
            <div className="flex justify-end mb-4">
              <Button variant="ghost" onClick={() => setPlayingVideo(null)} className="text-white">
                ×
              </Button>
            </div>
            <video 
              controls 
              autoPlay 
              className="w-full rounded-lg"
              src={playingVideo}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}