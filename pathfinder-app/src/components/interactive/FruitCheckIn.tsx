'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  HeartIcon,
  FaceSmileIcon,
  HandRaisedIcon,
  ClockIcon,
  GiftIcon,
  StarIcon,
  ShieldCheckIcon,
  UserIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

interface FruitCheckInProps {
  fruits: string[];
  day: number;
  onUpdate: (selectedFruits: string[], timestamp: Date) => void;
  existingSelection?: string[];
  fruitGrowth?: Record<string, number>; // Track growth levels for each fruit
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

const FRUIT_DESCRIPTIONS: Record<string, string> = {
  'Love': 'Showing care and compassion for others',
  'Joy': 'Finding happiness despite circumstances',
  'Peace': 'Maintaining calm in difficult situations',
  'Patience': 'Waiting gracefully and persevering',
  'Kindness': 'Acting with generosity and consideration',
  'Goodness': 'Choosing what is right and beneficial',
  'Faithfulness': 'Being reliable and trustworthy',
  'Gentleness': 'Responding with tenderness and humility',
  'Self-Control': 'Managing emotions and impulses wisely'
};

export default function FruitCheckIn({ 
  fruits, 
  day, 
  onUpdate, 
  existingSelection = [],
  fruitGrowth = {}
}: FruitCheckInProps) {
  const [selectedFruits, setSelectedFruits] = useState<string[]>(existingSelection);
  const [isSaved, setIsSaved] = useState(existingSelection.length > 0);
  const [showDetails, setShowDetails] = useState(false);

  const toggleFruit = (fruit: string) => {
    setSelectedFruits(prev => {
      if (prev.includes(fruit)) {
        return prev.filter(f => f !== fruit);
      } else {
        return [...prev, fruit];
      }
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    onUpdate(selectedFruits, new Date());
    setIsSaved(true);
  };

  const getFruitLevel = (fruit: string): number => {
    return fruitGrowth[fruit] || 0;
  };

  const getFruitLevelIcon = (level: number) => {
    if (level >= 15) return { icon: SparklesIcon, color: 'text-green-600' }; // Mature growth
    if (level >= 10) return { icon: SparklesIcon, color: 'text-green-500' }; // Growing well
    if (level >= 5) return { icon: SparklesIcon, color: 'text-green-400' };  // Seedling
    if (level >= 1) return { icon: SparklesIcon, color: 'text-green-300' };  // Starting
    return { icon: CircleStackIcon, color: 'text-gray-300' };                // No growth yet
  };

  return (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif font-medium text-navy-900 flex items-center text-sm">
          <SparklesIcon className="w-4 h-4 mr-2 text-green-600" />
          Fruit of the Spirit Check-In (Interactive)
        </h4>
        
        {isSaved && (
          <div className="flex items-center text-green-600 text-xs">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Saved
          </div>
        )}
      </div>
      
      <p className="text-sm text-green-800 mb-4">
        Which fruits did you experience or express through today's courage practice?
      </p>
      
      <div className="space-y-4">
        {/* Fruit Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fruits.map(fruit => {
            const isSelected = selectedFruits.includes(fruit);
            const level = getFruitLevel(fruit);
            const levelIconData = getFruitLevelIcon(level);
            const FruitIcon = getFruitIcon(fruit);
            const LevelIcon = levelIconData.icon;
            
            return (
              <button
                key={fruit}
                onClick={() => toggleFruit(fruit)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected 
                    ? 'border-green-400 bg-green-100 shadow-sm' 
                    : 'border-green-200 bg-white hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <FruitIcon className="w-5 h-5 text-green-600" />
                  <LevelIcon className={`w-4 h-4 ${levelIconData.color}`} />
                </div>
                <div className="text-sm font-medium text-navy-900">{fruit}</div>
                {level > 0 && (
                  <div className="text-xs text-green-600">Level {level}</div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Selected Fruits Summary */}
        {selectedFruits.length > 0 && (
          <div className="bg-white rounded-lg p-3 border border-green-300">
            <h5 className="text-sm font-medium text-navy-900 mb-2">
              Today's Fruit Experience ({selectedFruits.length} selected):
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedFruits.map(fruit => (
                <Badge key={fruit} className="bg-green-100 text-green-800 text-xs">
                  {FRUIT_EMOJIS[fruit]} {fruit}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide' : 'Show'} Fruit Details
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={selectedFruits.length === 0 || isSaved}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Update Fruit Dashboard
          </Button>
        </div>
        
        {/* Fruit Details */}
        {showDetails && (
          <Card className="bg-white border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Understanding the Fruits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {fruits.map(fruit => (
                <div key={fruit} className="text-xs">
                  <span className="font-medium">{FRUIT_EMOJIS[fruit]} {fruit}:</span>
                  <span className="text-slate-600 ml-1">{FRUIT_DESCRIPTIONS[fruit]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      
      <p className="text-xs text-green-600 mt-4 italic">
        Simple self-assessment - builds a "Fruit Dashboard" that grows visually with consistent practice.
      </p>
    </div>
  );
}
