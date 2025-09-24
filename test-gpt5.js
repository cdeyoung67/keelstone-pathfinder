// Test GPT-5 Model (Full Logic)
const axios = require('axios');

async function testGPT5() {
    console.log('🧪 Testing GPT-5 Model (Full Logic)');
    console.log('===================================');

    // Read GPT-5 specific environment variables
    const endpoint = process.env.ENDPOINT_GPT5;
    const apiKey = process.env.API_KEY_GPT5;
    const apiVersion = process.env.API_VERSION_GPT5 || '2024-02-01';
    const modelName = process.env.MODEL_NAME_GPT5;
    const deploymentName = process.env.DEPLOYMENT_GPT5;
    const options = process.env.OPTIONS_GPT5;
    const client = process.env.CLIENT_GPT5;

    if (!endpoint || !apiKey || !deploymentName) {
        console.error('❌ Missing environment variables:');
        console.error('   ENDPOINT_GPT5:', endpoint ? '✅ Set' : '❌ Missing');
        console.error('   API_KEY_GPT5:', apiKey ? '✅ Set' : '❌ Missing');
        console.error('   API_VERSION_GPT5:', apiVersion);
        console.error('   MODEL_NAME_GPT5:', modelName || 'Not set');
        console.error('   DEPLOYMENT_GPT5:', deploymentName ? '✅ Set' : '❌ Missing');
        console.error('   OPTIONS_GPT5:', options || 'Not set');
        console.error('   CLIENT_GPT5:', client || 'Not set');
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
            name: 'Wisdom Agent Test - Complex Decision Making',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Wisdom agent specializing in complex decision-making and multi-step logical reasoning. You help users navigate difficult choices by breaking down complex problems into clear, actionable steps. You draw from classical wisdom traditions and practical decision-making frameworks.'
                },
                {
                    role: 'user',
                    content: 'I\'m torn between staying in my stable but unfulfilling job and pursuing my passion for starting a nonprofit, but I have a family to support and limited savings. I feel paralyzed by analysis. Can you help me think through this systematically?'
                }
            ]
        },
        {
            name: 'Justice Agent Test - Ethical Reasoning',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Justice agent specializing in ethical reasoning and relationship guidance. You help users navigate complex interpersonal situations, workplace conflicts, and moral dilemmas. You consider multiple perspectives and help users find fair, principled solutions.'
                },
                {
                    role: 'user',
                    content: 'My close friend asked me to lie to their spouse about where they were last weekend. I suspect they\'re having an affair, but I don\'t have proof. I\'m caught between loyalty to my friend and my moral principles. The spouse has been asking me directly. What should I do?'
                }
            ]
        },
        {
            name: 'Logic Stress Test - Multi-Step Reasoning',
            messages: [
                {
                    role: 'system',
                    content: 'You are testing your multi-step logical reasoning capabilities. Provide clear, structured analysis with step-by-step reasoning.'
                },
                {
                    role: 'user',
                    content: 'I need to decide between three job offers: Company A offers $80k with great work-life balance but limited growth, Company B offers $100k with high stress but rapid advancement opportunities, and Company C offers $90k with moderate stress and good learning opportunities but uncertain job security. I value financial stability, personal growth, and family time. How should I approach this decision systematically?'
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
                    max_completion_tokens: 1500  // Increased quota allows more tokens for reasoning + response
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': apiKey
                    },
                    timeout: 45000  // Longer timeout for complex reasoning
                }
            );
            const endTime = Date.now();

            console.log('✅ Success!');
            console.log('Response Time:', `${endTime - startTime}ms`);
            const message = response.data.choices[0].message;
            const responseContent = message.content;
            const refusal = message.refusal;
            
            console.log('Response Content:', responseContent || '[No content]');
            if (refusal) {
                console.log('⚠️  Refusal:', refusal);
            }
            console.log('Message keys:', Object.keys(message));
            console.log('Reasoning tokens used:', response.data.usage.completion_tokens_details.reasoning_tokens);
            console.log('Usage:', response.data.usage);
            console.log('Reasoning Quality: Analyzing structure and logic...');
            
            // Analyze response structure
            const responseText = response.data.choices[0].message.content;
            const hasSteps = /\d+\.|Step \d+|First|Second|Third|Finally/i.test(responseText);
            const hasStructure = responseText.includes('\n') && responseText.length > 200;
            const hasAnalysis = /consider|analyze|evaluate|weigh|compare/i.test(responseText);
            
            console.log('   📊 Structure Analysis:');
            console.log('   - Has logical steps:', hasSteps ? '✅' : '❌');
            console.log('   - Well-structured:', hasStructure ? '✅' : '❌');
            console.log('   - Contains analysis:', hasAnalysis ? '✅' : '❌');

        } catch (error) {
            console.error('❌ Error:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        }
    }

    console.log('\n🎉 GPT-5 Logic Model testing complete!');
    console.log('💡 This model is perfect for Wisdom and Justice agents requiring complex reasoning.');
}

// Load environment variables if .env.local exists
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    // dotenv not available, that's okay
}

testGPT5().catch(console.error);
