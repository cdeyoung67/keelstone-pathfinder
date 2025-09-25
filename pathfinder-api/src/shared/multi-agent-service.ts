// Multi-Agent Service for Keel Stone Pathfinder
// Orchestrates specialized agents for personalized customer journey

import axios from 'axios';
import { Assessment, PersonalizedPlan, CardinalVirtue, Door } from './types';

// Agent Configuration
interface AgentConfig {
    endpoint: string;
    apiKey: string;
    apiVersion: string;
    deploymentName: string;
    modelName: string;
    maxTokens: number;
    timeout: number;
}

// Agent Types
export type AgentType = 'concierge' | 'christian' | 'secular' | 'wisdom' | 'courage' | 'justice' | 'temperance';

// Multi-Agent Service Class
export class MultiAgentService {
    private agents: Map<AgentType, AgentConfig>;

    constructor() {
        this.agents = new Map();
        this.initializeAgents();
    }

    private initializeAgents() {
        // GPT-5-Chat Agents (Conversational)
        this.agents.set('concierge', {
            endpoint: process.env.ENDPOINT_GPT5_CHAT || '',
            apiKey: process.env.API_KEY_GPT5_CHAT || '',
            apiVersion: process.env.API_VERSION_GPT5_CHAT || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_CHAT || '',
            modelName: 'gpt-5-chat',
            maxTokens: 1200,
            timeout: 45000
        });

        this.agents.set('christian', {
            endpoint: process.env.ENDPOINT_GPT5_CHAT || '',
            apiKey: process.env.API_KEY_GPT5_CHAT || '',
            apiVersion: process.env.API_VERSION_GPT5_CHAT || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_CHAT || '',
            modelName: 'gpt-5-chat',
            maxTokens: 1500,
            timeout: 45000
        });

        this.agents.set('secular', {
            endpoint: process.env.ENDPOINT_GPT5_CHAT || '',
            apiKey: process.env.API_KEY_GPT5_CHAT || '',
            apiVersion: process.env.API_VERSION_GPT5_CHAT || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_CHAT || '',
            modelName: 'gpt-5-chat',
            maxTokens: 1500,
            timeout: 45000
        });

        // GPT-5-Mini Agents (SME - Subject Matter Experts)
        this.agents.set('wisdom', {
            endpoint: process.env.ENDPOINT_GPT5_MINI || '',
            apiKey: process.env.API_KEY_GPT5_MINI || '',
            apiVersion: process.env.API_VERSION_GPT5_MINI || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_MINI || '',
            modelName: 'gpt-5-mini',
            maxTokens: 1000,
            timeout: 30000
        });

        this.agents.set('courage', {
            endpoint: process.env.ENDPOINT_GPT5_MINI || '',
            apiKey: process.env.API_KEY_GPT5_MINI || '',
            apiVersion: process.env.API_VERSION_GPT5_MINI || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_MINI || '',
            modelName: 'gpt-5-mini',
            maxTokens: 800,
            timeout: 30000
        });

        this.agents.set('justice', {
            endpoint: process.env.ENDPOINT_GPT5_MINI || '',
            apiKey: process.env.API_KEY_GPT5_MINI || '',
            apiVersion: process.env.API_VERSION_GPT5_MINI || '2024-04-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_MINI || '',
            modelName: 'gpt-5-mini',
            maxTokens: 1000,
            timeout: 30000
        });

        // GPT-5-Nano Agent (Ultra-Fast Habits)
        this.agents.set('temperance', {
            endpoint: process.env.ENDPOINT_GPT5_NANO || '',
            apiKey: process.env.API_KEY_GPT5_NANO || '',
            apiVersion: process.env.API_VERSION_GPT5_NANO || '2024-12-01-preview',
            deploymentName: process.env.DEPLOYMENT_GPT5_NANO || '',
            modelName: 'gpt-5-nano',
            maxTokens: 16384, // Higher limit for GPT-5-Nano to get visible output
            timeout: 15000
        });
    }

    // Agent Selection Logic
    public selectAgents(assessment: Assessment): { primary: AgentType; virtue: AgentType } {
        // Primary agent based on door (Christian/Secular)
        const primary: AgentType = assessment.door === 'christian' ? 'christian' : 'secular';
        
        // Virtue agent based on primary virtue from struggles
        const virtue: AgentType = assessment.primaryVirtue;
        
        return { primary, virtue };
    }

    // Specialized System Prompts
    private getSystemPrompt(agent: AgentType, assessment: Assessment): string {
        const baseContext = `You are part of the Keel Stone Pathfinder system, helping ${assessment.firstName} find inner steadiness through contemplative practices. Their primary struggle area is ${assessment.primaryVirtue}, and they prefer ${assessment.timeBudget} minute practices during ${assessment.daypart}.`;

        switch (agent) {
            case 'concierge':
                return `${baseContext}

You are the Concierge Agent - the wise guide who orchestrates the user's journey. You:
- Welcome users with warmth and understanding
- Assess their current state and needs
- Route them to appropriate specialized agents
- Provide journey overview and next steps
- Maintain a contemplative, professional tone

Focus on guidance, clarity, and gentle direction toward their path of inner steadiness.`;

            case 'christian':
                return `${baseContext}

You are the Christian Path Agent, integrating faith, scripture, and theological wisdom. You:
- Draw from biblical wisdom and Christian contemplative traditions
- Include relevant scripture references (${assessment.bibleVersion || 'NIV'} preferred)
- Frame practices through grace, not performance
- Connect daily struggles to spiritual growth
- Use language of faith: prayer, scripture, grace, wisdom, growth

Your tone is grace-filled, biblically grounded, and encouraging. You help believers see God's wisdom in their daily challenges.`;

            case 'secular':
                return `${baseContext}

You are the Secular Path Agent, drawing from philosophical wisdom and practical ethics. You:
- Reference classical virtues, Stoic insights, and philosophical traditions
- Use wisdom from thinkers like Marcus Aurelius, Aristotle, and modern psychology
- Focus on rational approaches to virtue and character development
- Frame practices through wisdom, reason, and human flourishing
- Avoid religious language while maintaining depth and meaning

Your tone is thoughtful, wise, and grounded in human experience and philosophical insight.`;

            case 'wisdom':
                return `${baseContext}

You are the Wisdom Agent, specializing in decision-making and complex reasoning. You:
- Help users navigate difficult choices and decisions
- Break down complex problems into clear, actionable steps
- Provide frameworks for thinking through challenges
- Draw connections between different aspects of a situation
- Offer multiple perspectives and considerations

Your responses are structured, logical, and provide clear pathways forward for complex decisions.`;

            case 'courage':
                return `${baseContext}

You are the Courage Agent, specializing in overcoming fear and taking action. You:
- Help users move from fear to confident action
- Provide practical steps to overcome perfectionism and fear of failure
- Encourage bold but wise action
- Break down intimidating challenges into manageable steps
- Celebrate small wins and progress

Your tone is encouraging, direct, and action-oriented. You help people take the brave next step.`;

            case 'justice':
                return `${baseContext}

You are the Justice Agent, specializing in relationships and ethical reasoning. You:
- Help users navigate interpersonal conflicts and relationship challenges
- Provide guidance on fairness, boundaries, and healthy relationships
- Address work-life balance and saying no appropriately
- Consider multiple perspectives in relational situations
- Focus on principled, fair solutions

Your responses consider all parties involved and seek win-win, principled outcomes.`;

            case 'temperance':
                return `${baseContext}

You are the Temperance Agent, specializing in habit formation and self-control. You:
- Provide quick, practical advice for building healthy habits
- Help with moderation and self-control challenges
- Offer simple, actionable daily practices
- Focus on small, sustainable changes
- Address digital overwhelm, eating habits, and daily routines

Your responses are concise, immediately actionable, and focused on small wins that build momentum.`;

            default:
                return baseContext;
        }
    }

    // Call Individual Agent
    private async callAgent(
        agent: AgentType, 
        prompt: string, 
        assessment: Assessment,
        context?: string
    ): Promise<string> {
        const config = this.agents.get(agent);
        if (!config || !config.endpoint || !config.apiKey) {
            throw new Error(`Agent ${agent} not configured properly`);
        }

        const messages = [
            {
                role: 'system',
                content: this.getSystemPrompt(agent, assessment)
            },
            {
                role: 'user',
                content: context ? `${context}\n\n${prompt}` : prompt
            }
        ];

        try {
            const response = await axios.post(
                `${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${config.apiVersion}`,
                {
                    messages,
                    max_completion_tokens: config.maxTokens,
                    model: config.modelName
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': config.apiKey
                    },
                    timeout: config.timeout
                }
            );

            const content = response.data.choices[0].message.content;
            if (!content) {
                throw new Error(`No content received from ${agent} agent`);
            }

            return content;
        } catch (error: any) {
            console.error(`Error calling ${agent} agent:`, error.message);
            throw new Error(`Failed to get response from ${agent} agent: ${error.message}`);
        }
    }

    // Generate Complete Personalized Plan
    public async generatePersonalizedPlan(assessment: Assessment): Promise<PersonalizedPlan> {
        console.log(`🤖 Multi-agent plan generation for ${assessment.firstName}`);
        
        // Step 1: Concierge orchestrates the journey
        const conciergePrompt = `Welcome ${assessment.firstName} to their Pathfinder journey. They've shared these struggles: ${assessment.struggles.join(', ')}. 

Create a warm welcome message and brief overview of their personalized 21-day journey focusing on ${assessment.primaryVirtue}. Keep it encouraging and set expectations for their ${assessment.door} path.`;

        const welcome = await this.callAgent('concierge', conciergePrompt, assessment);

        // Step 2: Select agents for plan generation
        const agents = this.selectAgents(assessment);
        
        // Step 3: Primary path agent creates the plan structure
        const planPrompt = `Create a personalized 21-day practice plan for ${assessment.firstName}. 

Key details:
- Primary virtue: ${assessment.primaryVirtue}
- Struggles: ${assessment.struggles.join(', ')}
- Time budget: ${assessment.timeBudget} minutes
- Preferred time: ${assessment.daypart}
- Additional context: ${assessment.context || 'None provided'}

Generate a structured 21-day plan with:
1. Daily anchor statement
2. Week 1 (Days 1-7): Foundation building
3. Week 2 (Days 8-14): Deepening practice  
4. Week 3 (Days 15-21): Integration and growth
5. Weekly check-in guidance

Each day should include practical steps, reflection questions, and wisdom appropriate for the ${assessment.door} path.`;

        const planContent = await this.callAgent(agents.primary, planPrompt, assessment);

        // Step 4: Virtue specialist provides specific guidance
        const virtuePrompt = `Enhance this 21-day plan with specialized ${assessment.primaryVirtue} guidance. Focus on practical daily exercises, micro-habits, and specific techniques for developing ${assessment.primaryVirtue}. 

Provide 3-5 specific practices or techniques that can be woven throughout the 21 days.`;

        const virtueGuidance = await this.callAgent(agents.virtue, virtuePrompt, assessment, planContent);

        // Step 5: Create the structured plan object
        const plan: PersonalizedPlan = {
            id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: '', // Will be set by caller
            assessment,
            anchor: `Today I practice ${assessment.primaryVirtue} — small, consistent, unhurried.`,
            virtue: assessment.primaryVirtue,
            door: assessment.door,
            daily: this.parsePlanContent(planContent, virtueGuidance, assessment),
            weeklyCheckin: `How has your practice of ${assessment.primaryVirtue} evolved this week? What's working well, and what needs adjustment?`,
            createdAt: new Date(),
            version: 'multi-agent-v1.0'
        };

        console.log(`✅ Multi-agent plan generated: ${plan.daily.length} days`);
        return plan;
    }

    // Parse plan content into structured daily practices
    private parsePlanContent(planContent: string, virtueGuidance: string, assessment: Assessment): any[] {
        // For now, create a structured 21-day plan
        // In production, this would parse the AI-generated content more sophisticatedly
        
        const daily = [];
        for (let day = 1; day <= 21; day++) {
            const week = Math.ceil(day / 7);
            const dayInWeek = ((day - 1) % 7) + 1;
            
            let theme = '';
            if (week === 1) theme = 'Foundation';
            else if (week === 2) theme = 'Deepening';
            else theme = 'Integration';

            daily.push({
                day,
                title: `Day ${day}: ${theme} in ${assessment.primaryVirtue}`,
                steps: [
                    "Begin with three mindful breaths",
                    `Practice ${assessment.primaryVirtue} in one small action`,
                    "Reflect on your experience",
                    week === 3 && dayInWeek === 7 ? "Weekly integration review" : "Set tomorrow's intention"
                ],
                reflection: `How did you experience ${assessment.primaryVirtue} today? What did you notice?`,
                quote: {
                    text: this.getQuoteForDay(day, assessment.primaryVirtue, assessment.door),
                    source: assessment.door === 'christian' ? 'Scripture' : 'Ancient Wisdom',
                    type: assessment.door === 'christian' ? 'biblical' : 'wisdom'
                },
                commentary: `Day ${day} focuses on ${theme.toLowerCase()} your practice of ${assessment.primaryVirtue}. ${this.getCommentaryForDay(day, assessment.primaryVirtue)}.`,
                estimatedTime: parseInt(assessment.timeBudget.split('-')[0]) || 5
            });
        }

        return daily;
    }

    // Helper methods for quotes and commentary
    private getQuoteForDay(day: number, virtue: CardinalVirtue, door: Door): string {
        const quotes = {
            wisdom: {
                christian: "Trust in the Lord with all your heart and lean not on your own understanding.",
                secular: "The only true wisdom is in knowing you know nothing. - Socrates"
            },
            courage: {
                christian: "Be strong and courageous! Do not be afraid or discouraged.",
                secular: "Courage is not the absence of fear, but action in spite of it."
            },
            justice: {
                christian: "Let justice roll on like a river, righteousness like a never-failing stream.",
                secular: "Justice is truth in action. - Benjamin Disraeli"
            },
            temperance: {
                christian: "Like a city whose walls are broken through is a person who lacks self-control.",
                secular: "Moderation in all things. - Aristotle"
            }
        };

        return quotes[virtue][door];
    }

    private getCommentaryForDay(day: number, virtue: CardinalVirtue): string {
        const week = Math.ceil(day / 7);
        if (week === 1) return `building the foundation of ${virtue} through small, consistent practices`;
        if (week === 2) return `deepening your understanding and application of ${virtue}`;
        return `integrating ${virtue} as a natural part of your daily rhythm`;
    }

    // Quick Agent Consultation (for ongoing support)
    public async consultAgent(
        agentType: AgentType, 
        question: string, 
        assessment: Assessment,
        context?: string
    ): Promise<string> {
        console.log(`🤖 Consulting ${agentType} agent for ${assessment.firstName}`);
        return await this.callAgent(agentType, question, assessment, context);
    }
}
