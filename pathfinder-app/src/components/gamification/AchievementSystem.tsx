'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrophyIcon, 
  StarIcon, 
  LockClosedIcon, 
  CheckCircleIcon, 
  FireIcon, 
  SparklesIcon, 
  FlagIcon,
  PlayIcon, // For first step (play/start)
  BoltIcon,
  ShieldCheckIcon,
  GiftIcon, // For fruit bearer
  DocumentTextIcon,
  HandRaisedIcon // For community encourager
} from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'fruit' | 'milestone' | 'special';
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  achievements: Achievement[];
  onClaimReward?: (achievementId: string) => void;
  className?: string;
}

const RARITY_COLORS = {
  common: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
  rare: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  epic: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  legendary: { bg: 'bg-gold-100', border: 'border-gold-300', text: 'text-gold-700' }
};

const CATEGORY_INFO = {
  streak: { name: 'Consistency', color: 'text-orange-600', iconComponent: FireIcon },
  fruit: { name: 'Spiritual Growth', color: 'text-green-600', iconComponent: SparklesIcon },
  milestone: { name: 'Journey Markers', color: 'text-blue-600', iconComponent: CheckCircleIcon },
  special: { name: 'Special Recognition', color: 'text-purple-600', iconComponent: StarIcon }
};

// Map achievement IDs to Heroicons
const getAchievementIcon = (achievementId: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'first-step': PlayIcon, // Start/first step
    'three-day-warrior': BoltIcon, // Power/energy
    'week-of-courage': ShieldCheckIcon, // Protection/strength
    'fruit-bearer': GiftIcon, // Gifts/fruits
    'courage-champion': TrophyIcon, // Ultimate achievement
    'reflection-master': DocumentTextIcon, // Writing/reflection
    'community-encourager': HandRaisedIcon // Community/helping
  };
  
  return iconMap[achievementId] || StarIcon; // Default to StarIcon if not found
};

// Sample achievements based on Christian Courage framework
const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step of Faith',
    description: 'Complete your first day of courage practice',
    icon: 'footprints', // Will be mapped to FootprintsIcon
    category: 'milestone',
    requirement: 1,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'common'
  },
  {
    id: 'three-day-warrior',
    title: 'Three Day Warrior',
    description: 'Maintain a 3-day practice streak',
    icon: 'bolt', // Will be mapped to BoltIcon
    category: 'streak',
    requirement: 3,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'common'
  },
  {
    id: 'week-of-courage',
    title: 'Week of Courage',
    description: 'Complete 7 consecutive days of practice',
    icon: 'shield', // Will be mapped to ShieldCheckIcon
    category: 'streak',
    requirement: 7,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'fruit-bearer',
    title: 'Fruit Bearer',
    description: 'Experience all 9 fruits of the spirit in one week',
    icon: 'tree', // Will be mapped to TreePineIcon
    category: 'fruit',
    requirement: 9,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'epic'
  },
  {
    id: 'courage-champion',
    title: 'Courage Champion',
    description: 'Complete the full 21-day journey',
    icon: 'crown', // Will be mapped to CrownIcon
    category: 'milestone',
    requirement: 21,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'reflection-master',
    title: 'Reflection Master',
    description: 'Write 10 meaningful reflections',
    icon: 'document', // Will be mapped to DocumentTextIcon
    category: 'special',
    requirement: 10,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'rare'
  },
  {
    id: 'community-encourager',
    title: 'Community Encourager',
    description: 'Share 5 reflections with the community',
    icon: 'handshake', // Will be mapped to HandshakeIcon
    category: 'special',
    requirement: 5,
    currentProgress: 0,
    isUnlocked: false,
    rarity: 'epic'
  }
];

export default function AchievementSystem({ 
  achievements = SAMPLE_ACHIEVEMENTS, 
  onClaimReward,
  className = '' 
}: AchievementSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionRate = (unlockedCount / totalCount) * 100;
  
  const filteredAchievements = achievements.filter(achievement => {
    if (showUnlockedOnly && !achievement.isUnlocked) return false;
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    return true;
  });
  
  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  };
  
  const isNearCompletion = (achievement: Achievement) => {
    return !achievement.isUnlocked && getProgressPercentage(achievement) >= 80;
  };

  return (
    <Card className={`bg-gradient-to-br from-gold-50 to-orange-50 border-gold-200 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-6 h-6 text-gold-600" />
            <CardTitle className="text-lg">Courage Achievements</CardTitle>
          </div>
          
          <Badge className="bg-gold-100 text-gold-800">
            {unlockedCount}/{totalCount} Unlocked
          </Badge>
        </div>
        
        <CardDescription>
          Track your spiritual growth through meaningful milestones
        </CardDescription>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Overall Completion</span>
            <span className="font-medium text-navy-900">{completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={completionRate} className="h-3" />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="text-xs"
          >
            All Categories
          </Button>
          
          {Object.entries(CATEGORY_INFO).map(([category, info]) => {
            const IconComponent = info.iconComponent;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs flex items-center gap-1"
              >
                <IconComponent className="w-3 h-3" />
                {info.name}
              </Button>
            );
          })}
          
          <Button
            variant={showUnlockedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
            className="text-xs ml-auto"
          >
            {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
          </Button>
        </div>
        
        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement) => {
            const rarity = RARITY_COLORS[achievement.rarity];
            const category = CATEGORY_INFO[achievement.category];
            const progressPercentage = getProgressPercentage(achievement);
            const nearCompletion = isNearCompletion(achievement);
            
            return (
              <Card 
                key={achievement.id}
                title={`${achievement.title}: ${achievement.description}${achievement.isUnlocked ? ' (Unlocked!)' : ` (Progress: ${achievement.currentProgress}/${achievement.requirement})`}`}
                className={`relative transition-all duration-300 cursor-help ${
                  achievement.isUnlocked 
                    ? `${rarity.bg} ${rarity.border} border-2 shadow-lg` 
                    : nearCompletion
                    ? 'bg-yellow-50 border-yellow-200 border-2 shadow-md'
                    : 'bg-slate-50 border-slate-300 border'
                } ${achievement.isUnlocked ? 'hover:scale-105' : 'hover:shadow-md hover:border-slate-400'}`}
              >
                {/* Unlocked Badge */}
                {achievement.isUnlocked && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircleIcon className="w-4 h-4" />
                  </div>
                )}
                
                {/* Locked Indicator - Top Left Corner */}
                {!achievement.isUnlocked && (
                  <div className="absolute -top-2 -left-2 bg-gray-400 text-white rounded-full p-1">
                    <LockClosedIcon className="w-4 h-4" />
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${achievement.isUnlocked ? '' : 'opacity-60'}`}>
                      {(() => {
                        const AchievementIcon = getAchievementIcon(achievement.id);
                        return (
                          <AchievementIcon 
                            className={`w-8 h-8 ${
                              achievement.isUnlocked 
                                ? 'text-gold-600' 
                                : 'text-slate-500'
                            }`} 
                          />
                        );
                      })()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className={`font-medium ${achievement.isUnlocked ? 'text-navy-900' : 'text-slate-700'}`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-xs ${achievement.isUnlocked ? 'text-slate-700' : 'text-slate-600'}`}>
                            {achievement.description}
                          </p>
                          {!achievement.isUnlocked && (
                            <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                              <FlagIcon className="w-3 h-3" />
                              Goal: {achievement.requirement} {achievement.category === 'streak' ? 'day streak' : achievement.category === 'milestone' ? 'days completed' : achievement.category === 'fruit' ? 'fruits experienced' : 'actions'}
                            </p>
                          )}
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className={`${rarity.bg} ${rarity.text} text-xs ml-2`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      {/* Category */}
                      <div className={`text-xs ${category.color} mb-2 flex items-center gap-1`}>
                        {(() => {
                          const CategoryIcon = category.iconComponent;
                          return <CategoryIcon className="w-3 h-3" />;
                        })()}
                        {category.name}
                      </div>
                      
                      {/* Progress */}
                      {!achievement.isUnlocked && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium">
                              {achievement.currentProgress}/{achievement.requirement}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          {nearCompletion && (
                            <p className="text-xs text-yellow-700 font-medium flex items-center gap-1">
                              <StarIcon className="w-3 h-3" />
                              Almost there! Keep going!
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Unlocked Info */}
                      {achievement.isUnlocked && achievement.unlockedAt && (
                        <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Claim Reward Button */}
                      {achievement.isUnlocked && onClaimReward && (
                        <Button 
                          size="sm" 
                          className="w-full mt-3 bg-gold-500 hover:bg-gold-600"
                          onClick={() => onClaimReward(achievement.id)}
                        >
                          <StarIcon className="w-4 h-4 mr-2" />
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <TrophyIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No achievements match your current filters.</p>
          </div>
        )}
        
        {/* Encouragement */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gold-200">
          <p className="text-sm text-gold-800 text-center">
            <TrophyIcon className="w-4 h-4 inline mr-2" />
            <strong>Keep Growing in Courage!</strong> Each achievement represents a meaningful step in your spiritual journey. 
            {unlockedCount === 0 && " Take that first step today!"}
            {unlockedCount > 0 && unlockedCount < totalCount && " You're making great progress!"}
            {unlockedCount === totalCount && " Congratulations, Courage Champion!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
