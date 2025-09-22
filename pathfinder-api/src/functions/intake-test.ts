import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMockDatabase, getMockOpenAIService } from '../shared/mock-services';
import { Assessment, IntakeRequest, IntakeResponse, CardinalVirtue } from '../shared/types';

// Helper function to determine primary virtue from struggles
function getPrimaryVirtue(struggles: string[]): CardinalVirtue {
  const virtueCount = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };
  
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

  struggles.forEach(struggle => {
    const virtue = struggleToVirtue[struggle];
    if (virtue) {
      virtueCount[virtue]++;
    }
  });

  return Object.entries(virtueCount).reduce((a, b) => 
    virtueCount[a[0] as CardinalVirtue] > virtueCount[b[0] as CardinalVirtue] ? a : b
  )[0] as CardinalVirtue;
}

export async function intakeTest(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('🧪 MOCK Intake function triggered');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return { status: 200, headers: corsHeaders };
  }

  if (request.method !== 'POST') {
    return {
      status: 405,
      headers: corsHeaders,
      jsonBody: { success: false, error: 'Method not allowed' }
    };
  }

  try {
    const body = await request.json() as IntakeRequest;
    if (!body.assessment) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { success: false, error: 'Assessment data is required' }
      };
    }

    const { firstName, lastName, email, struggles, door, timeBudget, daypart } = body.assessment;
    if (!firstName || !lastName || !email || !struggles || !door || !timeBudget || !daypart) {
      return {
        status: 400,
        headers: corsHeaders,
        jsonBody: { success: false, error: 'Missing required fields' }
      };
    }

    const assessment: Assessment = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body.assessment,
      primaryVirtue: getPrimaryVirtue(struggles),
      createdAt: new Date()
    };

    context.log(`🧪 MOCK Processing assessment for ${firstName} ${lastName} (${email})`);
    context.log(`🧪 MOCK Primary virtue: ${assessment.primaryVirtue}, Struggles: ${struggles.join(', ')}`);

    // Use mock services
    const db = getMockDatabase();
    const openai = getMockOpenAIService();

    // Check if user already exists
    let user = await db.getUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        lastActive: new Date()
      });
      context.log(`🧪 MOCK Created new user: ${user.id}`);
    } else {
      await db.updateUserLastActive(user.id);
      context.log(`🧪 MOCK Updated existing user: ${user.id}`);
    }

    // Generate personalized plan using mock OpenAI
    context.log('🧪 MOCK Generating personalized plan...');
    const plan = await openai.generatePersonalizedPlan(assessment);
    plan.userId = user.id;

    // Save plan to mock database
    const savedPlan = await db.createPlan(plan);
    context.log(`🧪 MOCK Plan created with ID: ${savedPlan.id}`);

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

    context.log(`🧪 MOCK Progress tracking initialized: ${progress.id}`);

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
    context.error('🧪 MOCK Error in intake function:', error);
    
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

app.http('intake-test', {
  methods: ['GET', 'POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'intake-test',
  handler: intakeTest,
});
