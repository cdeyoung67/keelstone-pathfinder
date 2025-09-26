'use client';

import { useState, useEffect } from 'react';
import { Assessment, PersonalizedPlan, UserProgress, CampaignContext } from '@/lib/types';
import IntakeForm from '@/components/intake/IntakeForm';
import PlanDisplay from '@/components/plan/PlanDisplay';
import PlanPreview from '@/components/plan/PlanPreview';
import JourneyGateway from '@/components/journey/JourneyGateway';
import LoadingState from '@/components/ui/LoadingState';
import MultiAgentProgress from '@/components/ui/MultiAgentProgress';
import AppLayout from '@/components/ui/AppLayout';
import EnvironmentBanner from '@/components/ui/EnvironmentBanner';
import { generatePlan } from '@/lib/api';
import { config, getVerbosityLevel } from '@/lib/config';

import {
  UserIcon,
  ClockIcon,
  ArrowPathRoundedSquareIcon,
  ChartBarIcon,
  StarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CpuChipIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface DefaultFlowProps {
  campaignContext?: CampaignContext;
  initialStep?: 'landing' | 'intake' | 'plan';
  day6Reflection?: string;
}

/**
 * Default Flow Component
 * This is the main application flow that works for all campaigns
 * It's the original page.tsx logic but cleaned up and componentized
 */
export default function DefaultFlow({ 
  campaignContext, 
  initialStep = 'landing',
  day6Reflection 
}: DefaultFlowProps) {
  // All the original state from page.tsx
  const [showIntake, setShowIntake] = useState(initialStep === 'intake');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PersonalizedPlan | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCommittedToJourney, setHasCommittedToJourney] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [showMultiAgentProgress, setShowMultiAgentProgress] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [apiInProgress, setApiInProgress] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // All the original handlers from page.tsx
  const handleStartPathfinder = () => {
    setShowIntake(true);
    setError(null);
  };

  const handleStartJourney = async () => {
    if (!currentPlan) return;
    setShowGateway(true);
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasAccount(true);
      setHasCommittedToJourney(true);
      
      if (currentPlan) {
        setUserProgress({
          planId: currentPlan.id,
          completedDays: [],
          skippedDays: [],
          currentStreak: 0,
          lastActivity: new Date(),
          feedback: [],
          dailyProgress: {},
          totalChallengesCompleted: 0,
          fruitGrowth: {},
          badges: []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPlan = () => {
    setShowGateway(false);
  };

  const handleReconfigure = () => {
    setCurrentPlan(null);
    setUserProgress(null);
    setHasCommittedToJourney(false);
    setShowGateway(false);
    setShowIntake(true);
    setError(null);
  };

  const handleIntakeSubmit = async (assessment: Assessment) => {
    setIsLoading(true);
    setShowIntake(false);
    setError(null);
    setProgressMessage('');
    
    // Add campaign context to assessment
    const assessmentWithCampaign = {
      ...assessment,
      campaignContext: campaignContext || assessment.campaignContext
    };
    
    setCurrentPlan(null);
    setShowPlan(false);

    const verbosity = getVerbosityLevel();
    if (verbosity !== 'off' && config.enableMultiAgentDisplay) {
      setShowMultiAgentProgress(true);
    }

    try {
      setApiInProgress(true);
      
      const plan = await generatePlan(assessmentWithCampaign, (step: string) => {
        setProgressMessage(step);
        console.log(`Multi-agent progress: ${step}`);
      });
      
      console.log('🎯 Plan generated, storing plan but keeping progress open:', plan.id);
      setCurrentPlan(plan);
      
      setUserProgress({
        planId: plan.id,
        completedDays: [],
        skippedDays: [],
        currentStreak: 0,
        lastActivity: new Date(),
        feedback: [],
        dailyProgress: {},
        totalChallengesCompleted: 0,
        fruitGrowth: {},
        badges: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
      console.error('Multi-agent plan generation failed:', err);
      setShowMultiAgentProgress(false);
    } finally {
      setIsLoading(false);
      setApiInProgress(false);
      setProgressMessage('');
    }
  };

  const handleProgressUpdate = (day: number, completed: boolean) => {
    setUserProgress(prev => {
      if (!prev) return prev;
      
      const newCompletedDays = completed 
        ? [...prev.completedDays, day].sort((a, b) => a - b)
        : prev.completedDays.filter(d => d !== day);
      
      return {
        ...prev,
        completedDays: newCompletedDays,
        currentStreak: calculateStreak(newCompletedDays),
        lastActivity: new Date()
      };
    });
  };

  const calculateStreak = (completedDays: number[]): number => {
    if (completedDays.length === 0) return 0;
    
    const sortedDays = [...completedDays].sort((a, b) => b - a);
    let streak = 1;
    
    for (let i = 1; i < sortedDays.length; i++) {
      if (sortedDays[i-1] - sortedDays[i] === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Placeholder handlers for plan interactions
  const handleReflectionSave = (day: number, reflection: any) => {
    console.log('Reflection saved for day', day, ':', reflection);
  };

  const handleChallengeComplete = (day: number, completed: boolean) => {
    console.log('Challenge completed for day', day, ':', completed);
  };

  const handleFruitUpdate = (day: number, fruits: string[]) => {
    console.log('Fruit updated for day', day, ':', fruits);
  };

  const handleCommunityShare = (day: number, content: string, privacy: string) => {
    console.log('Community share for day', day, ':', { content, privacy });
  };

  const handleWeeklyReflection = (week: number, reflection: any) => {
    console.log('Weekly reflection for week', week, ':', reflection);
  };

  const handleWeeklyShare = (week: number, content: string) => {
    console.log('Weekly share for week', week, ':', content);
  };

  const handleEncourageMember = (userId: string, message: string) => {
    console.log('Encourage member:', userId, message);
  };

  const handlePrayForMember = (userId: string) => {
    console.log('Pray for member:', userId);
  };

  const handleGratitudeSave = (day: number, entries: any[]) => {
    console.log('Gratitude saved for day', day, ':', entries);
  };

  const handleMindfulMinuteComplete = (day: number, duration: number, notes?: string) => {
    console.log('Mindful minute completed for day', day, ':', { duration, notes });
  };

  // Early return for committed journey (plan display)
  if (hasCommittedToJourney && currentPlan && userProgress) {
    return (
      <AppLayout>
        <PlanDisplay 
          plan={currentPlan} 
          progress={userProgress} 
          onProgressUpdate={handleProgressUpdate}
          onClose={() => {
            setHasCommittedToJourney(false);
            setCurrentPlan(null);
            setUserProgress(null);
          }}
          onReflectionSave={handleReflectionSave}
          onChallengeComplete={handleChallengeComplete}
          onFruitUpdate={handleFruitUpdate}
          onCommunityShare={handleCommunityShare}
          onWeeklyReflection={handleWeeklyReflection}
          onWeeklyShare={handleWeeklyShare}
          onEncourageMember={handleEncourageMember}
          onPrayForMember={handlePrayForMember}
          onGratitudeSave={handleGratitudeSave}
          onMindfulMinuteComplete={handleMindfulMinuteComplete}
        />
      </AppLayout>
    );
  }

  // Early return for plan with gateway
  if (currentPlan && showGateway) {
    return (
      <AppLayout>
        <JourneyGateway 
          plan={currentPlan}
          userEmail={currentPlan.assessment?.email}
          onCreateAccount={handleCreateAccount}
          onBackToPlan={handleBackToPlan}
        />
      </AppLayout>
    );
  }

  // Early return for plan preview
  if (currentPlan && !hasCommittedToJourney && !showGateway) {
    return (
      <AppLayout>
        <PlanPreview 
          plan={currentPlan} 
          onStartJourney={handleStartJourney}
          onReconfigure={handleReconfigure}
        />
      </AppLayout>
    );
  }

  // Main landing page
  return (
    <>
      <EnvironmentBanner />
      <AppLayout>
        {/* Main Content */}
        <div className="text-center mb-16 relative z-10">
          
          <h1 className="text-hero mb-8 animate-gentle-fade">
            Find Your Path to{" "}
            <span className="text-transparent bg-clip-text animate-float inline-block" style={{
              backgroundImage: 'linear-gradient(135deg, #C9A45C 0%, #708C69 100%)'
            }}>
              Inner Steadiness
            </span>
          </h1>
          
          <p className="text-subtitle text-slate-600 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed">
            Break free from digital overwhelm with a personalized 21-day practice plan. 
            Choose your path—Christian or secular—and discover daily habits that bring calm, clarity, and purpose.
          </p>
          
          <div className="flex flex-col gap-4 justify-center items-center mb-12 animate-scale-in">
            <button
              onClick={handleStartPathfinder}
              className="btn-primary group transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <MapIcon className="w-5 h-5 mr-2" />
              Start Your Pathfinder
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-caption text-slate-500 text-center">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              <span>Takes less than 90 seconds • No account required</span>
            </div>
          </div>

          {/* Campaign Context Display (for debugging) */}
          {campaignContext && campaignContext.source !== 'direct' && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Campaign: {campaignContext.campaignId} | Source: {campaignContext.source}
                {day6Reflection && <span> | Day 6 Reflection: "{day6Reflection.substring(0, 50)}..."</span>}
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20 animate-slide-up px-4 md:px-0">
          <div className="text-center space-contemplative group">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-200 shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
              <UserIcon className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-3 text-lg">Personalized</h3>
            <p className="text-body text-sm leading-relaxed">
              Your plan adapts to your struggles, schedule, and spiritual preferences
            </p>
          </div>

          <div className="text-center space-contemplative group">
            <div className="w-16 h-16 bg-gradient-to-br from-olive-50 to-olive-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-olive-200 shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
              <ClockIcon className="w-8 h-8 text-olive-600" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-3 text-lg">Bite-Sized</h3>
            <p className="text-body text-sm leading-relaxed">
              5-20 minute daily practices that fit into your real life
            </p>
          </div>

          <div className="text-center space-contemplative group">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-50 to-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-navy-200 shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
              <ArrowPathRoundedSquareIcon className="w-8 h-8 text-navy-600" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-3 text-lg">Two Paths</h3>
            <p className="text-body text-sm leading-relaxed">
              Christian (with Scripture) or Secular (with philosophy)—your choice
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16 md:mb-20 bg-section rounded-2xl md:rounded-3xl p-6 md:p-12 relative overflow-hidden mx-4 md:mx-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-50/30 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-display mb-8 md:mb-12 animate-gentle-fade">Join others finding peace in a chaotic world</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center space-contemplative group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200 shadow-soft group-hover:shadow-medium transition-all duration-300">
                  <ChartBarIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2 text-lg">94% report reduced anxiety</h3>
                <p className="text-sm text-slate-600">Based on 21-day program completers</p>
              </div>

              <div className="text-center space-contemplative group">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-soft group-hover:shadow-medium transition-all duration-300">
                  <StarIcon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2 text-lg">4.8/5 average rating</h3>
                <p className="text-sm text-slate-600">From over 2,000 participants</p>
              </div>

              <div className="text-center space-contemplative group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-200 shadow-soft group-hover:shadow-medium transition-all duration-300">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2 text-lg">Private & secure</h3>
                <p className="text-sm text-slate-600">Your data is never shared or sold</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-section mb-8">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <DocumentTextIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Take Assessment</h3>
              <p className="text-body text-sm">
                Share your struggles, preferences, and available time
              </p>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <CpuChipIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">AI Creates Plan</h3>
              <p className="text-body text-sm">
                Personalized 21-day journey with daily practices
              </p>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <BookOpenIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Daily Practice</h3>
              <p className="text-body text-sm">
                Build lasting habits through gentle, consistent practice
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="text-center">
          <h2 className="text-section mb-8">Track Your Growth</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <ExclamationTriangleIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Gentle Accountability</h3>
              <p className="text-body text-sm">
                Encouraging reminders without guilt or shame
              </p>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <StarIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Celebrate Wins</h3>
              <p className="text-body text-sm">
                Recognition for small steps and consistent effort
              </p>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <CheckCircleIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Track Progress</h3>
              <p className="text-body text-sm">
                Build momentum with gentle progress tracking
              </p>
            </div>
          </div>
        </div>
      </AppLayout>

      {/* Modals */}
      {showIntake && (
        <IntakeForm 
          onSubmit={handleIntakeSubmit}
          onClose={() => setShowIntake(false)}
          initialData={currentPlan?.assessment}
          startStep={currentPlan?.assessment ? 2 : 1}
          campaignContext={campaignContext}
        />
      )}
      
      {isLoading && (
        <LoadingState 
          estimatedTime={2000}
          onCancel={() => {
            setIsLoading(false);
            setShowIntake(true);
          }}
        />
      )}
      
      {/* Multi-Agent Progress Overlay */}
      {showMultiAgentProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <MultiAgentProgress 
            isActive={showMultiAgentProgress}
            onComplete={() => {
              console.log('🎉 User clicked Next - showing plan now');
              setShowMultiAgentProgress(false);
              setShowPlan(true);
            }}
            currentStep={progressMessage}
            apiInProgress={apiInProgress}
          />
        </div>
      )}
    </>
  );
}
