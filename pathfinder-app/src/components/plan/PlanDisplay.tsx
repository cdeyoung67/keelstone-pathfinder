'use client';

import { useState } from 'react';
import { PersonalizedPlan, UserProgress } from '@/lib/types';
import { 
  CalendarDaysIcon,
  StarIcon,
  LockClosedIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  BuildingLibraryIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

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
          {plan.door === 'christian' ? (
            <HeartIcon className="w-5 h-5 inline mr-2" />
          ) : (
            <BuildingLibraryIcon className="w-5 h-5 inline mr-2" />
          )} 
          {plan.door === 'christian' ? 'Christian Path' : 'Secular Path'}
          {plan.door === 'christian' && <span className="ml-2 text-xs opacity-75">({plan.daily[0]?.quote.bibleVersion?.toUpperCase()})</span>}
        </div>
        
        <h1 className="text-hero mb-2">
          {plan.assessment?.firstName}'s 14-Day {virtue.title} Practice
        </h1>
        <p className="text-subtitle mb-4">{virtue.subtitle}</p>
        
        {/* Anchor Statement */}
        <Card className="bg-accent border-olive-500 mb-6">
          <CardContent className="p-6 text-sand-100">
            <h2 className="text-lg font-semibold mb-2">Your Daily Anchor</h2>
            <p className="text-quote text-sand-100">&ldquo;{plan.anchor}&rdquo;</p>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">Progress Overview</CardTitle>
            <CardDescription className="text-center">
              {completedDays.length} of 14 days completed • Day {currentDay} is next
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center flex-wrap gap-2 mb-4">
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
            <Progress 
              value={(completedDays.length / 14) * 100} 
              className="w-full h-2 bg-sand-300"
            />
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="flex justify-center space-x-3 mb-8">
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="btn-outline focus-ring"
            >
              <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" />
              Export Plan
            </button>
            
            {showExportOptions && (
              <div className="absolute top-full mt-2 left-0 card border border-sand-300 shadow-medium z-10 min-w-max">
                <button
                  onClick={() => mockExport('pdf')}
                  className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-t-lg focus-ring"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 inline mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => mockExport('png')}
                  className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-b-lg focus-ring"
                >
                  <PhotoIcon className="w-4 h-4 inline mr-2" />
                  Save as Image
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
      <Tabs defaultValue="practices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sand-200">
          <TabsTrigger value="practices" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Daily Practices
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Weekly Insights
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="practices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5" />
                Your 14-Day Journey
              </CardTitle>
              <CardDescription>
                Click on any day to expand and see the practice details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {plan.daily.map((practice) => {
                  const isCompleted = completedDays.includes(practice.day);
                  const isCurrent = practice.day === currentDay && !isCompleted;

                  return (
                    <AccordionItem key={practice.day} value={`day-${practice.day}`}>
                      <div className="flex items-center w-full py-4">
                        <div className={`progress-dot mr-4 ${
                          isCompleted
                            ? 'progress-dot-completed'
                            : isCurrent
                            ? 'progress-dot-current'
                            : 'progress-dot-pending'
                        }`}>
                          {isCompleted ? '✓' : practice.day}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <AccordionTrigger className="hover:no-underline py-0 border-0 w-full justify-between pr-4">
                            <div className="flex-1 text-left">
                              <h3 className="font-medium text-navy-900">{practice.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                <span>{practice.estimatedTime} minutes</span>
                                {isCompleted && <Badge variant="secondary" className="bg-olive-100 text-olive-800">Completed</Badge>}
                                {isCurrent && <Badge className="bg-gold-500">Current</Badge>}
                              </div>
                            </div>
                          </AccordionTrigger>
                        </div>
                        
                        {onProgressUpdate && !isCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(practice.day);
                            }}
                            className="ml-6 flex-shrink-0"
                          >
                            Mark Done
                          </Button>
                        )}
                      </div>

                      <AccordionContent className="pt-4 space-contemplative">
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
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                Weekly Insights & Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
                <h3 className="font-serif font-semibold text-gold-900 mb-2 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  Week 1 & 2 Check-in
                </h3>
                <p className="text-body text-gold-800">{plan.weeklyCheckin}</p>
              </div>

              {plan.stretchPractice && (
                <div className="bg-olive-50 border border-olive-200 rounded-lg p-6">
                  <h3 className="font-serif font-semibold text-olive-900 mb-2 flex items-center">
                    <StarIcon className="w-5 h-5 mr-2" />
                    Stretch Practice
                  </h3>
                  <p className="text-body text-olive-800">{plan.stretchPractice}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {plan.door === 'christian' ? <HeartIcon className="w-5 h-5" /> : <BuildingLibraryIcon className="w-5 h-5" />}
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-navy-900">Export Options</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" onClick={() => mockExport('pdf')} className="w-full justify-start">
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => mockExport('png')} className="w-full justify-start">
                      <PhotoIcon className="w-4 h-4 mr-2" />
                      Save as Image
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-navy-900">Your Path</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {plan.door === 'christian' ? <HeartIcon className="w-4 h-4" /> : <BuildingLibraryIcon className="w-4 h-4" />}
                    <span>{plan.door === 'christian' ? 'Christian Path' : 'Secular Path'}</span>
                    {plan.door === 'christian' && plan.daily[0]?.quote.bibleVersion && (
                      <Badge variant="secondary" className="text-xs">
                        {plan.daily[0].quote.bibleVersion.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center text-caption space-y-2">
                <p>Generated with {plan.version} • Created {plan.createdAt.toLocaleDateString()}</p>
                <p className="text-slate-500 flex items-center justify-center">
                  <LockClosedIcon className="w-4 h-4 mr-1" />
                  Your data is private and secure. You can delete it anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
