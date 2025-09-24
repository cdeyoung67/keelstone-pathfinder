// Multi-Agent Customer Journey Intake Function

// Helper function to determine primary virtue from struggles
function getPrimaryVirtue(struggles) {
  const virtueCount = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };
  
  const struggleToVirtue = {
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
    if (virtue) virtueCount[virtue]++;
  });

  return Object.entries(virtueCount).reduce((a, b) => 
    virtueCount[a[0]] > virtueCount[b[0]] ? a : b
  )[0];
}

// Multi-Agent Plan Generation Service
class MultiAgentService {
  constructor() {
    this.agents = new Map();
    this.initializeAgents();
  }

  initializeAgents() {
    // Use environment variables for multi-agent configuration
    // For now, we'll use a simplified single-agent approach that mimics multi-agent behavior
    this.isMultiAgentEnabled = process.env.ENABLE_MULTI_AGENT === 'true';
  }

  async generatePersonalizedPlan(assessment) {
    if (this.isMultiAgentEnabled) {
      return await this.generateMultiAgentPlan(assessment);
    } else {
      return this.generateSingleAgentPlan(assessment);
    }
  }

  async generateMultiAgentPlan(assessment) {
    // Multi-agent plan generation (placeholder for now)
    // This would call the TypeScript MultiAgentService
    console.log(`🤖 Multi-agent plan generation for ${assessment.firstName}`);
    console.log(`Primary virtue: ${assessment.primaryVirtue}, Door: ${assessment.door}`);
    
    // For now, return enhanced single-agent plan with multi-agent context
    return this.generateSingleAgentPlan(assessment, true);
  }

  generateSingleAgentPlan(assessment, multiAgentContext = false) {
    const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const virtue = assessment.primaryVirtue;
    const timeMinutes = parseInt(assessment.timeBudget.split('-')[0]) || 5;
    
    // Generate 21 days of practices with enhanced context
    const daily = [];
    for (let day = 1; day <= 21; day++) {
      const week = Math.ceil(day / 7);
      const isWeekly = day % 7 === 0;
      
      let theme = '';
      if (week === 1) theme = 'Foundation';
      else if (week === 2) theme = 'Deepening'; 
      else theme = 'Integration';

      daily.push({
        day,
        title: isWeekly ? `Week ${week} Reflection: ${virtue}` : `Day ${day}: ${theme} in ${virtue}`,
        steps: [
          "Begin with three mindful breaths",
          `Practice ${virtue} in one small action`,
          multiAgentContext ? `Apply ${virtue} to your specific struggle: ${assessment.struggles[0]}` : "Reflect on your experience",
          isWeekly ? "Weekly progress review" : "Set tomorrow's intention"
        ],
        reflection: `How did you experience ${virtue} today? What insights emerged?`,
        quote: {
          text: this.getQuoteForVirtue(virtue, assessment.door),
          source: this.getQuoteSource(virtue, assessment.door),
          type: assessment.door === 'christian' ? 'biblical' : 'wisdom'
        },
        commentary: multiAgentContext ? 
          `Day ${day} - ${theme}: Your ${assessment.door} path emphasizes ${virtue} as key to addressing ${assessment.struggles.join(' and ')}. ${this.getCommentaryForDay(day, virtue)}.` :
          `Today's focus on ${virtue} helps build the foundation for lasting change.`,
        estimatedTime: timeMinutes
      });
    }
    
    return {
      id: planId,
      userId: '',
      assessment,
      anchor: `Today I practice ${virtue} — small, consistent, unhurried.`,
      virtue,
      door: assessment.door,
      daily,
      weeklyCheckin: `How has your practice of ${virtue} evolved this week? What's working well, and what needs adjustment?`,
      createdAt: new Date(),
      version: multiAgentContext ? "multi-agent-v1.0" : "1.0-functional"
    };
  }

  getQuoteForVirtue(virtue, door) {
    const quotes = {
      wisdom: {
        christian: "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
        secular: "The only true wisdom is in knowing you know nothing. - Socrates"
      },
      courage: {
        christian: "Be strong and courageous! Do not be afraid or discouraged. - Joshua 1:9",
        secular: "Courage is not the absence of fear, but action in spite of it. - Mark Twain"
      },
      justice: {
        christian: "Let justice roll on like a river, righteousness like a never-failing stream. - Amos 5:24",
        secular: "Justice is truth in action. - Benjamin Disraeli"
      },
      temperance: {
        christian: "Like a city whose walls are broken through is a person who lacks self-control. - Proverbs 25:28",
        secular: "Moderation in all things. - Aristotle"
      }
    };
    return quotes[virtue][door];
  }

  getQuoteSource(virtue, door) {
    return door === 'christian' ? 'Scripture' : 'Ancient Wisdom';
  }

  getCommentaryForDay(day, virtue) {
    const week = Math.ceil(day / 7);
    if (week === 1) return `This week focuses on building the foundation of ${virtue} through small, consistent practices`;
    if (week === 2) return `This week deepens your understanding and application of ${virtue} in daily life`;
    return `This week integrates ${virtue} as a natural part of your daily rhythm and character`;
  }
}

module.exports = async function (context, req) {
  context.log('Intake function triggered');

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: corsHeaders
    };
    return;
  }

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      headers: corsHeaders,
      body: { success: false, error: 'Method not allowed' }
    };
    return;
  }

  try {
    // Parse and validate request
    const body = req.body;
    if (!body || !body.assessment) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: { success: false, error: 'Assessment data is required' }
      };
      return;
    }

    const { firstName, lastName, email, struggles, door, timeBudget, daypart } = body.assessment;
    if (!firstName || !lastName || !email || !struggles || !door || !timeBudget || !daypart) {
      context.res = {
        status: 400,
        headers: corsHeaders,
        body: { success: false, error: 'Missing required fields' }
      };
      return;
    }

    // Create assessment with primary virtue
    const assessment = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...body.assessment,
      primaryVirtue: getPrimaryVirtue(struggles),
      createdAt: new Date()
    };

    context.log(`Processing assessment for ${firstName} ${lastName} (${email})`);
    context.log(`Primary virtue: ${assessment.primaryVirtue}, Struggles: ${struggles.join(', ')}`);

    // Create user
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email, firstName, lastName,
      createdAt: new Date(),
      lastActive: new Date()
    };

    // Generate personalized plan using Multi-Agent Service
    const multiAgentService = new MultiAgentService();
    const plan = await multiAgentService.generatePersonalizedPlan(assessment);
    plan.userId = user.id;

    context.log(`Generated ${plan.daily.length}-day plan for ${assessment.primaryVirtue} using ${plan.version}`);

    const response = {
      success: true,
      plan: plan
    };

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: response
    };

  } catch (error) {
    context.log.error('Error in intake function:', error);
    
    const response = {
      success: false,
      error: error.message || 'Internal server error'
    };

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: response
    };
  }
};
