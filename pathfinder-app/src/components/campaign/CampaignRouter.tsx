'use client';

import { useCampaign } from '@/hooks/useCampaign';
import Day6UndergroundFlow from './flows/Day6UndergroundFlow';
import SocialMediaFlow from './flows/SocialMediaFlow';
import DefaultFlow from './flows/DefaultFlow';
import LoadingState from '@/components/ui/LoadingState';

/**
 * Campaign Router
 * Routes users to the appropriate campaign flow based on their campaign context
 */
export default function CampaignRouter() {
  const { campaign, context, isLoading, error } = useCampaign();

  // Show loading state while detecting campaign
  if (isLoading) {
    return (
      <LoadingState 
        message="Detecting your journey..."
        estimatedTime={1000}
      />
    );
  }

  // Show error state if campaign detection failed
  if (error) {
    console.error('Campaign router error:', error);
    // Fallback to default flow
    return <DefaultFlow />;
  }

  // Route to appropriate campaign flow
  switch (campaign.id) {
    case 'day-6-underground':
      return <Day6UndergroundFlow />;
      
    case 'social-media':
      return <SocialMediaFlow />;
      
    case 'referral':
      // For now, referrals use the default flow with campaign context
      return <DefaultFlow campaignContext={context} />;
      
    default:
      // Direct access and unknown campaigns
      return <DefaultFlow campaignContext={context} />;
  }
}
