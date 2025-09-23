import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getDatabaseService } from '../shared/service-factory';
import { ProgressRequest, ProgressResponse } from '../shared/types';

export async function progress(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Progress function triggered');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return {
      status: 200,
      headers: corsHeaders
    };
  }

  try {
    const db = getDatabaseService();

    if (request.method === 'GET') {
      // Get progress for a plan
      const planId = request.query.get('planId');
      if (!planId) {
        return {
          status: 400,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'planId is required' }
        };
      }

      const progressData = await db.getProgressByPlanId(planId);
      if (!progressData) {
        return {
          status: 404,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'Progress not found' }
        };
      }

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: { success: true, progress: progressData }
      };
    }

    if (request.method === 'POST') {
      // Update progress
      const body = await request.json() as ProgressRequest;
      if (!body.planId || !body.updates) {
        return {
          status: 400,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'planId and updates are required' }
        };
      }

      // Get existing progress
      let progressData = await db.getProgressByPlanId(body.planId);
      if (!progressData) {
        return {
          status: 404,
          headers: corsHeaders,
          jsonBody: { success: false, error: 'Progress not found' }
        };
      }

      // Apply updates
      for (const update of body.updates) {
        if (update.completed) {
          // Add to completed days if not already there
          if (!progressData.completedDays.includes(update.day)) {
            progressData.completedDays.push(update.day);
            progressData.completedDays.sort((a, b) => a - b);
          }
          // Remove from skipped days if it was there
          progressData.skippedDays = progressData.skippedDays.filter(d => d !== update.day);
        } else {
          // Remove from completed days
          progressData.completedDays = progressData.completedDays.filter(d => d !== update.day);
          // Add to skipped days if not already there
          if (!progressData.skippedDays.includes(update.day)) {
            progressData.skippedDays.push(update.day);
            progressData.skippedDays.sort((a, b) => a - b);
          }
        }

        // Add feedback if provided
        if (update.feedback) {
          progressData.feedback.push({
            day: update.day,
            type: 'comment',
            value: update.feedback,
            timestamp: update.timestamp
          });
        }
      }

      // Recalculate streak
      progressData.currentStreak = calculateStreak(progressData.completedDays);
      progressData.lastActivity = new Date();

      // Save updated progress
      const updatedProgress = await db.updateProgress(progressData);

      context.log(`Progress updated for plan ${body.planId}: ${progressData.completedDays.length} days completed, streak: ${progressData.currentStreak}`);

      const response: ProgressResponse = {
        success: true
      };

      return {
        status: 200,
        headers: corsHeaders,
        jsonBody: response
      };
    }

    return {
      status: 405,
      headers: corsHeaders,
      jsonBody: { success: false, error: 'Method not allowed' }
    };

  } catch (error: any) {
    context.error('Error in progress function:', error);
    
    const response: ProgressResponse = {
      success: false,
      error: error.message || 'Internal server error'
    };

    return {
      status: 500,
      headers: corsHeaders,
      jsonBody: response
    };
  }
}

// Helper function to calculate current streak
function calculateStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;
  
  const sorted = [...completedDays].sort((a, b) => b - a);
  let streak = 1;
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i-1] - sorted[i] === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

app.http('progress', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'progress',
  handler: progress,
});