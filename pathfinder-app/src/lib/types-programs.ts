/**
 * Program Management Types
 * Unified system for managing all types of programs (practices, collections, challenges)
 */

import { PersonalizedPlan, UserProgress, Assessment } from './types';
import { PersonalQuote, Testimony } from './types-personal';

export type ProgramType = 'practice' | 'collection' | 'challenge' | 'course';
export type ProgramStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type ProgramVisibility = 'private' | 'shared' | 'public';

export interface Program {
  id: string;
  type: ProgramType;
  title: string;
  description: string;
  subtitle?: string;
  
  // Program metadata
  duration?: number; // days for practices, undefined for open-ended collections
  estimatedTimePerDay?: string; // "5-10 minutes", "15-20 minutes"
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  
  // Program status and progress
  status: ProgramStatus;
  progress?: ProgramProgress;
  
  // Content - different based on type
  plan?: PersonalizedPlan; // For practice programs
  quotes?: PersonalQuote[]; // For collection programs
  testimonies?: Testimony[]; // For testimony collections
  challenges?: Challenge[]; // For challenge programs
  
  // User and sharing
  userId?: string; // undefined for anonymous users
  isTemplate: boolean; // can be used as template for others
  visibility: ProgramVisibility;
  shareCode?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ProgramProgress {
  currentDay?: number;
  completedDays: number[];
  totalDays?: number;
  completionPercentage: number;
  streak: number;
  longestStreak: number;
  lastActivityAt: Date;
  
  // Type-specific progress
  practiceProgress?: UserProgress; // For practice programs
  collectionProgress?: {
    quotesAdded: number;
    testimoniesShared: number;
    favoriteCount: number;
  };
  challengeProgress?: {
    challengesCompleted: number;
    pointsEarned: number;
    level: number;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  day: number;
  type: 'reflection' | 'action' | 'sharing' | 'practice';
  points: number;
  isCompleted: boolean;
  completedAt?: Date;
  userResponse?: string;
}

export interface ProgramTemplate {
  id: string;
  title: string;
  description: string;
  type: ProgramType;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  estimatedTime: string;
  isPopular: boolean;
  useCount: number;
  rating: number;
  
  // Template creation function
  createProgram: (assessment?: Assessment) => Promise<Program>;
}

export interface ProgramStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  totalDaysCompleted: number;
  currentStreak: number;
  longestStreak: number;
  favoriteType: ProgramType;
}

// Program creation requests
export interface CreateProgramRequest {
  type: ProgramType;
  title?: string;
  description?: string;
  templateId?: string;
  assessment?: Assessment;
  initialData?: {
    quotes?: PersonalQuote[];
    testimonies?: Testimony[];
    plan?: PersonalizedPlan;
  };
}

// Program action types for UI
export type ProgramAction = 
  | 'start'
  | 'pause' 
  | 'resume'
  | 'complete'
  | 'archive'
  | 'share'
  | 'duplicate'
  | 'edit'
  | 'delete'
  | 'export';

export interface ProgramActionResult {
  success: boolean;
  message: string;
  data?: any;
}
