'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  SparklesIcon, 
  TrophyIcon, 
  FireIcon,
  CircleStackIcon,
  BoltIcon,
  ShieldCheckIcon,
  HeartIcon,
  FaceSmileIcon,
  HandRaisedIcon,
  ClockIcon,
  GiftIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface FruitDashboardProps {
  fruitGrowth: Record<string, number>;
  currentStreak: number;
  totalDays: number;
  completedDays: number;
  className?: string;
}

// Better icon mapping for each fruit of the spirit
const getFruitIcon = (fruit: string) => {
  switch (fruit) {
    case 'Love': return HeartIcon;
    case 'Joy': return FaceSmileIcon;
    case 'Peace': return HandRaisedIcon;
    case 'Patience': return ClockIcon;
    case 'Kindness': return GiftIcon;
    case 'Goodness': return StarIcon;
    case 'Faithfulness': return ShieldCheckIcon;
    case 'Gentleness': return SparklesIcon; // Using SparklesIcon for gentleness (soft, gentle sparkle)
    case 'Self-Control': return UserIcon;
    default: return SparklesIcon;
  }
};

const FRUIT_DATA = {
  'Love': { color: 'text-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  'Joy': { color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  'Peace': { color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  'Patience': { color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  'Kindness': { color: 'text-pink-500', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
  'Goodness': { color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  'Faithfulness': { color: 'text-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  'Gentleness': { color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  'Self-Control': { color: 'text-teal-500', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' }
};

const getFruitStage = (level: number) => {
  if (level >= 21) return { iconComponent: SparklesIcon, label: 'Mature Tree', description: 'Fully grown and bearing abundant fruit' };
  if (level >= 15) return { iconComponent: SparklesIcon, label: 'Flourishing Plant', description: 'Strong growth with visible fruit' };
  if (level >= 10) return { iconComponent: SparklesIcon, label: 'Growing Seedling', description: 'Healthy growth showing promise' };
  if (level >= 5) return { iconComponent: CircleStackIcon, label: 'Planted Seed', description: 'Beginning to take root' };
  if (level >= 1) return { iconComponent: CircleStackIcon, label: 'Prepared Soil', description: 'Ground ready for planting' };
  return { iconComponent: CircleStackIcon, label: 'Unplanted', description: 'Waiting to be cultivated' };
};

const getStreakReward = (streak: number) => {
  if (streak >= 21) return { iconComponent: TrophyIcon, label: 'Crown of Courage', color: 'text-purple-600' };
  if (streak >= 14) return { iconComponent: FireIcon, label: 'Fire of Faith', color: 'text-red-500' };
  if (streak >= 7) return { iconComponent: BoltIcon, label: 'Warrior Spirit', color: 'text-yellow-500' };
  if (streak >= 3) return { iconComponent: ShieldCheckIcon, label: 'Growing Strong', color: 'text-blue-500' };
  return null;
};

export default function FruitDashboard({ 
  fruitGrowth, 
  currentStreak, 
  totalDays, 
  completedDays,
  className = '' 
}: FruitDashboardProps) {
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'garden' | 'progress'>('garden');
  
  const totalFruitLevel = Object.values(fruitGrowth).reduce((sum, level) => sum + level, 0);
  const averageFruitLevel = totalFruitLevel / 9; // 9 fruits of the spirit
  const streakReward = getStreakReward(currentStreak);
  
  return (
    <Card className={`bg-gradient-to-br from-green-50 to-gold-50 border-green-200 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-green-600" />
            <CardTitle className="text-lg">Your Spiritual Fruit Garden</CardTitle>
          </div>
          
          {/* Streak Display */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-orange-500" />
              <Badge className="bg-orange-100 text-orange-800">
                {currentStreak} day streak
              </Badge>
              {streakReward && (() => {
                const RewardIcon = streakReward.iconComponent;
                return (
                  <Badge className={`${streakReward.color} bg-white flex items-center gap-1`}>
                    <RewardIcon className="w-3 h-3" />
                    {streakReward.label}
                  </Badge>
                );
              })()}
            </div>
          )}
        </div>
        
        <CardDescription>
          Growing through {completedDays} days of faithful practice • {totalFruitLevel} total fruit growth
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'garden' | 'progress')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="garden" className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Garden View
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrophyIcon className="w-4 h-4" />
              Progress View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="garden" className="space-y-6">
            {/* Fruit Garden Grid */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(FRUIT_DATA).map(([fruitName, fruitData]) => {
                const level = fruitGrowth[fruitName] || 0;
                const stage = getFruitStage(level);
                const isSelected = selectedFruit === fruitName;
                const FruitIcon = getFruitIcon(fruitName);
                
                return (
                  <button
                    key={fruitName}
                    onClick={() => setSelectedFruit(isSelected ? null : fruitName)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? `${fruitData.borderColor} ${fruitData.bgColor} shadow-lg scale-105` 
                        : 'border-green-200 bg-white hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 mx-auto">
                        <FruitIcon className={`w-8 h-8 ${fruitData.color}`} />
                      </div>
                      <div className="text-sm font-medium text-navy-900">{fruitName}</div>
                      <div className="text-xs text-slate-600">Level {level}</div>
                      <div className="text-xs text-green-600">{stage.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Selected Fruit Details */}
            {selectedFruit && (
              <Card className={`${FRUIT_DATA[selectedFruit].bgColor} ${FRUIT_DATA[selectedFruit].borderColor} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6">
                      {(() => {
                        const FruitIcon = getFruitIcon(selectedFruit);
                        return <FruitIcon className={`w-6 h-6 ${FRUIT_DATA[selectedFruit].color}`} />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-navy-900 mb-1">
                        {selectedFruit}
                      </h4>
                      <p className="text-sm text-slate-700 mb-2">
                        {getFruitStage(fruitGrowth[selectedFruit] || 0).description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>Level {fruitGrowth[selectedFruit] || 0}</span>
                        <span>•</span>
                        <span>Next stage at Level {Math.ceil((fruitGrowth[selectedFruit] || 0) / 5) * 5 + 5}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{completedDays}</div>
                  <div className="text-sm text-slate-600">Days Completed</div>
                  <Progress value={(completedDays / totalDays) * 100} className="mt-2 h-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-white border-orange-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
                  <div className="text-sm text-slate-600">Current Streak</div>
                  <div className="mt-2 text-xs text-orange-700">
                    {streakReward ? (
                      <div className="flex items-center gap-1">
                        {(() => {
                          const RewardIcon = streakReward.iconComponent;
                          return <RewardIcon className="w-3 h-3" />;
                        })()}
                        {streakReward.label}
                      </div>
                    ) : 'Keep going!'}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalFruitLevel}</div>
                  <div className="text-sm text-slate-600">Total Fruit Growth</div>
                  <div className="mt-2 text-xs text-purple-700">
                    Avg Level {averageFruitLevel.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Individual Fruit Progress */}
            <div className="space-y-3">
              <h4 className="font-medium text-navy-900">Individual Fruit Growth</h4>
              {Object.entries(FRUIT_DATA).map(([fruitName, fruitData]) => {
                const level = fruitGrowth[fruitName] || 0;
                const nextMilestone = Math.ceil(level / 5) * 5 + 5;
                const progressToNext = level === 0 ? 0 : ((level % 5) / 5) * 100;
                
                return (
                  <div key={fruitName} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-lg">{fruitData.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-navy-900">{fruitName}</span>
                        <span className="text-xs text-slate-600">Level {level}</span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                      <div className="text-xs text-slate-500 mt-1">
                        Next milestone: Level {nextMilestone}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Encouragement Message */}
        <div className="mt-6 p-4 bg-gold-50 rounded-lg border border-gold-200">
          <p className="text-sm text-gold-800 text-center">
            <TrophyIcon className="w-4 h-4 inline mr-2" />
            <strong>Keep Growing!</strong> Each day of faithful practice nurtures your spiritual fruit. 
            {averageFruitLevel < 5 && " You're just getting started - every small step matters!"}
            {averageFruitLevel >= 5 && averageFruitLevel < 15 && " Your garden is taking shape beautifully!"}
            {averageFruitLevel >= 15 && " Your spiritual fruit is flourishing - what an inspiration!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
