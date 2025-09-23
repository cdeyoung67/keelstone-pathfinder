// Azure Cosmos DB service
import { CosmosClient, Database, Container } from '@azure/cosmos';
import { DefaultAzureCredential } from '@azure/identity';
import { UserDocument, PlanDocument, ProgressDocument } from './types';

export class DatabaseService {
  private client: CosmosClient;
  private database: Database;
  private usersContainer: Container;
  private plansContainer: Container;
  private progressContainer: Container;

  constructor() {
    // Initialize Cosmos client with managed identity in production
    // or connection string for local development
    const endpoint = process.env.COSMOS_DB_ENDPOINT!;
    const key = process.env.COSMOS_DB_KEY;

    if (key) {
      // Local development with connection string
      this.client = new CosmosClient({ endpoint, key });
    } else {
      // Production with managed identity
      this.client = new CosmosClient({
        endpoint,
        aadCredentials: new DefaultAzureCredential()
      });
    }

    this.database = this.client.database('pathfinder');
    this.usersContainer = this.database.container('users');
    this.plansContainer = this.database.container('plans');
    this.progressContainer = this.database.container('progress');
  }

  // User operations
  async createUser(user: Omit<UserDocument, 'id'>): Promise<UserDocument> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userDoc: UserDocument = { id, ...user };
    
    const { resource } = await this.usersContainer.items.create(userDoc);
    return resource as UserDocument;
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    const query = {
      query: 'SELECT * FROM users u WHERE u.email = @email',
      parameters: [{ name: '@email', value: email }]
    };

    const { resources } = await this.usersContainer.items.query<UserDocument>(query).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }

  async updateUserLastActive(userId: string): Promise<void> {
    const { resource: user } = await this.usersContainer.item(userId).read<UserDocument>();
    if (user) {
      user.lastActive = new Date();
      await this.usersContainer.item(userId).replace(user);
    }
  }

  // Plan operations
  async createPlan(plan: PlanDocument): Promise<PlanDocument> {
    const { resource } = await this.plansContainer.items.create(plan);
    return resource as PlanDocument;
  }

  async getPlanById(planId: string): Promise<PlanDocument | null> {
    try {
      const { resource } = await this.plansContainer.item(planId).read<PlanDocument>();
      return resource || null;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      throw error;
    }
  }

  async getPlansByUserId(userId: string): Promise<PlanDocument[]> {
    const query = {
      query: 'SELECT * FROM plans p WHERE p.userId = @userId ORDER BY p.createdAt DESC',
      parameters: [{ name: '@userId', value: userId }]
    };

    const { resources } = await this.plansContainer.items.query<PlanDocument>(query).fetchAll();
    return resources;
  }

  // Progress operations
  async createProgress(progress: ProgressDocument): Promise<ProgressDocument> {
    const { resource } = await this.progressContainer.items.create(progress);
    return resource as ProgressDocument;
  }

  async getProgressByPlanId(planId: string): Promise<ProgressDocument | null> {
    const query = {
      query: 'SELECT * FROM progress p WHERE p.planId = @planId',
      parameters: [{ name: '@planId', value: planId }]
    };

    const { resources } = await this.progressContainer.items.query<ProgressDocument>(query).fetchAll();
    return resources.length > 0 ? resources[0] : null;
  }

  async updateProgress(progress: ProgressDocument): Promise<ProgressDocument> {
    const { resource } = await this.progressContainer.item(progress.id).replace(progress);
    return resource as ProgressDocument;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.database.read();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let dbInstance: DatabaseService | null = null;

export function getDatabase(): DatabaseService {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
}
