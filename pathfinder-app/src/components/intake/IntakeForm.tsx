'use client';

import { useState, useEffect } from 'react';
import { Assessment, Door, BibleVersion, TimeBudget, Daypart, CardinalVirtue } from '@/lib/types';
import { STRUGGLE_CATEGORIES, BIBLE_VERSIONS, StruggleCategory } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IntakeFormProps {
  onSubmit: (assessment: Assessment) => void;
  onClose: () => void;
  initialData?: Partial<Assessment>;
  startStep?: number;
}

export default function IntakeForm({ onSubmit, onClose, initialData, startStep = 1 }: IntakeFormProps) {
  // Debug logging
  console.log('IntakeForm initialData:', initialData);
  console.log('IntakeForm startStep:', startStep);
  
  const [currentStep, setCurrentStep] = useState(startStep);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    struggles: initialData?.struggles || [] as string[],
    door: initialData?.door || 'secular' as Door,
    bibleVersion: initialData?.bibleVersion || 'niv' as BibleVersion,
    timeBudget: initialData?.timeBudget || '10-15' as TimeBudget,
    daypart: initialData?.daypart || 'morning' as Daypart,
    context: initialData?.context || ''
  });
  
  // State for popup modal in struggles step
  const [selectedCategoryPopup, setSelectedCategoryPopup] = useState<string | null>(null);
  
  // Debug logging for popup state
  console.log('selectedCategoryPopup:', selectedCategoryPopup);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('useEffect updating formData with initialData:', initialData);
      setFormData(prev => ({
        firstName: initialData.firstName || prev.firstName,
        lastName: initialData.lastName || prev.lastName,
        email: initialData.email || prev.email,
        struggles: initialData.struggles || prev.struggles,
        door: initialData.door || prev.door,
        bibleVersion: initialData.bibleVersion || prev.bibleVersion,
        timeBudget: initialData.timeBudget || prev.timeBudget,
        daypart: initialData.daypart || prev.daypart,
        context: initialData.context || prev.context
      }));
    }
  }, [initialData]);

  const totalSteps = 5;

  // Determine primary virtue based on selected struggles
  const getPrimaryVirtue = (struggles: string[]): CardinalVirtue => {
    const virtueCount = { wisdom: 0, courage: 0, justice: 0, temperance: 0 };
    
    // Find struggles across all categories
    const allStruggles = STRUGGLE_CATEGORIES.flatMap(category => category.struggles);
    
    struggles.forEach(struggleId => {
      const struggle = allStruggles.find(s => s.id === struggleId);
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
    console.log('openCategoryPopup called with categoryId:', categoryId);
    setSelectedCategoryPopup(categoryId);
    console.log('selectedCategoryPopup set to:', categoryId);
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
    <div className="fixed inset-0 bg-navy-900 bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="card max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-sand-300">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-navy-900">Your Pathfinder Assessment</h2>
              <p className="text-sm text-slate-600">Less than 90 seconds</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 focus-ring p-1 rounded ml-4"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="flex items-center gap-2">
                Step {currentStep} of {totalSteps}
                {currentStep === 2 && formData.struggles.length > 0 && (
                  <Badge variant="secondary" className="bg-gold-100 text-gold-800 text-xs px-2 py-0.5">
                    {formData.struggles.length}
                  </Badge>
                )}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress 
              value={(currentStep / totalSteps) * 100} 
              className="w-full h-1.5 bg-sand-300"
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Step 1: Your Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-serif font-semibold text-navy-900">Tell us about yourself</h3>
                <p className="text-sm text-slate-600 mt-1">We'll use this to personalize your experience and send your 14-day plan.</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium text-slate-700">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-sand-100 border-sand-400 focus:border-gold-500 focus:ring-gold-500/20 h-9"
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium text-slate-700">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-sand-100 border-sand-400 focus:border-gold-500 focus:ring-gold-500/20 h-9"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-sand-100 border-sand-400 focus:border-gold-500 focus:ring-gold-500/20 h-9"
                />
                <p className="text-xs text-slate-500">
                  We'll send your personalized plan here and add you to our community updates.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Struggles */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-title">What are you struggling with most?</h3>
                <p className="text-body mt-1">Click on any category that resonates with you.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {STRUGGLE_CATEGORIES.map((category) => {
                  const selectedCount = getCategorySelectedCount(category);
                  
                  return (
                    <Card 
                      key={category.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                        selectedCount > 0
                          ? 'border-gold-500 bg-gold-50 shadow-sm'
                          : 'hover:border-gold-400 hover:bg-gold-50/50'
                      }`}
                      onClick={(e) => {
                        console.log('Card clicked for category:', category.id);
                        e.preventDefault();
                        e.stopPropagation();
                        openCategoryPopup(category.id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-navy-900 text-sm leading-tight">{category.title}</h4>
                              {selectedCount > 0 && (
                                <Badge className="bg-gold-500 text-xs px-1.5 py-0.5 h-5">
                                  {selectedCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{category.description}</p>
                          </div>
                          <div className="ml-2 text-slate-400 flex-shrink-0">
                            <ChevronDownIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {formData.struggles.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <Badge variant="secondary" className="bg-accent text-sand-100 px-4 py-2">
                    ✓ {formData.struggles.length} area{formData.struggles.length === 1 ? '' : 's'} selected
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Door Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-serif font-semibold text-navy-900">Choose your approach</h3>
                <p className="text-sm text-slate-600 mt-1">Both paths lead to the same virtues, just with different framing.</p>
              </div>
              
              <div className="space-y-3">
                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                    formData.door === 'christian'
                      ? 'border-gold-500 bg-gold-50 shadow-sm'
                      : 'hover:border-gold-400 hover:bg-gold-50/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, door: 'christian' }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-navy-900 text-sm mb-1">Christian Path</h4>
                        <p className="text-xs text-slate-600">Scripture-based practices with biblical wisdom and prayer</p>
                      </div>
                      {formData.door === 'christian' && (
                        <Badge className="bg-gold-500 text-xs px-2 py-1 ml-3">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                    formData.door === 'secular'
                      ? 'border-gold-500 bg-gold-50 shadow-sm'
                      : 'hover:border-gold-400 hover:bg-gold-50/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, door: 'secular' }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-navy-900 text-sm mb-1">Secular Path</h4>
                        <p className="text-xs text-slate-600">Philosophy-based practices with Stoic wisdom and reflection</p>
                      </div>
                      {formData.door === 'secular' && (
                        <Badge className="bg-gold-500 text-xs px-2 py-1 ml-3">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bible Version Selection for Christian Door */}
              {formData.door === 'christian' && (
                <Card className="bg-gold-50 border-gold-200">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <Label htmlFor="bibleVersion" className="text-xs font-medium text-navy-900">
                        Bible Version Preference
                      </Label>
                      <Select 
                        value={formData.bibleVersion} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bibleVersion: value as BibleVersion }))}
                      >
                        <SelectTrigger className="bg-sand-100 border-sand-400 focus:border-gold-500 h-8 text-sm">
                          <SelectValue placeholder="Choose your preferred Bible version" />
                        </SelectTrigger>
                        <SelectContent>
                          {BIBLE_VERSIONS.map((version) => (
                            <SelectItem key={version.value} value={version.value}>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{version.label}</span>
                                <span className="text-xs text-slate-600">{version.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 4: Time & Schedule */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-serif font-semibold text-navy-900">When will you practice?</h3>
                <p className="text-xs text-slate-600 mt-0.5">Choose your time commitment and schedule</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-navy-900">Time Budget</h4>
                <div className="space-y-1.5">
                  {[
                    { value: '5-10', label: '5-10 min', description: 'Quick practices' },
                    { value: '10-15', label: '10-15 min', description: 'Balanced (recommended)' },
                    { value: '15-20', label: '15-20 min', description: 'Deeper reflection' }
                  ].map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        formData.timeBudget === option.value
                          ? 'border-gold-500 bg-gold-50 shadow-sm'
                          : 'hover:border-gold-400 hover:bg-gold-50/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, timeBudget: option.value as TimeBudget }))}
                    >
                      <CardContent className="p-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-navy-900 text-xs">{option.label}</div>
                            <div className="text-xs text-slate-600">{option.description}</div>
                          </div>
                          {formData.timeBudget === option.value && (
                            <Badge className="bg-gold-500 text-xs px-1.5 py-0.5">✓</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-navy-900">Best Time of Day</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { value: 'morning', label: 'Morning', description: 'Start centered' },
                    { value: 'midday', label: 'Midday', description: 'Reset at lunch' },
                    { value: 'evening', label: 'Evening', description: 'Reflect & relax' },
                    { value: 'flexible', label: 'Flexible', description: 'When possible' }
                  ].map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        formData.daypart === option.value
                          ? 'border-gold-500 bg-gold-50 shadow-sm'
                          : 'hover:border-gold-400 hover:bg-gold-50/50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, daypart: option.value as Daypart }))}
                    >
                      <CardContent className="p-2">
                        <div className="text-center">
                          <div className="font-semibold text-navy-900 text-xs mb-0.5">{option.label}</div>
                          <div className="text-xs text-slate-600 leading-tight">{option.description}</div>
                          {formData.daypart === option.value && (
                            <Badge className="bg-gold-500 text-xs px-1 py-0.5 mt-1">✓</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Context (Optional) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-serif font-semibold text-navy-900">Anything else we should know?</h3>
                <p className="text-sm text-slate-600 mt-1">Optional: Share context to help us personalize your plan better</p>
              </div>
              
              <Card className="bg-sand-50 border-sand-300">
                <CardContent className="p-4">
                  <Label htmlFor="context" className="text-xs font-medium text-slate-700 mb-2 block">
                    Additional Context (Optional)
                  </Label>
                  <textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                    placeholder="E.g., I'm a new parent, going through a career transition, dealing with loss..."
                    className="w-full px-3 py-2 border border-sand-400 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 bg-sand-100 text-sm resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    This helps us tailor your practices to your current life situation.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sand-300 flex justify-between items-center">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              size="sm"
              className="bg-navy-900 hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed px-6"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="sm"
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6"
            >
              Create My Plan
            </Button>
          )}
        </div>
      </div>

      {/* ShadCN Dialog for Category Selection */}
      <Dialog open={!!selectedCategoryPopup} onOpenChange={(open) => !open && closeCategoryPopup()}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden z-[200]">
          {(() => {
            const category = STRUGGLE_CATEGORIES.find(cat => cat.id === selectedCategoryPopup);
            if (!category) return null;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-navy-900">{category.title}</DialogTitle>
                  <DialogDescription className="text-slate-600">{category.description}</DialogDescription>
                </DialogHeader>
                
                {/* Dialog Content */}
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-sm text-slate-600 mb-4">Select all that apply to you:</p>
                  <div className="space-y-3">
                    {category.struggles.map((struggle) => (
                      <button
                        key={struggle.id}
                        type="button"
                        onClick={() => toggleStruggle(struggle.id)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          formData.struggles.includes(struggle.id)
                            ? 'border-gold-500 bg-gold-50 text-navy-900'
                            : 'border-slate-200 hover:border-gold-400 hover:bg-gold-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{struggle.label}</span>
                          {formData.struggles.includes(struggle.id) && (
                            <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">
                    {getCategorySelectedCount(category)} of {category.struggles.length} selected
                  </span>
                  <Button onClick={closeCategoryPopup} className="bg-navy-900 hover:bg-navy-800">
                    Done
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
