'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrophyIcon,
  StarIcon,
  UsersIcon,
  ChartBarIcon,
  FireIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { 
  TrophyIcon as TrophyIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

interface LeaderboardMember {
  id: string;
  name: string;
  virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
  currentDay: number;
  completionRate: number;
  currentStreak: number;
  fruitLevel: number; // 1-5 levels
  totalPoints: number;
  recentWin?: string;
  isChristianPath: boolean;
  rank: number;
}

interface VirtueLeaderboardProps {
  userProgress: {
    virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
    currentDay: number;
    completionRate: number;
    currentStreak: number;
    fruitLevel: number;
    totalPoints: number;
  };
  onViewProfile?: (memberId: string) => void;
}

// Mock leaderboard data organized by virtue
const MOCK_LEADERBOARD_DATA: Record<string, LeaderboardMember[]> = {
  wisdom: [
    {
      id: 'w1',
      name: 'Sarah M.',
      virtue: 'wisdom',
      currentDay: 21,
      completionRate: 95,
      currentStreak: 12,
      fruitLevel: 5,
      totalPoints: 1420,
      recentWin: 'Completed 21-day wisdom journey with deep insights',
      isChristianPath: true,
      rank: 1
    },
    {
      id: 'w2', 
      name: 'David L.',
      virtue: 'wisdom',
      currentDay: 18,
      completionRate: 89,
      currentStreak: 8,
      fruitLevel: 4,
      totalPoints: 1180,
      recentWin: 'Learning to pause before important decisions',
      isChristianPath: false,
      rank: 2
    },
    {
      id: 'w3',
      name: 'Maria K.',
      virtue: 'wisdom',
      currentDay: 15,
      completionRate: 87,
      currentStreak: 6,
      fruitLevel: 3,
      totalPoints: 980,
      isChristianPath: true,
      rank: 3
    }
  ],
  courage: [
    {
      id: 'c1',
      name: 'Michael R.',
      virtue: 'courage',
      currentDay: 19,
      completionRate: 94,
      currentStreak: 10,
      fruitLevel: 5,
      totalPoints: 1380,
      recentWin: 'Started my own business after 3 weeks of courage practice',
      isChristianPath: false,
      rank: 1
    },
    {
      id: 'c2',
      name: 'Jessica T.',
      virtue: 'courage',
      currentDay: 16,
      completionRate: 88,
      currentStreak: 7,
      fruitLevel: 4,
      totalPoints: 1120,
      recentWin: 'Had the difficult conversation I was avoiding',
      isChristianPath: true,
      rank: 2
    }
  ],
  justice: [
    {
      id: 'j1',
      name: 'Emma L.',
      virtue: 'justice',
      currentDay: 20,
      completionRate: 90,
      currentStreak: 9,
      fruitLevel: 4,
      totalPoints: 1250,
      recentWin: 'Advocated for fair treatment at work',
      isChristianPath: true,
      rank: 1
    },
    {
      id: 'j2',
      name: 'Carlos M.',
      virtue: 'justice',
      currentDay: 14,
      completionRate: 86,
      currentStreak: 5,
      fruitLevel: 3,
      totalPoints: 920,
      isChristianPath: false,
      rank: 2
    }
  ],
  temperance: [
    {
      id: 't1',
      name: 'Anna W.',
      virtue: 'temperance',
      currentDay: 17,
      completionRate: 92,
      currentStreak: 8,
      fruitLevel: 4,
      totalPoints: 1190,
      recentWin: 'Developed healthy digital boundaries',
      isChristianPath: true,
      rank: 1
    }
  ]
};

export default function VirtueLeaderboard({ 
  userProgress,
  onViewProfile
}: VirtueLeaderboardProps) {
  const [selectedVirtue, setSelectedVirtue] = useState<'wisdom' | 'courage' | 'justice' | 'temperance'>(userProgress.virtue);

  const virtueConfig = {
    wisdom: {
      icon: AcademicCapIcon,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    courage: {
      icon: ShieldCheckIcon,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      badgeColor: 'bg-red-100 text-red-800'
    },
    justice: {
      icon: ScaleIcon,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      badgeColor: 'bg-green-100 text-green-800'
    },
    temperance: {
      icon: FireIcon,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  };

  const getFruitLevelDisplay = (level: number, isChristianPath: boolean) => {
    if (isChristianPath) {
      const fruitNames = ['Seed', 'Sprout', 'Growing', 'Bearing', 'Abundant'];
      return fruitNames[level - 1] || 'Seed';
    } else {
      const levelNames = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
      return levelNames[level - 1] || 'Bronze';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <TrophyIconSolid className="w-4 h-4 text-yellow-600" />;
    if (rank === 2) return <StarIconSolid className="w-4 h-4 text-gray-500" />;
    if (rank === 3) return <StarIconSolid className="w-4 h-4 text-amber-600" />;
    return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-600">#{rank}</span>;
  };

  const currentVirtueConfig = virtueConfig[selectedVirtue];
  const currentLeaderboard = MOCK_LEADERBOARD_DATA[selectedVirtue] || [];
  
  // Add user to leaderboard if they're practicing this virtue
  const leaderboardWithUser = selectedVirtue === userProgress.virtue 
    ? [
        ...currentLeaderboard,
        {
          id: 'user',
          name: 'You',
          virtue: userProgress.virtue,
          currentDay: userProgress.currentDay,
          completionRate: userProgress.completionRate,
          currentStreak: userProgress.currentStreak,
          fruitLevel: userProgress.fruitLevel,
          totalPoints: userProgress.totalPoints,
          isChristianPath: true, // TODO: Get from user data
          rank: currentLeaderboard.length + 1
        }
      ].sort((a, b) => b.totalPoints - a.totalPoints).map((member, index) => ({ ...member, rank: index + 1 }))
    : currentLeaderboard;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className={`${currentVirtueConfig.bgColor} ${currentVirtueConfig.borderColor}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg font-serif ${currentVirtueConfig.textColor} flex items-center gap-2`}>
            <TrophyIcon className="w-5 h-5" />
            Virtue Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-sm ${currentVirtueConfig.textColor} mb-3`}>
            See how you rank among others practicing the same virtue. Fruit levels represent sustained growth and consistency.
          </div>
          
          {/* Virtue Selector */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(virtueConfig) as Array<keyof typeof virtueConfig>).map((virtue) => {
              const config = virtueConfig[virtue];
              const Icon = config.icon;
              const memberCount = MOCK_LEADERBOARD_DATA[virtue]?.length || 0;
              
              return (
                <Button
                  key={virtue}
                  variant={selectedVirtue === virtue ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedVirtue(virtue)}
                  className={`flex flex-col gap-1 h-auto py-2 ${
                    selectedVirtue === virtue 
                      ? virtue === 'courage' 
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                        : virtue === 'wisdom'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                        : virtue === 'justice'
                        ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                        : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                      : virtue === 'courage'
                      ? 'border-red-300 text-red-800 hover:bg-red-50 bg-white'
                      : virtue === 'wisdom'
                      ? 'border-blue-300 text-blue-800 hover:bg-blue-50 bg-white'
                      : virtue === 'justice'
                      ? 'border-green-300 text-green-800 hover:bg-green-50 bg-white'
                      : 'border-purple-300 text-purple-800 hover:bg-purple-50 bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium capitalize">{virtue}</span>
                  <span className="text-xs opacity-75">{memberCount} active</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2 capitalize">
            <currentVirtueConfig.icon className="w-4 h-4" />
            {selectedVirtue} Leaders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardWithUser.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No one is practicing {selectedVirtue} yet</div>
              <div className="text-xs mt-1">Be the first to start this journey!</div>
            </div>
          ) : (
            leaderboardWithUser.map((member) => (
              <div
                key={member.id}
                className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                  member.id === 'user' 
                    ? 'bg-gold-50 border-gold-300' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => member.id !== 'user' && onViewProfile?.(member.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getRankIcon(member.rank)}
                    <div className="font-medium text-slate-900">
                      {member.name}
                      {member.id === 'user' && <span className="text-gold-700"> (You)</span>}
                    </div>
                    {member.isChristianPath && (
                      <Badge variant="outline" className="text-xs">
                        Faith
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-600">
                    {member.totalPoints} pts
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600">Day {member.currentDay}</span>
                    <span className="text-slate-600">{member.completionRate}% complete</span>
                    <Badge className={currentVirtueConfig.badgeColor}>
                      {getFruitLevelDisplay(member.fruitLevel, member.isChristianPath)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600">
                    <FireIcon className="w-3 h-3" />
                    <span className="text-xs">{member.currentStreak} streak</span>
                  </div>
                </div>
                
                <Progress value={member.completionRate} className="h-1 mb-2" />
                
                {member.recentWin && (
                  <div className="text-xs text-slate-600 italic bg-white p-2 rounded border">
                    Recent win: "{member.recentWin}"
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Fruit Level Legend */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-slate-900 mb-2">Fruit Level System</div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="text-center">
                <div className="font-medium text-slate-700">Level {level}</div>
                <div className="text-slate-600">
                  {getFruitLevelDisplay(level, true)}
                </div>
                <div className="text-slate-500">
                  {getFruitLevelDisplay(level, false)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-2 text-center">
            Fruit levels increase with consistency, streaks, and community engagement
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
