#!/usr/bin/env node

/**
 * Local Development Server - Zero Cloud Dependencies
 * 
 * This server provides the exact same API endpoints as Azure Functions
 * but runs as a simple Express server with mock services.
 * 
 * Benefits:
 * - No Azure Functions Core Tools needed
 * - No cloud dependencies
 * - Fast startup and iteration
 * - Same API contract as production
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 7071; // Same port as Azure Functions

// Middleware
app.use(cors());
app.use(express.json());

// Mock Services (zero external dependencies)
const mockServices = {
  openai: {
    async generatePlan(assessment) {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: `plan_${Date.now()}`,
        userId: `user_${Date.now()}`,
        door: assessment.door,
        practices: Array.from({length: 21}, (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1}: Mock Practice`,
          description: `This is a mock practice for ${assessment.door} path`,
          duration: assessment.timeBudget,
          completed: false
        })),
        createdAt: new Date().toISOString()
      };
    }
  },
  
  database: {
    plans: new Map(),
    progress: new Map(),
    
    async savePlan(plan) {
      this.plans.set(plan.id, plan);
      return plan;
    },
    
    async getPlan(planId) {
      return this.plans.get(planId);
    },
    
    async saveProgress(progress) {
      this.progress.set(progress.planId, progress);
      return progress;
    }
  }
};

// Routes (identical to Azure Functions)
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check called');
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      functions: 'up',
      openai: 'mock',
      database: 'mock'
    },
    version: '1.0.0-dev'
  });
});

app.post('/api/intake', async (req, res) => {
  console.log('📝 Intake called:', req.body.assessment?.firstName);
  
  try {
    const { assessment } = req.body;
    
    if (!assessment || !assessment.firstName || !assessment.email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['assessment.firstName', 'assessment.email']
      });
    }
    
    // Generate plan using mock OpenAI
    const plan = await mockServices.openai.generatePlan(assessment);
    
    // Save to mock database
    await mockServices.database.savePlan(plan);
    
    console.log(`✅ Generated plan ${plan.id} for ${assessment.firstName}`);
    
    res.json({
      success: true,
      plan,
      message: 'Plan generated successfully (mock mode)'
    });
    
  } catch (error) {
    console.error('❌ Intake error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/progress', async (req, res) => {
  console.log('📊 Progress update called');
  
  try {
    const { planId, day, completed } = req.body;
    
    if (!planId || day === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['planId', 'day']
      });
    }
    
    const progress = {
      planId,
      day,
      completed: completed || false,
      timestamp: new Date().toISOString()
    };
    
    await mockServices.database.saveProgress(progress);
    
    console.log(`✅ Progress updated: Plan ${planId}, Day ${day}`);
    
    res.json({
      success: true,
      progress,
      message: 'Progress updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Progress error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Keel Stone Pathfinder - Local Development Server');
  console.log('=================================================');
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log('🔧 Mode: Development (Mock Services)');
  console.log('💰 Cost: $0 (No cloud dependencies)');
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  /api/health    - Health check`);
  console.log(`  POST /api/intake    - Create personalized plan`);
  console.log(`  POST /api/progress  - Update progress`);
  console.log('');
  console.log('🧪 Run tests: node test-intake.js');
  console.log('⏹️  Stop server: Ctrl+C');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development server...');
  process.exit(0);
});
