
'use client';

import { useState, useMemo, startTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DiamondAwardIcon, GoldAwardIcon, SilverAwardIcon } from '../icons';
import type { ActivityType, LeaderboardEntry } from '@/lib/types';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { generateLeaderboardSummary } from '@/ai/flows/generate-leaderboard-summary';

interface LeaderboardClientProps {
  initialData: Record<ActivityType, LeaderboardEntry[]>;
}

const activityOptions: ActivityType[] = [
  'Running',
  'Long Jump',
  'Sit-ups',
  'Push-ups',
  'High Jump',
];

const locationOptions = ['All', 'California', 'Texas', 'New York', 'Florida'];

const getMedal = (rank: number) => {
  if (rank === 1) return <DiamondAwardIcon className="h-6 w-6 text-blue-400" />;
  if (rank === 2) return <GoldAwardIcon className="h-6 w-6 text-yellow-400" />;
  if (rank === 3) return <SilverAwardIcon className="h-6 w-6 text-gray-400" />;
  return <span className="text-sm font-medium">{rank}</span>;
};

export function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('Running');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = useMemo(() => {
    let data = initialData[selectedActivity] || [];
    if (selectedLocation !== 'All') {
      data = data.filter((entry) => entry.user.state === selectedLocation);
    }
    return data;
  }, [selectedActivity, selectedLocation, initialData]);
  
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');

    const topPerformers = filteredData.slice(0, 5).map(p => ({
      name: p.user.fullName,
      performanceMetric: p.metric,
      score: p.score,
    }));

    try {
      const result = await generateLeaderboardSummary({
        activityType: selectedActivity,
        location: selectedLocation === 'All' ? undefined : selectedLocation,
        topPerformers,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary('Could not generate a summary at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Activity</label>
            <Select
              value={selectedActivity}
              onValueChange={(value) => {
                startTransition(() => {
                  setSelectedActivity(value as ActivityType);
                  setSummary('');
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activityOptions.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Location</label>
            <Select
              value={selectedLocation}
              onValueChange={(value) => {
                 startTransition(() => {
                  setSelectedLocation(value);
                  setSummary('');
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locationOptions.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
            <Button onClick={handleGenerateSummary} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Generate Summary
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {summary && (
            <Alert className="mb-6 bg-primary/5 border-primary/20">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertTitle className="font-headline">AI Summary</AlertTitle>
                <AlertDescription>{summary}</AlertDescription>
            </Alert>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Athlete</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((entry) => (
                <TableRow key={entry.user.id}>
                  <TableCell>
                    <div className="flex h-8 w-8 items-center justify-center">
                      {getMedal(entry.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={entry.user.avatarUrl} alt={entry.user.fullName} />
                        <AvatarFallback>{entry.user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.user.state}, {entry.user.village}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-mono text-lg font-medium">
                      {entry.score}
                      <span className="ml-1 text-sm text-muted-foreground">{entry.metric}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results for this filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
