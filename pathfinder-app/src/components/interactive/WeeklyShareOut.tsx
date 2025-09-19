'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShareIcon, 
  HeartIcon,
  CheckCircleIcon,
  SparklesIcon,
  UsersIcon,
  LockClosedIcon,
  GlobeAltIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface WeeklyShareOutProps {
  week: number;
  virtue: string;
  completedDays: number[];
  weekDays: number[]; // Days 1-7, 8-14, or 15-21
  onShare: (shareData: {
    week: number;
    content: string;
    privacy: 'public' | 'community' | 'private';
    highlights: string[];
    timestamp: Date;
  }) => void;
  existingShare?: {
    content: string;
    privacy: 'public' | 'community' | 'private';
    highlights: string[];
    timestamp: Date;
  };
  isChristianPath?: boolean;
}

type SharePrivacy = 'public' | 'community' | 'private';

export default function WeeklyShareOut({ 
  week, 
  virtue,
  completedDays,
  weekDays,
  onShare,
  existingShare,
  isChristianPath = false
}: WeeklyShareOutProps) {
  const [shareContent, setShareContent] = useState(existingShare?.content || '');
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>(existingShare?.highlights || []);
  const [privacy, setPrivacy] = useState<SharePrivacy>(existingShare?.privacy || 'community');
  const [isSharing, setIsSharing] = useState(false);

  // Calculate week stats
  const weekCompletedDays = completedDays.filter(day => weekDays.includes(day));
  const weekCompletionRate = (weekCompletedDays.length / weekDays.length) * 100;
  
  // Generate suggested highlights based on completion rate and virtue
  const getSuggestedHighlights = () => {
    const base = [
      `Completed ${weekCompletedDays.length} out of ${weekDays.length} days`,
      `Practiced ${virtue} consistently`,
      `Built stronger daily habits`,
      `Overcame resistance and showed up`
    ];

    const virtueSpecific = {
      wisdom: [
        'Made more thoughtful decisions',
        'Paused before reacting',
        'Learned something new about myself',
        'Asked better questions'
      ],
      courage: [
        'Took action despite fear',
        'Spoke up when it mattered',
        'Started something I\'d been avoiding',
        'Faced a difficult conversation'
      ],
      justice: [
        'Stood up for someone else',
        'Made a fair decision',
        'Helped without being asked',
        'Corrected an injustice'
      ],
      temperance: [
        'Chose restraint over impulse',
        'Found balance in a difficult situation',
        'Practiced self-control',
        'Made mindful choices'
      ]
    };

    const christianAdditions = isChristianPath ? [
      'Felt God\'s presence in daily practice',
      'Prayer became more natural',
      'Scripture spoke to my situation',
      'Experienced grace in failure'
    ] : [];

    return [
      ...base,
      ...(virtueSpecific[virtue as keyof typeof virtueSpecific] || []),
      ...christianAdditions
    ];
  };

  const suggestedHighlights = getSuggestedHighlights();

  const toggleHighlight = (highlight: string) => {
    setSelectedHighlights(prev => 
      prev.includes(highlight) 
        ? prev.filter(h => h !== highlight)
        : [...prev, highlight]
    );
  };

  const handleShare = async () => {
    if (!shareContent.trim() && selectedHighlights.length === 0) return;
    
    setIsSharing(true);
    
    try {
      await onShare({
        week,
        content: shareContent.trim(),
        privacy,
        highlights: selectedHighlights,
        timestamp: new Date()
      });
    } finally {
      setIsSharing(false);
    }
  };

  const getWeekTitle = () => {
    const titles = {
      1: 'Week 1: Foundation Building',
      2: 'Week 2: Momentum Growing', 
      3: 'Week 3: Habit Solidifying'
    };
    return titles[week as keyof typeof titles] || `Week ${week}`;
  };

  const getPrivacyIcon = (privacyLevel: SharePrivacy) => {
    switch(privacyLevel) {
      case 'public': return GlobeAltIcon;
      case 'community': return UsersIcon;
      case 'private': return EyeSlashIcon;
    }
  };

  const getPrivacyDescription = (privacyLevel: SharePrivacy) => {
    switch(privacyLevel) {
      case 'public': return 'Visible to everyone';
      case 'community': return 'Visible to your practice community';
      case 'private': return 'Just for your personal tracking';
    }
  };

  if (existingShare) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-green-900 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            {getWeekTitle()} - Shared
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-green-800 bg-white p-3 rounded-lg border border-green-200">
            {existingShare.content}
          </div>
          
          {existingShare.highlights.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-green-700">Highlights:</div>
              <div className="flex flex-wrap gap-1">
                {existingShare.highlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-green-600">
            <div className="flex items-center gap-1">
              {(() => {
                const Icon = getPrivacyIcon(existingShare.privacy);
                return <Icon className="w-3 h-3" />;
              })()}
              {getPrivacyDescription(existingShare.privacy)}
            </div>
            <div>
              Shared {existingShare.timestamp.toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gold-300 bg-gold-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gold-900 flex items-center gap-2">
          <ShareIcon className="w-4 h-4" />
          {getWeekTitle()} - Share Your Win
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Week Stats */}
        <div className="bg-white p-3 rounded-lg border border-gold-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gold-900">Week {week} Progress</span>
            <Badge className={weekCompletionRate >= 75 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {weekCompletedDays.length}/{weekDays.length} days
            </Badge>
          </div>
          <div className="text-xs text-gold-700">
            {weekCompletionRate >= 75 ? 'Strong week!' : 
             weekCompletionRate >= 50 ? 'Good progress!' : 
             'Every step counts!'}
          </div>
        </div>

        {/* Suggested Highlights */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gold-900">What went well this week? (Select any that apply)</div>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {suggestedHighlights.map((highlight, index) => (
              <button
                key={index}
                onClick={() => toggleHighlight(highlight)}
                className={`text-left text-xs p-2 rounded-lg border transition-all ${
                  selectedHighlights.includes(highlight)
                    ? 'bg-gold-100 border-gold-300 text-gold-900'
                    : 'bg-white border-gold-200 text-gold-700 hover:bg-gold-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedHighlights.includes(highlight) ? (
                    <CheckCircleIcon className="w-3 h-3 text-gold-600" />
                  ) : (
                    <div className="w-3 h-3 border border-gold-300 rounded-full" />
                  )}
                  {highlight}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Share Content */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gold-900">Share one specific win or insight:</div>
          <Textarea
            value={shareContent}
            onChange={(e) => setShareContent(e.target.value)}
            placeholder={`Share one breakthrough, challenge overcome, or insight from practicing ${virtue} this week...`}
            className="bg-white border-gold-300 focus:border-gold-500 focus:ring-gold-500/20 text-sm resize-none"
            rows={3}
          />
        </div>

        {/* Privacy Settings */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gold-900">Who can see this?</div>
          <div className="flex gap-2">
            {(['community', 'public', 'private'] as SharePrivacy[]).map((privacyLevel) => {
              const Icon = getPrivacyIcon(privacyLevel);
              return (
                <button
                  key={privacyLevel}
                  onClick={() => setPrivacy(privacyLevel)}
                  className={`flex-1 flex items-center gap-2 p-2 text-xs rounded-lg border transition-all ${
                    privacy === privacyLevel
                      ? 'bg-gold-100 border-gold-300 text-gold-900'
                      : 'bg-white border-gold-200 text-gold-700 hover:bg-gold-50'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <div className="text-left">
                    <div className="font-medium capitalize">{privacyLevel}</div>
                    <div className="text-xs opacity-75">{getPrivacyDescription(privacyLevel)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Share Button */}
        <Button 
          onClick={handleShare}
          disabled={isSharing || (!shareContent.trim() && selectedHighlights.length === 0)}
          className="w-full bg-gold-600 hover:bg-gold-700 text-white"
        >
          {isSharing ? (
            <>
              <SparklesIcon className="w-4 h-4 mr-2 animate-pulse" />
              Sharing...
            </>
          ) : (
            <>
              <ShareIcon className="w-4 h-4 mr-2" />
              Share Week {week} Win
            </>
          )}
        </Button>

        <div className="text-xs text-gold-700 text-center">
          <SparklesIcon className="w-3 h-3 inline mr-1" />
          Research shows public reporting increases habit success by 65%!
        </div>
      </CardContent>
    </Card>
  );
}
