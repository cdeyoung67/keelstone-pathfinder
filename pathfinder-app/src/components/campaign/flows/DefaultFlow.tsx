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
        <div className="text-center mb-12 animate-gentle-fade">
          
          <h1 className="text-hero mb-6">
            Find Your Path to{" "}
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #C9A45C 0%, #708C69 100%)'
            }}>
              Inner Steadiness
            </span>
          </h1>
          
          <p className="text-subtitle text-slate-600 mb-6 max-w-3xl mx-auto">
            Break free from digital overwhelm with a personalized 21-day practice plan. 
            Choose your path—Christian or secular—and discover daily habits that bring calm, clarity, and purpose.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleStartPathfinder}
              className="btn-primary group"
            >
              <MapIcon className="w-5 h-5 mr-2" />
              Start Your Pathfinder
              <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-caption">Takes less than 90 seconds • No account required</p>
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-contemplative">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <UserIcon className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-2">Personalized</h3>
            <p className="text-body text-sm">
              Your plan adapts to your struggles, schedule, and spiritual preferences
            </p>
          </div>

          <div className="text-center space-contemplative">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <ClockIcon className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-2">Bite-Sized</h3>
            <p className="text-body text-sm">
              5-20 minute daily practices that fit into your real life
            </p>
          </div>

          <div className="text-center space-contemplative">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <ArrowPathRoundedSquareIcon className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-serif font-semibold text-navy-900 mb-2">Two Paths</h3>
            <p className="text-body text-sm">
              Christian (with Scripture) or Secular (with philosophy)—your choice
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-section mb-8">Join others finding peace in a chaotic world</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <ChartBarIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">94% report reduced anxiety</h3>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <StarIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">4.8/5 average rating</h3>
            </div>

            <div className="text-center space-contemplative">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
                <ShieldCheckIcon className="w-6 h-6 text-slate-700" />
              </div>
              <h3 className="font-serif font-semibold text-navy-900 mb-2">Private & secure</h3>
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
