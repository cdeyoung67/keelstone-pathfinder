// Service factory to provide real or mock services based on environment
import { DatabaseService, getDatabase } from './database';
import { OpenAIService, getOpenAIService } from './openai-service';
import { MockDatabaseService, MockOpenAIService } from './mock-services';

// Check if we have real service configurations
export function hasCosmosDBConfig(): boolean {
  return !!(process.env.COSMOS_DB_ENDPOINT && process.env.COSMOS_DB_KEY);
}

export function hasOpenAIConfig(): boolean {
  return !!(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
}

// Get database service (real or mock)
export function getDatabaseService(): DatabaseService | MockDatabaseService {
  if (hasCosmosDBConfig()) {
    console.log('Using real Cosmos DB service');
    return getDatabase();
  } else {
    console.log('Using mock database service');
    return new MockDatabaseService();
  }
}

// Get OpenAI service (real or mock)
export function getOpenAIServiceSafe(): OpenAIService | MockOpenAIService {
  if (hasOpenAIConfig()) {
    console.log('Using real Azure OpenAI service');
    return getOpenAIService();
  } else {
    console.log('Using mock OpenAI service');
    return new MockOpenAIService();
  }
}
