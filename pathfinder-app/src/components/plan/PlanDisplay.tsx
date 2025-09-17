'use client';

import { useState } from 'react';
import { PersonalizedPlan, UserProgress } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';

interface PlanDisplayProps {
  plan: PersonalizedPlan;
  progress?: UserProgress;
  onProgressUpdate?: (day: number, completed: boolean) => void;
  onClose?: () => void;
}

export default function PlanDisplay({ 
  plan, 
  progress, 
  onProgressUpdate,
  onClose 
}: PlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const virtue = VIRTUE_DESCRIPTIONS[plan.virtue];
  const completedDays = progress?.completedDays || [];
  const currentDay = Math.min(completedDays.length + 1, 14);

  const handleDayClick = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const handleToggleComplete = (day: number) => {
    const isCompleted = completedDays.includes(day);
    onProgressUpdate?.(day, !isCompleted);
  };

  const mockExport = (format: 'pdf' | 'png') => {
    // Mock export functionality
    alert(`Mock export as ${format.toUpperCase()} - In production, this would generate and download the file`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 card">
      {/* Header */}
      <div className="text-center mb-8 animate-gentle-fade">
        <div className="inline-flex items-center px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-sm font-medium mb-4 border border-gold-200">
          {plan.door === 'christian' ? '✝️' : '🏛️'} {plan.door === 'christian' ? 'Christian Path' : 'Secular Path'}
          {plan.door === 'christian' && <span className="ml-2 text-xs opacity-75">({plan.daily[0]?.quote.bibleVersion?.toUpperCase()})</span>}
        </div>
        
        <h1 className="text-hero mb-2">
          Your 14-Day {virtue.title} Practice
        </h1>
        <p className="text-subtitle mb-4">{virtue.subtitle}</p>
        
        {/* Anchor Statement */}
        <div className="bg-accent rounded-lg p-6 mb-6 text-sand-100">
          <h2 className="text-lg font-semibold mb-2">Your Daily Anchor</h2>
          <p className="text-quote text-sand-100">&ldquo;{plan.anchor}&rdquo;</p>
        </div>

        {/* Progress Overview */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === currentDay && !isCompleted;
            
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`progress-dot focus-ring ${
                  isCompleted
                    ? 'progress-dot-completed'
                    : isCurrent
                    ? 'progress-dot-current'
                    : selectedDay === day
                    ? 'bg-gold-100 text-gold-800 ring-2 ring-gold-300'
                    : 'progress-dot-pending'
                }`}
              >
                {isCompleted ? '✓' : day}
              </button>
            );
          })}
        </div>

        {/* Export Options */}
        <div className="flex justify-center space-x-3 mb-8">
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="btn-outline focus-ring"
            >
              📄 Export Plan
            </button>
            
            {showExportOptions && (
              <div className="absolute top-full mt-2 left-0 card border border-sand-300 shadow-medium z-10 min-w-max">
                <button
                  onClick={() => mockExport('pdf')}
                  className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-t-lg focus-ring"
                >
                  📄 Download PDF
                </button>
                <button
                  onClick={() => mockExport('png')}
                  className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-b-lg focus-ring"
                >
                  🖼️ Save as Image
                </button>
              </div>
            )}
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="btn-primary focus-ring"
            >
              Start Day 1
            </button>
          )}
        </div>
      </div>

      {/* Daily Practices */}
      <div className="space-y-4">
        {plan.daily.map((practice) => {
          const isCompleted = completedDays.includes(practice.day);
          const isCurrent = practice.day === currentDay && !isCompleted;
          const isExpanded = selectedDay === practice.day;

          return (
            <div
              key={practice.day}
              className={`border rounded-lg transition-all ${
                isCompleted
                  ? 'border-olive-200 bg-olive-50'
                  : isCurrent
                  ? 'border-gold-300 bg-gold-50'
                  : 'border-sand-300 bg-sand-100 hover:border-sand-400'
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <button
                  onClick={() => handleDayClick(practice.day)}
                  className="flex items-center space-x-3 flex-grow text-left focus-ring rounded"
                >
                  <div className={`progress-dot ${
                    isCompleted
                      ? 'progress-dot-completed'
                      : isCurrent
                      ? 'progress-dot-current'
                      : 'progress-dot-pending'
                  }`}>
                    {isCompleted ? '✓' : practice.day}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-navy-900">{practice.title}</h3>
                    <p className="text-caption">{practice.estimatedTime} minutes</p>
                  </div>
                </button>
                
                <div className="flex items-center space-x-2 ml-4">
                  {onProgressUpdate && (
                    <button
                      onClick={() => handleToggleComplete(practice.day)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors focus-ring ${
                        isCompleted
                          ? 'bg-olive-100 text-olive-800 hover:bg-olive-200'
                          : 'bg-sand-200 text-slate-600 hover:bg-sand-300'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Mark Done'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDayClick(practice.day)}
                    className={`p-1 rounded focus-ring transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <span className="text-slate-500">▼</span>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-sand-300">
                  <div className="pt-4 space-contemplative">
                    {/* Steps */}
                    <div>
                      <h4 className="font-serif font-medium text-navy-900 mb-2">Practice Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-body">
                        {practice.steps.map((step, index) => (
                          <li key={index} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Quote */}
                    <div className="bg-sand-200 rounded-lg p-4 border border-sand-300">
                      <blockquote className="text-quote text-navy-800 mb-2">
                        &ldquo;{practice.quote.text}&rdquo;
                      </blockquote>
                      <cite className="text-caption text-slate-600">
                        — {practice.quote.source}
                        {practice.quote.bibleVersion && (
                          <span className="ml-1">({practice.quote.bibleVersion.toUpperCase()})</span>
                        )}
                      </cite>
                    </div>

                    {/* Reflection */}
                    <div>
                      <h4 className="font-serif font-medium text-navy-900 mb-2">Reflection</h4>
                      <p className="text-body">{practice.reflection}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Check-in */}
      <div className="mt-8 bg-gold-50 border border-gold-200 rounded-lg p-6">
        <h3 className="font-serif font-semibold text-gold-900 mb-2">📅 Week 1 & 2 Check-in</h3>
        <p className="text-body text-gold-800">{plan.weeklyCheckin}</p>
      </div>

      {/* Stretch Practice */}
      {plan.stretchPractice && (
        <div className="mt-6 bg-olive-50 border border-olive-200 rounded-lg p-6">
          <h3 className="font-serif font-semibold text-olive-900 mb-2">🌟 Stretch Practice</h3>
          <p className="text-body text-olive-800">{plan.stretchPractice}</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-sand-300 text-center text-caption">
        <p>
          Generated with {plan.version} • Created {plan.createdAt.toLocaleDateString()}
        </p>
        <p className="mt-2 text-slate-500">
          🔒 Your data is private and secure. You can delete it anytime.
        </p>
      </div>
    </div>
  );
}
