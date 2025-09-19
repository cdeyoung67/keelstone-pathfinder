'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HeartIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

interface GratitudeEntry {
  id: string;
  content: string;
  category: 'people' | 'experiences' | 'growth' | 'provision' | 'general';
  timestamp: Date;
}

interface GratitudeLogProps {
  day: number;
  isChristianPath?: boolean;
  existingEntries?: GratitudeEntry[];
  onSave: (entries: GratitudeEntry[]) => void;
  onComplete: () => void;
  isCompleted?: boolean;
}

const GRATITUDE_PROMPTS = {
  christian: [
    "What is one way God showed His faithfulness today?",
    "Who did God use to bless you this week?", 
    "What challenge helped you grow closer to God?",
    "How did you see God's provision in your life?",
    "What Scripture or prayer encouraged you recently?"
  ],
  secular: [
    "What is one small moment that brought you joy today?",
    "Who made a positive difference in your week?",
    "What challenge taught you something valuable?", 
    "What do you appreciate about your current circumstances?",
    "What progress or growth are you grateful for?"
  ]
};

const CATEGORY_CONFIG = {
  people: { label: 'People', icon: HeartIcon, color: 'bg-rose-100 text-rose-800' },
  experiences: { label: 'Experiences', icon: SparklesIcon, color: 'bg-blue-100 text-blue-800' },
  growth: { label: 'Growth', icon: CheckCircleIcon, color: 'bg-green-100 text-green-800' },
  provision: { label: 'Provision', icon: ClockIcon, color: 'bg-amber-100 text-amber-800' },
  general: { label: 'General', icon: HeartIcon, color: 'bg-purple-100 text-purple-800' }
};

export default function GratitudeLog({ 
  day, 
  isChristianPath = false,
  existingEntries = [],
  onSave,
  onComplete,
  isCompleted = false
}: GratitudeLogProps) {
  const [entries, setEntries] = useState<GratitudeEntry[]>(existingEntries);
  const [newEntry, setNewEntry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORY_CONFIG>('general');
  const [isExpanded, setIsExpanded] = useState(!isCompleted && existingEntries.length === 0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const prompts = isChristianPath ? GRATITUDE_PROMPTS.christian : GRATITUDE_PROMPTS.secular;
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const handleStartTimer = () => {
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;

    const entry: GratitudeEntry = {
      id: `gratitude_${Date.now()}`,
      content: newEntry.trim(),
      category: selectedCategory,
      timestamp: new Date()
    };

    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    setNewEntry('');
    onSave(updatedEntries);

    // Update time spent
    if (startTime) {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setTimeSpent(elapsed);
    }
  };

  const handleComplete = () => {
    if (startTime) {
      const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setTimeSpent(elapsed);
    }
    setIsExpanded(false);
    onComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted && !isExpanded) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircleIconSolid className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900 text-sm">Gratitude Practice Complete</div>
                <div className="text-xs text-green-700">
                  {entries.length} gratitude{entries.length !== 1 ? 's' : ''} recorded
                  {timeSpent > 0 && ` • ${formatTime(timeSpent)} spent`}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
            >
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gold-50 border-gold-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gold-900 flex items-center gap-2">
          <HeartIconSolid className="w-4 h-4" />
          Weekly Gratitude Practice
          <Badge variant="outline" className="text-xs">
            Optional • 2 minutes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Introduction */}
        <div className="text-sm text-gold-800">
          {isChristianPath 
            ? "Take a moment to recognize God's goodness in your life this week. Gratitude strengthens faith and joy."
            : "Research shows gratitude practice enhances well-being and strengthens positive habits. Take 2 minutes to reflect."
          }
        </div>

        {/* Timer */}
        {startTime && (
          <div className="flex items-center gap-2 text-xs text-gold-700 bg-gold-100 px-2 py-1 rounded">
            <ClockIcon className="w-3 h-3" />
            Time: {formatTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))}
          </div>
        )}

        {/* Existing Entries */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gold-900">Your Gratitudes:</div>
            {entries.map((entry) => {
              const categoryConfig = CATEGORY_CONFIG[entry.category];
              const Icon = categoryConfig.icon;
              return (
                <div key={entry.id} className="bg-white p-3 rounded-lg border border-gold-200">
                  <div className="flex items-start gap-2 mb-2">
                    <Icon className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{entry.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${categoryConfig.color} text-xs`}>
                          {categoryConfig.label}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Prompt */}
        <div className="bg-white p-3 rounded-lg border border-gold-200">
          <div className="text-sm font-medium text-gold-900 mb-2">Reflection Prompt:</div>
          <p className="text-sm text-gold-800 italic">"{randomPrompt}"</p>
        </div>

        {/* New Entry Form */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gold-900">Add a gratitude:</div>
            <Textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              onFocus={handleStartTimer}
              placeholder="I'm grateful for..."
              className="bg-white border-gold-300 focus:border-gold-500 focus:ring-gold-500/20 text-sm resize-none"
              rows={2}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gold-900">Category:</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
                const config = CATEGORY_CONFIG[category];
                const Icon = config.icon;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg border transition-all ${
                      selectedCategory === category
                        ? 'bg-gold-100 border-gold-300 text-gold-900'
                        : 'bg-white border-gold-200 text-gold-700 hover:bg-gold-50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Button */}
          <Button 
            onClick={handleAddEntry}
            disabled={!newEntry.trim()}
            size="sm"
            className="w-full bg-gold-600 hover:bg-gold-700 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Gratitude
          </Button>
        </div>

        {/* Complete Button */}
        {entries.length > 0 && (
          <div className="pt-2 border-t border-gold-200">
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Complete Gratitude Practice
            </Button>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-gold-600 hover:text-gold-700 hover:bg-gold-100 text-xs"
          >
            Skip for now
          </Button>
        </div>

        {/* Research Note */}
        <div className="text-xs text-gold-700 bg-gold-100 p-2 rounded text-center">
          <SparklesIcon className="w-3 h-3 inline mr-1" />
          Gratitude practice enhances well-being and strengthens prosocial behavior
        </div>
      </CardContent>
    </Card>
  );
}
