// Simple GPT-5 Test with longer timeout
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function simpleGPT5Test() {
    console.log('🧪 Simple GPT-5 Test (Increased Quota)');
    console.log('=====================================');

    const endpoint = process.env.ENDPOINT_GPT5;
    const apiKey = process.env.API_KEY_GPT5;
    const apiVersion = process.env.API_VERSION_GPT5;
    const deploymentName = process.env.DEPLOYMENT_GPT5;
    const client = process.env.CLIENT_GPT5;

    console.log('🔧 Configuration:');
    console.log('   Endpoint:', endpoint);
    console.log('   Deployment:', deploymentName);
    console.log('   Client:', client);
    console.log('   API Version:', apiVersion);

    try {
        console.log('\n🎯 Testing with simple wisdom question...');
        const startTime = Date.now();
        
        const response = await axios.post(
            `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
            {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a wise counselor helping someone make a difficult decision. Provide thoughtful, structured guidance.'
                    },
                    {
                        role: 'user',
                        content: 'I need to choose between two job offers. One pays more but has longer hours, the other has better work-life balance but lower pay. How should I think about this decision?'
                    }
                ],
                max_completion_tokens: 1000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                timeout: 120000  // 2 minutes timeout
            }
        );

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log('✅ Success!');
        console.log('⏱️  Response Time:', `${responseTime}ms (${(responseTime/1000).toFixed(1)}s)`);
        
        const message = response.data.choices[0].message;
        const content = message.content;
        const usage = response.data.usage;

        console.log('\n📝 Response Content:');
        console.log(content || '[No visible content]');
        
        console.log('\n📊 Token Usage:');
        console.log('   Total tokens:', usage.total_tokens);
        console.log('   Prompt tokens:', usage.prompt_tokens);
        console.log('   Completion tokens:', usage.completion_tokens);
        console.log('   Reasoning tokens:', usage.completion_tokens_details.reasoning_tokens);
        console.log('   Output tokens:', usage.completion_tokens - usage.completion_tokens_details.reasoning_tokens);

        console.log('\n🧠 Analysis:');
        if (content && content.length > 0) {
            console.log('   ✅ Content generated successfully');
            console.log('   📏 Content length:', content.length, 'characters');
            console.log('   🎯 Reasoning quality: Deep internal processing with visible output');
        } else {
            console.log('   ⚠️  No visible content (all tokens used for reasoning)');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNABORTED') {
            console.error('   🕐 Request timed out - GPT-5 is doing very deep reasoning');
        }
        if (error.response) {
            console.error('   📊 Status:', error.response.status);
            console.error('   📝 Data:', error.response.data);
        }
    }
}

simpleGPT5Test();
