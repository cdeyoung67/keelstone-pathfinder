'use client';

import { useEffect, useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { Card } from './card';

interface LoadingStateProps {
  message?: string;
  estimatedTime?: number; // in milliseconds
  onCancel?: () => void;
}

const LOADING_MESSAGES = [
  "Analyzing your struggles and preferences...",
  "Selecting practices that resonate with your journey...",
  "Crafting your personalized daily anchors...",
  "Choosing quotes that speak to your heart...",
  "Finalizing your 21-day transformation path..."
];

export default function LoadingState({ 
  message, 
  estimatedTime = 2000,
  onCancel 
}: LoadingStateProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, estimatedTime / LOADING_MESSAGES.length);

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev; // Don't complete until actual completion
        return prev + (100 / (estimatedTime / 100));
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [estimatedTime]);

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card variant="interactive" size="lg" className="max-w-md w-full text-center animate-gentle-fade">
        {/* Animated Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">
          Creating Your Personal Plan
        </h3>

        {/* Dynamic Message */}
        <p className="text-sm text-gray-600 mb-6 min-h-[3rem] flex items-center justify-center">
          {message || LOADING_MESSAGES[currentMessage]}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-selected h-2 rounded-full transition-all duration-300 ease-out animate-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This usually takes {Math.round(estimatedTime / 1000)} seconds...
          </p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900 text-sm underline focus-ring rounded transition-colors duration-200"
          >
            Cancel
          </button>
        )}

        {/* Encouraging Note */}
        <div className="mt-6 p-4 bg-selected-bg rounded-lg border border-selected/20">
          <p className="text-sm text-gray-900">
            <LightBulbIcon className="w-4 h-4 inline mr-1 text-selected" />
            <strong>Did you know?</strong> Personalized practices are 3x more likely to become lasting habits than generic ones.
          </p>
        </div>
      </Card>
    </div>
  );
}
