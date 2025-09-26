/**
 * Mock Program Data and Service
 * Provides mock data and API functions for the unified program system
 */

import { 
  Program, 
  ProgramTemplate, 
  ProgramStats, 
  CreateProgramRequest,
  ProgramAction,
  ProgramActionResult,
  ProgramProgress
} from '../types-programs';
import { PersonalizedPlan, Assessment } from '../types';
import { mockPersonalQuotes, mockTestimonies } from './personal';

// Persistence functions for programs (JSON format)
const PROGRAMS_STORAGE_KEY = 'keel-stone-programs';

export const getStoredPrograms = (): Program[] => {
  if (typeof window === 'undefined') {
    console.log('getStoredPrograms: window undefined, returning initial programs');
    return [];
  }
  
  try {
    const stored = localStorage.getItem(PROGRAMS_STORAGE_KEY);
    if (stored) {
      const programs = JSON.parse(stored);
      // Convert date strings back to Date objects
      return programs.map((program: any) => ({
        ...program,
        createdAt: new Date(program.createdAt),
        updatedAt: new Date(program.updatedAt),
        progress: program.progress ? {
          ...program.progress,
          lastActivityAt: new Date(program.progress.lastActivityAt)
        } : undefined,
        plan: program.plan ? {
          ...program.plan,
          createdAt: new Date(program.plan.createdAt)
        } : undefined
      }));
    }
  } catch (error) {
    console.error('Error loading stored programs:', error);
  }
  
  return [];
};

export const storePrograms = (programs?: Program[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    const programsToStore = programs || mockPrograms;
    localStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programsToStore));
    console.log('Programs stored to localStorage:', programsToStore.length);
  } catch (error) {
    console.error('Error storing programs:', error);
  }
};

// Mock program templates available to all users
export const mockProgramTemplates: ProgramTemplate[] = [
  {
    id: 'courage-21-day',
    title: '21-Day Courage Practice',
    description: 'Build courage through daily practices, reflections, and scripture study',
    type: 'practice',
    tags: ['courage', 'daily-practice', 'christian', 'virtue'],
    difficulty: 'beginner',
    duration: 21,
    estimatedTime: '10-15 minutes',
    isPopular: true,
    useCount: 1247,
    rating: 4.8,
    createProgram: async (assessment?: Assessment) => {
      // This would integrate with existing plan generation
      return mockPrograms[0]; // Return courage program for now
    }
  },
  {
    id: 'wisdom-21-day',
    title: '21-Day Wisdom Practice', 
    description: 'Develop wisdom through contemplation, study, and practical application',
    type: 'practice',
    tags: ['wisdom', 'daily-practice', 'secular', 'virtue'],
    difficulty: 'intermediate',
    duration: 21,
    estimatedTime: '15-20 minutes',
    isPopular: true,
    useCount: 892,
    rating: 4.7,
    createProgram: async (assessment?: Assessment) => {
      return {
        ...mockPrograms[0],
        id: 'wisdom-program-' + Date.now(),
        title: 'My 21-Day Wisdom Practice'
      };
    }
  },
  {
    id: 'gratitude-30-day',
    title: '30-Day Gratitude Challenge',
    description: 'Transform your perspective through daily gratitude practices',
    type: 'challenge',
    tags: ['gratitude', 'mindfulness', 'wellbeing'],
    difficulty: 'beginner',
    duration: 30,
    estimatedTime: '5-10 minutes',
    isPopular: false,
    useCount: 456,
    rating: 4.6,
    createProgram: async () => {
      return {
        ...mockPrograms[2],
        id: 'gratitude-program-' + Date.now()
      };
    }
  },
  {
    id: 'life-verses-collection',
    title: 'Life Verses Collection',
    description: 'Build your personal collection of meaningful quotes and verses',
    type: 'collection',
    tags: ['quotes', 'verses', 'personal', 'ongoing'],
    difficulty: 'beginner',
    estimatedTime: 'As needed',
    isPopular: true,
    useCount: 2103,
    rating: 4.9,
    createProgram: async () => {
      return mockPrograms[1]; // Return collection program
    }
  }
];

// Initialize programs from storage or use defaults
const initialMockPrograms: Program[] = [
  {
    id: 'user-courage-practice-1',
    type: 'practice',
    title: "Christian's 21-Day Courage Practice",
    description: 'Brave, but not reckless',
    subtitle: 'A personalized journey to develop courage through daily practices',
    duration: 21,
    estimatedTimePerDay: '10-15 minutes',
    difficulty: 'beginner',
    tags: ['courage', 'christian', 'daily-practice'],
    status: 'active',
    progress: {
      currentDay: 5,
      completedDays: [1, 2, 3, 4],
      totalDays: 21,
      completionPercentage: 19,
      streak: 4,
      longestStreak: 4,
      lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      practiceProgress: {
        completedDays: [1, 2, 3, 4],
        currentDay: 5,
        reflections: {},
        challenges: {},
        fruits: {},
        community: {},
        gratitude: {},
        mindfulness: {},
        badges: []
      }
    },
    // plan: would be populated with actual PersonalizedPlan
    userId: 'google-user-123',
    isTemplate: false,
    visibility: 'private',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: 'user-life-verses-1',
    type: 'collection',
    title: 'My Life Verses',
    description: 'Personal collection of meaningful quotes and scripture',
    tags: ['quotes', 'verses', 'personal'],
    status: 'active',
    progress: {
      completedDays: [],
      totalDays: undefined,
      completionPercentage: 0,
      streak: 0,
      longestStreak: 0,
      lastActivityAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      collectionProgress: {
        quotesAdded: 10,
        testimoniesShared: 2,
        favoriteCount: 6
      }
    },
    quotes: mockPersonalQuotes.slice(0, 10),
    testimonies: mockTestimonies.slice(0, 2),
    userId: 'google-user-123',
    isTemplate: false,
    visibility: 'private',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'user-gratitude-challenge-1',
    type: 'challenge',
    title: '30-Day Gratitude Challenge',
    description: 'Daily gratitude practices to shift perspective',
    duration: 30,
    estimatedTimePerDay: '5-10 minutes',
    difficulty: 'beginner',
    tags: ['gratitude', 'mindfulness', 'challenge'],
    status: 'completed',
    progress: {
      currentDay: 30,
      completedDays: Array.from({length: 30}, (_, i) => i + 1),
      totalDays: 30,
      completionPercentage: 100,
      streak: 30,
      longestStreak: 30,
      lastActivityAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      challengeProgress: {
        challengesCompleted: 30,
        pointsEarned: 1500,
        level: 3
      }
    },
    challenges: Array.from({length: 30}, (_, i) => ({
      id: `gratitude-${i + 1}`,
      title: `Day ${i + 1}: Gratitude Practice`,
      description: `Today's gratitude focus`,
      day: i + 1,
      type: 'reflection' as const,
      points: 50,
      isCompleted: true,
      completedAt: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
      userResponse: `Grateful for...`
    })),
    userId: 'google-user-123',
    isTemplate: false,
    visibility: 'shared',
    shareCode: 'GRAT30-ABC123',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    startedAt: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000), // 37 days ago
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  }
];

// Export the programs array, initialized from storage or defaults
export const mockPrograms: Program[] = getStoredPrograms().length > 0 ? getStoredPrograms() : [...initialMockPrograms];

// Mock user program statistics
export const mockProgramStats: ProgramStats = {
  totalPrograms: 3,
  activePrograms: 2,
  completedPrograms: 1,
  totalDaysCompleted: 34, // 4 + 0 + 30
  currentStreak: 4,
  longestStreak: 30,
  favoriteType: 'practice'
};

// Program service API
export const mockProgramAPI = {
  // Get user's programs
  getUserPrograms: async (userId?: string): Promise<Program[]> => {
    if (!userId) return []; // Anonymous users have no saved programs
    
    // Refresh from storage to get latest programs
    const storedPrograms = getStoredPrograms();
    if (storedPrograms.length > 0) {
      // Update mockPrograms with stored data
      mockPrograms.length = 0; // Clear current array
      mockPrograms.push(...storedPrograms); // Add stored programs
    }
    
    const userPrograms = mockPrograms.filter(p => p.userId === userId);
    console.log(`getUserPrograms for ${userId}: found ${userPrograms.length} programs`);
    return userPrograms;
  },

  // Get program templates/discover programs
  getProgramTemplates: async (): Promise<ProgramTemplate[]> => {
    return mockProgramTemplates;
  },

  // Get user statistics
  getUserStats: async (userId: string): Promise<ProgramStats> => {
    return mockProgramStats;
  },

  // Create new program from template or custom
  createProgram: async (request: CreateProgramRequest, userId?: string): Promise<Program> => {
    const newProgram: Program = {
      id: `program-${Date.now()}`,
      type: request.type,
      title: request.title || 'New Program',
      description: request.description || 'Custom program',
      status: 'draft',
      progress: {
        completedDays: [],
        completionPercentage: 0,
        streak: 0,
        longestStreak: 0,
        lastActivityAt: new Date()
      },
      userId,
      isTemplate: false,
      visibility: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If creating from template, use template's createProgram function
    if (request.templateId) {
      const template = mockProgramTemplates.find(t => t.id === request.templateId);
      if (template) {
        return await template.createProgram(request.assessment);
      }
    }

    // If creating from existing plan (from campaign flow)
    if (request.initialData?.plan) {
      newProgram.plan = request.initialData.plan;
      newProgram.type = 'practice';
      newProgram.duration = 21;
      newProgram.status = 'draft';
      
      // Add practice-specific data structure
      newProgram.practiceData = {
        dailyPractices: request.initialData.plan.daily.map((day, index) => ({
          day: index + 1,
          quote: day.quote,
          practice: day.practice,
          reflection: day.reflection,
          isCompleted: false,
          completedAt: undefined,
          userNotes: '',
          practiceRating: undefined
        })),
        virtue: request.initialData.plan.virtue,
        path: request.initialData.plan.door
      };
    }

    // Add the new program to the array and persist
    mockPrograms.push(newProgram);
    storePrograms();
    
    console.log('Created new program:', newProgram.id, 'Total programs:', mockPrograms.length);
    
    return newProgram;
  },

  // Save/update program
  saveProgram: async (program: Program): Promise<Program> => {
    const existingIndex = mockPrograms.findIndex(p => p.id === program.id);
    program.updatedAt = new Date();
    
    if (existingIndex >= 0) {
      mockPrograms[existingIndex] = program;
    } else {
      mockPrograms.push(program);
    }
    
    return program;
  },

  // Perform program action
  performAction: async (programId: string, action: ProgramAction, data?: any): Promise<Program | null> => {
    const program = mockPrograms.find(p => p.id === programId);
    if (!program) {
      console.error('Program not found:', programId);
      return null;
    }

    switch (action) {
      case 'start':
        program.status = 'active';
        program.startedAt = new Date();
        program.updatedAt = new Date();
        break;
      
      case 'pause':
        program.status = 'paused';
        program.updatedAt = new Date();
        break;
      
      case 'resume':
        program.status = 'active';
        program.updatedAt = new Date();
        break;
      
      case 'complete':
        program.status = 'completed';
        program.completedAt = new Date();
        program.updatedAt = new Date();
        break;
      
      case 'archive':
        program.status = 'archived';
        program.updatedAt = new Date();
        break;
      
      case 'delete':
        const index = mockPrograms.findIndex(p => p.id === programId);
        if (index >= 0) {
          mockPrograms.splice(index, 1);
          storePrograms(); // Persist deletion
          return null; // Program deleted
        }
        return null;
      
      case 'share':
        program.shareCode = `SHARE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        program.visibility = 'shared';
        program.updatedAt = new Date();
        break;
      
      case 'duplicate':
        const duplicate = {
          ...program,
          id: `program-${Date.now()}`,
          title: `${program.title} (Copy)`,
          status: 'draft' as const,
          progress: {
            completedDays: [],
            completionPercentage: 0,
            streak: 0,
            longestStreak: 0,
            lastActivityAt: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          startedAt: undefined,
          completedAt: undefined,
          shareCode: undefined
        };
        mockPrograms.push(duplicate);
        storePrograms(); // Persist the new duplicate
        return duplicate; // Return the new program
      
      default:
        console.error(`Action ${action} not implemented`);
        return null;
    }

    // For all actions except delete and duplicate, persist changes and return updated program
    storePrograms();
    console.log(`Program ${programId} action ${action} completed. Status: ${program.status}`);
    return program;
  },

  // Get program by ID
  getProgram: async (programId: string): Promise<Program | null> => {
    return mockPrograms.find(p => p.id === programId) || null;
  },

  // Get program by share code
  getProgramByShareCode: async (shareCode: string): Promise<Program | null> => {
    return mockPrograms.find(p => p.shareCode === shareCode) || null;
  }
};

// Helper functions
export const getProgramStatusColor = (status: Program['status']) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'completed': return 'text-blue-600 bg-blue-100';
    case 'paused': return 'text-yellow-600 bg-yellow-100';
    case 'draft': return 'text-gray-600 bg-gray-100';
    case 'archived': return 'text-slate-500 bg-slate-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getProgramTypeIcon = (type: Program['type']) => {
  switch (type) {
    case 'practice': return '🧘';
    case 'collection': return '📚';
    case 'challenge': return '🏆';
    case 'course': return '🎓';
    default: return '📋';
  }
};

export const formatProgramDuration = (duration?: number) => {
  if (!duration) return 'Ongoing';
  if (duration === 1) return '1 day';
  return `${duration} days`;
};
