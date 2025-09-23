// API service for Keel Stone Pathfinder
import { Assessment, PersonalizedPlan, UserProgress } from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071';

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

// Generic API call handler
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
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

    const data = await response.json();
    
    // Handle API response format
    if (data.success === false) {
      throw new ApiError(data.error || data.message || 'API call failed');
    }
    
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

  // Generate personalized plan
  async generatePlan(assessment: Assessment): Promise<PersonalizedPlan> {
    const response = await apiCall<{ plan: PersonalizedPlan }>('intake', {
      method: 'POST',
      body: JSON.stringify({ assessment }),
    });
    
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

// Helper function to use mock or real API based on environment
export const generatePlan = async (assessment: Assessment): Promise<PersonalizedPlan> => {
  try {
    // Try the real API first (when Azure OpenAI is connected)
    if (!isDevelopment()) {
      return await api.generatePlan(assessment);
    }
    
    // Fall back to mock API for development/testing
    return await api.generatePlanMock(assessment);
  } catch (error) {
    console.warn('Real API failed, falling back to mock:', error);
    
    // If real API fails, try mock as fallback
    try {
      return await api.generatePlanMock(assessment);
    } catch (mockError) {
      console.error('Both real and mock APIs failed:', mockError);
      throw new ApiError('Unable to generate plan. Please try again later.');
    }
  }
};

export default api;
