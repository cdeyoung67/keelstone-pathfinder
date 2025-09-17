'use client';

import { useState } from 'react';
import IntakeForm from '@/components/intake/IntakeForm';
import PlanDisplay from '@/components/plan/PlanDisplay';
import PlanPreview from '@/components/plan/PlanPreview';
import LoadingState from '@/components/ui/LoadingState';
import KeelStoneLogo from '@/components/ui/KeelStoneLogo';
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
  ArrowLeftIcon
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

  const handleStartPathfinder = () => {
    setShowIntake(true);
    setError(null);
  };

  const handleStartJourney = async () => {
    if (!currentPlan) return;
    
    setIsLoading(true);
    try {
      // TODO: In production, this would:
      // 1. Save assessment and plan to database
      // 2. Create personalized LLM prompts for each day
      // 3. Set up cron job/email automation
      // 4. Subscribe user to Kit.com drip campaign
      
      // Mock the commitment process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasCommittedToJourney(true);
      
      // Initialize progress tracking for the committed journey
      setUserProgress({
        planId: currentPlan.id,
        completedDays: [],
        skippedDays: [],
        currentStreak: 0,
        lastActivity: new Date(),
        feedback: []
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start journey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconfigure = () => {
    // Debug logging
    console.log('handleReconfigure called!');
    console.log('handleReconfigure currentPlan:', currentPlan);
    console.log('handleReconfigure assessment:', currentPlan?.assessment);
    console.log('Setting showIntake to true');
    
    // Reset to intake form starting at step 2 (keeping name/email)
    // Don't clear currentPlan yet - we need it for initialData
    setHasCommittedToJourney(false);
    setUserProgress(null);
    setShowIntake(true);
    setError(null);
    
    console.log('handleReconfigure completed');
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
        feedback: []
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
      <div className="min-h-screen flex">
      {/* Vertical Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-32 bg-navy-900 flex-col">
        {/* Logo at top */}
        <div className="px-3 py-6 border-b border-navy-700 flex justify-center">
          <KeelStoneLogo size="md" />
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-3 py-6 flex justify-center">
          <button
            onClick={handleStartOver}
            className="text-caption text-sand-200 hover:text-sand-100 underline focus-ring text-center"
          >
            <ArrowLeftIcon className="w-4 h-4 inline mr-1" />
            Start Over
          </button>
        </div>
      </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900 py-3 px-4 z-10 flex justify-between items-center">
          <KeelStoneLogo size="sm" />
          <button
            onClick={handleStartOver}
            className="text-caption text-sand-200 hover:text-sand-100 underline focus-ring"
          >
            <ArrowLeftIcon className="w-4 h-4 inline mr-1" />
            Start Over
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-section">
          <div className="max-w-4xl mx-auto py-8 pt-20 md:pt-8 px-6">
            {hasCommittedToJourney ? (
              <PlanDisplay 
                plan={currentPlan} 
                progress={userProgress || undefined}
                onProgressUpdate={handleProgressUpdate}
              />
            ) : (
              <PlanPreview
                plan={currentPlan}
                onStartJourney={handleStartJourney}
                onReconfigure={handleReconfigure}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Vertical Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-32 bg-navy-900 flex-col">
        {/* Logo at top */}
        <div className="px-3 py-6 border-b border-navy-700 flex justify-center">
          <KeelStoneLogo size="md" />
        </div>
        
        {/* Navigation space for future use */}
        <div className="flex-1 px-3 py-6">
          {/* Future navigation items can go here */}
        </div>
      </div>

      {/* Mobile Header - Visible only on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900 py-3 px-4 z-10">
        <KeelStoneLogo size="sm" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-hero">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-12 pt-20 md:pt-12">
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
              Break free from digital overwhelm with a personalized 14-day practice plan. 
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
                  Get a custom 14-day plan based on cardinal virtues
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
        </div>
      </div>

      {/* Modals */}
      {showIntake && (
        <>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ position: 'fixed', top: 0, left: 0, background: 'black', color: 'white', padding: '10px', zIndex: 9999, fontSize: '12px' }}>
              <div>showIntake: {showIntake ? 'YES' : 'NO'}</div>
              <div>Has currentPlan: {currentPlan ? 'YES' : 'NO'}</div>
              <div>Has assessment: {currentPlan?.assessment ? 'YES' : 'NO'}</div>
              <div>hasCommittedToJourney: {hasCommittedToJourney ? 'YES' : 'NO'}</div>
              <div>StartStep: {currentPlan?.assessment ? 2 : 1}</div>
              {currentPlan?.assessment && (
                <div>Email: {currentPlan.assessment.email}</div>
              )}
            </div>
          )}
          <IntakeForm 
            onSubmit={handleIntakeSubmit}
            onClose={() => setShowIntake(false)}
            initialData={currentPlan?.assessment}
            startStep={currentPlan?.assessment ? 2 : 1}
          />
        </>
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
    </div>
  );
}