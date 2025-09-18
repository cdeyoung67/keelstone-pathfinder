'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HeartIcon, 
  ShareIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  HandRaisedIcon
 } from '@heroicons/react/24/outline';

interface CommunityShareProps {
  prompt: string;
  day: number;
  onShare: (share: {
    content: string;
    privacy: 'public' | 'community' | 'prayer';
    timestamp: Date;
  }) => void;
  existingShare?: {
    content: string;
    privacy: 'public' | 'community' | 'prayer';
    timestamp: Date;
  };
  userReflection?: string; // Pre-populate from their reflection if they want
}

type SharePrivacy = 'public' | 'community' | 'prayer';

const FRUIT_RESPONSES = [
  { fruit: 'kindness', label: 'Kindness' },
  { fruit: 'encouragement', label: 'Encouragement' },
  { fruit: 'peace', label: 'Peace' },
  { fruit: 'gentleness', label: 'Gentleness' },
  { fruit: 'love', label: 'Love' },
  { fruit: 'joy', label: 'Joy' }
];

export default function CommunityShare({ 
  prompt, 
  day, 
  onShare, 
  existingShare,
  userReflection 
}: CommunityShareProps) {
  const [shareContent, setShareContent] = useState(
    existingShare?.content || userReflection || ''
  );
  const [privacy, setPrivacy] = useState<SharePrivacy>(
    existingShare?.privacy || 'community'
  );
  const [isShared, setIsShared] = useState(!!existingShare);
  const [showPreview, setShowPreview] = useState(false);

  const handleShare = () => {
    if (shareContent.trim()) {
      onShare({
        content: shareContent.trim(),
        privacy,
        timestamp: new Date()
      });
      setIsShared(true);
    }
  };

  const privacyOptions = [
    {
      value: 'community' as SharePrivacy,
      icon: ShareIcon,
      title: 'Share with Community',
      description: 'Visible to other Pathfinder users for encouragement'
    },
    {
      value: 'prayer' as SharePrivacy,
      icon: HandRaisedIcon,
      title: 'Prayer Request',
      description: 'Share for prayer support and spiritual encouragement'
    },
    {
      value: 'public' as SharePrivacy,
      icon: LockClosedIcon,
      title: 'Keep Private',
      description: 'Only you can see this reflection'
    }
  ];

  return (
    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-serif font-medium text-navy-900 flex items-center text-sm">
          <HeartIcon className="w-4 h-4 mr-2 text-purple-600" />
          Community Touchpoint
        </h4>
        
        {isShared && (
          <div className="flex items-center text-green-600 text-xs">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Shared
          </div>
        )}
      </div>
      
      <p className="text-sm text-purple-800 leading-relaxed mb-4">{prompt}</p>
      
      <div className="space-y-4">
        {/* Share Content */}
        <div>
          <label className="text-sm font-medium text-navy-900 block mb-2">
            Your Reflection to Share:
          </label>
          <Textarea 
            placeholder="Share your experience, insight, or request for prayer..."
            value={shareContent}
            onChange={(e) => setShareContent(e.target.value)}
            className="bg-white border-purple-200 focus:border-purple-400"
            rows={3}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-purple-600">
              {shareContent.length} characters
            </span>
            {userReflection && !shareContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareContent(userReflection)}
                className="text-xs"
              >
                Use My Reflection
              </Button>
            )}
          </div>
        </div>
        
        {/* Privacy Options */}
        <div>
          <label className="text-sm font-medium text-navy-900 block mb-2">
            Sharing Preference:
          </label>
          <div className="space-y-2">
            {privacyOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setPrivacy(option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    privacy === option.value
                      ? 'border-purple-400 bg-purple-100'
                      : 'border-purple-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-navy-900 text-sm">
                        {option.title}
                      </div>
                      <div className="text-xs text-slate-600">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Preview */}
        {shareContent && privacy !== 'public' && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs mb-2"
            >
              {showPreview ? 'Hide' : 'Preview'} Community Post
            </Button>
            
            {showPreview && (
              <Card className="bg-white border-purple-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs">
                      You
                    </div>
                    <span className="text-xs text-slate-500">Day {day} • Courage Journey</span>
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      {privacy === 'prayer' ? '🙏 Prayer' : '💬 Share'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700">{shareContent}</p>
                  
                  {/* Mock Fruit Responses */}
                  <div className="flex gap-2 mt-3 pt-2 border-t border-purple-100">
                    {FRUIT_RESPONSES.slice(0, 3).map(response => (
                      <button
                        key={response.fruit}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-xs transition-colors"
                      >
                        <HeartIcon className="w-3 h-3 text-purple-600" />
                        <span>{response.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleShare}
            disabled={!shareContent.trim() || isShared}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {privacy === 'prayer' ? '🙏 Share for Prayer' : 
             privacy === 'community' ? '💬 Share with Community' : 
             '🔒 Keep Private'}
          </Button>
          
          {isShared && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsShared(false)}
              className="text-xs"
            >
              Edit Share
            </Button>
          )}
        </div>
        
        {isShared && existingShare && (
          <div className="text-xs text-green-600 italic">
            Shared on {existingShare.timestamp.toLocaleDateString()} as {
              existingShare.privacy === 'prayer' ? 'prayer request' :
              existingShare.privacy === 'community' ? 'community encouragement' :
              'private reflection'
            }
          </div>
        )}
      </div>
      
      <p className="text-xs text-purple-600 mt-4 italic">
        Encouragement to share reflection or journal snippet - prompts supportive replies (no "likes," but Fruits: kindness, gentleness, etc.).
      </p>
    </div>
  );
}
