'use client';

import { useState, useEffect, useCallback } from 'react';
import { Assessment, Door, BibleVersion, TimeBudget, Daypart, CardinalVirtue, IfThenPlan, CampaignContext } from '@/lib/types';
import { STRUGGLE_CATEGORIES, BIBLE_VERSIONS, StruggleCategory } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { XMarkIcon, ChevronDownIcon, CheckCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
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
  campaignContext?: CampaignContext | null;
}

export default function IntakeForm({ onSubmit, onClose, initialData, startStep = 1, campaignContext }: IntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    struggles: initialData?.struggles || [] as string[],
    door: initialData?.door || 'secular' as Door,
    bibleVersion: initialData?.bibleVersion || 'niv' as BibleVersion,
    timeBudget: initialData?.timeBudget || '5-10' as TimeBudget,
    daypart: initialData?.daypart || 'morning' as Daypart,
    context: initialData?.context || '',
    ifThenPlans: initialData?.ifThenPlans || [] as IfThenPlan[]
  });
  
  // State for popup modal in struggles step
  const [selectedCategoryPopup, setSelectedCategoryPopup] = useState<string | null>(null);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        firstName: initialData.firstName || prev.firstName,
        lastName: initialData.lastName || prev.lastName,
        email: initialData.email || prev.email,
        struggles: initialData.struggles || prev.struggles,
        door: initialData.door || prev.door,
        bibleVersion: initialData.bibleVersion || prev.bibleVersion,
        timeBudget: initialData.timeBudget || prev.timeBudget,
        daypart: initialData.daypart || prev.daypart,
        context: initialData.context || prev.context,
        ifThenPlans: initialData.ifThenPlans || prev.ifThenPlans
      }));
    }
  }, [initialData]);

  const totalSteps = 6; // Added if-then planning step

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

  // Helper functions for if-then planning
  const initializeIfThenPlans = useCallback(() => {
    if (formData.ifThenPlans.length === 0) {
      const primaryVirtue = getPrimaryVirtue(formData.struggles);
      const approaches = ['prepare', 'act', 'serve', 'reflect'];
      
      // Enhanced path-specific cue suggestions with time/context anchoring
      const getDaypartCues = (door: Door) => {
        if (door === 'christian') {
          return {
            morning: {
              prepare: 'after I wake up, during my quiet time with God',
              act: 'when I start my day after morning prayer or devotion',
              serve: 'during my commute or as I prepare for the day',
              reflect: 'after breakfast, before the busyness begins'
            },
            midday: {
              prepare: 'when I pause for a midday prayer or breath',
              act: 'before tackling my biggest afternoon challenge',
              serve: 'during interactions with colleagues or family',
              reflect: 'when I feel mid-day stress and need God\'s peace'
            },
            evening: {
              prepare: 'when I arrive home and thank God for the day',
              act: 'before dinner, as I transition to family time',
              serve: 'during evening time with family or community',
              reflect: 'before my bedtime routine, reviewing the day with God'
            },
            flexible: {
              prepare: 'when I need God\'s presence and feel scattered',
              act: 'when facing a challenge and need to trust God',
              serve: 'when God puts someone in my path who needs help',
              reflect: 'when I notice stress and need to surrender to God'
            }
          };
        } else {
          return {
            morning: {
              prepare: 'after I wake up and before checking my phone',
              act: 'when I start my morning routine (coffee/breakfast)',
              serve: 'during my commute or morning preparation',
              reflect: 'after my morning meal, before work begins'
            },
            midday: {
              prepare: 'when I return from lunch and reset my focus',
              act: 'before tackling my biggest afternoon task',
              serve: 'during a natural break in my workday',
              reflect: 'when I feel mid-day fatigue and need to recharge'
            },
            evening: {
              prepare: 'when I arrive home and transition from work',
              act: 'before dinner preparation begins',
              serve: 'during family/personal time',
              reflect: 'before my bedtime routine, reviewing the day'
            },
            flexible: {
              prepare: 'when I need centering or feel scattered',
              act: 'when facing a challenge or important decision',
              serve: 'when I encounter others who could use help',
              reflect: 'when I notice stress, tension, or reactivity'
            }
          };
        }
      };

      const daypartCues = getDaypartCues(formData.door);

      // Path-specific virtue actions (Christian vs Secular)
      const getVirtueActions = (door: Door) => {
        if (door === 'christian') {
          return {
            wisdom: {
              prepare: 'pray for wisdom and ask God to guide my decisions today',
              act: 'read one Bible verse and ask "What is God nudging me to do?"',
              serve: 'choose quality over speed, trusting God\'s timing in one task',
              reflect: 'notice one assumption and ask "Lord, what don\'t I see here?"'
            },
            courage: {
              prepare: 'pray for courage and remember how God has been faithful before',
              act: 'take one step forward trusting God, even when afraid',
              serve: 'speak truth in love or stand up for someone who needs it',
              reflect: 'ask "Am I being brave or reckless?" and seek God\'s wisdom'
            },
            justice: {
              prepare: 'pray for eyes to see injustice and a heart like Christ\'s',
              act: 'give someone their due credit or correct an unfair situation',
              serve: 'do one act of mercy or include someone who\'s left out',
              reflect: 'ask "Am I seeking justice or revenge?" and choose mercy'
            },
            temperance: {
              prepare: 'pray for self-control and strength to choose what honors God',
              act: 'choose one small "no" to excess, trusting God\'s provision',
              serve: 'help someone find balance or model godly restraint',
              reflect: 'ask "Is this balanced or extreme?" and seek God\'s heart'
            }
          };
        } else {
          return {
            wisdom: {
              prepare: 'take 3 mindful breaths and set intention to learn today',
              act: 'read one paragraph from a wisdom source and ask one clarifying question',
              serve: 'choose quality over speed in one task, considering long-term impact',
              reflect: 'notice one assumption I made and practice intellectual humility'
            },
            courage: {
              prepare: 'center yourself and recall one time you acted with courage',
              act: 'do one thing that challenges you slightly, starting before you feel ready',
              serve: 'speak up for someone who needs it or offer help when it\'s uncomfortable',
              reflect: 'ask "Is this brave or reckless?" and balance courage with wisdom'
            },
            justice: {
              prepare: 'take perspective and consider how your actions affect others',
              act: 'give someone their due credit or address one unfair situation',
              serve: 'do one act of kindness without being asked or include someone left out',
              reflect: 'ask "Is this fair or vindictive?" and choose compassion over revenge'
            },
            temperance: {
              prepare: 'pause mindfully and set intention for balanced choices',
              act: 'choose one small "no" to excess or pause before reacting impulsively',
              serve: 'help someone find balance or model healthy restraint',
              reflect: 'ask "Is this balanced or extreme?" and adjust toward the middle way'
            }
          };
        }
      };

      const virtueActions = getVirtueActions(formData.door);

      const newPlans: IfThenPlan[] = approaches.map(approach => ({
        virtue: primaryVirtue,
        approach: approach,
        cue: daypartCues[formData.daypart][approach as keyof typeof daypartCues.morning],
        action: virtueActions[primaryVirtue][approach as keyof typeof virtueActions.wisdom],
        context: formData.door === 'christian' 
          ? `${formData.daypart} practice - ${approach} approach to ${primaryVirtue} through faith`
          : `${formData.daypart} practice - ${approach} approach to ${primaryVirtue} through mindfulness`
      }));

      setFormData(prev => ({
        ...prev,
        ifThenPlans: newPlans
      }));
    }
  }, [formData.ifThenPlans.length, formData.daypart, formData.struggles, formData.door]);

  const updateIfThenPlan = (virtue: CardinalVirtue, approach: string | undefined, field: keyof IfThenPlan, value: string) => {
    setFormData(prev => ({
      ...prev,
      ifThenPlans: prev.ifThenPlans.map(plan => 
        plan.virtue === virtue && plan.approach === approach ? { ...plan, [field]: value } : plan
      )
    }));
  };


  // Initialize if-then plans when entering step 5
  useEffect(() => {
    if (currentStep === 5 && formData.ifThenPlans.length === 0) {
      initializeIfThenPlans();
    }
  }, [currentStep, initializeIfThenPlans]);

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
      ifThenPlans: formData.ifThenPlans.length > 0 ? formData.ifThenPlans : undefined,
      campaignContext: campaignContext || undefined,
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
      case 5: return formData.ifThenPlans.length === 4; // Must have all four if-then plans
      case 6: return true; // Context is optional
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
                <p className="text-sm text-slate-600 mt-1">We'll use this to personalize your experience and send your 21-day plan.</p>
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
                      onClick={() => openCategoryPopup(category.id)}
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
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    {formData.struggles.length} area{formData.struggles.length === 1 ? '' : 's'} selected
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
                        defaultValue={formData.bibleVersion}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bibleVersion: value as BibleVersion }))}
                      >
                        <SelectTrigger className="bg-sand-100 border-sand-400 focus:border-gold-500 h-8 text-sm">
                          <SelectValue placeholder="Choose your preferred Bible version" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          {BIBLE_VERSIONS.map((version) => (
                            <SelectItem key={version.value} value={version.value}>
                              {version.label} - {version.description}
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
                    { value: '5-10', label: '10 min or less', description: 'Four 2-minute micro-habits (recommended)' },
                    { value: '10-15', label: '10-15 min', description: 'Four 3-4 minute practices' },
                    { value: '15-20', label: '15-20 min', description: 'Four 4-5 minute practices' }
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
                            <Badge className="bg-gold-500 text-xs px-1.5 py-0.5">
                              <CheckCircleIcon className="w-3 h-3" />
                            </Badge>
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
                            <Badge className="bg-gold-500 text-xs px-1 py-0.5 mt-1">
                              <CheckCircleIcon className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: If-Then Planning */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-serif font-semibold text-navy-900">Create Your If-Then Plans</h3>
                <p className="text-sm text-slate-600 mt-1">Research shows that "if-then" planning dramatically improves habit success. Let's create four focused plans for {getPrimaryVirtue(formData.struggles)}.</p>
                <div className="mt-2 text-xs text-gold-700 bg-gold-50 border border-gold-200 rounded-lg px-3 py-2 inline-block">
                  <LightBulbIcon className="w-3 h-3 inline mr-1" />
                  These plans are customized for your {formData.door === 'christian' ? 'Christian faith journey' : 'secular wisdom path'}
                </div>
              </div>

              {/* Plans are initialized via useEffect when entering this step */}

              <div className="space-y-4">
                {formData.ifThenPlans.map((plan, index) => {
                  const virtue = VIRTUE_DESCRIPTIONS[plan.virtue];
                  return (
                    <Card key={`${plan.virtue}-${plan.approach || index}`} className="bg-sand-50 border-sand-300">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-navy-900 capitalize">
                          {plan.approach ? `${plan.approach.toUpperCase()} - ${virtue.title}` : `${virtue.title} - ${virtue.subtitle}`}
                        </CardTitle>
                        {plan.approach && (
                          <CardDescription className="text-xs text-slate-600">
                            {plan.approach === 'prepare' && 'Set intention and center yourself'}
                            {plan.approach === 'act' && 'Take your first small step'}
                            {plan.approach === 'serve' && 'Practice through service to others'}
                            {plan.approach === 'reflect' && 'Balance and learn from the experience'}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-700">
                            If (trigger/cue):
                          </Label>
                          <Input
                            value={plan.cue}
                            onChange={(e) => updateIfThenPlan(plan.virtue, plan.approach, 'cue', e.target.value)}
                            placeholder="e.g., after my morning coffee"
                            className="bg-sand-100 border-sand-400 focus:border-gold-500 focus:ring-gold-500/20 h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-700">
                            Then I will:
                          </Label>
                          <Input
                            value={plan.action}
                            onChange={(e) => updateIfThenPlan(plan.virtue, plan.approach, 'action', e.target.value)}
                            placeholder="e.g., pause and ask for guidance"
                            className="bg-sand-100 border-sand-400 focus:border-gold-500 focus:ring-gold-500/20 h-8 text-sm"
                          />
                        </div>
                        <div className="text-xs text-slate-500 italic">
                          "If {plan.cue}, then I will {plan.action}"
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LightBulbIcon className="w-4 h-4 text-gold-600" />
                  <h4 className="font-medium text-gold-900 text-sm">Why This Works</h4>
                </div>
                <p className="text-xs text-gold-800 leading-relaxed">
                  Implementation intentions ("if-then" plans) are one of the most powerful tools in behavioral science. 
                  They help your brain automatically link situations to actions, making your new habits feel natural and effortless.
                </p>
              </div>
            </div>
          )}

          {/* Step 6: Context (Optional) */}
          {currentStep === 6 && (
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
