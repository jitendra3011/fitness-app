export type ActivityType =
  | 'Running'
  | 'Long Jump'
  | 'Sit-ups'
  | 'Push-ups'
  | 'High Jump'
  | 'Shuttle Run'
  | 'Endurance Run';
  


export type LeaderboardMetricUnit = 'km' | 'm' | 'reps' | 'cm' | 'laps' | 'pts' | 'seconds';

export interface LeaderboardUser {
  id: string;
  fullName: string;
  avatarUrl: string;
  state?: string;
  village?: string | null;
}

export interface LeaderboardEntry {
  user: LeaderboardUser;
  score: number;
  metric: LeaderboardMetricUnit;
}

export type Leaderboard = Record<ActivityType, LeaderboardEntry[]>;


