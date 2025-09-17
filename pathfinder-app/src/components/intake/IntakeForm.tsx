'use client';

import { useState } from 'react';
import { Assessment, Door, BibleVersion, TimeBudget, Daypart, CardinalVirtue } from '@/lib/types';
import { STRUGGLE_CATEGORIES, BIBLE_VERSIONS, StruggleCategory } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface IntakeFormProps {
  onSubmit: (assessment: Assessment) => void;
  onClose: () => void;
}

export default function IntakeForm({ onSubmit, onClose }: IntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    struggles: [] as string[],
    door: 'secular' as Door,
    bibleVersion: 'niv' as BibleVersion,
    timeBudget: '10-15' as TimeBudget,
    daypart: 'morning' as Daypart,
    context: ''
  });
  
  // State for popup modal in struggles step
  const [selectedCategoryPopup, setSelectedCategoryPopup] = useState<string | null>(null);

  const totalSteps = 5;

  // Determine primary virtue based on selected struggles
  const getPrimaryVirtue = (struggles: string[]): CardinalVirtue => {
    const virtueCount = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };
    
    struggles.forEach(struggleId => {
      const struggle = COMMON_STRUGGLES.find(s => s.id === struggleId);
      if (struggle) {
        virtueCount[struggle.virtue]++;
      }
    });
    
    // Return virtue with highest count, defaulting to wisdom
    return Object.entries(virtueCount).reduce((a, b) => 
      virtueCount[a[0] as CardinalVirtue] > virtueCount[b[0] as CardinalVirtue] ? a : b
    )[0] as CardinalVirtue;
  };

  const handleSubmit = () => {
    const assessment: Assessment = {
      id: `assessment_${Date.now()}`,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      struggles: formData.struggles,
      door: formData.door,
      bibleVersion: formData.door === 'christian' ? formData.bibleVersion : undefined,
      timeBudget: formData.timeBudget,
      daypart: formData.daypart,
      primaryVirtue: getPrimaryVirtue(formData.struggles),
      context: formData.context || undefined,
      createdAt: new Date()
    };
    
    onSubmit(assessment);
  };

  const toggleStruggle = (struggleId: string) => {
    setFormData(prev => ({
      ...prev,
      struggles: prev.struggles.includes(struggleId)
        ? prev.struggles.filter(id => id !== struggleId)
        : [...prev.struggles, struggleId]
    }));
  };

  const openCategoryPopup = (categoryId: string) => {
    setSelectedCategoryPopup(categoryId);
  };

  const closeCategoryPopup = () => {
    setSelectedCategoryPopup(null);
  };

  const getCategorySelectedCount = (category: StruggleCategory): number => {
    return category.struggles.filter(struggle => formData.struggles.includes(struggle.id)).length;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.firstName.length > 0 && formData.lastName.length > 0 && formData.email.length > 0 && formData.email.includes('@');
      case 2: return formData.struggles.length > 0;
      case 3: return true; // Door selection always valid
      case 4: return true; // Time/daypart always valid
      case 5: return true; // Context is optional
      default: return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-sand-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-display">Your Pathfinder Assessment</h2>
              <p className="text-body mt-1">This will take less than 90 seconds</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl focus-ring p-1 rounded"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-caption mb-2">
              <span>
                Step {currentStep} of {totalSteps}
                {currentStep === 2 && formData.struggles.length > 0 && (
                  <span className="ml-2 text-warm-gold font-medium">
                    • {formData.struggles.length} selected
                  </span>
                )}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-sand-300 rounded-full h-2">
              <div 
                className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Your Information */}
          {currentStep === 1 && (
            <div className="space-contemplative">
              <h3 className="text-title">Tell us about yourself</h3>
              <p className="text-body">We'll use this to personalize your experience and send your 14-day plan.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input-field focus-ring"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input-field focus-ring"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field focus-ring"
                />
                <p className="text-xs text-slate-500 mt-1">
                  We'll send your personalized plan here and add you to our community updates.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Struggles */}
          {currentStep === 2 && (
            <div className="space-contemplative">
              <h3 className="text-title">What are you struggling with most?</h3>
              <p className="text-body">Click on any category that resonates with you.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRUGGLE_CATEGORIES.map((category) => {
                  const selectedCount = getCategorySelectedCount(category);
                  
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => openCategoryPopup(category.id)}
                      className={`p-6 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                        selectedCount > 0
                          ? 'border-warm-gold bg-warm-gold/10 shadow-md'
                          : 'border-slate-200 hover:border-warm-gold/50 hover:bg-warm-gold/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-deep-navy text-lg mb-2">{category.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                          {selectedCount > 0 && (
                            <div className="inline-flex items-center px-3 py-1 bg-warm-gold text-white text-sm rounded-full font-medium">
                              ✓ {selectedCount} selected
                            </div>
                          )}
                        </div>
                        <div className="ml-4 text-slate-400">
                          <ChevronDownIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {formData.struggles.length > 0 && (
                <div className="mt-6 p-4 bg-accent rounded-lg text-center">
                  <p className="text-sand-100 font-medium">
                    ✓ {formData.struggles.length} area{formData.struggles.length === 1 ? '' : 's'} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Door Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900">Choose your approach</h3>
              <p className="text-gray-600">Both paths lead to the same virtues, just with different framing.</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, door: 'christian' }))}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    formData.door === 'christian'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-lg">Christian Path</div>
                  <div className="text-gray-600 mt-1">Scripture-based practices with biblical wisdom and prayer</div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, door: 'secular' }))}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    formData.door === 'secular'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-lg">Secular Path</div>
                  <div className="text-gray-600 mt-1">Philosophy-based practices with Stoic wisdom and reflection</div>
                </button>
              </div>

              {/* Bible Version Selection for Christian Door */}
              {formData.door === 'christian' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Bible Version Preference</h4>
                  <div className="space-y-2">
                    {BIBLE_VERSIONS.map((version) => (
                      <button
                        key={version.value}
                        onClick={() => setFormData(prev => ({ ...prev, bibleVersion: version.value }))}
                        className={`w-full p-3 text-left border rounded transition-all ${
                          formData.bibleVersion === version.value
                            ? 'border-blue-500 bg-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{version.label}</div>
                            <div className="text-sm text-gray-600">{version.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Time & Schedule */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900">When will you practice?</h3>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Time Budget</h4>
                <div className="space-y-2">
                  {[
                    { value: '5-10', label: '5-10 minutes', description: 'Quick daily practices' },
                    { value: '10-15', label: '10-15 minutes', description: 'Balanced approach (recommended)' },
                    { value: '15-20', label: '15-20 minutes', description: 'Deeper reflection time' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, timeBudget: option.value as TimeBudget }))}
                      className={`w-full p-3 text-left border rounded-lg transition-all ${
                        formData.timeBudget === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Best Time of Day</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'morning', label: 'Morning', description: 'Start the day centered' },
                    { value: 'midday', label: 'Midday', description: 'Reset during lunch' },
                    { value: 'evening', label: 'Evening', description: 'Reflect and unwind' },
                    { value: 'flexible', label: 'Flexible', description: 'Whenever I can' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData(prev => ({ ...prev, daypart: option.value as Daypart }))}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        formData.daypart === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Context (Optional) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Anything else we should know?</h3>
              <p className="text-gray-600">Optional: Share any context that might help us personalize your plan better.</p>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                placeholder="E.g., I'm a new parent, going through a career transition, dealing with loss..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-sand-300 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus-ring rounded"
          >
            Back
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-secondary px-6 py-2 focus-ring"
            >
              Create My Plan
            </button>
          )}
        </div>
      </div>

      {/* Category Popup Modal */}
      {selectedCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {(() => {
              const category = STRUGGLE_CATEGORIES.find(cat => cat.id === selectedCategoryPopup);
              if (!category) return null;
              
              return (
                <>
                  {/* Popup Header */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-deep-navy">{category.title}</h3>
                        <p className="text-slate-600 mt-1">{category.description}</p>
                      </div>
                      <button
                        onClick={closeCategoryPopup}
                        className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Popup Content */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <p className="text-sm text-slate-600 mb-4">Select all that apply to you:</p>
                    <div className="space-y-3">
                      {category.struggles.map((struggle) => (
                        <button
                          key={struggle.id}
                          type="button"
                          onClick={() => toggleStruggle(struggle.id)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                            formData.struggles.includes(struggle.id)
                              ? 'border-warm-gold bg-warm-gold/10 text-deep-navy'
                              : 'border-slate-200 hover:border-warm-gold/50 hover:bg-warm-gold/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{struggle.label}</span>
                            {formData.struggles.includes(struggle.id) && (
                              <div className="w-5 h-5 rounded-full bg-warm-gold flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Popup Footer */}
                  <div className="p-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      {getCategorySelectedCount(category)} of {category.struggles.length} selected
                    </span>
                    <button
                      onClick={closeCategoryPopup}
                      className="btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
