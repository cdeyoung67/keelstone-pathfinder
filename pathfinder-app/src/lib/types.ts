// Core types for Keel Stone Pathfinder

export type Door = 'christian' | 'secular';
export type CardinalVirtue = 'wisdom' | 'courage' | 'justice' | 'temperance';
export type BibleVersion = 'kjv' | 'niv' | 'esv' | 'nlt' | 'msg';
export type TimeBudget = '5-10' | '10-15' | '15-20';
export type Daypart = 'morning' | 'midday' | 'evening' | 'flexible';

export interface Struggle {
  id: string;
  label: string;
  virtue: CardinalVirtue; // Which virtue primarily addresses this struggle
}

export interface Assessment {
  id: string;
  email: string;
  struggles: string[]; // Array of struggle IDs
  door: Door;
  bibleVersion?: BibleVersion; // Only for Christian door
  timeBudget: TimeBudget;
  daypart: Daypart;
  primaryVirtue: CardinalVirtue; // Determined from struggles
  context?: string; // Optional additional context
  createdAt: Date;
}

export interface DailyPractice {
  day: number;
  title: string;
  steps: string[];
  reflection: string;
  quote: Quote;
  estimatedTime: number; // in minutes
}

export interface Quote {
  text: string;
  source: string;
  type: 'biblical' | 'stoic' | 'wisdom';
  bibleVersion?: BibleVersion; // For biblical quotes
}

export interface PersonalizedPlan {
  id: string;
  userId: string;
  anchor: string; // Daily anchor statement
  virtue: CardinalVirtue;
  door: Door;
  daily: DailyPractice[];
  weeklyCheckin: string;
  stretchPractice?: string;
  createdAt: Date;
  version: string; // For A/B testing different AI models
}

export interface UserProgress {
  planId: string;
  completedDays: number[];
  skippedDays: number[];
  currentStreak: number;
  lastActivity: Date;
  feedback: UserFeedback[];
}

export interface UserFeedback {
  day?: number;
  type: 'rating' | 'comment' | 'nps';
  value: number | string;
  timestamp: Date;
}

export interface MockModelConfig {
  name: string;
  style: 'concise' | 'detailed' | 'balanced';
  tone: 'practical' | 'nuanced' | 'warm';
  responseTime: number; // milliseconds
  errorRate: number; // 0-1, for testing error states
}

// Common struggles mapped to cardinal virtues
export const COMMON_STRUGGLES: Struggle[] = [
  // Temperance (Self-control, moderation)
  { id: 'social-media-overwhelm', label: 'Social media overwhelm', virtue: 'temperance' },
  { id: 'news-anxiety', label: 'News and current events anxiety', virtue: 'temperance' },
  { id: 'digital-distraction', label: 'Constant digital distractions', virtue: 'temperance' },
  { id: 'emotional-reactivity', label: 'Emotional reactivity to others', virtue: 'temperance' },
  
  // Wisdom (Sound judgment, discernment)
  { id: 'decision-paralysis', label: 'Difficulty making decisions', virtue: 'wisdom' },
  { id: 'information-overload', label: 'Too much information, can\'t focus', virtue: 'wisdom' },
  { id: 'lack-direction', label: 'Feeling lost or without direction', virtue: 'wisdom' },
  { id: 'analysis-paralysis', label: 'Overthinking everything', virtue: 'wisdom' },
  
  // Courage (Bravery, perseverance)
  { id: 'fear-failure', label: 'Fear of failure or rejection', virtue: 'courage' },
  { id: 'avoiding-conflict', label: 'Avoiding difficult conversations', virtue: 'courage' },
  { id: 'perfectionism', label: 'Perfectionism holding me back', virtue: 'courage' },
  { id: 'burnout-exhaustion', label: 'Burnout and exhaustion', virtue: 'courage' },
  
  // Justice (Fairness, compassion, service)
  { id: 'relationship-conflicts', label: 'Relationship conflicts', virtue: 'justice' },
  { id: 'work-life-balance', label: 'Work-life balance struggles', virtue: 'justice' },
  { id: 'helping-others', label: 'Difficulty saying no to others', virtue: 'justice' },
  { id: 'feeling-isolated', label: 'Feeling disconnected from community', virtue: 'justice' }
];

// Bible version options for Christian door
export const BIBLE_VERSIONS: { value: BibleVersion; label: string; description: string }[] = [
  { value: 'niv', label: 'NIV', description: 'New International Version (Modern, clear)' },
  { value: 'esv', label: 'ESV', description: 'English Standard Version (Literal, readable)' },
  { value: 'nlt', label: 'NLT', description: 'New Living Translation (Very accessible)' },
  { value: 'kjv', label: 'KJV', description: 'King James Version (Traditional)' },
  { value: 'msg', label: 'MSG', description: 'The Message (Contemporary paraphrase)' }
];
