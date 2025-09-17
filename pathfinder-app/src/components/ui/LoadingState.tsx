'use client';

import { useEffect, useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';

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
  "Finalizing your 14-day transformation path..."
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
    <div className="fixed inset-0 bg-navy-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full p-8 text-center animate-gentle-fade">
        {/* Animated Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sand-100 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-title mb-2">
          Creating Your Personal Plan
        </h3>

        {/* Dynamic Message */}
        <p className="text-body mb-6 min-h-[3rem] flex items-center justify-center">
          {message || LOADING_MESSAGES[currentMessage]}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-sand-300 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-caption mt-2">
            This usually takes {Math.round(estimatedTime / 1000)} seconds...
          </p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 text-sm underline focus-ring rounded"
          >
            Cancel
          </button>
        )}

        {/* Encouraging Note */}
        <div className="mt-6 p-4 bg-gold-50 rounded-lg border border-gold-200">
          <p className="text-sm text-gold-800">
            <LightBulbIcon className="w-4 h-4 inline mr-1 text-gold-600" />
            <strong>Did you know?</strong> Personalized practices are 3x more likely to become lasting habits than generic ones.
          </p>
        </div>
      </div>
    </div>
  );
}
