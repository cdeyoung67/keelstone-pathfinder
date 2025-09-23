// Shared types for Keel Stone Pathfinder API
// Copied and adapted from pathfinder-app/src/lib/types.ts

export type Door = 'christian' | 'secular';
export type CardinalVirtue = 'wisdom' | 'courage' | 'justice' | 'temperance';
export type BibleVersion = 'kjv' | 'niv' | 'esv' | 'nlt' | 'msg';
export type TimeBudget = '5-10' | '10-15' | '15-20';
export type Daypart = 'morning' | 'midday' | 'evening' | 'flexible';

export interface Struggle {
  id: string;
  label: string;
  virtue: CardinalVirtue;
}

export interface IfThenPlan {
  virtue: CardinalVirtue;
  approach?: string;
  cue: string;
  action: string;
  context: string;
}

export interface Assessment {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  struggles: string[];
  door: Door;
  bibleVersion?: BibleVersion;
  timeBudget: TimeBudget;
  daypart: Daypart;
  primaryVirtue: CardinalVirtue;
  context?: string;
  ifThenPlans?: IfThenPlan[];
  createdAt: Date;
}

export interface MicroHabit {
  virtue: CardinalVirtue;
  approach?: string;
  action: string;
  steps: string[];
  timeMinutes: number;
  ifThenPrompt?: string;
}

export interface DailyPractice {
  day: number;
  title: string;
  steps: string[];
  reflection: string;
  quote: Quote;
  commentary: string;
  estimatedTime: number;
  microHabits?: MicroHabit[];
  
  // Christian UX enhancements
  openingPrayer?: string;
  scriptureAnchor?: string;
  wisdomBridge?: string;
  reflectionPrompt?: string;
  practicalChallenge?: string;
  fruitCheckIn?: string[];
  communityPrompt?: string;
  closingPrayer?: string;
  courageTheme?: string;
  fruitFocus?: string[];
}

export interface Quote {
  text: string;
  source: string;
  type: 'biblical' | 'stoic' | 'wisdom';
  bibleVersion?: BibleVersion;
}

export interface PersonalizedPlan {
  id: string;
  userId: string;
  assessment?: Assessment;
  anchor: string;
  virtue: CardinalVirtue;
  door: Door;
  daily: DailyPractice[];
  weeklyCheckin: string;
  stretchPractice?: string;
  createdAt: Date;
  version: string;
}

// API Request/Response types
export interface IntakeRequest {
  assessment: Omit<Assessment, 'id' | 'createdAt'>;
}

export interface IntakeResponse {
  success: boolean;
  plan?: PersonalizedPlan;
  error?: string;
}

export interface ProgressUpdate {
  planId: string;
  day: number;
  completed: boolean;
  feedback?: string;
  timestamp: Date;
}

export interface ProgressRequest {
  planId: string;
  updates: ProgressUpdate[];
}

export interface ProgressResponse {
  success: boolean;
  error?: string;
}

// Database document types
export interface UserDocument {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastActive: Date;
}

export interface PlanDocument extends PersonalizedPlan {
  _rid?: string;
  _ts?: number;
}

export interface ProgressDocument {
  id: string;
  planId: string;
  userId: string;
  completedDays: number[];
  skippedDays: number[];
  currentStreak: number;
  lastActivity: Date;
  feedback: Array<{
    day?: number;
    type: 'rating' | 'comment' | 'nps';
    value: number | string;
    timestamp: Date;
  }>;
}
