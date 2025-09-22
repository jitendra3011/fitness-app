'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface AthleteVideo {
  id: string;
  athleteName: string;
  category: string;
  url: string;
  uploadDate: string;
  analyzed: boolean;
  aiScore?: number;
  feedback?: string;
}

const MOCK_VIDEOS: AthleteVideo[] = [
  {
    id: '1',
    athleteName: 'Push Up Tutorial',
    category: 'Push Ups',
    url: 'https://www.youtube.com/watch?v=L_sVqDppvdc',
    uploadDate: '2024-01-15',
    analyzed: true,
    aiScore: 95,
    feedback: 'Excellent push-up form and technique demonstration'
  },
  {
    id: '2',
    athleteName: 'Push Ups for Beginners',
    category: 'Push Ups',
    url: 'https://www.youtube.com/watch?v=ynPwl6qyUNM',
    uploadDate: '2024-01-14',
    analyzed: true,
    aiScore: 92,
    feedback: 'Perfect beginner-friendly push-up instructions'
  },
  {
    id: '3',
    athleteName: 'Long Jump Drills',
    category: 'Long Jump',
    url: 'https://www.youtube.com/watch?v=qB7p3t4h1TU',
    uploadDate: '2024-01-13',
    analyzed: true,
    aiScore: 89,
    feedback: 'Effective long jump training drills and techniques'
  },
  {
    id: '4',
    athleteName: 'High Jump Technique',
    category: 'High Jump',
    url: 'https://www.espn.in/video/clip/_/id/17116238',
    uploadDate: '2024-01-12',
    analyzed: true,
    aiScore: 94,
    feedback: 'Professional high jump technique showcase'
  },
  {
    id: '5',
    athleteName: 'Long Jump for Beginners',
    category: 'Long Jump',
    url: 'https://www.dailymotion.com/video/x8h6ra4',
    uploadDate: '2024-01-11',
    analyzed: true,
    aiScore: 87,
    feedback: 'Step-by-step long jump technique for beginners'
  }
];

export function VideoManagementEnhanced() {
  const [videos, setVideos] = useState<AthleteVideo[]>(MOCK_VIDEOS);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const analyzeVideo = async (videoId: string) => {
    setAnalyzing(videoId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { 
            ...video, 
            analyzed: true, 
            aiScore: Math.floor(Math.random() * 30) + 70,
            feedback: 'AI analysis completed - Good performance with room for improvement'
          }
        : video
    ));
    setAnalyzing(null);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ionicons name="play" size={20} />
            Training Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {videos.map(video => (
              <div key={video.id} className="border rounded-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0 w-full md:w-64">
                    <div className="relative w-full h-36 bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
                      <img 
                        src={`https://img.youtube.com/vi/${video.url.includes('youtube.com') ? video.url.split('v=')[1]?.split('&')[0] : 'default'}/maxresdefault.jpg`}
                        alt={video.athleteName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='360'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-size='24'%3E${video.category}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Ionicons name="play" size={16} color="white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Ionicons name="person" size={16} />
                        <span className="font-semibold">{video.athleteName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MaterialIcons name="sports" size={16} />
                        <span>{video.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ionicons name="calendar" size={16} />
                        <span className="text-sm text-gray-500">{video.uploadDate}</span>
                      </div>
                      {video.analyzed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Score: {video.aiScore}%
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => analyzeVideo(video.id)}
                      disabled={analyzing === video.id || video.analyzed}
                      className="w-full"
                    >
                      <MaterialIcons name="psychology" size={16} style={{marginRight: 4}} />
                      {analyzing === video.id ? 'Analyzing...' : video.analyzed ? 'Re-analyze' : 'Analyze'}
                    </Button>
                    
                    {video.feedback && (
                      <div className="p-3 bg-blue-50 rounded text-sm">
                        <p className="font-medium text-blue-800 mb-1">AI Feedback:</p>
                        <p className="text-blue-700">{video.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}