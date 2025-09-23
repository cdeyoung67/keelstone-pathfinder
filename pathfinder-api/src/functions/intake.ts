import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getDatabase } from '../shared/database';
import { getOpenAIService } from '../shared/openai-service';
import { Assessment, IntakeRequest, IntakeResponse, CardinalVirtue } from '../shared/types';

// Helper function to determine primary virtue from struggles
function getPrimaryVirtue(struggles: string[]): CardinalVirtue {
  const virtueCount = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };
  
  // Map struggles to virtues (simplified version - in production this would be more sophisticated)
  const struggleToVirtue: Record<string, CardinalVirtue> = {
    'social-media-overwhelm': 'temperance',
    'news-anxiety': 'temperance',
    'digital-distraction': 'temperance',
    'information-overload': 'wisdom',
    'emotional-reactivity': 'temperance',
    'burnout-exhaustion': 'courage',
    'decision-paralysis': 'wisdom',
    'analysis-paralysis': 'wisdom',
    'lack-direction': 'wisdom',
    'fear-failure': 'courage',
    'perfectionism': 'courage',
    'avoiding-conflict': 'courage',
    'relationship-conflicts': 'justice',
    'helping-others': 'justice',
    'work-life-balance': 'justice',
    'feeling-isolated': 'justice'
  };

  // Count virtue occurrences
  struggles.forEach(struggle => {
    const virtue = struggleToVirtue[struggle];
    if (virtue) {
      virtueCount[virtue]++;
    }
  });

  // Return the virtue with the highest count, defaulting to wisdom
  return Object.entries(virtueCount).reduce((a, b) => 
    virtueCount[a[0] as CardinalVirtue] > virtueCount[b[0] as CardinalVirtue] ? a : b
  )[0] as CardinalVirtue;
}

export async function intake(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Intake function triggered');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (request.method !== 'POST') {
    return {
      status: 405,
      headers: corsHeaders,
      jsonBody: { success: false, error: 'Method not allowed' }
    };
  }

  try {
    // Parse request body
    const body = await request.json() as IntakeRequest;
    if (!body.assessment) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { success: false, error: 'Assessment data is required' }
      };
    }

    // Validate required fields
    const { firstName, lastName, email, struggles, door, timeBudget, daypart } = body.assessment;
    if (!firstName || !lastName || !email || !struggles || !door || !timeBudget || !daypart) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { success: false, error: 'Missing required fields' }
      };
    }

    // Create assessment with generated ID and primary virtue
    const assessment: Assessment = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body.assessment,
      primaryVirtue: getPrimaryVirtue(struggles),
      createdAt: new Date()
    };

    context.log(`Processing assessment for ${firstName} ${lastName} (${email})`);
    context.log(`Primary virtue: ${assessment.primaryVirtue}, Struggles: ${struggles.join(', ')}`);

    // Initialize services
    const db = getDatabase();
    const openai = getOpenAIService();

    // Check if user already exists
    let user = await db.getUserByEmail(email);
    if (!user) {
      // Create new user
      user = await db.createUser({
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        lastActive: new Date()
      });
      context.log(`Created new user: ${user.id}`);
    } else {
      // Update last active
      await db.updateUserLastActive(user.id);
      context.log(`Updated existing user: ${user.id}`);
    }

    // Generate personalized plan using Azure OpenAI
    context.log('Generating personalized plan with Azure OpenAI...');
    const plan = await openai.generatePersonalizedPlan(assessment);
    plan.userId = user.id; // Ensure plan is linked to the correct user

    // Save plan to database
    const savedPlan = await db.createPlan(plan);
    context.log(`Plan created with ID: ${savedPlan.id}`);

    // Initialize progress tracking
    const progress = await db.createProgress({
      id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      planId: savedPlan.id,
      userId: user.id,
      completedDays: [],
      skippedDays: [],
      currentStreak: 0,
      lastActivity: new Date(),
      feedback: []
    });

    context.log(`Progress tracking initialized: ${progress.id}`);

    // TODO: Trigger email sequence (ConvertKit integration)
    // This would be implemented in Phase 1 as well

    const response: IntakeResponse = {
      success: true,
      plan: savedPlan
    };

    return {
      status: 200,
      headers: corsHeaders,
      jsonBody: response
    };

  } catch (error: any) {
    context.error('Error in intake function:', error);
    
    const response: IntakeResponse = {
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

app.http('intake', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'intake',
  handler: intake,
});