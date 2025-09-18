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

// Generate Christian UX content following christianUX.md framework
function generateChristianUXContent(
  day: number,
  virtue: CardinalVirtue,
  practiceTitle: string,
  courageTheme: string
) {
  const openingPrayers = [
    "Heavenly Father, as I begin this day, guide my heart toward courage that reflects Your love. Help me to trust in Your strength when I feel weak, and to act with boldness that serves Your kingdom. Amen.",
    "Lord Jesus, You showed us perfect courage in facing the cross. Grant me the grace to follow Your example in small ways today, choosing love over fear and faith over doubt. Amen.",
    "God of all comfort, I come to You seeking the courage to face today's challenges. Fill me with Your peace that surpasses understanding, and help me to be a source of strength for others. Amen.",
    "Father, You have not given me a spirit of fear, but of power, love, and sound mind. Help me to remember this truth as I practice courage today. Guide my steps and guard my heart. Amen."
  ];

  const closingPrayers = [
    "Thank You, Lord, for walking with me through today's challenges. Help me to grow in courage tomorrow, and to trust more deeply in Your unfailing love. May my small acts of bravery bring glory to Your name. Amen.",
    "Gracious God, I thank You for the opportunities to practice courage today. Forgive me where I fell short, and strengthen me for tomorrow's journey. Help me to rest in Your peace tonight. Amen.",
    "Jesus, thank You for being my example of perfect courage. As I reflect on today, help me to see how You were present in my small acts of faith. Prepare my heart for tomorrow's growth. Amen.",
    "Father, I praise You for Your faithfulness today. Thank You for the courage You provided and the growth You are working in my heart. Help me to trust You more completely each day. Amen."
  ];

  const wisdomBridges = [
    "Throughout history, courage has been recognized as essential for human flourishing. The Stoic philosopher Seneca wrote that 'courage is not the absence of fear, but action in spite of it.' This aligns beautifully with biblical courage—not the absence of fear, but faith that acts despite fear. Both Scripture and philosophy teach us that true bravery serves something greater than ourselves.",
    "Ancient wisdom traditions, from Aristotle to Confucius, have taught that courage is a virtue that must be practiced daily in small ways. Aristotle called it the 'golden mean' between cowardice and recklessness. This mirrors the biblical understanding of courage as wisdom in action—neither presumptuous nor paralyzed, but faithful and measured.",
    "The great Christian thinkers like C.S. Lewis and Dietrich Bonhoeffer understood that courage is not a feeling but a choice. Lewis wrote that 'courage is not simply one of the virtues but the form of every virtue at the testing point.' Both faith and reason affirm that courage is the bridge between our values and our actions.",
    "Military leaders, philosophers, and saints throughout history have discovered the same truth: courage grows through practice. Whether we look to Marcus Aurelius, Joan of Arc, or modern heroes, we see that bravery is built through daily choices to do what is right despite difficulty. Faith provides the 'why' while wisdom provides the 'how.'"
  ];

  const courageThemes = [
    "Courage in Small Moments",
    "Faith Over Fear",
    "Speaking Truth in Love",
    "Standing for Justice",
    "Embracing God's Calling",
    "Strength in Vulnerability",
    "Hope in Uncertainty"
  ];

  const practicalChallenges = [
    "Have a difficult but necessary conversation with someone, speaking truth in love.",
    "Take one small step toward a goal that feels overwhelming, trusting God with the outcome.",
    "Offer help to someone who might be struggling, even if it feels awkward.",
    "Stand up for someone who is being treated unfairly, in whatever way feels appropriate.",
    "Share something meaningful about your faith with someone, naturally and without pressure.",
    "Apologize to someone you've wronged, taking full responsibility without excuses.",
    "Try something new that stretches you, embracing the discomfort as growth."
  ];

  // Scripture & Anchor: One clear thought framing the theme of Courage
  const scriptureAnchors = [
    "Today I will trust in God's strength when facing what seems impossible, knowing He goes before me.",
    "I choose to act with love-driven courage, letting faith be louder than fear in my decisions.",
    "God has equipped me with everything I need for today's challenges; I will step forward in confidence.",
    "I will speak truth in love today, trusting God to use my words for His purposes.",
    "When I feel weak, I will remember that God's power is made perfect in weakness.",
    "I choose to stand for what is right today, knowing God honors those who honor Him.",
    "I will take the next right step in faith, trusting God to illuminate the path ahead."
  ];

  // Reflection Prompts: Journaling or prayer reflection (captured in app for tracking)
  const reflectionPrompts = [
    "How did I see God's faithfulness in the moments when I chose courage over comfort today?",
    "What fears did I face today, and how did trusting in God's presence change my response?",
    "Where did I see the fruit of the Spirit (love, peace, patience) emerging through my brave choices?",
    "What is God teaching me about His character through today's opportunities to practice courage?",
    "How did acting courageously today align with or challenge my understanding of following Jesus?",
    "What small act of bravery today surprised me, and how might God be growing my faith through it?",
    "In what ways did I partner with God's strength today rather than relying solely on my own?"
  ];

  // Fruit of the Spirit Check-In options
  const fruitCheckInOptions = [
    ['Love', 'Joy', 'Peace'],
    ['Patience', 'Kindness', 'Goodness'], 
    ['Faithfulness', 'Gentleness', 'Self-Control'],
    ['Love', 'Patience', 'Gentleness'],
    ['Joy', 'Peace', 'Kindness'],
    ['Goodness', 'Faithfulness', 'Self-Control'],
    ['Love', 'Peace', 'Faithfulness']
  ];

  // Community Touchpoints: Encouragement to share reflection or journal snippet
  const communityPrompts = [
    "Share one sentence about how God showed up in your courage practice today.",
    "What's one small way you saw God's faithfulness today? Share to encourage others.",
    "Describe in a few words how choosing courage over fear felt today.",
    "Share a brief prayer request or praise related to today's courage challenge.",
    "What fruit of the Spirit did you notice most today? Share your experience.",
    "Offer one word of encouragement to someone else walking this courage journey.",
    "Share how today's practice is changing your perspective on trusting God."
  ];

  return {
    // Following the exact christianUX.md framework order
    openingPrayer: openingPrayers[day % openingPrayers.length],
    scriptureAnchor: scriptureAnchors[day % scriptureAnchors.length], 
    wisdomBridge: wisdomBridges[day % wisdomBridges.length],
    reflectionPrompt: reflectionPrompts[day % reflectionPrompts.length],
    practicalChallenge: practicalChallenges[day % practicalChallenges.length],
    fruitCheckIn: fruitCheckInOptions[day % fruitCheckInOptions.length],
    communityPrompt: communityPrompts[day % communityPrompts.length],
    closingPrayer: closingPrayers[day % closingPrayers.length],
    
    // Legacy fields for backward compatibility
    courageTheme: courageTheme || courageThemes[day % courageThemes.length],
    fruitFocus: fruitCheckInOptions[day % fruitCheckInOptions.length]
  };
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

  // Select 21 practices, customizing based on struggles and model style
  const virtuesPractices = basePractices[virtue];
  const selectedPractices = virtuesPractices.slice(0, 7); // Take first 7, then repeat with variations
  
  for (let day = 1; day <= 21; day++) {
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
    
    // Generate Christian UX content for Christian door
    const christianUX = assessment.door === 'christian' && virtue === 'courage' 
      ? generateChristianUXContent(day, virtue, basePractice.title, '')
      : {};
    
    practices.push({
      day,
      title: `Day ${day}: ${basePractice.title}`,
      steps,
      reflection: `How did practicing ${virtue} feel today? What did you notice?`,
      quote,
      commentary,
      estimatedTime,
      ...christianUX
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
