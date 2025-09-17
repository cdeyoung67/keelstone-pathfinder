// Mock LLM system for testing different AI model responses

import { Assessment, PersonalizedPlan, DailyPractice, Quote, MockModelConfig, CardinalVirtue, BibleVersion } from './types';
import { SAMPLE_QUOTES } from './content-library';

// Mock model configurations for testing
export const MOCK_MODELS: Record<string, MockModelConfig> = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    style: 'concise',
    tone: 'practical',
    responseTime: 1500,
    errorRate: 0.02
  },
  'gpt-4': {
    name: 'GPT-4',
    style: 'detailed',
    tone: 'nuanced', 
    responseTime: 2500,
    errorRate: 0.01
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    style: 'balanced',
    tone: 'warm',
    responseTime: 2000,
    errorRate: 0.01
  }
};

// Simulate realistic delay
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Generate anchor statement based on virtue and door
function generateAnchor(virtue: CardinalVirtue, door: 'christian' | 'secular'): string {
  const anchors = {
    christian: {
      wisdom: "Today I will seek God's wisdom in small, faithful steps — discerning, but not proud.",
      courage: "Today I will step forward in God's strength — brave, but not reckless.", 
      justice: "Today I will love my neighbor as myself — fair, but not harsh.",
      temperance: "Today I will practice God's peace within — steady, but not rigid."
    },
    secular: {
      wisdom: "Today I practice discernment — wise, but not proud.",
      courage: "Today I practice brave action — courageous, but not reckless.",
      justice: "Today I practice fairness — just, but not harsh.", 
      temperance: "Today I practice moderation — steady, but not rigid."
    }
  };
  
  return anchors[door][virtue];
}

// Get appropriate quote based on door, virtue, and day
function getQuoteForDay(
  day: number, 
  virtue: CardinalVirtue, 
  door: 'christian' | 'secular',
  bibleVersion?: BibleVersion
): Quote {
  const quotes = SAMPLE_QUOTES[virtue][door];
  const quote = quotes[day % quotes.length]; // Cycle through available quotes
  
  // For biblical quotes, adjust version if needed
  if (door === 'christian' && quote.type === 'biblical' && bibleVersion && bibleVersion !== 'kjv') {
    return {
      ...quote,
      bibleVersion,
      // In real implementation, this would fetch the verse in the requested version
      text: quote.text // For now, keep same text but mark the version
    };
  }
  
  return quote;
}

// Generate daily practices based on assessment
function generateDailyPractices(
  assessment: Assessment,
  virtue: CardinalVirtue,
  modelStyle: 'concise' | 'detailed' | 'balanced'
): DailyPractice[] {
  const practices: DailyPractice[] = [];
  
  // Base practices by virtue (these would be AI-generated in real implementation)
  const basePractices = {
    wisdom: [
      { title: 'Morning Reflection', baseSteps: ['Take 3 deep breaths', 'Ask: What do I need to understand today?'] },
      { title: 'Decision Pause', baseSteps: ['Before major decisions, pause for 30 seconds', 'Consider long-term consequences'] },
      { title: 'Evening Review', baseSteps: ['Review one decision from today', 'What would I do differently?'] },
      { title: 'Seek Understanding', baseSteps: ['Listen more than you speak in one conversation', 'Ask clarifying questions'] },
      { title: 'Knowledge vs Wisdom', baseSteps: ['Identify one fact you learned', 'How can you apply it wisely?'] },
      { title: 'Humble Learning', baseSteps: ['Admit you don\'t know something', 'Ask someone to teach you'] },
      { title: 'Pattern Recognition', baseSteps: ['Notice a recurring pattern in your day', 'What is it teaching you?'] }
    ],
    courage: [
      { title: 'Small Brave Act', baseSteps: ['Do one thing that scares you slightly', 'Notice how you feel afterward'] },
      { title: 'Speak Truth Gently', baseSteps: ['Share an honest opinion with kindness', 'Focus on being helpful, not right'] },
      { title: 'Face the Difficult', baseSteps: ['Address one task you\'ve been avoiding', 'Break it into smaller steps'] },
      { title: 'Stand for Values', baseSteps: ['Identify one value that matters to you', 'Take one small action aligned with it'] },
      { title: 'Comfort Zone Stretch', baseSteps: ['Try something new for 5 minutes', 'Embrace the discomfort'] },
      { title: 'Encourage Another', baseSteps: ['Offer genuine encouragement to someone', 'Be specific about what you appreciate'] },
      { title: 'Inner Strength', baseSteps: ['When feeling weak, remember past victories', 'Draw strength from that memory'] }
    ],
    justice: [
      { title: 'Fair Listening', baseSteps: ['Listen to understand, not to respond', 'Repeat back what you heard'] },
      { title: 'Acts of Service', baseSteps: ['Do something helpful without being asked', 'Expect nothing in return'] },
      { title: 'Boundary Setting', baseSteps: ['Say no to one request that overextends you', 'Explain kindly why'] },
      { title: 'Gratitude Practice', baseSteps: ['Thank someone who serves others', 'Be specific about their impact'] },
      { title: 'Equity Check', baseSteps: ['Notice who might be overlooked today', 'Include them in some way'] },
      { title: 'Forgiveness Step', baseSteps: ['Release one small resentment', 'Focus on your own peace'] },
      { title: 'Community Care', baseSteps: ['Do something that benefits your community', 'Even if no one notices'] }
    ],
    temperance: [
      { title: 'Digital Boundary', baseSteps: ['Set phone to silent for 1 hour', 'Notice what you do instead'] },
      { title: 'Mindful Consumption', baseSteps: ['Before consuming news/media, ask why', 'Set a time limit'] },
      { title: 'Emotional Pause', baseSteps: ['When feeling reactive, count to 10', 'Respond from calm, not emotion'] },
      { title: 'Moderation Practice', baseSteps: ['Choose less of something good', 'Appreciate quality over quantity'] },
      { title: 'Present Moment', baseSteps: ['Spend 5 minutes fully present', 'No multitasking, just being'] },
      { title: 'Balance Check', baseSteps: ['Notice where you feel out of balance', 'Make one small adjustment'] },
      { title: 'Gentle Discipline', baseSteps: ['Keep one small promise to yourself', 'Celebrate the follow-through'] }
    ]
  };

  // Select 14 practices, customizing based on struggles and model style
  const virtuesPractices = basePractices[virtue];
  const selectedPractices = virtuesPractices.slice(0, 7); // Take first 7, then repeat with variations
  
  for (let day = 1; day <= 14; day++) {
    const basePractice = selectedPractices[(day - 1) % 7];
    const quote = getQuoteForDay(day, virtue, assessment.door, assessment.bibleVersion);
    
    // Adjust steps based on model style
    let steps = [...basePractice.baseSteps];
    if (modelStyle === 'detailed') {
      steps.push('Journal one sentence about this experience');
    } else if (modelStyle === 'concise') {
      steps = steps.slice(0, -1); // Remove last step for brevity
    }
    
    // Adjust for time budget
    const timeMap = { '5-10': 8, '10-15': 12, '15-20': 18 };
    const estimatedTime = timeMap[assessment.timeBudget];
    
    practices.push({
      day,
      title: `Day ${day}: ${basePractice.title}`,
      steps,
      reflection: `How did practicing ${virtue} feel today? What did you notice?`,
      quote,
      estimatedTime
    });
  }
  
  return practices;
}

// Main function to generate personalized plan
export async function generateMockPlan(
  assessment: Assessment,
  modelType: keyof typeof MOCK_MODELS = 'gpt-4-turbo'
): Promise<PersonalizedPlan> {
  const model = MOCK_MODELS[modelType];
  
  // Simulate realistic delay
  await delay(model.responseTime);
  
  // Simulate occasional errors for testing
  if (Math.random() < model.errorRate) {
    throw new Error('Mock LLM service temporarily unavailable');
  }
  
  const primaryVirtue = assessment.primaryVirtue;
  const anchor = generateAnchor(primaryVirtue, assessment.door);
  const dailyPractices = generateDailyPractices(assessment, primaryVirtue, model.style);
  
  // Generate weekly check-in based on virtue
  const weeklyCheckins = {
    wisdom: "This week, what's one thing you understand more clearly about yourself or your situation?",
    courage: "This week, what's one brave step you took that you're proud of?",
    justice: "This week, how did you show fairness or compassion to yourself or others?",
    temperance: "This week, where did you find good balance or healthy boundaries?"
  };
  
  const plan: PersonalizedPlan = {
    id: `plan_${Date.now()}`,
    userId: assessment.id,
    anchor,
    virtue: primaryVirtue,
    door: assessment.door,
    daily: dailyPractices,
    weeklyCheckin: weeklyCheckins[primaryVirtue],
    stretchPractice: "Consider sharing one insight from this practice with a friend or family member.",
    createdAt: new Date(),
    version: modelType
  };
  
  return plan;
}

// Test different model responses for comparison
export async function generateMultipleVersions(
  assessment: Assessment
): Promise<Record<string, PersonalizedPlan>> {
  const models = Object.keys(MOCK_MODELS);
  const results: Record<string, PersonalizedPlan> = {};
  
  for (const model of models) {
    try {
      results[model] = await generateMockPlan(assessment, model as keyof typeof MOCK_MODELS);
    } catch (error) {
      console.warn(`Failed to generate plan with ${model}:`, error);
    }
  }
  
  return results;
}
