'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Play, Upload, Brain, CheckCircle } from 'lucide-react';

const VIDEO_CATEGORIES = ['Running', 'Long Jump', 'Sit-ups', 'High Jump', 'Endurance Run', 'Shuttle'];

const SAMPLE_VIDEOS = {
  'Running': 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'Long Jump': 'https://videos.pexels.com/video-files/6253956/6253956-uhd_2560_1440_25fps.mp4',
  'Sit-ups': 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4',
  'High Jump': 'https://videos.pexels.com/video-files/6975214/6975214-uhd_2560_1440_25fps.mp4',
  'Endurance Run': 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'Shuttle': 'https://videos.pexels.com/video-files/4662438/4662438-uhd_2560_1440_25fps.mp4'
};

interface Video {
  id: string;
  category: string;
  url: string;
  uploadDate: string;
  analyzed: boolean;
  aiScore?: number;
  feedback?: string;
}

export function VideoUploadSystem({ userId }: { userId: string }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const uploadVideo = (category: string) => {
    const newVideo: Video = {
      id: Date.now().toString(),
      category,
      url: SAMPLE_VIDEOS[category as keyof typeof SAMPLE_VIDEOS],
      uploadDate: new Date().toISOString().split('T')[0],
      analyzed: false
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const analyzeVideo = async (videoId: string) => {
    setAnalyzing(videoId);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockFeedback = {
      'Running': 'Good form! Maintain consistent pace. Improve arm swing.',
      'Long Jump': 'Excellent takeoff angle. Work on landing technique.',
      'Sit-ups': 'Perfect form! Maintain this consistency.',
      'High Jump': 'Great approach speed. Focus on bar clearance.',
      'Endurance Run': 'Steady pace maintained. Good breathing technique.',
      'Shuttle': 'Quick direction changes. Improve acceleration.'
    };

    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { 
            ...video, 
            analyzed: true, 
            aiScore: Math.floor(Math.random() * 30) + 70,
            feedback: mockFeedback[video.category as keyof typeof mockFeedback]
          }
        : video
    ));
    setAnalyzing(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📹 Video Upload Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {VIDEO_CATEGORIES.map(category => (
              <Button
                key={category}
                variant="outline"
                onClick={() => uploadVideo(category)}
                className="h-20 flex flex-col gap-2"
              >
                <Upload className="h-5 w-5" />
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📂 Uploaded Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No videos uploaded yet</p>
          ) : (
            <div className="grid gap-4">
              {videos.map(video => (
                <div key={video.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{video.category}</h3>
                      <p className="text-sm text-gray-500">Uploaded: {video.uploadDate}</p>
                    </div>
                    <div className="flex gap-2">
                      {video.analyzed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Score: {video.aiScore}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <video 
                    src={video.url} 
                    controls 
                    className="w-full h-48 rounded-lg mb-3"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3EVideo Preview%3C/text%3E%3C/svg%3E"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => analyzeVideo(video.id)}
                      disabled={analyzing === video.id || video.analyzed}
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      {analyzing === video.id ? 'Analyzing...' : video.analyzed ? 'Analyzed' : 'Analyze with AI'}
                    </Button>
                  </div>
                  
                  {video.feedback && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">AI Feedback:</p>
                      <p className="text-sm text-blue-700">{video.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}