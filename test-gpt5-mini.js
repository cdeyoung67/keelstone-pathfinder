// Test GPT-5-Mini Model (Cost-Effective Reasoning)
const axios = require('axios');

async function testGPT5Mini() {
    console.log('🧪 Testing GPT-5-Mini Model (Cost-Effective)');
    console.log('=============================================');

    // Read GPT-5-Mini specific environment variables
    const endpoint = process.env.ENDPOINT_GPT5_MINI;
    const apiKey = process.env.API_KEY_GPT5_MINI;
    const apiVersion = process.env.API_VERSION_GPT5_MINI || '2024-02-01';
    const modelName = process.env.MODEL_NAME_GPT5_MINI;
    const deploymentName = process.env.DEPLOYMENT_GPT5_MINI;
    const options = process.env.OPTIONS_GPT5_MINI;
    const client = process.env.CLIENT_GPT5_MINI;

    if (!endpoint || !apiKey || !deploymentName) {
        console.error('❌ Missing environment variables:');
        console.error('   ENDPOINT_GPT5_MINI:', endpoint ? '✅ Set' : '❌ Missing');
        console.error('   API_KEY_GPT5_MINI:', apiKey ? '✅ Set' : '❌ Missing');
        console.error('   API_VERSION_GPT5_MINI:', apiVersion);
        console.error('   MODEL_NAME_GPT5_MINI:', modelName || 'Not set');
        console.error('   DEPLOYMENT_GPT5_MINI:', deploymentName ? '✅ Set' : '❌ Missing');
        console.error('   OPTIONS_GPT5_MINI:', options || 'Not set');
        console.error('   CLIENT_GPT5_MINI:', client || 'Not set');
        console.error('\nPlease check your .env.local file');
        return;
    }

    console.log('🔧 Configuration:');
    console.log('   Endpoint:', endpoint);
    console.log('   API Version:', apiVersion);
    console.log('   Model Name:', modelName);
    console.log('   Deployment:', deploymentName);
    console.log('   Client:', client);
    console.log('   Options:', options);
    console.log('   API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set');

    const testPrompts = [
        {
            name: 'Courage Agent Test - Overcoming Fear',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Courage agent specializing in helping people overcome fear and take action. You provide practical, encouraging guidance that helps users move from fear to confident action. Be supportive but direct, focusing on actionable steps.'
                },
                {
                    role: 'user',
                    content: 'I\'ve been wanting to start my own business for years, but I\'m terrified of failing and losing my savings. Every time I think about taking the leap, I get paralyzed by all the things that could go wrong. How can I move past this fear and actually take action?'
                }
            ]
        },
        {
            name: 'Action-Oriented Encouragement Test',
            messages: [
                {
                    role: 'system',
                    content: 'You are an encouraging coach who helps people take the first step when they feel overwhelmed. Focus on breaking down big challenges into small, manageable actions.'
                },
                {
                    role: 'user',
                    content: 'I need to have a difficult conversation with my boss about a promotion, but I keep putting it off because I\'m afraid of confrontation. It\'s been months and I\'m getting frustrated with myself. What should I do?'
                }
            ]
        },
        {
            name: 'Cost-Effectiveness Test - Quick Response',
            messages: [
                {
                    role: 'system',
                    content: 'Give a brief but encouraging response to help someone take action.'
                },
                {
                    role: 'user',
                    content: 'I want to exercise but I always make excuses. Give me a simple way to start today.'
                }
            ]
        }
    ];

    for (const test of testPrompts) {
        console.log(`\n🎯 Running: ${test.name}`);
        console.log('─'.repeat(60));

        try {
            const startTime = Date.now();
            const response = await axios.post(
                `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
                {
                    messages: test.messages,
                    max_completion_tokens: 600  // Moderate token limit for cost-effectiveness
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    timeout: 60000  // 1 minute timeout
                }
            );
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            console.log('✅ Success!');
            console.log('⏱️  Response Time:', `${responseTime}ms (${(responseTime/1000).toFixed(1)}s)`);
            
            const message = response.data.choices[0].message;
            const content = message.content;
            const usage = response.data.usage;

            console.log('📝 Response Content:');
            console.log(content || '[No visible content]');
            
            console.log('\n📊 Token Usage:');
            console.log('   Total tokens:', usage.total_tokens);
            console.log('   Prompt tokens:', usage.prompt_tokens);
            console.log('   Completion tokens:', usage.completion_tokens);
            if (usage.completion_tokens_details) {
                console.log('   Reasoning tokens:', usage.completion_tokens_details.reasoning_tokens || 0);
                console.log('   Output tokens:', usage.completion_tokens - (usage.completion_tokens_details.reasoning_tokens || 0));
            }

            // Analyze response quality for Courage agent
            if (content && content.length > 0) {
                const hasAction = /step|action|start|begin|try|do|practice/i.test(content);
                const hasEncouragement = /can|will|able|possible|believe|confident/i.test(content);
                const hasStructure = content.includes('\n') || content.length > 100;
                
                console.log('\n🎯 Courage Agent Analysis:');
                console.log('   - Contains actionable steps:', hasAction ? '✅' : '❌');
                console.log('   - Encouraging tone:', hasEncouragement ? '✅' : '❌');
                console.log('   - Well-structured:', hasStructure ? '✅' : '❌');
                console.log('   - Cost-effective length:', content.length < 1000 ? '✅' : '⚠️');
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    }

    console.log('\n🎉 GPT-5-Mini testing complete!');
    console.log('💡 Perfect for Courage agent: Cost-effective, action-oriented, encouraging guidance.');
}

// Load environment variables if .env.local exists
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    // dotenv not available, that's okay
}

testGPT5Mini().catch(console.error);
