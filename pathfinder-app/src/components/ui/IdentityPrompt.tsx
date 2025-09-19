'use client';

import { CardinalVirtue } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from '@heroicons/react/24/outline';

interface IdentityPromptProps {
  virtue: CardinalVirtue;
  day: number;
  door: 'christian' | 'secular';
  className?: string;
}

export default function IdentityPrompt({ virtue, day, door, className = '' }: IdentityPromptProps) {
  const virtueDesc = VIRTUE_DESCRIPTIONS[virtue];
  
  // WHITEPAPER ALIGNMENT: Identity-based motivation prompts
  const identityStatements = {
    christian: {
      wisdom: "I am a person who seeks God's wisdom and grows in discernment each day.",
      courage: "I am a person who trusts God's strength and acts with faithful courage.",
      justice: "I am a person who loves mercy, seeks justice, and walks humbly with God.",
      temperance: "I am a person who practices self-control and finds balance through God's grace."
    },
    secular: {
      wisdom: "I am a person who seeks understanding and makes thoughtful decisions.",
      courage: "I am a person who faces challenges with strength and takes meaningful action.",
      justice: "I am a person who treats others fairly and contributes to my community.",
      temperance: "I am a person who practices moderation and lives with intention."
    }
  };

  const dailyActions = {
    wisdom: "seeking understanding in small moments",
    courage: "taking brave steps forward", 
    justice: "showing kindness and fairness",
    temperance: "making mindful choices"
  };

  const identityStatement = identityStatements[door][virtue];
  const actionPhrase = dailyActions[virtue];

  return (
    <Card className={`bg-gradient-to-r from-gold-50 to-olive-50 border-gold-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <StarIcon className="w-5 h-5 text-gold-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-navy-900 text-sm mb-2">
              Day {day} Identity Reminder
            </h3>
            <blockquote className="text-navy-800 font-medium text-sm leading-relaxed mb-2">
              "{identityStatement}"
            </blockquote>
            <p className="text-xs text-slate-600">
              Today, I will live this identity by <strong>{actionPhrase}</strong> in my four micro-habits.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
