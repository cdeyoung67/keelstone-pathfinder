'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  SparklesIcon, 
  TrophyIcon, 
  StarIcon,
  CheckCircleIcon,
  BoltIcon,
  ShieldCheckIcon,
  MapIcon
} from '@heroicons/react/24/outline';

interface Milestone {
  day: number;
  title: string;
  description: string;
  icon: string;
  celebration?: string;
  reward?: string;
  isCompleted: boolean;
  completedAt?: Date;
}

interface ProgressMarkersProps {
  currentDay: number;
  completedDays: number[];
  totalDays: number;
  onCelebrate?: (milestone: Milestone) => void;
  className?: string;
}

// Milestone celebrations based on Christian Courage journey
const COURAGE_MILESTONES: Milestone[] = [
  {
    day: 1,
    title: 'First Step of Faith',
    description: 'You\'ve begun your courage journey!',
    icon: 'step',
    celebration: 'Welcome to your courage journey! Every great journey begins with a single step.',
    reward: 'Unlocked: Daily Reflection feature',
    isCompleted: false
  },
  {
    day: 3,
    title: 'Building Momentum',
    description: 'Three days of consistent practice',
    icon: 'strength',
    celebration: 'Amazing! You\'re building a strong foundation of courage.',
    reward: 'Badge: Three Day Warrior',
    isCompleted: false
  },
  {
    day: 7,
    title: 'Week of Courage',
    description: 'One full week of faithful practice',
    icon: 'warrior',
    celebration: 'Incredible! A full week of growing in courage. You\'re truly becoming a warrior of faith.',
    reward: 'Badge: Week Warrior + Fruit Dashboard boost',
    isCompleted: false
  },
  {
    day: 14,
    title: 'Halfway Hero',
    description: 'You\'ve reached the halfway point!',
    icon: 'mountain',
    celebration: 'Halfway there! Your courage is growing stronger each day.',
    reward: 'Badge: Halfway Hero + Special reflection prompt',
    isCompleted: false
  },
  {
    day: 21,
    title: 'Courage Champion',
    description: 'Completed the full 21-day journey!',
    icon: 'crown',
    celebration: 'CHAMPION! You\'ve completed your 21-day courage transformation. What an incredible achievement!',
    reward: 'Crown Badge + Access to advanced practices',
    isCompleted: false
  }
];

const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case 'step': return StarIcon;
    case 'strength': return BoltIcon;
    case 'warrior': return ShieldCheckIcon;
    case 'mountain': return MapIcon;
    case 'crown': return TrophyIcon;
    default: return CheckCircleIcon;
  }
};

interface CelebrationModalProps {
  milestone: Milestone;
  onClose: () => void;
}

function CelebrationModal({ milestone, onClose }: CelebrationModalProps) {
  const IconComponent = getIconComponent(milestone.icon);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full bg-gradient-to-br from-gold-50 to-orange-50 border-gold-300 border-2">
        <CardContent className="p-6 text-center">
          {/* Celebration Animation */}
          <div className="w-16 h-16 mx-auto mb-4 animate-bounce bg-gold-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-gold-600" />
          </div>
          
          <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">
            {milestone.title}
          </h2>
          
          <p className="text-gold-800 mb-4 leading-relaxed">
            {milestone.celebration}
          </p>
          
          {milestone.reward && (
            <div className="bg-white rounded-lg p-3 mb-4 border border-gold-200">
              <div className="text-sm font-medium text-navy-900 mb-1 flex items-center justify-center gap-2">
                <StarIcon className="w-4 h-4 text-gold-600" />
                Reward Unlocked!
              </div>
              <div className="text-xs text-slate-600">{milestone.reward}</div>
            </div>
          )}
          
          <Button 
            onClick={onClose}
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Continue Journey
          </Button>
          
          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '2s'
                }}
              >
                <SparklesIcon className="w-4 h-4 text-gold-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProgressMarkers({ 
  currentDay, 
  completedDays, 
  totalDays,
  onCelebrate,
  className = '' 
}: ProgressMarkersProps) {
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>(COURAGE_MILESTONES);
  
  // Update milestone completion status
  useEffect(() => {
    setMilestones(prevMilestones => 
      prevMilestones.map(milestone => ({
        ...milestone,
        isCompleted: completedDays.includes(milestone.day),
        completedAt: completedDays.includes(milestone.day) ? new Date() : undefined
      }))
    );
  }, [completedDays]);
  
  // Check for new milestone achievements
  useEffect(() => {
    const newlyCompleted = milestones.find(
      milestone => 
        milestone.day === currentDay && 
        completedDays.includes(milestone.day) && 
        !milestone.isCompleted
    );
    
    if (newlyCompleted) {
      setCelebratingMilestone(newlyCompleted);
      onCelebrate?.(newlyCompleted);
    }
  }, [currentDay, completedDays, milestones, onCelebrate]);
  
  const completionPercentage = (completedDays.length / totalDays) * 100;
  const nextMilestone = milestones.find(m => !m.isCompleted);
  
  return (
    <>
      <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-serif font-semibold text-navy-900">Journey Milestones</h3>
            </div>
            
            <Badge className="bg-blue-100 text-blue-800">
              {completedDays.length}/{totalDays} Days
            </Badge>
          </div>
          
          {/* Progress Timeline */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
            <div 
              className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-1000"
              style={{ height: `${completionPercentage}%` }}
            ></div>
            
            {/* Milestone Markers */}
            <div className="space-y-6">
              {milestones.map((milestone, index) => {
                const isActive = currentDay >= milestone.day;
                const isCompleted = milestone.isCompleted;
                const isNext = nextMilestone?.day === milestone.day;
                const IconComponent = getIconComponent(milestone.icon);
                
                return (
                  <div key={milestone.day} className="relative flex items-start gap-4">
                    {/* Milestone Dot */}
                    <div className={`relative z-10 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-400 text-white shadow-lg' 
                        : isNext
                        ? 'bg-gold-100 border-gold-400 text-gold-600 animate-pulse'
                        : isActive
                        ? 'bg-blue-100 border-blue-400 text-blue-600'
                        : 'bg-slate-100 border-slate-300 text-slate-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Milestone Content */}
                    <div className={`flex-1 pb-6 ${isActive ? '' : 'opacity-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-navy-900">
                          Day {milestone.day}: {milestone.title}
                        </h4>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {isNext && (
                          <Badge className="bg-gold-100 text-gold-800 text-xs">
                            <StarIcon className="w-3 h-3 mr-1" />
                            Next Goal
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-2">
                        {milestone.description}
                      </p>
                      
                      {milestone.reward && (
                        <div className="text-xs text-purple-600">
                          {milestone.reward}
                        </div>
                      )}
                      
                      {isCompleted && milestone.completedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Achieved on {milestone.completedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Next Milestone Preview */}
          {nextMilestone && (
            <div className="mt-6 p-4 bg-gold-50 rounded-lg border border-gold-200">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="w-4 h-4 text-gold-600" />
                <span className="text-sm font-medium text-navy-900">Next Milestone</span>
              </div>
              <p className="text-sm text-gold-800">
                <span className="font-medium">{nextMilestone.title}</span> in {nextMilestone.day - currentDay} days
              </p>
              <div className="text-xs text-gold-700 mt-1">
                {nextMilestone.reward}
              </div>
            </div>
          )}
          
          {/* Completion Celebration */}
          {completedDays.length === totalDays && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-gold-100 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gold-100 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-gold-600" />
                </div>
                <h4 className="font-serif font-bold text-navy-900 mb-1">
                  Journey Complete!
                </h4>
                <p className="text-sm text-purple-800">
                  You've completed your 21-day courage transformation. What an incredible achievement!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Celebration Modal */}
      {celebratingMilestone && (
        <CelebrationModal 
          milestone={celebratingMilestone}
          onClose={() => setCelebratingMilestone(null)}
        />
      )}
    </>
  );
}
