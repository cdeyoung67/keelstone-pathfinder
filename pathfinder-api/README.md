# Keel Stone Pathfinder API

Azure Functions backend for the Keel Stone Pathfinder application.

## 🏗️ Architecture

- **Azure Functions**: Serverless HTTP endpoints
- **Azure Cosmos DB**: Document database for users, plans, and progress
- **Azure OpenAI**: GPT-4 for personalized plan generation
- **TypeScript**: Type-safe development

## 📋 Prerequisites

- Node.js 18+
- Azure Functions Core Tools
- Azure account with:
  - Cosmos DB account
  - OpenAI resource
  - Function App

## 🚀 Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure local settings**
   Update `local.settings.json` with your Azure resource endpoints and keys:
   ```json
   {
     "Values": {
       "COSMOS_DB_ENDPOINT": "https://your-cosmos-account.documents.azure.com:443/",
       "COSMOS_DB_KEY": "your-cosmos-db-key",
       "AZURE_OPENAI_ENDPOINT": "https://your-openai-resource.openai.azure.com/",
       "AZURE_OPENAI_API_KEY": "your-openai-key",
       "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-4"
     }
   }
   ```

3. **Start local development server**
   ```bash
   npm start
   ```

   The functions will be available at:
   - Health check: `http://localhost:7071/api/health`
   - Intake: `http://localhost:7071/api/intake`
   - Progress: `http://localhost:7071/api/progress`

## 📡 API Endpoints

### POST /api/intake
Creates a personalized 21-day plan based on user assessment.

**Request Body:**
```json
{
  "assessment": {
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "struggles": ["social-media-overwhelm", "decision-paralysis"],
    "door": "secular",
    "timeBudget": "10-15",
    "daypart": "morning",
    "context": "Working parent looking for balance"
  }
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "id": "plan_123",
    "anchor": "Daily anchor statement",
    "virtue": "wisdom",
    "daily": [...],
    "weeklyCheckin": "Weekly reflection question"
  }
}
```

### GET/POST /api/progress
Tracks user progress through their 21-day plan.

**GET** - Retrieve progress: `?planId=plan_123`

**POST** - Update progress:
```json
{
  "planId": "plan_123",
  "updates": [
    {
      "day": 1,
      "completed": true,
      "feedback": "Great first day!",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### GET /api/health
Health check endpoint for monitoring.

## 🗄️ Database Schema

### Users Collection
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastActive": "2024-01-01T00:00:00Z"
}
```

### Plans Collection
```json
{
  "id": "plan_123",
  "userId": "user_123",
  "anchor": "Daily anchor statement",
  "virtue": "wisdom",
  "door": "secular",
  "daily": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Progress Collection
```json
{
  "id": "progress_123",
  "planId": "plan_123", 
  "userId": "user_123",
  "completedDays": [1, 2, 3],
  "skippedDays": [],
  "currentStreak": 3,
  "lastActivity": "2024-01-01T00:00:00Z",
  "feedback": [...]
}
```

## 🚀 Deployment

The API is automatically deployed to Azure Functions when changes are pushed to the `main` branch.

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Azure
func azure functionapp publish ks-pathfinder-api
```

## 🔧 Configuration

### Required Environment Variables
- `COSMOS_DB_ENDPOINT`: Cosmos DB account endpoint
- `COSMOS_DB_KEY`: Cosmos DB access key (dev) or use Managed Identity (prod)
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI service endpoint
- `AZURE_OPENAI_API_KEY`: OpenAI access key (dev) or use Managed Identity (prod)
- `AZURE_OPENAI_DEPLOYMENT_NAME`: GPT-4 deployment name
- `ALLOWED_ORIGINS`: CORS allowed origins

### Database Setup
Create these containers in your Cosmos DB account:
- **Database**: `pathfinder`
- **Containers**:
  - `users` (partition key: `/id`)
  - `plans` (partition key: `/userId`) 
  - `progress` (partition key: `/planId`)

## 📝 Development Notes

- All functions use anonymous auth level for now (add authentication later)
- CORS is configured for local development and production domains
- Error handling includes structured logging for Application Insights
- Database operations use optimistic concurrency where appropriate
- OpenAI responses are parsed and validated before storage
