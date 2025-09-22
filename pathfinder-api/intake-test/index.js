module.exports = async function (context, req) {
    context.log('🧪 MOCK Intake function triggered');

    // CORS headers
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: corsHeaders
        };
        return;
    }

    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            headers: corsHeaders,
            body: { success: false, error: 'Method not allowed' }
        };
        return;
    }

    try {
        const body = req.body;
        if (!body || !body.assessment) {
            context.res = {
                status: 400,
                headers: corsHeaders,
                body: { success: false, error: 'Assessment data is required' }
            };
            return;
        }

        const { firstName, lastName, email, struggles, door, timeBudget, daypart } = body.assessment;
        if (!firstName || !lastName || !email || !struggles || !door || !timeBudget || !daypart) {
            context.res = {
                status: 400,
                headers: corsHeaders,
                body: { success: false, error: 'Missing required fields' }
            };
            return;
        }

        // Mock plan generation
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

        const mockPlan = {
            id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: `user_${Date.now()}`,
            assessment: body.assessment,
            anchor: `Today I practice ${body.assessment.door === 'christian' ? 'God\'s wisdom' : 'discernment'} — wise, but not proud.`,
            virtue: 'wisdom', // Simplified for testing
            door: body.assessment.door,
            daily: Array.from({ length: 21 }, (_, i) => ({
                day: i + 1,
                title: `Day ${i + 1}: Wisdom Practice`,
                steps: [`Mock step 1 for ${body.assessment.door}`, 'Mock step 2', 'Mock step 3'],
                reflection: 'How did today\'s practice feel?',
                quote: {
                    text: body.assessment.door === 'christian' ? 'The fear of the Lord is the beginning of wisdom.' : 'The only true wisdom is in knowing you know nothing.',
                    source: body.assessment.door === 'christian' ? 'Proverbs 9:10' : 'Socrates',
                    type: body.assessment.door === 'christian' ? 'biblical' : 'wisdom'
                },
                commentary: 'Mock commentary connecting wisdom to daily life.',
                estimatedTime: 10
            })),
            weeklyCheckin: 'What\'s one thing you understand more clearly?',
            createdAt: new Date(),
            version: 'mock-v1.0'
        };

        context.log(`🧪 MOCK Generated plan for ${firstName} ${lastName}`);

        context.res = {
            status: 200,
            headers: corsHeaders,
            body: {
                success: true,
                plan: mockPlan
            }
        };

    } catch (error) {
        context.log.error('🧪 MOCK Error in intake function:', error);
        
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: {
                success: false,
                error: error.message || 'Internal server error'
            }
        };
    }
};
