'use client';

import { useCampaign } from '@/hooks/useCampaign';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShareIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import DefaultFlow from './DefaultFlow';
import { useState } from 'react';

/**
 * Social Media Campaign Flow
 * Optimized for users discovering us through social platforms
 */
export default function SocialMediaFlow() {
  const { campaign, context } = useCampaign();
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  if (!showWelcome) {
    return <DefaultFlow campaignContext={context} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light to-sand-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-gentle-fade">
        
        {/* Social Media Welcome */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-medium mb-4 border border-gold-200">
            <ShareIcon className="w-4 h-4 mr-2" />
            Welcome from Social Media!
          </div>
          
          <h1 className="text-hero mb-4 text-navy-900">
            Ready to Find Your Path?
          </h1>
          
          <p className="text-subtitle text-slate-600 mb-6">
            Join thousands discovering inner steadiness through personalized contemplative practices.
          </p>
        </div>

        {/* Social Proof */}
        <Card className="bg-white border-gold-200">
          <CardHeader>
            <CardTitle className="flex items-center text-navy-800">
              <SparklesIcon className="w-6 h-6 mr-2 text-gold-600" />
              Why People Love Keel Stone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-sand-50 rounded-lg">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium text-navy-800">94% Report</div>
                <div className="text-xs text-slate-600">Reduced anxiety in 7 days</div>
              </div>
              <div className="p-4 bg-sand-50 rounded-lg">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm font-medium text-navy-800">4.8/5 Stars</div>
                <div className="text-xs text-slate-600">Average user rating</div>
              </div>
              <div className="p-4 bg-sand-50 rounded-lg">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm font-medium text-navy-800">Private & Secure</div>
                <div className="text-xs text-slate-600">Your data stays yours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card className="bg-white border-navy-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy-800 mb-4">What Happens Next?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gold-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-sm text-slate-700">5-minute assessment about your struggles and preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gold-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-sm text-slate-700">AI creates your personalized 21-day practice plan</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gold-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-sm text-slate-700">Daily 5-20 minute practices delivered to your inbox</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className="bg-accent text-white hover:bg-olive-600 font-semibold px-8"
          >
            Start Your Free Assessment
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-slate-500 mt-2">
            Takes less than 90 seconds • No account required yet
          </p>
        </div>
      </div>
    </div>
  );
}
