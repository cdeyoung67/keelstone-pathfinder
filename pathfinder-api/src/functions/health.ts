import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getDatabase } from '../shared/database';

export async function health(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Health check triggered');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (request.method === 'OPTIONS') {
    return {
      status: 200,
      headers: corsHeaders
    };
  }

  try {
    const db = getDatabase();
    const dbHealthy = await db.healthCheck();

    const healthStatus = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'up' : 'down',
        functions: 'up'
      },
      version: '1.0.0'
    };

    return {
      status: dbHealthy ? 200 : 503,
      headers: corsHeaders,
      jsonBody: healthStatus
    };

  } catch (error: any) {
    context.error('Health check failed:', error);

    return {
      status: 503,
      headers: corsHeaders,
      jsonBody: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          database: 'unknown',
          functions: 'up'
        },
        version: '1.0.0'
      }
    };
  }
}

app.http('health', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'health',
  handler: health,
});