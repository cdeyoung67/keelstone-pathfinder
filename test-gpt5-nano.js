// Test GPT-5-Nano Model (Ultra-Fast for Habits)
const axios = require('axios');

async function testGPT5Nano() {
    console.log('🧪 Testing GPT-5-Nano Model (Ultra-Fast)');
    console.log('========================================');

    // Read GPT-5-Nano specific environment variables
    const endpoint = process.env.ENDPOINT_GPT5_NANO;
    const apiKey = process.env.API_KEY_GPT5_NANO;
    const apiVersion = process.env.API_VERSION_GPT5_NANO || '2024-02-01';
    const modelName = process.env.MODEL_NAME_GPT5_NANO;
    const deploymentName = process.env.DEPLOYMENT_GPT5_NANO;
    const options = process.env.OPTIONS_GPT5_NANO;
    const client = process.env.CLIENT_GPT5_NANO;

    if (!endpoint || !apiKey || !deploymentName) {
        console.error('❌ Missing environment variables:');
        console.error('   ENDPOINT_GPT5_NANO:', endpoint ? '✅ Set' : '❌ Missing');
        console.error('   API_KEY_GPT5_NANO:', apiKey ? '✅ Set' : '❌ Missing');
        console.error('   API_VERSION_GPT5_NANO:', apiVersion);
        console.error('   MODEL_NAME_GPT5_NANO:', modelName || 'Not set');
        console.error('   DEPLOYMENT_GPT5_NANO:', deploymentName ? '✅ Set' : '❌ Missing');
        console.error('   OPTIONS_GPT5_NANO:', options || 'Not set');
        console.error('   CLIENT_GPT5_NANO:', client || 'Not set');
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
            name: 'Temperance Agent Test - Habit Formation',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Temperance agent specializing in habit formation and self-control. You help users build healthy habits and practice moderation. Provide quick, practical advice for daily habit building.'
                },
                {
                    role: 'user',
                    content: 'I keep checking my phone compulsively throughout the day and it\'s affecting my focus. I want to build better phone habits but I don\'t know where to start. Give me a simple daily practice.'
                }
            ]
        },
        {
            name: 'Quick Habit Check-in Test',
            messages: [
                {
                    role: 'system',
                    content: 'You are helping someone with their daily habit check-in. Be encouraging and provide a quick tip.'
                },
                {
                    role: 'user',
                    content: 'I did my 5-minute meditation this morning but I\'m feeling stressed again this afternoon. What\'s a quick reset I can do right now?'
                }
            ]
        },
        {
            name: 'Self-Control Practice Test',
            messages: [
                {
                    role: 'system',
                    content: 'Give a brief, practical tip for practicing self-control with food.'
                },
                {
                    role: 'user',
                    content: 'I always overeat when I\'m stressed. What\'s one simple thing I can do before meals?'
                }
            ]
        },
        {
            name: 'Speed Test - Ultra-Fast Response',
            messages: [
                {
                    role: 'user',
                    content: 'Give me one tiny habit I can start today for better sleep.'
                }
            ]
        }
    ];

    for (const test of testPrompts) {
        console.log(`\n🎯 Running: ${test.name}`);
        console.log('─'.repeat(50));

        try {
            const startTime = Date.now();
            const response = await axios.post(
                `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
                {
                    messages: test.messages,
                    max_completion_tokens: 300  // Small token limit for ultra-fast responses
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    timeout: 30000  // 30 seconds timeout
                }
            );
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            console.log('✅ Success!');
            console.log('⚡ Response Time:', `${responseTime}ms (${(responseTime/1000).toFixed(1)}s)`);
            
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

            // Analyze response quality for Temperance agent
            if (content && content.length > 0) {
                const isQuick = responseTime < 5000; // Under 5 seconds
                const isConcise = content.length < 500; // Under 500 characters
                const hasPractical = /habit|practice|do|try|start|simple|easy/i.test(content);
                const hasTiming = /minute|hour|day|morning|evening|before|after/i.test(content);
                
                console.log('\n🎯 Temperance Agent Analysis:');
                console.log('   - Ultra-fast response:', isQuick ? '✅' : '❌');
                console.log('   - Concise and practical:', isConcise ? '✅' : '❌');
                console.log('   - Contains actionable habits:', hasPractical ? '✅' : '❌');
                console.log('   - Includes timing/frequency:', hasTiming ? '✅' : '❌');
                console.log('   - Perfect for frequent check-ins:', (isQuick && isConcise) ? '✅' : '❌');
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    }

    console.log('\n🎉 GPT-5-Nano testing complete!');
    console.log('⚡ Perfect for Temperance agent: Ultra-fast habit formation and frequent check-ins.');
}

// Load environment variables if .env.local exists
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    // dotenv not available, that's okay
}

testGPT5Nano().catch(console.error);
