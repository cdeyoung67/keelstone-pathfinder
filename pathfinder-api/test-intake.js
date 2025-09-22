// Comprehensive test script to verify Azure Functions endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:7071/api';

// Test data
const testAssessments = {
  secular: {
    assessment: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      struggles: ["social-media-overwhelm", "decision-paralysis"],
      door: "secular",
      timeBudget: "10-15",
      daypart: "morning",
      context: "Working parent looking for balance and focus"
    }
  },
  christian: {
    assessment: {
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com",
      struggles: ["fear-failure", "perfectionism", "burnout-exhaustion"],
      door: "christian",
      bibleVersion: "niv",
      timeBudget: "15-20",
      daypart: "evening",
      context: "Looking for spiritual growth and courage in daily life"
    }
  }
};

async function testHealthEndpoint() {
  console.log('🏥 Testing health endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    
    console.log('✅ Health check status:', response.status);
    console.log('📊 Health data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error testing health endpoint:', error.response?.data || error.message);
    return false;
  }
}

async function testIntakeEndpoint(testName, testData) {
  console.log(`\n📝 Testing ${testName} intake endpoint...`);
  console.log('📤 Request body:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await axios.post(`${BASE_URL}/intake-test`, testData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ Response status:', response.status);
    
    if (response.data.success) {
      const plan = response.data.plan;
      console.log('📋 Plan generated successfully:');
      console.log(`  - Plan ID: ${plan.id}`);
      console.log(`  - Primary virtue: ${plan.virtue}`);
      console.log(`  - Door: ${plan.door}`);
      console.log(`  - Daily practices: ${plan.daily.length}`);
      console.log(`  - Anchor: ${plan.anchor}`);
      console.log(`  - Weekly checkin: ${plan.weeklyCheckin}`);
      
      // Test a few daily practices
      if (plan.daily.length > 0) {
        console.log('📅 Sample daily practice:');
        const day1 = plan.daily[0];
        console.log(`  - Day ${day1.day}: ${day1.title}`);
        console.log(`  - Steps: ${day1.steps.length}`);
        console.log(`  - Estimated time: ${day1.estimatedTime} minutes`);
        console.log(`  - Quote: "${day1.quote.text}" - ${day1.quote.source}`);
      }
      
      return { success: true, plan };
    } else {
      console.log('❌ Plan generation failed:', response.data.error);
      return { success: false, error: response.data.error };
    }
    
  } catch (error) {
    console.error('❌ Error testing intake endpoint:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

async function testProgressEndpoint(planId) {
  console.log(`\n📈 Testing progress endpoint with plan ID: ${planId}...`);
  
  try {
    // Test GET progress
    console.log('📥 Getting initial progress...');
    let response = await axios.get(`${BASE_URL}/progress?planId=${planId}`);
    console.log('✅ Initial progress retrieved:', response.data);
    
    // Test POST progress update
    console.log('📤 Updating progress...');
    const progressUpdate = {
      planId: planId,
      updates: [
        {
          day: 1,
          completed: true,
          feedback: "Great first day! Felt very centered.",
          timestamp: new Date().toISOString()
        },
        {
          day: 2,
          completed: true,
          feedback: "Building momentum!",
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    response = await axios.post(`${BASE_URL}/progress`, progressUpdate, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Progress updated:', response.data);
    
    // Test GET progress again to see changes
    console.log('📥 Getting updated progress...');
    response = await axios.get(`${BASE_URL}/progress?planId=${planId}`);
    console.log('✅ Updated progress retrieved:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing progress endpoint:', error.response?.data || error.message);
    return false;
  }
}

async function testValidationErrors() {
  console.log('\n🚫 Testing validation errors...');
  
  try {
    // Test missing fields
    const invalidData = {
      assessment: {
        firstName: "Test",
        // Missing required fields
      }
    };
    
    const response = await axios.post(`${BASE_URL}/intake-test`, invalidData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('❌ Should have failed validation but got:', response.status);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation error handled correctly:', error.response.data);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Azure Functions Tests');
  console.log('=====================================\n');
  
  // Test 1: Health check
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.log('❌ Health check failed, stopping tests');
    return;
  }
  
  // Test 2: Validation errors
  await testValidationErrors();
  
  // Test 3: Secular intake
  const secularResult = await testIntakeEndpoint('SECULAR', testAssessments.secular);
  
  // Test 4: Christian intake  
  const christianResult = await testIntakeEndpoint('CHRISTIAN', testAssessments.christian);
  
  // Test 5: Progress tracking (if we have a successful plan)
  if (secularResult.success && secularResult.plan) {
    await testProgressEndpoint(secularResult.plan.id);
  }
  
  console.log('\n🎉 Tests completed!');
  console.log('=====================================');
  console.log('Summary:');
  console.log(`✅ Health check: ${healthOk ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Secular intake: ${secularResult.success ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Christian intake: ${christianResult.success ? 'PASS' : 'FAIL'}`);
  
  if (!healthOk || !secularResult.success || !christianResult.success) {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
    process.exit(1);
  } else {
    console.log('\n🎊 All tests passed! Your Azure Functions are working correctly.');
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
  process.exit(1);
});

// Run the tests
runAllTests();
