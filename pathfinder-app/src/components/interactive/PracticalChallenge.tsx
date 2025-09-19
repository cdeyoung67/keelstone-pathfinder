'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon, CheckCircleIcon, FireIcon, TrophyIcon, BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface PracticalChallengeProps {
  challenge: string;
  day: number;
  onComplete: (completed: boolean, timestamp: Date) => void;
  isCompleted?: boolean;
  completedAt?: Date;
  currentStreak?: number;
  totalCompleted?: number;
}

export default function PracticalChallenge({ 
  challenge, 
  day, 
  onComplete, 
  isCompleted = false,
  completedAt,
  currentStreak = 0,
  totalCompleted = 0
}: PracticalChallengeProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleToggleComplete = () => {
    if (!isCompleted) {
      setShowConfirmation(true);
    } else {
      onComplete(false, new Date());
      setShowConfirmation(false);
    }
  };

  const handleConfirmComplete = () => {
    onComplete(true, new Date());
    setShowConfirmation(false);
  };

  const getStreakBadge = () => {
    if (currentStreak >= 21) return { icon: TrophyIcon, label: 'Champion', color: 'bg-purple-100 text-purple-800' };
    if (currentStreak >= 14) return { icon: BoltIcon, label: 'On Fire', color: 'bg-red-100 text-red-800' };
    if (currentStreak >= 7) return { icon: ShieldCheckIcon, label: 'Warrior', color: 'bg-yellow-100 text-yellow-800' };
    if (currentStreak >= 3) return { icon: StarIcon, label: 'Strong', color: 'bg-blue-100 text-blue-800' };
    return null;
  };

  const streakBadge = getStreakBadge();

  return (
    <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg p-4 border border-gold-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif font-medium text-navy-900 flex items-center text-sm">
          <StarIcon className="w-4 h-4 mr-2 text-gold-600" />
          Practical Challenge (Gamified)
        </h4>
        
        {/* Streak and completion badges */}
        <div className="flex gap-2">
          {currentStreak > 0 && (
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              <FireIcon className="w-3 h-3 mr-1" />
              {currentStreak} day streak
            </Badge>
          )}
        {streakBadge && (
          <Badge className={`text-xs ${streakBadge.color}`}>
            <streakBadge.icon className="w-3 h-3 mr-1" />
            {streakBadge.label}
          </Badge>
        )}
        </div>
      </div>
      
      <p className="text-sm text-navy-800 leading-relaxed mb-4">{challenge}</p>
      
      {!showConfirmation ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button 
              onClick={handleToggleComplete}
              size="sm"
              variant={isCompleted ? "outline" : "default"}
              className={isCompleted 
                ? "border-green-300 text-green-700 hover:bg-green-50" 
                : "bg-gold-500 hover:bg-gold-600 text-navy-900"
              }
            >
              {isCompleted ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Challenge Complete!
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Mark Challenge Complete
                </>
              )}
            </Button>
            
            {totalCompleted > 0 && (
              <div className="flex items-center text-xs text-gold-700">
                <TrophyIcon className="w-4 h-4 mr-1" />
                {totalCompleted} total completed
              </div>
            )}
          </div>
          
          {isCompleted && completedAt && (
            <div className="text-xs text-green-600 italic">
              ✅ Completed on {completedAt.toLocaleDateString()} at {completedAt.toLocaleTimeString()}
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-white border-gold-300">
          <CardContent className="p-3">
            <p className="text-sm text-navy-800 mb-3">
              Great! You're about to complete today's courage challenge. This will:
            </p>
            <ul className="text-xs text-slate-600 space-y-1 mb-3">
              <li>• Add to your completion streak</li>
              <li>• Contribute to your Fruit Dashboard growth</li>
              <li>• Unlock potential badges and rewards</li>
            </ul>
            <div className="flex gap-2">
              <Button 
                onClick={handleConfirmComplete}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Confirm Complete
              </Button>
              <Button 
                onClick={() => setShowConfirmation(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <p className="text-xs text-gold-700 mt-3 italic">
        One small but tangible act of Courage - logged in app → tracked streaks, badges, or fruit icons as rewards.
      </p>
    </div>
  );
}
