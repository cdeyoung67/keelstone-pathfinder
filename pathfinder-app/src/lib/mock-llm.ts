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

// Generate Fruit of the Spirit commentary connecting quote to practice
function generateCommentary(
  day: number,
  virtue: CardinalVirtue,
  door: 'christian' | 'secular',
  practiceTitle: string,
  quote: Quote
): string {
  // Fruit of the Spirit mapping for both doors
  const fruitOfSpirit = {
    christian: {
      wisdom: ['gentleness', 'self-control', 'patience'],
      courage: ['faithfulness', 'love', 'peace'],
      justice: ['kindness', 'goodness', 'love'],
      temperance: ['self-control', 'gentleness', 'patience']
    },
    secular: {
      wisdom: ['gentleness', 'self-discipline', 'patience'],
      courage: ['faithfulness', 'love', 'inner peace'],
      justice: ['kindness', 'goodness', 'compassion'],
      temperance: ['self-control', 'gentleness', 'mindfulness']
    }
  };

  const relevantFruits = fruitOfSpirit[door][virtue];
  const [fruit1, fruit2, fruit3] = relevantFruits;

  // Commentary templates based on virtue and door
  const commentaryTemplates = {
    wisdom: {
      christian: [
        `The wisdom found in this quote from ${quote.source} speaks directly to the heart of ${practiceTitle.toLowerCase()}. When we cultivate ${fruit1} in our daily decisions, we mirror the character of Christ who "grew in wisdom and stature." This practice invites us to slow down and seek understanding rather than rushing to judgment, recognizing that true wisdom comes from above.`,
        
        `As we engage with today's steps, we're developing ${fruit2}—one of the fruits of the Spirit that transforms how we navigate uncertainty. The quote reminds us that wisdom isn't about having all the answers, but about approaching life's complexities with humility and discernment. Each moment of pause, each question we ask, becomes an opportunity to demonstrate the ${fruit3} that flows from a heart aligned with God's wisdom.`,
        
        `This practice builds the virtue of wisdom not through accumulating knowledge, but through cultivating a spirit that seeks truth in love. When we see evidence of growing ${fruit1}, ${fruit2}, and ${fruit3} in our responses to daily challenges, we know we're walking in the wisdom that leads to life. These fruits are the markers that show us we're not just becoming smarter, but becoming more like Christ in our thinking and decision-making.`
      ],
      secular: [
        `This quote captures the essence of what makes ${practiceTitle.toLowerCase()} so transformative in building practical wisdom. When we approach life's decisions with ${fruit1}, we create space for clearer thinking and better outcomes. Philosophy has long taught us that wisdom isn't about knowing everything, but about knowing how to think well and act with intention.`,
        
        `Today's practice cultivates ${fruit2}—a quality that ancient philosophers recognized as essential for good judgment. The wisdom in this quote reminds us that every choice is an opportunity to practice discernment. By developing ${fruit3} in our daily responses, we build the mental habits that lead to flourishing and authentic living.`,
        
        `The virtue of wisdom reveals itself through qualities like ${fruit1}, ${fruit2}, and ${fruit3}. These aren't just nice ideals—they're practical indicators that our decision-making is becoming more skillful and our perspective more balanced. When we notice these qualities emerging in our daily life, we know we're developing the kind of wisdom that creates genuine well-being for ourselves and others.`
      ]
    },
    courage: {
      christian: [
        `The truth in this quote from ${quote.source} calls us to the kind of ${practiceTitle.toLowerCase()} that reflects God's heart for His people. Biblical courage isn't about being fearless—it's about acting in ${fruit1} despite our fears. When we take small brave steps, we're participating in the same Spirit that empowered ordinary people to do extraordinary things throughout Scripture.`,
        
        `This practice develops ${fruit2}, one of the fruits that naturally flows from a heart that trusts God's goodness. The quote reminds us that courage grows not in the absence of difficulty, but in the presence of faith. As we practice today's steps, we're building the spiritual muscle of ${fruit3}—learning to act from love rather than fear, just as Christ did.`,
        
        `True courage is revealed through the fruits of ${fruit1}, ${fruit2}, and ${fruit3}. These qualities show us that we're not just becoming braver, but becoming more loving in our bravery. When our courage produces greater compassion, deeper peace, and stronger faithfulness, we know we're walking in the courage that comes from God—the kind that builds up rather than tears down.`
      ],
      secular: [
        `This quote illuminates why ${practiceTitle.toLowerCase()} is so essential for developing authentic courage. Real bravery isn't about grand gestures—it's about consistently choosing ${fruit1} in small moments. Philosophy teaches us that courage is a practice, not a feeling, and each small act of bravery builds our capacity for larger ones.`,
        
        `Today's steps cultivate ${fruit2}, recognizing that genuine courage emerges from a place of inner strength rather than external bravado. The wisdom in this quote shows us that courage and ${fruit3} are intimately connected—when we act from a centered place, our bravery serves life rather than ego.`,
        
        `We know we're developing true courage when we see ${fruit1}, ${fruit2}, and ${fruit3} growing in our daily responses to challenge. These qualities are the evidence that our bravery is becoming more skillful and wise. Authentic courage creates more connection, more peace, and more genuine strength—both in ourselves and in our relationships with others.`
      ]
    },
    justice: {
      christian: [
        `The heart of this quote from ${quote.source} reveals why ${practiceTitle.toLowerCase()} is so central to Christian living. Justice isn't just about fairness—it's about reflecting God's ${fruit1} in every interaction. When we practice justice in small ways, we're participating in God's work of healing and restoration in the world, showing His love through practical action.`,
        
        `This practice develops ${fruit2}, one of the fruits of the Spirit that transforms how we see and treat others. The quote reminds us that true justice flows from a heart that has experienced God's mercy. As we engage with today's steps, we're learning to demonstrate ${fruit3} not as weakness, but as the strength that comes from knowing we are deeply loved.`,
        
        `Biblical justice is revealed through fruits like ${fruit1}, ${fruit2}, and ${fruit3}. These qualities show us that we're not just becoming more fair, but more like Jesus in our treatment of others. When our pursuit of justice produces greater compassion, deeper kindness, and more generous love, we know we're walking in the justice that reflects God's heart for all people.`
      ],
      secular: [
        `This quote captures the essence of why ${practiceTitle.toLowerCase()} matters so deeply for human flourishing. Justice isn't just a political concept—it's a personal practice that begins with ${fruit1} in our daily interactions. Philosophy has always recognized that a just society starts with individuals who cultivate fairness and compassion in their own lives.`,
        
        `Today's practice builds ${fruit2}, understanding that genuine justice requires both clear thinking and an open heart. The wisdom in this quote shows us that fairness isn't about rigid rules, but about responding to each situation with ${fruit3} and discernment. Every act of consideration, every moment of listening, becomes a practice of justice.`,
        
        `We recognize growing justice in ourselves through qualities like ${fruit1}, ${fruit2}, and ${fruit3}. These aren't just moral ideals—they're practical indicators that our sense of fairness is becoming more mature and wise. When our commitment to justice creates more understanding, more compassion, and more genuine care for others' wellbeing, we know we're developing the kind of character that contributes to a better world.`
      ]
    },
    temperance: {
      christian: [
        `The wisdom in this quote from ${quote.source} speaks to the heart of why ${practiceTitle.toLowerCase()} is so essential for spiritual growth. Temperance isn't about restriction—it's about freedom through ${fruit1}. When we practice healthy boundaries, we're following the example of Christ who knew when to engage and when to withdraw, always acting from love rather than compulsion.`,
        
        `This practice cultivates ${fruit2}, one of the fruits that reflects God's own character. The quote reminds us that true self-control comes not from willpower alone, but from the Spirit's work in our hearts. As we engage with today's steps, we're learning ${fruit3}—the ability to respond rather than react, to choose our actions from a place of peace rather than pressure.`,
        
        `Biblical temperance is revealed through fruits like ${fruit1}, ${fruit2}, and ${fruit3}. These qualities show us that we're not just becoming more disciplined, but more free to love well. When our self-control produces greater gentleness, deeper patience, and more thoughtful responses, we know we're walking in the temperance that comes from God—the kind that creates space for His love to flow through us.`
      ],
      secular: [
        `This quote illuminates why ${practiceTitle.toLowerCase()} is so crucial for authentic living. True temperance isn't about deprivation—it's about developing ${fruit1} that allows us to choose our responses rather than being driven by impulse. Ancient wisdom traditions have always taught that freedom comes through skillful self-regulation, not indulgence.`,
        
        `Today's practice develops ${fruit2}, recognizing that genuine balance requires both awareness and compassion toward ourselves. The wisdom in this quote shows us that temperance and ${fruit3} work together—when we approach our habits and patterns with kindness rather than harsh judgment, lasting change becomes possible.`,
        
        `We know we're developing healthy temperance when we see ${fruit1}, ${fruit2}, and ${fruit3} growing in our daily responses to impulse and desire. These qualities are evidence that our self-regulation is becoming more skillful and sustainable. Authentic temperance creates more peace, more intentional living, and more genuine satisfaction—not through restriction, but through wise choices that serve our deepest values.`
      ]
    }
  };

  return commentaryTemplates[virtue][door].join('\n\n');
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
    
    const commentary = generateCommentary(day, virtue, assessment.door, basePractice.title, quote);
    
    practices.push({
      day,
      title: `Day ${day}: ${basePractice.title}`,
      steps,
      reflection: `How did practicing ${virtue} feel today? What did you notice?`,
      quote,
      commentary,
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
    assessment: assessment, // Include the full assessment for personalization
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
