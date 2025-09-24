// Test GPT-5-Nano with improved parameters for visible output
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testGPT5NanoImproved() {
    console.log('🧪 Testing GPT-5-Nano (Improved Parameters)');
    console.log('============================================');

    const endpoint = process.env.ENDPOINT_GPT5_NANO;
    const apiKey = process.env.API_KEY_GPT5_NANO;
    const apiVersion = "2024-12-01-preview";  // Updated API version from example
    const modelName = "gpt-5-nano";
    const deployment = process.env.DEPLOYMENT_GPT5_NANO;

    if (!endpoint || !apiKey || !deployment) {
        console.error('❌ Missing environment variables');
        return;
    }

    console.log('🔧 Configuration:');
    console.log('   Endpoint:', endpoint);
    console.log('   Model Name:', modelName);
    console.log('   Deployment:', deployment);
    console.log('   API Version:', apiVersion);
    console.log('   API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set');

    const testPrompts = [
        {
            name: 'Simple Travel Question (Like Example)',
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "I am going to Paris, what should I see?" }
            ]
        },
        {
            name: 'Temperance Agent - Quick Habit Tip',
            messages: [
                { role: "system", content: "You are a Temperance agent. Give quick, practical habit advice." },
                { role: "user", content: "Give me one tiny habit I can start today for better sleep." }
            ]
        },
        {
            name: 'Ultra-Simple Question',
            messages: [
                { role: "user", content: "What is wisdom in one sentence?" }
            ]
        }
    ];

    for (const test of testPrompts) {
        console.log(`\n🎯 Running: ${test.name}`);
        console.log('─'.repeat(50));

        try {
            const startTime = Date.now();
            
            const response = await axios.post(
                `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
                {
                    messages: test.messages,
                    max_completion_tokens: 16384,  // Much higher token limit like example
                    model: modelName  // Include model name parameter from example
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    timeout: 30000
                }
            );

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            console.log('✅ Success!');
            console.log('⚡ Response Time:', `${responseTime}ms (${(responseTime/1000).toFixed(1)}s)`);
            
            const content = response.data.choices[0].message.content;
            console.log('📝 Response Content:');
            console.log(content || '[No visible content]');
            
            if (response.data.usage) {
                console.log('\n📊 Token Usage:');
                console.log('   Total tokens:', response.data.usage.total_tokens);
                console.log('   Prompt tokens:', response.data.usage.prompt_tokens);
                console.log('   Completion tokens:', response.data.usage.completion_tokens);
                if (response.data.usage.completion_tokens_details) {
                    console.log('   Reasoning tokens:', response.data.usage.completion_tokens_details.reasoning_tokens || 0);
                    console.log('   Output tokens:', response.data.usage.completion_tokens - (response.data.usage.completion_tokens_details.reasoning_tokens || 0));
                }
            }

            // Analyze response quality
            if (content && content.length > 0) {
                const isQuick = responseTime < 3000; // Under 3 seconds
                const isConcise = content.length < 1000; // Reasonable length
                const hasPractical = /habit|practice|do|try|start|simple|easy/i.test(content);
                
                console.log('\n🎯 Analysis:');
                console.log('   - Ultra-fast response:', isQuick ? '✅' : '❌');
                console.log('   - Has visible content:', '✅');
                console.log('   - Reasonable length:', isConcise ? '✅' : '❌');
                console.log('   - Contains practical advice:', hasPractical ? '✅' : '❌');
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
            console.error('Full error:', error);
        }
    }

    console.log('\n🎉 GPT-5-Nano improved testing complete!');
}

testGPT5NanoImproved().catch((err) => {
    console.error("The sample encountered an error:", err);
});
