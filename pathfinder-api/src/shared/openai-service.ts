// Azure OpenAI service for plan generation
import OpenAI from 'openai';
import { Assessment, PersonalizedPlan, DailyPractice, Quote, CardinalVirtue } from './types';

export class OpenAIService {
  private client: OpenAI;
  private deploymentName: string;

  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

    // Configure for Azure OpenAI
    this.client = new OpenAI({
      apiKey,
      baseURL: `${endpoint}/openai/deployments/${this.deploymentName}`,
      defaultQuery: { 'api-version': '2024-02-15-preview' },
      defaultHeaders: {
        'api-key': apiKey,
      },
    });
  }

  async generatePersonalizedPlan(assessment: Assessment): Promise<PersonalizedPlan> {
    const prompt = this.buildPrompt(assessment);
    
    try {
      const response = await this.client.chat.completions.create({
        model: this.deploymentName,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(assessment.door)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return this.parsePlanResponse(content, assessment);
    } catch (error) {
      console.error('Error generating plan:', error);
      throw new Error('Failed to generate personalized plan');
    }
  }

  private getSystemPrompt(door: 'christian' | 'secular'): string {
    const basePrompt = `You are a wise and compassionate guide helping people develop contemplative practices based on the four cardinal virtues: wisdom, courage, justice, and temperance. You create personalized 21-day practice plans that are practical, gentle, and transformative.

Your response must be valid JSON following this exact structure:
{
  "anchor": "Daily anchor statement",
  "weeklyCheckin": "Weekly reflection question",
  "daily": [
    {
      "day": 1,
      "title": "Day 1: Practice Title",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "reflection": "Reflection question",
      "quote": {
        "text": "Quote text",
        "source": "Quote source",
        "type": "biblical|stoic|wisdom"
      },
      "commentary": "Three-paragraph commentary connecting quote to practice",
      "estimatedTime": 10,
      "microHabits": [
        {
          "virtue": "wisdom",
          "approach": "Prepare",
          "action": "Action description",
          "steps": ["Micro-step 1", "Micro-step 2"],
          "timeMinutes": 3
        }
      ]
    }
  ]
}`;

    if (door === 'christian') {
      return basePrompt + `

CHRISTIAN FRAMEWORK:
- Include scripture references (user's preferred Bible version)
- Frame practices in terms of following Christ and growing in faith
- Use gentle, grace-first language that emphasizes God's love
- Include opening and closing prayers for each day
- Connect practices to the Fruit of the Spirit
- Reference biblical examples of virtue when appropriate`;
    } else {
      return basePrompt + `

SECULAR FRAMEWORK:
- Draw from Stoic philosophy, classical virtue ethics, and modern psychology
- Use inclusive language that doesn't assume religious belief
- Reference historical examples and philosophical wisdom
- Focus on human flourishing and character development
- Include mindfulness and reflection practices`;
    }
  }

  private buildPrompt(assessment: Assessment): string {
    const strugglesText = assessment.struggles.join(', ');
    const timeText = assessment.timeBudget === '5-10' ? '5-10 minutes' : 
                    assessment.timeBudget === '10-15' ? '10-15 minutes' : '15-20 minutes';
    
    return `Create a personalized 21-day practice plan for ${assessment.firstName} who is struggling with: ${strugglesText}.

User Details:
- Name: ${assessment.firstName} ${assessment.lastName}
- Primary virtue to focus on: ${assessment.primaryVirtue}
- Time budget per day: ${timeText}
- Preferred practice time: ${assessment.daypart}
- Door preference: ${assessment.door}
${assessment.bibleVersion ? `- Bible version: ${assessment.bibleVersion}` : ''}
${assessment.context ? `- Additional context: ${assessment.context}` : ''}

Focus the entire 21-day plan on developing ${assessment.primaryVirtue} through four complementary approaches each day:
1. PREPARE: Prayer/centering practice (${assessment.door === 'christian' ? 'prayer-based' : 'mindfulness-based'})
2. ACT: One small brave action toward ${assessment.primaryVirtue}
3. SERVE: One micro-service expressing ${assessment.primaryVirtue} toward others
4. REFLECT: Gentle self-examination and course correction

Each day should have 4 micro-habits totaling ${timeText}. Make the practices:
- Specific to their struggles with ${strugglesText}
- Appropriate for ${assessment.daypart} practice
- Progressive in difficulty over 21 days
- Practical and immediately actionable

Return only valid JSON with no additional text or formatting.`;
  }

  private parsePlanResponse(content: string, assessment: Assessment): PersonalizedPlan {
    try {
      // Clean the response - remove any markdown formatting or extra text
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanContent);

      // Validate the structure
      if (!parsed.anchor || !parsed.daily || !Array.isArray(parsed.daily)) {
        throw new Error('Invalid plan structure');
      }

      // Create the personalized plan
      const plan: PersonalizedPlan = {
        id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: assessment.id,
        assessment,
        anchor: parsed.anchor,
        virtue: assessment.primaryVirtue,
        door: assessment.door,
        daily: parsed.daily.map((day: any, index: number) => ({
          day: index + 1,
          title: day.title || `Day ${index + 1}: ${assessment.primaryVirtue} Practice`,
          steps: day.steps || [],
          reflection: day.reflection || 'How did today\'s practice feel?',
          quote: day.quote || this.getDefaultQuote(assessment.primaryVirtue, assessment.door),
          commentary: day.commentary || '',
          estimatedTime: day.estimatedTime || this.getDefaultTime(assessment.timeBudget),
          microHabits: day.microHabits || [],
          // Add Christian UX fields if applicable
          ...(assessment.door === 'christian' && {
            openingPrayer: day.openingPrayer,
            closingPrayer: day.closingPrayer,
            scriptureAnchor: day.scriptureAnchor,
            wisdomBridge: day.wisdomBridge,
            reflectionPrompt: day.reflectionPrompt,
            practicalChallenge: day.practicalChallenge,
            fruitCheckIn: day.fruitCheckIn,
            communityPrompt: day.communityPrompt
          })
        })),
        weeklyCheckin: parsed.weeklyCheckin || this.getDefaultWeeklyCheckin(assessment.primaryVirtue),
        stretchPractice: parsed.stretchPractice || 'Consider sharing one insight from this practice with a friend.',
        createdAt: new Date(),
        version: 'gpt-4-production'
      };

      return plan;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private getDefaultQuote(virtue: CardinalVirtue, door: 'christian' | 'secular'): Quote {
    const quotes = {
      christian: {
        wisdom: { text: "The fear of the Lord is the beginning of wisdom.", source: "Proverbs 9:10", type: "biblical" as const },
        courage: { text: "Be strong and courageous! Do not be afraid or discouraged.", source: "Joshua 1:9", type: "biblical" as const },
        justice: { text: "Learn to do right; seek justice. Defend the oppressed.", source: "Isaiah 1:17", type: "biblical" as const },
        temperance: { text: "Like a city whose walls are broken through is a person who lacks self-control.", source: "Proverbs 25:28", type: "biblical" as const }
      },
      secular: {
        wisdom: { text: "The only true wisdom is in knowing you know nothing.", source: "Socrates", type: "wisdom" as const },
        courage: { text: "Courage is not the absence of fear, but action in spite of it.", source: "Seneca", type: "stoic" as const },
        justice: { text: "Justice is the crowning glory of the virtues.", source: "Cicero", type: "wisdom" as const },
        temperance: { text: "Moderation in all things, including moderation.", source: "Oscar Wilde", type: "wisdom" as const }
      }
    };

    return quotes[door][virtue];
  }

  private getDefaultTime(timeBudget: string): number {
    switch (timeBudget) {
      case '5-10': return 7;
      case '10-15': return 12;
      case '15-20': return 17;
      default: return 10;
    }
  }

  private getDefaultWeeklyCheckin(virtue: CardinalVirtue): string {
    const checkins = {
      wisdom: "This week, what's one thing you understand more clearly about yourself or your situation?",
      courage: "This week, what's one brave step you took that you're proud of?",
      justice: "This week, how did you show fairness or compassion to yourself or others?",
      temperance: "This week, where did you find good balance or healthy boundaries?"
    };

    return checkins[virtue];
  }
}

// Singleton instance
let openaiInstance: OpenAIService | null = null;

export function getOpenAIService(): OpenAIService {
  if (!openaiInstance) {
    openaiInstance = new OpenAIService();
  }
  return openaiInstance;
}
