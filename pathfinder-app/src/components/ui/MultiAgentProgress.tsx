'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, Cog6ToothIcon, ClockIcon } from '@heroicons/react/24/outline';
import { config, getVerbosityLevel, getVerbosityMessages } from '@/lib/config';

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  agent?: string;
  estimatedTime?: number;
  actualTime?: number;
}

interface MultiAgentProgressProps {
  isActive: boolean;
  onComplete?: () => void;
  customSteps?: ProgressStep[];
  currentStep?: string; // External step control
  apiInProgress?: boolean; // Whether real API is running
}

export default function MultiAgentProgress({ 
  isActive, 
  onComplete,
  customSteps,
  currentStep,
  apiInProgress = false
}: MultiAgentProgressProps) {
  const verbosity = getVerbosityLevel();
  const messages = getVerbosityMessages();
  
  // Default progress steps based on verbosity
  const getDefaultSteps = (): ProgressStep[] => {
    const baseSteps: ProgressStep[] = [
      {
        id: 'analyze',
        label: 'Analyzing your struggles and preferences',
        status: 'pending',
        estimatedTime: 1000
      },
      {
        id: 'select',
        label: 'Selecting specialized agents for your journey',
        status: 'pending',
        estimatedTime: 500
      },
      {
        id: 'orchestrate',
        label: 'Concierge Agent: Orchestrating your personalized path',
        status: 'pending',
        agent: 'Concierge',
        estimatedTime: 2000
      }
    ];

    // Add verbosity-specific steps
    if (verbosity === 'high') {
      baseSteps.push(
        {
          id: 'path-agent',
          label: 'Path Agent: Creating spiritual practices framework',
          status: 'pending',
          agent: 'Christian/Secular',
          estimatedTime: 3000
        },
        {
          id: 'virtue-agent',
          label: 'Virtue Agent: Developing specialized guidance',
          status: 'pending',
          agent: 'Virtue SME',
          estimatedTime: 2000
        },
        {
          id: 'integrate',
          label: 'Integrating multi-agent insights',
          status: 'pending',
          estimatedTime: 1000
        }
      );
    } else if (verbosity === 'medium') {
      baseSteps.push(
        {
          id: 'specialists',
          label: 'AI specialists creating your practices',
          status: 'pending',
          estimatedTime: 4000
        }
      );
    } else if (verbosity === 'low') {
      baseSteps.push(
        {
          id: 'crafting',
          label: 'Crafting your 21-day journey',
          status: 'pending',
          estimatedTime: 4000
        }
      );
    }

    baseSteps.push({
      id: 'finalize',
      label: 'Finalizing your personalized plan',
      status: 'pending',
      estimatedTime: 500
    });

    return baseSteps;
  };

  const [steps, setSteps] = useState<ProgressStep[]>(customSteps || getDefaultSteps());
  const [startTime, setStartTime] = useState<number | null>(null);

  // Update steps based on external currentStep prop
  useEffect(() => {
    if (!isActive) return;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    // Map currentStep message to step progression
    if (currentStep) {
      setSteps(prev => {
        const updated = [...prev];
        
        // Find which step should be active based on currentStep message
        let activeIndex = -1;
        
        if (currentStep.includes('Making API request') || currentStep.includes('Analyzing')) {
          activeIndex = 0; // analyze step
        } else if (currentStep.includes('Processing response') || currentStep.includes('Selecting')) {
          activeIndex = 1; // select step
        } else if (currentStep.includes('Orchestrating') || currentStep.includes('Concierge')) {
          activeIndex = 2; // orchestrate step
        } else if (currentStep.includes('Creating') || currentStep.includes('Path Agent')) {
          activeIndex = 3; // path-agent step
        } else if (currentStep.includes('Developing') || currentStep.includes('Virtue Agent')) {
          activeIndex = 4; // virtue-agent step
        } else if (currentStep.includes('Integrating') || currentStep.includes('specialists')) {
          activeIndex = 5; // integrate step
        } else if (currentStep.includes('Finalizing') || currentStep.includes('Response processed')) {
          activeIndex = updated.length - 1; // final step
        }

        if (activeIndex >= 0 && activeIndex < updated.length) {
          // Mark previous steps as completed
          for (let i = 0; i < activeIndex; i++) {
            if (updated[i].status !== 'completed') {
              updated[i] = { ...updated[i], status: 'completed' };
            }
          }
          
          // Mark current step as in progress
          if (updated[activeIndex].status !== 'completed') {
            updated[activeIndex] = { ...updated[activeIndex], status: 'in_progress' };
          }
        }
        
        return updated;
      });
    }
  }, [currentStep, isActive, startTime]);

  // Handle completion when API finishes - ONLY complete when explicitly told
  useEffect(() => {
    if (!apiInProgress && isActive && currentStep?.includes('processed successfully')) {
      // Mark all steps as completed but DON'T auto-complete
      setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
      
      // DO NOT auto-complete - wait for parent to call onComplete
      // The parent component will call onComplete when it's ready to show results
    }
  }, [apiInProgress, currentStep, isActive]);

  // Reset when becoming inactive
  useEffect(() => {
    if (!isActive) {
      setSteps(customSteps || getDefaultSteps());
      setStartTime(null);
    }
  }, [isActive, customSteps]);

  if (!isActive || verbosity === 'off') {
    return null;
  }

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const elapsedTime = startTime ? Date.now() - startTime : 0;
  const allStepsCompleted = completedSteps === totalSteps && 
    (currentStep?.includes('processed successfully') || 
     currentStep?.includes('Finalizing') || 
     !apiInProgress);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {messages.planGeneration || "Creating your personalized journey..."}
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Stats */}
        {config.showResponseTimes && (
          <div className="flex justify-center gap-4 text-sm text-gray-600 mb-4">
            <span>{completedSteps} of {totalSteps} steps completed</span>
            <span>•</span>
            <span>{(elapsedTime / 1000).toFixed(1)}s elapsed</span>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'completed' 
                ? 'bg-green-50 border border-green-200' 
                : step.status === 'in_progress'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              )}
              {step.status === 'in_progress' && (
                <Cog6ToothIcon className="h-5 w-5 text-blue-600 animate-spin" />
              )}
              {step.status === 'pending' && (
                <ClockIcon className="h-5 w-5 text-gray-400" />
              )}
              {step.status === 'error' && (
                <div className="h-5 w-5 rounded-full bg-red-500" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-grow">
              <div className={`font-medium ${
                step.status === 'completed' ? 'text-green-800' :
                step.status === 'in_progress' ? 'text-blue-800' :
                'text-gray-600'
              }`}>
                {step.label}
              </div>
              
              {/* Agent Info (High Verbosity) */}
              {verbosity === 'high' && step.agent && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.agent} Agent
                </div>
              )}
            </div>

            {/* Timing Info (Debug Mode) */}
            {config.showResponseTimes && step.actualTime && (
              <div className="text-xs text-gray-500">
                {(step.actualTime / 1000).toFixed(1)}s
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Message */}
      {verbosity === 'high' && !allStepsCompleted && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            🤖 Multiple AI agents are working together to create your personalized journey
          </p>
        </div>
      )}

      {/* Next Button - Only shows when all steps are completed */}
      <div className="mt-6 text-center">
        <button
          onClick={() => allStepsCompleted && onComplete?.()}
          disabled={!allStepsCompleted}
          className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
            allStepsCompleted
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer transform hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allStepsCompleted ? (
            <>
              <CheckCircleIcon className="h-5 w-5 inline mr-2" />
              View Your Personalized Plan
            </>
          ) : (
            <>
              <Cog6ToothIcon className="h-5 w-5 inline mr-2 animate-spin" />
              Please wait...
            </>
          )}
        </button>
        
        {allStepsCompleted && (
          <p className="text-sm text-green-600 mt-2">
            ✨ Your personalized 21-day journey is ready!
          </p>
        )}
      </div>
    </div>
  );
}
