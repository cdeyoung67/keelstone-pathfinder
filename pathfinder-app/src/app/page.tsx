'use client';

import { useState } from 'react';
import IntakeForm from '@/components/intake/IntakeForm';
import PlanDisplay from '@/components/plan/PlanDisplay';
import PlanPreview from '@/components/plan/PlanPreview';
import JourneyGateway from '@/components/journey/JourneyGateway';
import LoadingState from '@/components/ui/LoadingState';
import AppLayout from '@/components/ui/AppLayout';
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
import { Assessment, PersonalizedPlan, UserProgress } from '@/lib/types';
import { generateMockPlan } from '@/lib/mock-llm';

export default function Home() {
  const [showIntake, setShowIntake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PersonalizedPlan | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCommittedToJourney, setHasCommittedToJourney] = useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);

  const handleStartPathfinder = () => {
    setShowIntake(true);
    setError(null);
  };

  const handleStartJourney = async () => {
    if (!currentPlan) return;
    
    // Go to gateway page instead of directly starting the full journey
    setShowGateway(true);
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      // TODO: In production, this would:
      // 1. Show account creation modal/form
      // 2. Create user account
      // 3. Save assessment and plan to database
      // 4. Create personalized LLM prompts for each day
      // 5. Set up cron job/email automation
      // 6. Subscribe user to Kit.com drip campaign
      
      // Mock the account creation process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasAccount(true);
      setHasCommittedToJourney(true);
      
      // Initialize progress tracking for the committed journey
      if (currentPlan) {
        setUserProgress({
          planId: currentPlan.id,
          completedDays: [],
          skippedDays: [],
          currentStreak: 0,
          lastActivity: new Date(),
          feedback: [],
          // Phase 2: Interactive tracking
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
    // Reset to intake form starting at step 2 (keeping name/email)
    // Don't clear currentPlan yet - we need it for initialData
    setHasCommittedToJourney(false);
    setShowGateway(false);
    setHasAccount(false);
    setUserProgress(null);
    setShowIntake(true);
    setError(null);
  };

  const handleIntakeSubmit = async (assessment: Assessment) => {
    setIsLoading(true);
    setShowIntake(false);
    setError(null);
    
    // Clear currentPlan now that we have new assessment data
    setCurrentPlan(null);

    try {
      // TODO: In production, integrate with Kit.com API here
      // Example Kit.com integration:
      // await kitApi.subscribers.create({
      //   email: assessment.email,
      //   first_name: assessment.firstName,
      //   last_name: assessment.lastName,
      //   tags: [assessment.door, assessment.primaryVirtue],
      //   custom_fields: {
      //     struggles: assessment.struggles.join(','),
      //     time_budget: assessment.timeBudget,
      //     daypart: assessment.daypart
      //   }
      // });
      
      // Mock delay and plan generation
      const plan = await generateMockPlan(assessment);
      setCurrentPlan(plan);
      
      // Initialize progress tracking
      setUserProgress({
        planId: plan.id,
        completedDays: [],
        skippedDays: [],
        currentStreak: 0,
        lastActivity: new Date(),
        feedback: [],
        // Phase 2: Interactive tracking
        dailyProgress: {},
        totalChallengesCompleted: 0,
        fruitGrowth: {},
        badges: []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = (day: number, completed: boolean) => {
    if (!userProgress) return;

    setUserProgress(prev => {
      if (!prev) return prev;
      
      const newCompleted = completed 
        ? [...prev.completedDays, day].sort((a, b) => a - b)
        : prev.completedDays.filter(d => d !== day);
      
      return {
        ...prev,
        completedDays: newCompleted,
        currentStreak: calculateStreak(newCompleted),
        lastActivity: new Date()
      };
    });
  };

  const calculateStreak = (completedDays: number[]): number => {
    if (completedDays.length === 0) return 0;
    
    const sorted = [...completedDays].sort((a, b) => b - a);
    let streak = 1;
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i-1] - sorted[i] === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const handleStartOver = () => {
    setCurrentPlan(null);
    setUserProgress(null);
    setHasCommittedToJourney(false);
    setShowGateway(false);
    setHasAccount(false);
    setError(null);
  };

  if (error) {
  return (
      <div className="min-h-screen bg-hero flex items-center justify-center p-4">
        <div className="max-w-md w-full card p-6 text-center">
          <div className="text-gold-500 mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 mx-auto" />
          </div>
          <h2 className="text-title mb-2">Oops! Something went wrong</h2>
          <p className="text-body mb-4">{error}</p>
          <button
            onClick={handleStartOver}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentPlan) {
    return (
      <AppLayout 
        showBackButton 
        onBackClick={handleStartOver}
        backButtonText="Start Over"
      >

        {hasCommittedToJourney && hasAccount ? (
          <PlanDisplay 
            plan={currentPlan} 
            progress={userProgress || undefined}
            onProgressUpdate={handleProgressUpdate}
            onGratitudeSave={(day, entries) => {
              // TODO: Persist gratitude entries
              console.log('Gratitude saved for day', day, ':', entries);
            }}
            onMindfulMinuteComplete={(day, duration, notes) => {
              // TODO: Persist mindful minute session
              console.log('Mindful minute completed for day', day, ':', { duration, notes });
            }}
          />
        ) : showGateway ? (
          <JourneyGateway
            plan={currentPlan}
            userEmail={currentPlan?.assessment?.email}
            onCreateAccount={handleCreateAccount}
            onBackToPlan={handleBackToPlan}
          />
        ) : (
          <PlanPreview
            plan={currentPlan}
            onStartJourney={handleStartJourney}
            onReconfigure={handleReconfigure}
          />
        )}
      </AppLayout>
    );
  }

  return (
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
            
            <button
              onClick={handleStartPathfinder}
              className="btn-primary text-lg px-8 py-4 rounded-xl inline-flex items-center transform hover:scale-105 transition-all duration-200"
            >
              <MapIcon className="w-5 h-5 mr-2" />
              Start Your Pathfinder
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            
            <p className="text-caption mt-2">
              Takes less than 90 seconds • No account required
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
            <div className="card-elevated text-center p-6">
              <div className="flex justify-center mb-4">
                <UserIcon className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-title mb-2">Personalized</h3>
              <p className="text-body text-sm">
                Your plan adapts to your struggles, schedule, and spiritual preferences
              </p>
            </div>
            
            <div className="card-elevated text-center p-6">
              <div className="flex justify-center mb-4">
                <ClockIcon className="w-8 h-8 text-olive-500" />
              </div>
              <h3 className="text-title mb-2">Bite-Sized</h3>
              <p className="text-body text-sm">
                5-20 minute daily practices that fit into your real life
              </p>
            </div>
            
            <div className="card-elevated text-center p-6">
              <div className="flex justify-center mb-4">
                <ArrowPathRoundedSquareIcon className="w-8 h-8 text-navy-600" />
              </div>
              <h3 className="text-title mb-2">Two Paths</h3>
              <p className="text-body text-sm">
                Christian (with Scripture) or Secular (with philosophy)—your choice
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-16">
            <p className="text-subtitle text-slate-500 mb-6">Join others finding peace in a chaotic world</p>
            <div className="flex justify-center space-x-8 text-caption">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-olive-500" />
                <span>94% report reduced anxiety</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-4 h-4 text-gold-500" />
                <span>4.8/5 average rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4 text-navy-600" />
                <span>Private & secure</span>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="card p-8">
            <h2 className="text-display text-center mb-8">
              How Your Pathfinder Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center space-contemplative">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold-200">
                  <DocumentTextIcon className="w-6 h-6 text-gold-700" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2">Quick Assessment</h3>
                <p className="text-body text-sm">
                  Tell us your struggles and preferences in under 90 seconds
                </p>
              </div>
              
              <div className="text-center space-contemplative">
                <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-olive-200">
                  <CpuChipIcon className="w-6 h-6 text-olive-700" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2">AI Personalization</h3>
                <p className="text-body text-sm">
                  Get a custom 21-day plan based on cardinal virtues
                </p>
              </div>
              
              <div className="text-center space-contemplative">
                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-navy-200">
                  <BookOpenIcon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="font-serif font-semibold text-navy-900 mb-2">Daily Practice</h3>
                <p className="text-body text-sm">
                  Follow simple, meaningful practices each day
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

      {/* Modals */}
      {showIntake && (
        <IntakeForm 
          onSubmit={handleIntakeSubmit}
          onClose={() => setShowIntake(false)}
          initialData={currentPlan?.assessment}
          startStep={currentPlan?.assessment ? 2 : 1}
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
    </AppLayout>
  );
}