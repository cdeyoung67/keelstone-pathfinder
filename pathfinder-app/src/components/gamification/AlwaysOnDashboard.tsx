'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FireIcon, 
  TrophyIcon, 
  SparklesIcon,
  CalendarDaysIcon,
  HeartIcon,
  StarIcon,
  ChevronRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  completedDays: number;
  currentDay: number;
  totalFruitGrowth: number;
  unlockedAchievements: number;
  totalAchievements: number;
  todayCompleted: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  priority: 'high' | 'medium' | 'low';
}

interface AlwaysOnDashboardProps {
  stats: DashboardStats;
  onStartToday?: () => void;
  onViewFruitGarden?: () => void;
  onViewAchievements?: () => void;
  onViewProgress?: () => void;
  className?: string;
}

export default function AlwaysOnDashboard({ 
  stats,
  onStartToday,
  onViewFruitGarden,
  onViewAchievements,
  onViewProgress,
  className = '' 
}: AlwaysOnDashboardProps) {
  const [showQuickActions, setShowQuickActions] = useState(true);
  
  const progressPercentage = (stats.completedDays / stats.totalDays) * 100;
  const achievementPercentage = (stats.unlockedAchievements / stats.totalAchievements) * 100;
  
  const getStreakMessage = () => {
    if (stats.currentStreak === 0) return "Ready to start your courage journey?";
    if (stats.currentStreak < 3) return "Building momentum! Keep going!";
    if (stats.currentStreak < 7) return "Great consistency! You're on fire!";
    if (stats.currentStreak < 14) return "Amazing dedication! You're a warrior!";
    if (stats.currentStreak < 21) return "Incredible perseverance! Almost there!";
    return "Courage Champion! What an inspiration!";
  };
  
  const getMotivationalMessage = () => {
    const messages = [
      "God has not given you a spirit of fear, but of power, love, and sound mind.",
      "Be strong and courageous! The Lord your God is with you wherever you go.",
      "In small acts of courage, we find the strength to face greater challenges.",
      "Every step of faith builds the foundation for tomorrow's victories.",
      "Your courage today inspires others to be brave tomorrow."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const quickActions: QuickAction[] = [
    {
      id: 'start-today',
      title: stats.todayCompleted ? 'Review Today' : 'Start Today\'s Practice',
      description: stats.todayCompleted 
        ? 'Reflect on today\'s courage journey' 
        : `Day ${stats.currentDay} courage practice awaits`,
      icon: stats.todayCompleted ? HeartIcon : PlayIcon,
      action: () => onStartToday?.(),
      priority: 'high'
    },
    {
      id: 'fruit-garden',
      title: 'Visit Fruit Garden',
      description: `${stats.totalFruitGrowth} total growth points`,
      icon: SparklesIcon,
      action: () => onViewFruitGarden?.(),
      priority: 'medium'
    },
    {
      id: 'achievements',
      title: 'View Achievements',
      description: `${stats.unlockedAchievements}/${stats.totalAchievements} unlocked`,
      icon: TrophyIcon,
      action: () => onViewAchievements?.(),
      priority: 'medium'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Stats Card */}
      <Card className="bg-gradient-to-br from-navy-900 to-navy-800 text-white border-navy-700">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-sand-100">Your Courage Journey</CardTitle>
              <CardDescription className="text-sand-300">
                {getStreakMessage()}
              </CardDescription>
            </div>
            
            {stats.currentStreak > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-orange-400">
                  <FireIcon className="w-5 h-5" />
                  <span className="text-2xl font-bold">{stats.currentStreak}</span>
                </div>
                <div className="text-xs text-sand-300">day streak</div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gold-400">{stats.completedDays}</div>
              <div className="text-xs text-sand-300">Days Complete</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{stats.totalFruitGrowth}</div>
              <div className="text-xs text-sand-300">Fruit Growth</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{stats.unlockedAchievements}</div>
              <div className="text-xs text-sand-300">Achievements</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{stats.longestStreak}</div>
              <div className="text-xs text-sand-300">Best Streak</div>
            </div>
          </div>
          
          {/* Journey Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sand-200">Journey Progress</span>
              <span className="text-sand-100 font-medium">
                {stats.completedDays}/{stats.totalDays} days ({progressPercentage.toFixed(0)}%)
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-navy-700" 
            />
          </div>
          
          {/* Motivational Quote */}
          <div className="mt-6 p-4 bg-navy-800 rounded-lg border border-navy-600">
            <p className="text-sm text-sand-200 italic text-center">
              "{getMotivationalMessage()}"
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-navy-900">Quick Actions</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowQuickActions(false)}
              className="text-xs"
            >
              Hide
            </Button>
          </div>
          
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                  action.priority === 'high' 
                    ? 'border-gold-300 bg-gold-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={action.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      action.priority === 'high' 
                        ? 'bg-gold-100 text-gold-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-navy-900 text-sm">
                        {action.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {action.description}
                      </p>
                    </div>
                    
                    <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Today's Status */}
      <Card className={`${
        stats.todayCompleted 
          ? 'bg-green-50 border-green-200' 
          : stats.currentDay <= stats.totalDays
          ? 'bg-blue-50 border-blue-200'
          : 'bg-purple-50 border-purple-200'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              stats.todayCompleted 
                ? 'bg-green-100 text-green-600' 
                : stats.currentDay <= stats.totalDays
                ? 'bg-blue-100 text-blue-600'
                : 'bg-purple-100 text-purple-600'
            }`}>
              {stats.todayCompleted ? (
                <HeartIcon className="w-5 h-5" />
              ) : stats.currentDay <= stats.totalDays ? (
                <CalendarDaysIcon className="w-5 h-5" />
              ) : (
                <TrophyIcon className="w-5 h-5" />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium text-sm ${
                stats.todayCompleted ? 'text-green-900' 
                : stats.currentDay <= stats.totalDays ? 'text-blue-900'
                : 'text-purple-900'
              }`}>
                {stats.todayCompleted 
                  ? 'Today\'s Practice Complete!'
                  : stats.currentDay <= stats.totalDays
                  ? `Day ${stats.currentDay} Ready`
                  : 'Journey Complete!'
                }
              </h4>
              <p className={`text-xs ${
                stats.todayCompleted ? 'text-green-700' 
                : stats.currentDay <= stats.totalDays ? 'text-blue-700'
                : 'text-purple-700'
              }`}>
                {stats.todayCompleted 
                  ? 'Well done! Your courage grew today.'
                  : stats.currentDay <= stats.totalDays
                  ? 'Your daily courage practice awaits'
                  : 'You\'ve completed your transformation!'
                }
              </p>
            </div>
            
            {!stats.todayCompleted && stats.currentDay <= stats.totalDays && (
              <Button 
                size="sm" 
                onClick={onStartToday}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Show Quick Actions Toggle */}
      {!showQuickActions && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowQuickActions(true)}
          className="w-full"
        >
          <StarIcon className="w-4 h-4 mr-2" />
          Show Quick Actions
        </Button>
      )}
    </div>
  );
}
