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
  firstName: string;
  lastName: string;
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
  commentary: string; // 3-paragraph commentary connecting quote to practice via Fruit of the Spirit
  estimatedTime: number; // in minutes
  
  // Christian UX enhancements (following christianUX.md framework)
  openingPrayer?: string;        // Opening Prayer: Short prayer asking for guidance, focus, and openness to God's wisdom
  scriptureAnchor?: string;      // Scripture & Anchor: One clear thought framing the theme of Courage
  wisdomBridge?: string;         // Wisdom Bridge: Secular/historical support reinforcing that faith and reason both affirm Courage
  reflectionPrompt?: string;     // Reflection Prompt: Journaling or prayer reflection (text or audio) - captured in app for tracking
  practicalChallenge?: string;   // Practical Challenge (Gamified): One small but tangible act of Courage - logged in app
  fruitCheckIn?: string[];       // Fruit of the Spirit Check-In: Simple self-assessment - builds "Fruit Dashboard"
  communityPrompt?: string;      // Community Touchpoint: Encouragement to share reflection or journal snippet
  closingPrayer?: string;        // Closing Prayer: Short prayer asking God to guide user to improve and grow in courage tomorrow
  
  // Legacy fields (to be removed after migration)
  courageTheme?: string;         // Daily courage theme/focus
  fruitFocus?: string[];         // Specific fruits of the spirit to focus on today
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
  assessment?: Assessment; // Include assessment data for personalization
  anchor: string; // Daily anchor statement
  virtue: CardinalVirtue;
  door: Door;
  daily: DailyPractice[];
  weeklyCheckin: string;
  stretchPractice?: string;
  createdAt: Date;
  version: string; // For A/B testing different AI models
}

// Interactive tracking for Phase 2
export interface DayReflection {
  type: 'text' | 'audio';
  content: string;
  timestamp: Date;
}

export interface ChallengeCompletion {
  completed: boolean;
  completedAt?: Date;
  streak: number;
  totalCompleted: number;
}

export interface FruitSelection {
  fruits: string[];
  timestamp: Date;
  dayGrowth: Record<string, number>; // How much each fruit grew this day
}

export interface CommunityShare {
  content: string;
  privacy: 'public' | 'community' | 'prayer';
  timestamp: Date;
  responses?: FruitResponse[];
}

export interface FruitResponse {
  userId: string;
  fruit: 'kindness' | 'encouragement' | 'peace' | 'gentleness' | 'love' | 'joy';
  timestamp: Date;
}

export interface DayProgress {
  day: number;
  reflection?: DayReflection;
  challengeCompletion?: ChallengeCompletion;
  fruitSelection?: FruitSelection;
  communityShare?: CommunityShare;
  completedAt?: Date;
}

export interface UserProgress {
  planId: string;
  completedDays: number[];
  skippedDays: number[];
  currentStreak: number;
  lastActivity: Date;
  feedback: UserFeedback[];
  
  // Phase 2: Interactive tracking
  dailyProgress: Record<number, DayProgress>; // day number -> progress
  totalChallengesCompleted: number;
  fruitGrowth: Record<string, number>; // fruit name -> growth level
  badges: string[]; // earned badges
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

// Struggle categories for better organization
export interface StruggleCategory {
  id: string;
  title: string;
  description: string;
  virtue: CardinalVirtue;
  struggles: Struggle[];
}

// Organized struggle categories
export const STRUGGLE_CATEGORIES: StruggleCategory[] = [
  {
    id: 'digital-overwhelm',
    title: 'Digital & Information Overwhelm',
    description: 'Managing technology and information intake',
    virtue: 'temperance',
    struggles: [
      { id: 'social-media-overwhelm', label: 'Social media overwhelm', virtue: 'temperance' },
      { id: 'news-anxiety', label: 'News and current events anxiety', virtue: 'temperance' },
      { id: 'digital-distraction', label: 'Constant digital distractions', virtue: 'temperance' },
      { id: 'information-overload', label: 'Too much information, can\'t focus', virtue: 'wisdom' }
    ]
  },
  {
    id: 'emotional-balance',
    title: 'Emotional Balance & Reactions',
    description: 'Managing emotions and stress responses',
    virtue: 'temperance',
    struggles: [
      { id: 'emotional-reactivity', label: 'Emotional reactivity to others', virtue: 'temperance' },
      { id: 'burnout-exhaustion', label: 'Burnout and exhaustion', virtue: 'courage' }
    ]
  },
  {
    id: 'decision-clarity',
    title: 'Decision Making & Direction',
    description: 'Finding clarity and making good choices',
    virtue: 'wisdom',
    struggles: [
      { id: 'decision-paralysis', label: 'Difficulty making decisions', virtue: 'wisdom' },
      { id: 'analysis-paralysis', label: 'Overthinking everything', virtue: 'wisdom' },
      { id: 'lack-direction', label: 'Feeling lost or without direction', virtue: 'wisdom' }
    ]
  },
  {
    id: 'confidence-action',
    title: 'Confidence & Taking Action',
    description: 'Overcoming fear and self-doubt',
    virtue: 'courage',
    struggles: [
      { id: 'fear-failure', label: 'Fear of failure or rejection', virtue: 'courage' },
      { id: 'perfectionism', label: 'Perfectionism holding me back', virtue: 'courage' },
      { id: 'avoiding-conflict', label: 'Avoiding difficult conversations', virtue: 'courage' }
    ]
  },
  {
    id: 'relationships-boundaries',
    title: 'Relationships & Boundaries',
    description: 'Connecting with others and setting healthy limits',
    virtue: 'justice',
    struggles: [
      { id: 'relationship-conflicts', label: 'Relationship conflicts', virtue: 'justice' },
      { id: 'helping-others', label: 'Difficulty saying no to others', virtue: 'justice' },
      { id: 'work-life-balance', label: 'Work-life balance struggles', virtue: 'justice' },
      { id: 'feeling-isolated', label: 'Feeling disconnected from community', virtue: 'justice' }
    ]
  }
];

// Flattened list for backward compatibility
export const COMMON_STRUGGLES: Struggle[] = STRUGGLE_CATEGORIES.flatMap(category => category.struggles);

// Bible version options for Christian door
export const BIBLE_VERSIONS: { value: BibleVersion; label: string; description: string }[] = [
  { value: 'niv', label: 'NIV', description: 'New International Version (Modern, clear)' },
  { value: 'esv', label: 'ESV', description: 'English Standard Version (Literal, readable)' },
  { value: 'nlt', label: 'NLT', description: 'New Living Translation (Very accessible)' },
  { value: 'kjv', label: 'KJV', description: 'King James Version (Traditional)' },
  { value: 'msg', label: 'MSG', description: 'The Message (Contemporary paraphrase)' }
];
