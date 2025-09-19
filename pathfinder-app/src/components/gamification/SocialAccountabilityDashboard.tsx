'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  UsersIcon,
  HeartIcon,
  TrophyIcon,
  SparklesIcon,
  ChatBubbleLeftIcon,
  HandRaisedIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  HandRaisedIcon as HandRaisedIconSolid
} from '@heroicons/react/24/solid';
import VirtueLeaderboard from './VirtueLeaderboard';

interface CommunityMember {
  id: string;
  name: string;
  virtue: string;
  currentDay: number;
  completionRate: number;
  currentStreak: number;
  recentWin?: string;
  isChristianPath: boolean;
}

interface CommunityShare {
  id: string;
  memberName: string;
  virtue: string;
  week: number;
  content: string;
  highlights: string[];
  timestamp: Date;
  encouragements: number;
  prayers: number;
  userHasEncouraged?: boolean;
  userHasPrayed?: boolean;
}

interface SocialAccountabilityDashboardProps {
  userProgress: {
    virtue: 'wisdom' | 'courage' | 'justice' | 'temperance';
    currentDay: number;
    completionRate: number;
    currentStreak: number;
    fruitLevel?: number;
    totalPoints?: number;
  };
  communityMembers?: CommunityMember[];
  recentShares?: CommunityShare[];
  onEncourage?: (shareId: string) => void;
  onPrayFor?: (shareId: string) => void;
  onJoinCommunity?: () => void;
  onViewProfile?: (memberId: string) => void;
  isChristianPath?: boolean;
}

// Mock data for demonstration
const MOCK_COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: '1',
    name: 'Sarah M.',
    virtue: 'wisdom',
    currentDay: 18,
    completionRate: 89,
    currentStreak: 5,
    recentWin: 'Finally had that difficult conversation with my boss',
    isChristianPath: true
  },
  {
    id: '2', 
    name: 'Michael K.',
    virtue: 'courage',
    currentDay: 15,
    completionRate: 93,
    currentStreak: 8,
    recentWin: 'Started the project I\'ve been putting off for months',
    isChristianPath: false
  },
  {
    id: '3',
    name: 'Emma L.',
    virtue: 'justice',
    currentDay: 12,
    completionRate: 75,
    currentStreak: 3,
    recentWin: 'Stood up for a coworker who was being treated unfairly',
    isChristianPath: true
  }
];

const MOCK_RECENT_SHARES: CommunityShare[] = [
  {
    id: '1',
    memberName: 'Sarah M.',
    virtue: 'wisdom',
    week: 2,
    content: 'This week I learned to pause before making decisions. God\'s timing is perfect, and rushing leads to mistakes. Taking time to pray first has changed everything.',
    highlights: ['Paused before reacting', 'Prayer became more natural', 'Made more thoughtful decisions'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    encouragements: 12,
    prayers: 8,
    userHasEncouraged: false,
    userHasPrayed: false
  },
  {
    id: '2',
    memberName: 'Michael K.',
    virtue: 'courage',
    week: 2, 
    content: 'Week 2 was about taking action despite fear. I finally started that side project I\'ve been talking about for years. Small steps, but they\'re adding up!',
    highlights: ['Started something I\'d been avoiding', 'Took action despite fear', 'Built stronger daily habits'],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    encouragements: 15,
    prayers: 0,
    userHasEncouraged: true,
    userHasPrayed: false
  }
];

export default function SocialAccountabilityDashboard({ 
  userProgress,
  communityMembers = MOCK_COMMUNITY_MEMBERS,
  recentShares = MOCK_RECENT_SHARES,
  onEncourage,
  onPrayFor,
  onJoinCommunity,
  onViewProfile,
  isChristianPath = false
}: SocialAccountabilityDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'shares'>('leaderboard');

  const handleEncourage = (shareId: string) => {
    onEncourage?.(shareId);
  };

  const handlePrayFor = (shareId: string) => {
    onPrayFor?.(shareId);
  };

  const getVirtueColor = (virtue: string) => {
    const colors = {
      wisdom: 'bg-blue-100 text-blue-800',
      courage: 'bg-red-100 text-red-800', 
      justice: 'bg-green-100 text-green-800',
      temperance: 'bg-purple-100 text-purple-800'
    };
    return colors[virtue as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif text-navy-900 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Practice Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 mb-3">
            You're part of a community practicing virtue together. Research shows social accountability increases success by 65%!
          </div>
          
          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-navy-900">{communityMembers.length + 1}</div>
              <div className="text-xs text-slate-600">Active Members</div>
            </div>
            <div>
              <div className="text-lg font-bold text-navy-900">
                {Math.round((communityMembers.reduce((sum, m) => sum + m.completionRate, userProgress.completionRate) / (communityMembers.length + 1)))}%
              </div>
              <div className="text-xs text-slate-600">Avg Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-navy-900">{recentShares.length}</div>
              <div className="text-xs text-slate-600">Recent Shares</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={selectedTab === 'leaderboard' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTab('leaderboard')}
          className="flex-1"
        >
          <TrophyIcon className="w-4 h-4 mr-2" />
          Virtue Leaderboard
        </Button>
        <Button
          variant={selectedTab === 'shares' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedTab('shares')}
          className="flex-1"
        >
          <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
          Community Shares
        </Button>
      </div>

      {/* Virtue Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <VirtueLeaderboard
          userProgress={{
            virtue: userProgress.virtue,
            currentDay: userProgress.currentDay,
            completionRate: userProgress.completionRate,
            currentStreak: userProgress.currentStreak,
            fruitLevel: userProgress.fruitLevel || 1,
            totalPoints: userProgress.totalPoints || Math.round(userProgress.completionRate * 10 + userProgress.currentStreak * 20)
          }}
          onViewProfile={onViewProfile}
        />
      )}

      {/* Recent Shares Tab */}
      {selectedTab === 'shares' && (
        <div className="space-y-4">
          {recentShares.map((share) => (
            <Card key={share.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">{share.memberName}</div>
                    <Badge className={getVirtueColor(share.virtue)}>
                      {share.virtue}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Week {share.week}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {formatTimeAgo(share.timestamp)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  {share.content}
                </div>
                
                {share.highlights.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-600">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {share.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Encouragement Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEncourage(share.id)}
                    className={`gap-1 ${share.userHasEncouraged ? 'text-red-600' : 'text-slate-600 hover:text-red-600'}`}
                  >
                    {share.userHasEncouraged ? (
                      <HeartIconSolid className="w-4 h-4" />
                    ) : (
                      <HeartIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm">{share.encouragements}</span>
                    <span className="text-xs">Encourage</span>
                  </Button>
                  
                  {isChristianPath && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePrayFor(share.id)}
                      className={`gap-1 ${share.userHasPrayed ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      {share.userHasPrayed ? (
                        <HandRaisedIconSolid className="w-4 h-4" />
                      ) : (
                        <HandRaisedIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm">{share.prayers}</span>
                      <span className="text-xs">Pray</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {recentShares.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <SparklesIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-sm text-slate-600">No recent shares yet</div>
                <div className="text-xs text-slate-500 mt-1">
                  Be the first to share your weekly win!
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
