// API service for Keel Stone Pathfinder
import { Assessment, PersonalizedPlan, UserProgress } from './types';
import { generateMockPlan } from './mock-llm';
import { config, getVerbosityLevel } from './config';

// API Configuration from centralized config
const { apiBaseUrl, useMockData, environment } = config;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API call handler with progress tracking
async function apiCall<T>(
  endpoint: string, 
  options?: RequestInit,
  onProgress?: (step: string) => void
): Promise<T> {
  try {
    onProgress?.('Making API request...');
    
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `API call failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    onProgress?.('Processing response...');
    const data = await response.json();
    
    // Handle API response format
    if (data.success === false) {
      throw new ApiError(data.error || data.message || 'API call failed');
    }
    
    onProgress?.('Response processed successfully');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

// API Methods
export const api = {
  // Health check
  async health(): Promise<{ status: string; timestamp: string }> {
    return apiCall('health');
  },

  // Generate personalized plan with progress tracking
  async generatePlan(
    assessment: Assessment, 
    onProgress?: (step: string) => void
  ): Promise<PersonalizedPlan> {
    const verbosity = getVerbosityLevel();
    
    // Provide verbosity-appropriate progress updates
    const progressHandler = (step: string) => {
      if (verbosity !== 'off') {
        // Map generic API steps to multi-agent specific messages
        let mappedStep = step;
        if (step.includes('Making API request')) {
          mappedStep = 'Analyzing your struggles and preferences...';
        } else if (step.includes('Processing response')) {
          mappedStep = 'Integrating multi-agent insights...';
        } else if (step.includes('Response processed successfully')) {
          mappedStep = 'Response processed successfully';
        }
        
        onProgress?.(mappedStep);
      }
    };
    
    const response = await apiCall<{ plan: PersonalizedPlan }>(
      'intake', 
      {
        method: 'POST',
        body: JSON.stringify({ assessment }),
      },
      progressHandler
    );
    
    return response.plan;
  },

  // Update user progress
  async updateProgress(progress: {
    planId: string;
    day: number;
    completed: boolean;
    feedback?: string;
  }): Promise<{ success: boolean }> {
    return apiCall('progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  },

  // Test with mock data (fallback during development)
  async generatePlanMock(assessment: Assessment): Promise<PersonalizedPlan> {
    const response = await apiCall<{ plan: PersonalizedPlan }>('intake-test', {
      method: 'POST',
      body: JSON.stringify({ assessment }),
    });
    
    return response.plan;
  }
};

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
};

// Enhanced plan generation with multi-agent progress tracking
export const generatePlan = async (
  assessment: Assessment,
  onProgress?: (step: string) => void
): Promise<PersonalizedPlan> => {
  const verbosity = getVerbosityLevel();
  
  // Always use mock data in demo mode or when configured
  if (useMockData) {
    console.log(`Using mock data - Environment: ${environment}, Demo Mode: ${config.demoMode}`);
    
    // Simulate multi-agent progress for demo with realistic timing
    if (onProgress && verbosity !== 'off') {
      onProgress('Analyzing your struggles and preferences...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProgress('Selecting specialized agents for your journey...');
      await new Promise(resolve => setTimeout(resolve, 800));
      onProgress('Concierge Agent: Orchestrating your personalized path...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (verbosity === 'high') {
        onProgress('Path Agent: Creating spiritual practices framework...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        onProgress('Virtue Agent: Developing specialized guidance...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        onProgress('Integrating multi-agent insights...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else if (verbosity === 'medium') {
        onProgress('AI specialists creating your practices...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        onProgress('Crafting your 21-day journey...');
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
      
      onProgress('Finalizing your personalized plan...');
      await new Promise(resolve => setTimeout(resolve, 800));
      onProgress('Response processed successfully');
      // Additional delay to ensure progress is visible
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return generateMockPlan(assessment);
  }
  
  try {
    // Try the real multi-agent API with enhanced progress tracking
    const startTime = Date.now();
    
    // Provide initial progress updates for real API
    if (onProgress && verbosity !== 'off') {
      onProgress('Analyzing your struggles and preferences...');
      // Small delay to show initial step
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress('Selecting specialized agents for your journey...');
      await new Promise(resolve => setTimeout(resolve, 100));
      onProgress('Concierge Agent: Orchestrating your personalized path...');
    }
    
    const plan = await api.generatePlan(assessment, onProgress);
    const endTime = Date.now();
    
    // Ensure we show completion message
    if (onProgress && verbosity !== 'off') {
      onProgress('Finalizing your personalized plan...');
      await new Promise(resolve => setTimeout(resolve, 300));
      onProgress('Response processed successfully');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Log performance for debugging
    if (config.showResponseTimes) {
      console.log(`Multi-agent plan generation took ${endTime - startTime}ms`);
      console.log('Plan version:', plan.version);
    }
    
    return plan;
  } catch (error) {
    console.warn('Multi-agent API failed, falling back to mock:', error);
    
    // If real API fails, try mock as fallback
    try {
      onProgress?.('Real API failed, using fallback mock data...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProgress?.('Response processed successfully');
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockPlan(assessment);
    } catch (mockError) {
      console.error('Both real and mock APIs failed:', mockError);
      throw new ApiError('Unable to generate plan. Please try again later.');
    }
  }
};

export default api;
