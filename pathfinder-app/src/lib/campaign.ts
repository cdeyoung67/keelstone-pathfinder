// Campaign detection and management utilities

import { CampaignContext } from './types';

/**
 * Detects campaign context from URL parameters and referrer
 */
export function detectCampaignContext(): CampaignContext {
  // Default to direct access
  let context: CampaignContext = {
    source: 'direct',
  };

  // Only run on client side
  if (typeof window === 'undefined') {
    console.log('🔍 Campaign detection: Running on server side, returning direct');
    return context;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  
  console.log('🔍 Campaign detection - URL params:', Object.fromEntries(urlParams.entries()));
  console.log('🔍 Campaign detection - Referrer:', referrer);

  // Check for specific campaign parameters
  const campaign = urlParams.get('campaign');
  const source = urlParams.get('source') || urlParams.get('utm_source');
  const medium = urlParams.get('utm_medium');
  const campaignId = urlParams.get('utm_campaign') || campaign;
  
  console.log('🔍 Campaign detection - Parsed values:', { campaign, source, medium, campaignId });

  // Day 6 Underground Campaign
  if (campaign === 'day-6-underground' || campaignId === 'underground-calls-2024') {
    context = {
      source: 'day-6-underground',
      campaignId: campaignId || 'underground-calls-2024',
      entryPoint: 'email-link',
      priorContext: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'],
    };
    console.log('✅ Day 6 Underground campaign detected');
  }
  // Social media campaigns
  else if (source === 'social' || medium === 'social') {
    context = {
      source: 'social-media',
      campaignId,
      entryPoint: 'social-post',
    };
    console.log('✅ Social media campaign detected');
  }
  // Referral from another site
  else if (referrer && !referrer.includes(window.location.hostname)) {
    context = {
      source: 'referral',
      referrer,
      entryPoint: 'external-link',
    };
    console.log('✅ Referral campaign detected');
  }
  // Direct access or unknown
  else {
    context = {
      source: 'direct',
      entryPoint: 'landing-page',
    };
    console.log('ℹ️ Direct access detected');
  }

  console.log('🎯 Final campaign context:', context);
  return context;
}

/**
 * Gets campaign-specific welcome content
 */
export function getCampaignWelcomeContent(campaignContext: CampaignContext) {
  switch (campaignContext.source) {
    case 'day-6-underground':
      return {
        title: "You've Made It to Day 6!",
        subtitle: "The underground calls are behind you — now let's build something better together.",
        description: "You've completed the 5-day journey through rebellion, despair, and back to hope. This is your safe place to start walking the path toward inner steadiness.",
        ctaText: "Continue Your Journey",
        showDay6Reflection: true,
        emotionalTone: "relief-and-excitement",
      };

    case 'social-media':
      return {
        title: "Welcome from Social Media!",
        subtitle: "Ready to find your path to inner steadiness?",
        description: "You've discovered Keel Stone Pathfinder — a personalized approach to building contemplative practices that actually stick.",
        ctaText: "Start Your Pathfinder",
        showDay6Reflection: false,
        emotionalTone: "curiosity-and-invitation",
      };

    case 'referral':
      return {
        title: "Welcome! A Friend Sent You",
        subtitle: "Someone thought you might find this helpful.",
        description: "Keel Stone Pathfinder creates personalized 21-day practice plans that help you break free from digital overwhelm through contemplative habits.",
        ctaText: "See What This Is About",
        showDay6Reflection: false,
        emotionalTone: "trust-and-curiosity",
      };

    default: // 'direct'
      return {
        title: "Find Your Path to Inner Steadiness",
        subtitle: "Personalized contemplative practices for the overwhelmed mind.",
        description: "Take a short assessment and receive a custom 21-day plan with daily practices designed specifically for your struggles and schedule.",
        ctaText: "Start Your Pathfinder",
        showDay6Reflection: false,
        emotionalTone: "professional-invitation",
      };
  }
}

/**
 * Stores campaign context in session storage for persistence
 */
export function storeCampaignContext(context: CampaignContext) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('keelstone-campaign', JSON.stringify(context));
  }
}

/**
 * Retrieves stored campaign context
 */
export function getStoredCampaignContext(): CampaignContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = sessionStorage.getItem('keelstone-campaign');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Gets campaign context, checking stored first, then detecting from URL
 */
export function getCampaignContext(): CampaignContext {
  const stored = getStoredCampaignContext();
  if (stored) {
    return stored;
  }

  const detected = detectCampaignContext();
  storeCampaignContext(detected);
  return detected;
}
