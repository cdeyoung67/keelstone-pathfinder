'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  EnvelopeIcon,
  UserPlusIcon,
  SparklesIcon,
  LockClosedIcon,
  CheckCircleIcon,
  HeartIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import type { PersonalizedPlan, DailyPractice } from '@/lib/types';

interface JourneyGatewayProps {
  plan: PersonalizedPlan;
  userEmail?: string;
  onCreateAccount?: () => void;
  onBackToPlan?: () => void;
  className?: string;
}

export default function JourneyGateway({ 
  plan, 
  userEmail,
  onCreateAccount,
  onBackToPlan,
  className = '' 
}: JourneyGatewayProps) {
  const [emailSent, setEmailSent] = useState(false);
  
  const dayOnePractice = plan.daily[0];
  
  const handleSendToEmail = () => {
    // Mock email sending
    setEmailSent(true);
    // In real implementation, this would trigger an API call
    console.log('Sending Day 1 preview to email:', userEmail);
  };

  const lockedFeatures = [
    { name: 'Interactive Reflections', icon: BookOpenIcon, description: 'Write and save your daily reflections' },
    { name: 'Challenge Tracking', icon: StarIcon, description: 'Mark challenges complete and build streaks' },
    { name: 'Fruit Dashboard', icon: SparklesIcon, description: 'Watch your spiritual fruit grow visually' },
    { name: 'Achievement System', icon: CheckCircleIcon, description: 'Unlock courage-themed achievements' },
    { name: 'Progress Milestones', icon: ArrowRightIcon, description: 'Celebrate major journey milestones' },
    { name: 'Community Sharing', icon: HeartIcon, description: 'Share reflections with fellow travelers' }
  ];

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SparklesIcon className="w-8 h-8 text-gold-600" />
          <h1 className="text-3xl font-serif font-bold text-navy-900">
            Your Courage Journey Begins!
          </h1>
        </div>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We've prepared your personalized 21-day courage transformation. 
          Here's a preview of Day 1 to get you started.
        </p>
        
        <Badge className="bg-gold-100 text-gold-800 px-4 py-1 flex items-center gap-2">
          {plan.door === 'christian' ? (
            <>
              <HeartIcon className="w-4 h-4" />
              Christian Path
            </>
          ) : (
            <>
              <StarIcon className="w-4 h-4" />
              Secular Path
            </>
          )} • 21 Days • {plan.virtue} Focus
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Day 1 Preview - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  Day 1 Preview: {dayOnePractice.title}
                </CardTitle>
                <Badge variant="secondary">Day 1 of 21</Badge>
              </div>
              <CardDescription>
                Your courage journey starts here. This is just a taste of what's waiting for you!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Quote Preview */}
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="p-1">
                    <SparklesIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy-900 mb-2">Today's Inspiration</h4>
                    <blockquote className="text-slate-700 italic border-l-4 border-gold-300 pl-4">
                      "{dayOnePractice.quote.text.substring(0, 120)}..."
                    </blockquote>
                    <div className="text-xs text-slate-500 mt-2">
                      — {dayOnePractice.quote.author}
                    </div>
                  </div>
                </div>
              </div>

              {/* Christian UX Preview (if applicable) */}
              {plan.door === 'christian' && dayOnePractice.openingPrayer && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <HeartIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-navy-900 mb-2">Opening Prayer</h4>
                        <p className="text-slate-700 text-sm">
                          {dayOnePractice.openingPrayer?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>

                  {dayOnePractice.scriptureAnchor && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <BookOpenIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-navy-900 mb-2">Scripture & Anchor</h4>
                          <p className="text-slate-700 text-sm">
                            {dayOnePractice.scriptureAnchor?.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Practice Preview */}
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <StarIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-navy-900 mb-2">Today's Practice</h4>
                    <p className="text-slate-700 text-sm">
                      {dayOnePractice.steps[0]?.substring(0, 150)}...
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        +{dayOnePractice.steps.length - 1} more steps
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locked Content Teaser */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative">
                <div className="absolute top-2 right-2">
                  <LockClosedIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="opacity-60">
                  <h4 className="font-medium text-slate-700 mb-2">Interactive Features</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-300 rounded"></div>
                      <span>Reflection journaling with save functionality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-300 rounded"></div>
                      <span>Challenge completion tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-300 rounded"></div>
                      <span>Fruit of the Spirit check-ins</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge className="bg-slate-200 text-slate-600 flex items-center gap-1 w-fit">
                    <LockClosedIcon className="w-3 h-3" />
                    Unlock with free account
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EnvelopeIcon className="w-6 h-6 text-green-600" />
                Check Your Email
              </CardTitle>
              <CardDescription>
                We've sent your complete Day 1 practice to your email for easy access.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {userEmail ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <EnvelopeIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-navy-900">Email sent to:</p>
                        <p className="text-sm text-green-600">{userEmail}</p>
                      </div>
                      {emailSent && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  </div>
                  
                  {!emailSent && (
                    <Button 
                      onClick={handleSendToEmail}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      Send Day 1 to My Email
                    </Button>
                  )}
                  
                  {emailSent && (
                    <div className="text-center p-4 bg-green-100 rounded-lg">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-800">
                        Day 1 practice sent! Check your inbox and spam folder.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                  <EnvelopeIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-800">
                    Provide your email to receive Day 1 directly in your inbox!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Creation CTA - Right Column */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-gold-50 to-orange-50 border-gold-300 border-2 sticky top-6">
            <CardHeader className="text-center">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <UserPlusIcon className="w-6 h-6 text-gold-600" />
                Create Your Free Account
              </CardTitle>
              <CardDescription>
                Unlock the full 21-day interactive experience
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Locked Features List */}
              <div className="space-y-3">
                <h4 className="font-medium text-navy-900 text-sm flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4 text-gold-600" />
                  What you'll unlock:
                </h4>
                {lockedFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-2 bg-white rounded-lg border border-gold-100">
                      <div className="p-1">
                        <IconComponent className="w-5 h-5 text-gold-600" />
                      </div>
                      <div>
                        <div className="font-medium text-navy-900 text-sm">{feature.name}</div>
                        <div className="text-xs text-slate-600">{feature.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>100% Free - No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Track progress across all 21 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Visual growth & achievement system</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Community sharing & encouragement</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                onClick={onCreateAccount}
                size="lg"
                className="w-full bg-gold-600 hover:bg-gold-700 text-navy-900 font-semibold text-base py-3"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Create Free Account
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>

              {/* Alternative */}
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onBackToPlan}
                  className="text-slate-600 hover:text-navy-900"
                >
                  ← Back to Plan Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
