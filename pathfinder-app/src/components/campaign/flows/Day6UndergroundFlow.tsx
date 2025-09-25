'use client';

import { useState } from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import Day6Welcome from '@/components/campaign/Day6Welcome';
import DefaultFlow from './DefaultFlow';

interface Day6UndergroundFlowProps {
  // Props that might be needed for the flow
}

/**
 * Day 6 Underground Campaign Flow
 * Handles the complete user journey for users coming from the 5-day email series
 */
export default function Day6UndergroundFlow({}: Day6UndergroundFlowProps) {
  const { campaign, context } = useCampaign();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'intake' | 'plan'>('welcome');
  const [day6Reflection, setDay6Reflection] = useState<string>('');

  const handleWelcomeContinue = () => {
    console.log('🎯 Day 6 user continuing to intake');
    setCurrentStep('intake');
  };

  const handleReflectionSave = (reflection: string) => {
    setDay6Reflection(reflection);
    console.log('📝 Day 6 reflection saved:', reflection);
    // TODO: In production, save to database with campaign context
  };

  const handleIntakeComplete = () => {
    setCurrentStep('plan');
  };

  // Step 1: Day 6 Welcome Experience
  if (currentStep === 'welcome') {
    return (
      <Day6Welcome
        firstName="Friend" // We'll get this from stored context later
        onContinue={handleWelcomeContinue}
        onReflectionSave={handleReflectionSave}
      />
    );
  }

  // Step 2 & 3: Use the default flow but with Day 6 context
  return (
    <DefaultFlow 
      campaignContext={context}
      initialStep={currentStep === 'intake' ? 'intake' : 'plan'}
      day6Reflection={day6Reflection}
    />
  );
}
