'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircleIcon, 
  FireIcon,
  CalendarIcon,
  TrophyIcon,
  ShareIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  FireIcon as FireIconSolid 
} from '@heroicons/react/24/solid';

interface ProgressRingProps {
  currentDay: number;
  completedDays: number[];
  totalDays: number;
  virtue: string;
  weeklySharePrompt?: string;
  onWeeklyShare?: (content: string) => void;
  lastSharedWeek?: number;
  streakCount?: number;
  className?: string;
}

export default function ProgressRing({ 
  currentDay, 
  completedDays, 
  totalDays,
  virtue,
  weeklySharePrompt,
  onWeeklyShare,
  lastSharedWeek = 0,
  streakCount = 0,
  className = ""
}: ProgressRingProps) {
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [shareContent, setShareContent] = useState('');

  // Calculate progress metrics
  const completionRate = (completedDays.length / Math.min(currentDay, totalDays)) * 100;
  const currentWeek = Math.ceil(currentDay / 7);
  const isWeeklyShareDue = currentWeek > lastSharedWeek && [7, 14, 21].includes(currentDay);
  const consecutiveDays = calculateConsecutiveStreak(completedDays, currentDay);
  
  // Calculate ring progress for visual display
  const ringProgress = (completedDays.length / totalDays) * 100;
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (ringProgress / 100) * circumference;

  function calculateConsecutiveStreak(completed: number[], current: number): number {
    let streak = 0;
    for (let i = Math.min(current, totalDays); i >= 1; i--) {
      if (completed.includes(i)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  const handleShare = () => {
    if (shareContent.trim() && onWeeklyShare) {
      onWeeklyShare(shareContent.trim());
      setShareContent('');
      setShowSharePrompt(false);
    }
  };

  const getProgressMessage = () => {
    if (completionRate >= 90) return "Exceptional progress!";
    if (completionRate >= 75) return "Strong momentum!";
    if (completionRate >= 60) return "Good consistency!";
    if (completionRate >= 40) return "Building habits!";
    return "Every step counts!";
  };

  const getStreakBadge = () => {
    if (consecutiveDays >= 7) return { icon: TrophyIcon, text: `${consecutiveDays} day streak!`, color: 'bg-yellow-100 text-yellow-800' };
    if (consecutiveDays >= 3) return { icon: FireIconSolid, text: `${consecutiveDays} day streak`, color: 'bg-orange-100 text-orange-800' };
    if (consecutiveDays >= 1) return { icon: CheckCircleIconSolid, text: `${consecutiveDays} day${consecutiveDays > 1 ? 's' : ''}`, color: 'bg-green-100 text-green-800' };
    return null;
  };

  const streakBadge = getStreakBadge();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress Ring Card */}
      <Card className="bg-gradient-to-br from-gold-50 to-olive-50 border-gold-200">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-serif text-navy-900">
            {virtue.charAt(0).toUpperCase() + virtue.slice(1)} Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {/* SVG Progress Ring */}
          <div className="relative inline-block mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-sand-300"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="text-gold-500 transition-all duration-500 ease-out"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-navy-900">
                {completedDays.length}
              </div>
              <div className="text-xs text-slate-600">
                of {totalDays}
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">Day {currentDay} of {totalDays}</span>
            </div>
            
            {streakBadge && (
              <Badge className={`${streakBadge.color} gap-1`}>
                <streakBadge.icon className="w-3 h-3" />
                {streakBadge.text}
              </Badge>
            )}
            
            <div className="text-xs text-slate-600 font-medium">
              {getProgressMessage()}
            </div>
          </div>

          {/* Completion Rate Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Completion Rate</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Share Prompt */}
      {isWeeklyShareDue && (
        <Card className="border-gold-300 bg-gold-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gold-900 flex items-center gap-2">
              <ShareIcon className="w-4 h-4" />
              Weekly Share-Out (Week {currentWeek})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gold-800">
              {weeklySharePrompt || `Share one win from your ${virtue} practice this week! Public reporting magnifies habit success.`}
            </p>
            
            {!showSharePrompt ? (
              <Button 
                onClick={() => setShowSharePrompt(true)}
                size="sm"
                className="w-full bg-gold-600 hover:bg-gold-700 text-white"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share This Week's Win
              </Button>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={shareContent}
                  onChange={(e) => setShareContent(e.target.value)}
                  placeholder="Share one specific win, insight, or breakthrough from practicing courage this week..."
                  className="w-full p-3 text-sm border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 bg-white resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleShare}
                    disabled={!shareContent.trim()}
                    size="sm"
                    className="flex-1 bg-gold-600 hover:bg-gold-700 text-white"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Share Win
                  </Button>
                  <Button 
                    onClick={() => setShowSharePrompt(false)}
                    variant="outline"
                    size="sm"
                    className="border-gold-300 text-gold-700 hover:bg-gold-100"
                  >
                    Later
                  </Button>
                </div>
                <p className="text-xs text-gold-700">
                  Your share will be visible to your practice community and helps others stay motivated!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-navy-900">{completedDays.length}</div>
              <div className="text-xs text-slate-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-navy-900">{consecutiveDays}</div>
              <div className="text-xs text-slate-600">Current Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-navy-900">{Math.round(completionRate)}%</div>
              <div className="text-xs text-slate-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
