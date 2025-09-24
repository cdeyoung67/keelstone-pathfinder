// Test GPT-5 Chat Model
const axios = require('axios');

async function testGPT5Chat() {
    console.log('🧪 Testing GPT-5 Chat Model');
    console.log('===============================');

    // Read GPT-5 Chat specific environment variables
    const endpoint = process.env.ENDPOINT_GPT5_CHAT;
    const apiKey = process.env.API_KEY_GPT5_CHAT;
    const apiVersion = process.env.API_VERSION_GPT5_CHAT || '2024-02-01';
    const modelName = process.env.MODEL_NAME_GPT5_CHAT;
    const deploymentName = process.env.DEPLOYMENT_GPT5_CHAT;
    const options = process.env.OPTIONS_GPT5_CHAT;

    if (!endpoint || !apiKey || !deploymentName) {
        console.error('❌ Missing environment variables:');
        console.error('   ENDPOINT_GPT5_CHAT:', endpoint ? '✅ Set' : '❌ Missing');
        console.error('   API_KEY_GPT5_CHAT:', apiKey ? '✅ Set' : '❌ Missing');
        console.error('   API_VERSION_GPT5_CHAT:', apiVersion);
        console.error('   MODEL_NAME_GPT5_CHAT:', modelName || 'Not set');
        console.error('   DEPLOYMENT_GPT5_CHAT:', deploymentName ? '✅ Set' : '❌ Missing');
        console.error('   OPTIONS_GPT5_CHAT:', options || 'Not set');
        console.error('\nPlease check your .env.local file');
        return;
    }

    console.log('🔧 Configuration:');
    console.log('   Endpoint:', endpoint);
    console.log('   API Version:', apiVersion);
    console.log('   Model Name:', modelName);
    console.log('   Deployment:', deploymentName);
    console.log('   Options:', options);
    console.log('   API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set');

    const testPrompts = [
        {
            name: 'Concierge Agent Test',
            messages: [
                {
                    role: 'system',
                    content: 'You are a wise concierge agent for the Keel Stone Pathfinder, helping users find inner steadiness through contemplative practices. You guide users through their spiritual journey with compassion and wisdom.'
                },
                {
                    role: 'user',
                    content: 'I feel overwhelmed by social media and news anxiety. I want to find more peace in my daily life. Can you help me understand what path might work for me?'
                }
            ]
        },
        {
            name: 'Christian Path Agent Test',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Christian path agent, integrating scripture, prayer, and theological wisdom to guide believers toward inner steadiness and spiritual growth. You speak with grace and biblical insight.'
                },
                {
                    role: 'user',
                    content: 'I struggle with perfectionism and fear of failure. How can my faith help me overcome these challenges?'
                }
            ]
        }
    ];

    for (const test of testPrompts) {
        console.log(`\n🎯 Running: ${test.name}`);
        console.log('─'.repeat(50));

        try {
            const response = await axios.post(
                `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
                {
                    messages: test.messages,
                    max_tokens: 300,
                    temperature: 0.7,
                    top_p: 0.95
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    timeout: 30000
                }
            );

            console.log('✅ Success!');
            console.log('Response:', response.data.choices[0].message.content);
            console.log('Usage:', response.data.usage);

        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    }

    console.log('\n🎉 GPT-5 Chat testing complete!');
}

// Load environment variables if .env.local exists
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    // dotenv not available, that's okay
}

testGPT5Chat().catch(console.error);
