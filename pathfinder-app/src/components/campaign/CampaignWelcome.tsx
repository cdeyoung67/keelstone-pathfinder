'use client';

import { CampaignContext } from '@/lib/types';
import { getCampaignWelcomeContent } from '@/lib/campaign';
import Day6Welcome from './Day6Welcome';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRightIcon,
  UserGroupIcon,
  ShareIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface CampaignWelcomeProps {
  campaignContext: CampaignContext;
  firstName?: string;
  onContinue: () => void;
  onReflectionSave?: (reflection: string) => void;
}

export default function CampaignWelcome({ 
  campaignContext, 
  firstName, 
  onContinue, 
  onReflectionSave 
}: CampaignWelcomeProps) {
  
  // Special handling for Day 6 Underground campaign
  if (campaignContext.source === 'day-6-underground') {
    return (
      <Day6Welcome
        firstName={firstName}
        onContinue={onContinue}
        onReflectionSave={onReflectionSave}
      />
    );
  }

  // Get campaign-specific content
  const content = getCampaignWelcomeContent(campaignContext);

  // Generic welcome for other campaign types
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light to-sand-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-gentle-fade">
        
        {/* Campaign Badge */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-navy-100 text-navy-800 rounded-full text-sm font-medium mb-4 border border-navy-200">
            {campaignContext.source === 'social-media' && <ShareIcon className="w-4 h-4 mr-2" />}
            {campaignContext.source === 'referral' && <UserGroupIcon className="w-4 h-4 mr-2" />}
            {campaignContext.source === 'direct' && <ComputerDesktopIcon className="w-4 h-4 mr-2" />}
            {getCampaignSourceLabel(campaignContext.source)}
          </div>
        </div>

        {/* Main Welcome */}
        <Card className="bg-white border-navy-200 text-center">
          <CardHeader>
            <CardTitle className="text-hero text-navy-900">
              {content.title}
            </CardTitle>
            <CardDescription className="text-subtitle text-slate-600">
              {content.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-body text-slate-700">
              {content.description}
            </p>

            {/* Referral-specific content */}
            {campaignContext.source === 'referral' && campaignContext.referrer && (
              <div className="bg-olive-50 border border-olive-200 rounded-lg p-4">
                <p className="text-sm text-olive-800">
                  <strong>Referred from:</strong> {new URL(campaignContext.referrer).hostname}
                </p>
              </div>
            )}

            {/* Social media specific content */}
            {campaignContext.source === 'social-media' && (
              <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                <p className="text-sm text-gold-800">
                  <strong>Welcome from social media!</strong> Thousands of others are already finding their path to inner steadiness.
                </p>
              </div>
            )}

            <Button
              onClick={onContinue}
              size="lg"
              className="bg-accent text-white hover:bg-olive-600 font-semibold"
            >
              {content.ctaText}
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card className="bg-white border-sand-300">
          <CardHeader>
            <CardTitle className="text-lg text-navy-800">What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-2">📝</div>
                <div className="text-sm font-medium text-navy-800">5-Minute Assessment</div>
                <div className="text-xs text-slate-600">Tell us about your struggles and preferences</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🧭</div>
                <div className="text-sm font-medium text-navy-800">Personalized Plan</div>
                <div className="text-xs text-slate-600">21 days of practices tailored to you</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-medium text-navy-800">Daily Growth</div>
                <div className="text-xs text-slate-600">5-20 minute practices that build lasting habits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getCampaignSourceLabel(source: string): string {
  switch (source) {
    case 'day-6-underground':
      return 'Underground Calls Campaign';
    case 'social-media':
      return 'Social Media';
    case 'referral':
      return 'Referral';
    case 'direct':
      return 'Direct Visit';
    default:
      return 'Welcome';
  }
}
