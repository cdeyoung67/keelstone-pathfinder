// Mock services for local testing without Azure dependencies
import { Assessment, PersonalizedPlan, UserDocument, PlanDocument, ProgressDocument } from './types';

export class MockDatabaseService {
  private users: Map<string, UserDocument> = new Map();
  private plans: Map<string, PlanDocument> = new Map();
  private progress: Map<string, ProgressDocument> = new Map();

  async createUser(user: Omit<UserDocument, 'id'>): Promise<UserDocument> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userDoc: UserDocument = { id, ...user };
    this.users.set(id, userDoc);
    console.log(`Mock: Created user ${id}`);
    return userDoc;
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    console.log(`Mock: Found user by email ${email}:`, !!user);
    return user || null;
  }

  async updateUserLastActive(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastActive = new Date();
      console.log(`Mock: Updated last active for user ${userId}`);
    }
  }

  async createPlan(plan: PlanDocument): Promise<PlanDocument> {
    this.plans.set(plan.id, plan);
    console.log(`Mock: Created plan ${plan.id}`);
    return plan;
  }

  async getPlanById(planId: string): Promise<PlanDocument | null> {
    const plan = this.plans.get(planId);
    console.log(`Mock: Found plan ${planId}:`, !!plan);
    return plan || null;
  }

  async getPlansByUserId(userId: string): Promise<PlanDocument[]> {
    const userPlans = Array.from(this.plans.values()).filter(p => p.userId === userId);
    console.log(`Mock: Found ${userPlans.length} plans for user ${userId}`);
    return userPlans;
  }

  async createProgress(progress: ProgressDocument): Promise<ProgressDocument> {
    this.progress.set(progress.id, progress);
    console.log(`Mock: Created progress ${progress.id}`);
    return progress;
  }

  async getProgressByPlanId(planId: string): Promise<ProgressDocument | null> {
    const prog = Array.from(this.progress.values()).find(p => p.planId === planId);
    console.log(`Mock: Found progress for plan ${planId}:`, !!prog);
    return prog || null;
  }

  async updateProgress(progress: ProgressDocument): Promise<ProgressDocument> {
    this.progress.set(progress.id, progress);
    console.log(`Mock: Updated progress ${progress.id}`);
    return progress;
  }

  async healthCheck(): Promise<boolean> {
    console.log('Mock: Database health check passed');
    return true;
  }
}

export class MockOpenAIService {
  async generatePersonalizedPlan(assessment: Assessment): Promise<PersonalizedPlan> {
    console.log(`Mock: Generating plan for ${assessment.firstName} ${assessment.lastName}`);
    console.log(`Mock: Primary virtue: ${assessment.primaryVirtue}, Door: ${assessment.door}`);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const plan: PersonalizedPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: assessment.id,
      assessment,
      anchor: this.generateMockAnchor(assessment.primaryVirtue, assessment.door),
      virtue: assessment.primaryVirtue,
      door: assessment.door,
      daily: this.generateMockDailyPractices(assessment),
      weeklyCheckin: this.generateMockWeeklyCheckin(assessment.primaryVirtue),
      stretchPractice: "Consider sharing one insight from this practice with a friend or family member.",
      createdAt: new Date(),
      version: 'mock-v1.0'
    };

    console.log(`Mock: Generated ${plan.daily.length} daily practices`);
    return plan;
  }

  private generateMockAnchor(virtue: string, door: string): string {
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
    
    return anchors[door as keyof typeof anchors][virtue as keyof typeof anchors.christian];
  }

  private generateMockWeeklyCheckin(virtue: string): string {
    const checkins = {
      wisdom: "This week, what's one thing you understand more clearly about yourself or your situation?",
      courage: "This week, what's one brave step you took that you're proud of?",
      justice: "This week, how did you show fairness or compassion to yourself or others?",
      temperance: "This week, where did you find good balance or healthy boundaries?"
    };

    return checkins[virtue as keyof typeof checkins];
  }

  private generateMockDailyPractices(assessment: Assessment): any[] {
    const practices = [];
    
    for (let day = 1; day <= 21; day++) {
      practices.push({
        day,
        title: `Day ${day}: ${assessment.primaryVirtue.charAt(0).toUpperCase() + assessment.primaryVirtue.slice(1)} Practice`,
        steps: [
          `Mock step 1 for ${assessment.primaryVirtue}`,
          `Mock step 2 addressing ${assessment.struggles[0] || 'general challenges'}`,
          `Mock step 3 for ${assessment.timeBudget} minute practice`
        ],
        reflection: `How did today's ${assessment.primaryVirtue} practice feel?`,
        quote: {
          text: `Mock ${assessment.door} quote for ${assessment.primaryVirtue}`,
          source: assessment.door === 'christian' ? 'Proverbs 1:7' : 'Marcus Aurelius',
          type: assessment.door === 'christian' ? 'biblical' : 'stoic'
        },
        commentary: `Mock commentary connecting ${assessment.primaryVirtue} to daily life through ${assessment.door} lens.`,
        estimatedTime: assessment.timeBudget === '5-10' ? 7 : assessment.timeBudget === '10-15' ? 12 : 17,
        microHabits: [
          {
            virtue: assessment.primaryVirtue,
            approach: 'Prepare',
            action: `Mock preparation for ${assessment.primaryVirtue}`,
            steps: ['Mock prep step 1', 'Mock prep step 2'],
            timeMinutes: 2
          }
        ]
      });
    }
    
    return practices;
  }
}

// Global mock instances
let mockDb: MockDatabaseService | null = null;
let mockOpenAI: MockOpenAIService | null = null;

export function getMockDatabase(): MockDatabaseService {
  if (!mockDb) {
    mockDb = new MockDatabaseService();
  }
  return mockDb;
}

export function getMockOpenAIService(): MockOpenAIService {
  if (!mockOpenAI) {
    mockOpenAI = new MockOpenAIService();
  }
  return mockOpenAI;
}
