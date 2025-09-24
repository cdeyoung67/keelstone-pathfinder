// Test Multi-Agent Customer Journey
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testMultiAgentJourney() {
    console.log('🧪 Testing Multi-Agent Customer Journey');
    console.log('=======================================');

    const baseUrl = "https://pathfinder-dev24-functions-f27w3p.azurewebsites.net/api";
    const headers = {'Content-Type': 'application/json'};

    // Test scenarios for different customer journeys
    const testScenarios = [
        {
            name: "Christian Path - Courage Focus",
            payload: {
                assessment: {
                    firstName: "Sarah",
                    lastName: "Johnson", 
                    email: "sarah.johnson@example.com",
                    struggles: ["fear-failure", "perfectionism", "avoiding-conflict"],
                    door: "christian",
                    bibleVersion: "NIV",
                    timeBudget: "10-15",
                    daypart: "morning",
                    context: "I'm starting a new business and struggling with fear of failure. My faith is important to me."
                }
            }
        },
        {
            name: "Secular Path - Temperance Focus", 
            payload: {
                assessment: {
                    firstName: "Marcus",
                    lastName: "Chen",
                    email: "marcus.chen@example.com", 
                    struggles: ["social-media-overwhelm", "digital-distraction", "emotional-reactivity"],
                    door: "secular",
                    timeBudget: "5-10",
                    daypart: "evening",
                    context: "I work in tech and feel constantly overwhelmed by information and digital distractions."
                }
            }
        },
        {
            name: "Christian Path - Wisdom Focus",
            payload: {
                assessment: {
                    firstName: "David",
                    lastName: "Martinez",
                    email: "david.martinez@example.com",
                    struggles: ["decision-paralysis", "analysis-paralysis", "lack-direction"],
                    door: "christian", 
                    bibleVersion: "ESV",
                    timeBudget: "15-20",
                    daypart: "midday",
                    context: "I'm at a crossroads in my career and seeking God's wisdom for major life decisions."
                }
            }
        },
        {
            name: "Secular Path - Justice Focus",
            payload: {
                assessment: {
                    firstName: "Elena",
                    lastName: "Rodriguez",
                    email: "elena.rodriguez@example.com",
                    struggles: ["relationship-conflicts", "work-life-balance", "helping-others"],
                    door: "secular",
                    timeBudget: "10-15", 
                    daypart: "flexible",
                    context: "I'm a manager struggling with work-life balance and setting healthy boundaries with my team."
                }
            }
        }
    ];

    for (const scenario of testScenarios) {
        console.log(`\n🎯 Testing: ${scenario.name}`);
        console.log('─'.repeat(60));

        try {
            const startTime = Date.now();
            const response = await axios.post(`${baseUrl}/intake`, scenario.payload, { 
                headers,
                timeout: 60000 // 1 minute timeout for plan generation
            });
            const endTime = Date.now();

            if (response.data.success && response.data.plan) {
                const plan = response.data.plan;
                console.log('✅ Journey Success!');
                console.log('⏱️  Generation Time:', `${endTime - startTime}ms`);
                console.log('👤 User:', `${plan.assessment.firstName} ${plan.assessment.lastName}`);
                console.log('🚪 Path:', plan.door);
                console.log('🎯 Primary Virtue:', plan.virtue);
                console.log('📅 Plan Length:', `${plan.daily.length} days`);
                console.log('⚡ Plan Version:', plan.version);
                console.log('🎭 Anchor Statement:', plan.anchor);

                // Analyze plan quality
                console.log('\n📊 Plan Analysis:');
                
                // Check for personalization
                const hasPersonalization = plan.daily.some(day => 
                    day.commentary.includes(plan.assessment.firstName) ||
                    day.commentary.includes(plan.door) ||
                    day.commentary.includes(plan.virtue)
                );
                console.log('   - Personalized content:', hasPersonalization ? '✅' : '❌');

                // Check for path-specific content
                const hasPathSpecificContent = plan.daily.some(day => 
                    (plan.door === 'christian' && (day.quote.source.includes('Scripture') || day.quote.text.includes('Lord'))) ||
                    (plan.door === 'secular' && (day.quote.source.includes('Wisdom') || day.quote.source.includes('Aristotle')))
                );
                console.log('   - Path-specific quotes:', hasPathSpecificContent ? '✅' : '❌');

                // Check for virtue focus
                const hasVirtueFocus = plan.daily.every(day => 
                    day.title.includes(plan.virtue) || day.commentary.includes(plan.virtue)
                );
                console.log('   - Virtue-focused content:', hasVirtueFocus ? '✅' : '❌');

                // Check for progressive structure
                const hasProgression = plan.daily.some(day => day.title.includes('Foundation')) &&
                                     plan.daily.some(day => day.title.includes('Deepening')) &&
                                     plan.daily.some(day => day.title.includes('Integration'));
                console.log('   - Progressive structure:', hasProgression ? '✅' : '❌');

                // Sample day content
                console.log('\n📝 Sample Day Content (Day 1):');
                const day1 = plan.daily[0];
                console.log('   Title:', day1.title);
                console.log('   Quote:', day1.quote.text);
                console.log('   Steps:', day1.steps.slice(0, 2).join(', ') + '...');
                console.log('   Commentary:', day1.commentary.substring(0, 100) + '...');

            } else {
                console.log('❌ Journey Failed:', response.data.error || 'Unknown error');
            }

        } catch (error) {
            console.log('❌ Request Failed:', error.message);
            if (error.response) {
                console.log('   Status:', error.response.status);
                console.log('   Data:', error.response.data);
            }
        }
    }

    console.log('\n🎉 Multi-Agent Customer Journey Testing Complete!');
    console.log('💡 Results show personalized plans based on door (Christian/Secular) and primary virtue.');
}

testMultiAgentJourney().catch(console.error);
