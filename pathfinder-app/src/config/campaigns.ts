// Campaign configuration system
// This is the single source of truth for all campaigns

import { CampaignContext, CampaignSource } from '@/lib/types';

export interface CampaignConfig {
  id: string;
  name: string;
  description: string;
  urlPatterns: string[]; // Array of URL patterns that trigger this campaign
  priority: number; // Higher number = higher priority when multiple patterns match
  enabled: boolean;
  metadata?: {
    source?: string;
    medium?: string;
    expectedPriorContext?: string[];
    emotionalTone?: string;
  };
}

export const CAMPAIGN_CONFIGS: Record<string, CampaignConfig> = {
  'day-6-underground': {
    id: 'day-6-underground',
    name: 'Day 6 Underground Calls',
    description: 'Users completing the 5-day underground email series',
    urlPatterns: [
      'campaign=day-6-underground',
      'utm_campaign=underground-calls-2024',
      'source=day-6-underground'
    ],
    priority: 100,
    enabled: true,
    metadata: {
      source: 'email-campaign',
      medium: 'email',
      expectedPriorContext: ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'],
      emotionalTone: 'relief-and-excitement'
    }
  },

  'social-media': {
    id: 'social-media',
    name: 'Social Media Campaign',
    description: 'Users arriving from social media platforms',
    urlPatterns: [
      'source=social',
      'utm_source=facebook',
      'utm_source=twitter',
      'utm_source=instagram',
      'utm_source=linkedin',
      'utm_medium=social'
    ],
    priority: 50,
    enabled: true,
    metadata: {
      source: 'social-media',
      medium: 'social',
      emotionalTone: 'curiosity-and-invitation'
    }
  },

  'referral': {
    id: 'referral',
    name: 'Referral Campaign',
    description: 'Users arriving from external websites',
    urlPatterns: [
      'source=referral',
      'utm_source=referral'
    ],
    priority: 30,
    enabled: true,
    metadata: {
      source: 'referral',
      medium: 'referral',
      emotionalTone: 'trust-and-curiosity'
    }
  },

  'direct': {
    id: 'direct',
    name: 'Direct Access',
    description: 'Default experience for direct visitors',
    urlPatterns: [], // Empty means this is the fallback
    priority: 0,
    enabled: true,
    metadata: {
      source: 'direct',
      medium: 'none',
      emotionalTone: 'professional-invitation'
    }
  }
};

/**
 * Get campaign config by ID
 */
export function getCampaignConfig(id: string): CampaignConfig | null {
  return CAMPAIGN_CONFIGS[id] || null;
}

/**
 * Get all enabled campaigns sorted by priority
 */
export function getEnabledCampaigns(): CampaignConfig[] {
  return Object.values(CAMPAIGN_CONFIGS)
    .filter(config => config.enabled)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Detect campaign from URL parameters
 */
export function detectCampaignFromUrl(): CampaignConfig {
  // Only run on client side
  if (typeof window === 'undefined') {
    return CAMPAIGN_CONFIGS.direct;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;

  // Convert URL params to a searchable string
  const paramString = urlParams.toString().toLowerCase();
  const referrerHostname = referrer ? new URL(referrer).hostname : '';
  
  // Check each campaign's patterns (in priority order)
  for (const config of getEnabledCampaigns()) {
    // Skip direct campaign (it's the fallback)
    if (config.id === 'direct') continue;
    
    // Check URL patterns
    for (const pattern of config.urlPatterns) {
      if (paramString.includes(pattern.toLowerCase())) {
        return config;
      }
    }
    
    // Special case: referral detection
    if (config.id === 'referral' && referrer && !referrer.includes(window.location.hostname)) {
      return config;
    }
  }

  // Fallback to direct
  return CAMPAIGN_CONFIGS.direct;
}

/**
 * Convert campaign config to campaign context
 */
export function configToCampaignContext(config: CampaignConfig): CampaignContext {
  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;

  return {
    source: config.id as CampaignSource,
    campaignId: config.id,
    referrer: referrer || undefined,
    entryPoint: config.metadata?.source || 'unknown',
    priorContext: config.metadata?.expectedPriorContext,
  };
}
