'use client';

import { useState, useEffect } from 'react';
import { CampaignContext } from '@/lib/types';
import { 
  detectCampaignFromUrl, 
  configToCampaignContext, 
  getCampaignConfig,
  type CampaignConfig 
} from '@/config/campaigns';

interface CampaignState {
  config: CampaignConfig;
  context: CampaignContext;
  isLoading: boolean;
  error: string | null;
}

/**
 * Campaign management hook
 * Handles detection, storage, and state management for campaigns
 */
export function useCampaign() {
  const [state, setState] = useState<CampaignState>({
    config: getCampaignConfig('direct')!,
    context: {
      source: 'direct',
      campaignId: 'direct',
      entryPoint: 'landing-page'
    },
    isLoading: true,
    error: null
  });

  useEffect(() => {
    try {
      // Detect campaign from URL
      const detectedConfig = detectCampaignFromUrl();
      const campaignContext = configToCampaignContext(detectedConfig);

      // Store in session for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('keelstone-campaign', JSON.stringify({
          configId: detectedConfig.id,
          context: campaignContext,
          detectedAt: new Date().toISOString()
        }));
      }

      setState({
        config: detectedConfig,
        context: campaignContext,
        isLoading: false,
        error: null
      });

      // Debug logging (remove in production)
      console.log('🎯 Campaign detected:', {
        campaign: detectedConfig.name,
        id: detectedConfig.id,
        context: campaignContext
      });

    } catch (error) {
      console.error('❌ Campaign detection failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  /**
   * Get stored campaign from session
   */
  const getStoredCampaign = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = sessionStorage.getItem('keelstone-campaign');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  /**
   * Clear campaign data (useful for testing)
   */
  const clearCampaign = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('keelstone-campaign');
    }
    
    const directConfig = getCampaignConfig('direct')!;
    setState({
      config: directConfig,
      context: configToCampaignContext(directConfig),
      isLoading: false,
      error: null
    });
  };

  /**
   * Check if current campaign matches a specific type
   */
  const isCampaign = (campaignId: string) => {
    return state.config.id === campaignId;
  };

  /**
   * Check if campaign should show welcome screen
   */
  const shouldShowWelcome = () => {
    // Show welcome for all campaigns except direct
    return state.config.id !== 'direct';
  };

  return {
    // Campaign data
    campaign: state.config,
    context: state.context,
    
    // State
    isLoading: state.isLoading,
    error: state.error,
    
    // Utilities
    isCampaign,
    shouldShowWelcome,
    clearCampaign,
    getStoredCampaign,
    
    // Convenience getters
    isDay6Underground: isCampaign('day-6-underground'),
    isSocialMedia: isCampaign('social-media'),
    isReferral: isCampaign('referral'),
    isDirect: isCampaign('direct'),
  };
}
