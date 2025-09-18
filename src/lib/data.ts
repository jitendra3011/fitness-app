import type { Leaderboard, LeaderboardEntry } from './types';

const users = [
  {
    id: 'u1',
    fullName: 'Aarav Kumar',
    avatarUrl: 'https://i.pravatar.cc/100?img=11',
    state: 'MH',
    village: 'Pune',
  },
  {
    id: 'u2',
    fullName: 'Priya Sharma',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    state: 'KA',
    village: 'Bengaluru',
  },
  {
    id: 'u3',
    fullName: 'Rahul Verma',
    avatarUrl: 'https://i.pravatar.cc/100?img=13',
    state: 'DL',
    village: null,
  },
  {
    id: 'u4',
    fullName: 'Neha Singh',
    avatarUrl: 'https://i.pravatar.cc/100?img=14',
    state: 'TN',
    village: 'Chennai',
  },
  {
    id: 'u5',
    fullName: 'Vikram Patel',
    avatarUrl: 'https://i.pravatar.cc/100?img=15',
    state: 'GJ',
    village: 'Surat',
  },
];

function entry(userIdx: number, score: number, metric: LeaderboardEntry['metric']): LeaderboardEntry {
  return { user: users[userIdx], score, metric };
}

export const mockLeaderboard: Leaderboard = {
  'Running': [entry(0, 5.6, 'km'), entry(1, 5.2, 'km'), entry(2, 4.9, 'km'), entry(3, 4.6, 'km'), entry(4, 4.1, 'km')],
  'Long Jump': [entry(2, 310, 'cm'), entry(0, 298, 'cm'), entry(3, 296, 'cm')],
  'Sit-ups': [entry(1, 82, 'reps'), entry(4, 79, 'reps'), entry(3, 75, 'reps')],
  'Push-ups': [entry(4, 65, 'reps'), entry(2, 60, 'reps'), entry(0, 58, 'reps')],
  'High Jump': [entry(3, 145, 'cm'), entry(1, 142, 'cm'), entry(0, 140, 'cm')],
};


