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
  HeartIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import IdentityPrompt from '@/components/ui/IdentityPrompt';
import PracticeSteps from '@/components/ui/PracticeSteps';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

// Phase 2: Interactive components
import ReflectionPrompt from '@/components/interactive/ReflectionPrompt';
import PracticalChallenge from '@/components/interactive/PracticalChallenge';
import FruitCheckIn from '@/components/interactive/FruitCheckIn';
import CommunityShare from '@/components/interactive/CommunityShare';
import WeeklyReflection, { WeeklyReflectionData } from '@/components/interactive/WeeklyReflection';

// Phase 3: Gamification components
import FruitDashboard from '@/components/gamification/FruitDashboard';
import AchievementSystem from '@/components/gamification/AchievementSystem';
import ProgressMarkers from '@/components/gamification/ProgressMarkers';
import AlwaysOnDashboard from '@/components/gamification/AlwaysOnDashboard';
import ProgressRing from '@/components/gamification/ProgressRing';
import SocialAccountabilityDashboard from '@/components/gamification/SocialAccountabilityDashboard';

// Enhanced Progress Monitoring
import WeeklyShareOut from '@/components/interactive/WeeklyShareOut';

// Gratitude & Mindfulness Features
import GratitudeLog from '@/components/interactive/GratitudeLog';
import MindfulMinute from '@/components/interactive/MindfulMinute';

interface PlanDisplayProps {
  plan: PersonalizedPlan;
  progress?: UserProgress;
  onProgressUpdate?: (day: number, completed: boolean) => void;
  onClose?: () => void;
  
  // Phase 2: Interactive callbacks
  onReflectionSave?: (day: number, reflection: { type: 'text' | 'audio'; content: string; timestamp: Date }) => void;
  onChallengeComplete?: (day: number, completed: boolean, timestamp: Date) => void;
  onFruitUpdate?: (day: number, selectedFruits: string[], timestamp: Date) => void;
  onCommunityShare?: (day: number, share: { content: string; privacy: 'public' | 'community' | 'prayer'; timestamp: Date }) => void;
  onWeeklyReflection?: (day: number, reflection: WeeklyReflectionData) => void;
  
  // Enhanced Social Accountability callbacks
  onWeeklyShare?: (shareData: { week: number; content: string; privacy: 'public' | 'community' | 'private'; highlights: string[]; timestamp: Date }) => void;
  onEncourageMember?: (shareId: string) => void;
  onPrayForMember?: (shareId: string) => void;
  
  // Gratitude & Mindfulness callbacks
  onGratitudeSave?: (day: number, entries: any[]) => void;
  onMindfulMinuteComplete?: (day: number, duration: number, notes?: string) => void;
}

export default function PlanDisplay({ 
  plan, 
  progress, 
  onProgressUpdate,
  onClose,
  onReflectionSave,
  onChallengeComplete,
  onFruitUpdate,
  onCommunityShare,
  onWeeklyReflection,
  onWeeklyShare,
  onEncourageMember,
  onPrayForMember,
  onGratitudeSave,
  onMindfulMinuteComplete
}: PlanDisplayProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const virtue = VIRTUE_DESCRIPTIONS[plan.virtue];
  const completedDays = progress?.completedDays || [];
  const currentDay = Math.min(completedDays.length + 1, 21);
  
  // Ensure progress has Phase 2 fields with defaults
  const safeProgress = progress ? {
    ...progress,
    dailyProgress: progress.dailyProgress || {},
    fruitGrowth: progress.fruitGrowth || {},
    totalChallengesCompleted: progress.totalChallengesCompleted || 0,
    badges: progress.badges || []
  } : undefined;

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
          {plan.assessment?.firstName}'s 21-Day {virtue.title} Practice
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
              {completedDays.length} of 21 days completed • Day {currentDay} is next
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center flex-wrap gap-2 mb-4">
              {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => {
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
              value={(completedDays.length / 21) * 100} 
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
        <TabsList className="grid w-full grid-cols-5 bg-sand-200">
          <TabsTrigger value="practices" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Daily Practices
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Progress
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Community
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gold-100 data-[state=active]:text-navy-900">
            Insights
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
                Your 21-Day Journey
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

                      <AccordionContent className="pt-4 space-y-6">
                        {/* Following the exact christianUX.md framework order */}
                        
                        {/* 1. Opening Prayer - Christian Door Only */}
                        {plan.door === 'christian' && practice.openingPrayer && (
                          <div className="bg-navy-50 rounded-lg p-4 border-l-4 border-gold-500">
                            <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center">
                              <HeartIcon className="w-4 h-4 mr-2" />
                              Opening Prayer
                            </h4>
                            <p className="text-sm text-navy-800 italic leading-relaxed">{practice.openingPrayer}</p>
                            <p className="text-xs text-slate-500 mt-2 italic">Short prayer asking for guidance, focus, and openness to God's wisdom.</p>
                          </div>
                        )}

                        {/* 2. Scripture & Anchor - Daily Bible passage (KJV) + One clear thought framing Courage */}
                        <div className="bg-sand-200 rounded-lg p-4 border border-sand-300">
                          <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center">
                            <BookOpenIcon className="w-4 h-4 mr-2" />
                            Scripture & Anchor
                          </h4>
                          
                          <blockquote className="text-quote text-navy-800 mb-2">
                            &ldquo;{practice.quote.text}&rdquo;
                          </blockquote>
                          <cite className="text-caption text-slate-600 mb-4">
                            — {practice.quote.source}
                            {practice.quote.bibleVersion && (
                              <span className="ml-1">({practice.quote.bibleVersion.toUpperCase()})</span>
                            )}
                          </cite>
                          
                          {/* Scripture Anchor */}
                          {plan.door === 'christian' && practice.scriptureAnchor && (
                            <div className="mt-4 p-3 bg-gold-50 rounded border border-gold-200">
                              <p className="text-sm font-medium text-navy-900 italic">"{practice.scriptureAnchor}"</p>
                              <p className="text-xs text-gold-700 mt-1">One clear thought framing the theme of Courage</p>
                            </div>
                          )}
                        </div>

                        {/* 3. Wisdom Bridge - Secular/historical support reinforcing faith and reason */}
                        {plan.door === 'christian' && practice.wisdomBridge && (
                          <div className="bg-olive-50 rounded-lg p-4 border border-olive-200">
                            <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center">
                              <AcademicCapIcon className="w-4 h-4 mr-2" />
                              Wisdom Bridge
                            </h4>
                            <p className="text-sm text-olive-800 leading-relaxed">{practice.wisdomBridge}</p>
                            <p className="text-xs text-olive-600 mt-2 italic">Reinforces that faith and reason both affirm Courage.</p>
                          </div>
                        )}

                        {/* WHITEPAPER ALIGNMENT: Structured Practice Steps */}
                        {practice.microHabits ? (
                          <PracticeSteps
                            day={practice.day}
                            virtue={plan.virtue}
                            microHabits={practice.microHabits}
                            estimatedTime={practice.estimatedTime}
                          />
                        ) : (
                          /* Fallback for legacy format */
                          <div>
                            <h4 className="font-serif font-medium text-navy-900 mb-3">Practice Steps</h4>
                            <ol className="list-decimal list-inside space-y-2 text-body">
                              {practice.steps.map((step, index) => (
                                <li key={index} className="text-sm leading-relaxed">{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* 4. Reflection Prompt - Interactive component */}
                        {plan.door === 'christian' && practice.reflectionPrompt && (
                          <ReflectionPrompt
                            prompt={practice.reflectionPrompt}
                            day={practice.day}
                            onSave={(reflection) => onReflectionSave?.(practice.day, reflection)}
                            existingReflection={safeProgress?.dailyProgress[practice.day]?.reflection}
                          />
                        )}

                        {/* 5. Practical Challenge (Gamified) - Interactive component */}
                        {plan.door === 'christian' && practice.practicalChallenge && (
                          <PracticalChallenge
                            challenge={practice.practicalChallenge}
                            day={practice.day}
                            onComplete={(completed, timestamp) => onChallengeComplete?.(practice.day, completed, timestamp)}
                            isCompleted={safeProgress?.dailyProgress[practice.day]?.challengeCompletion?.completed}
                            completedAt={safeProgress?.dailyProgress[practice.day]?.challengeCompletion?.completedAt}
                            currentStreak={safeProgress?.currentStreak || 0}
                            totalCompleted={safeProgress?.totalChallengesCompleted || 0}
                          />
                        )}

                        {/* 6. Fruit of the Spirit Check-In - Interactive component */}
                        {plan.door === 'christian' && practice.fruitCheckIn && practice.fruitCheckIn.length > 0 && (
                          <FruitCheckIn
                            fruits={practice.fruitCheckIn}
                            day={practice.day}
                            onUpdate={(selectedFruits, timestamp) => onFruitUpdate?.(practice.day, selectedFruits, timestamp)}
                            existingSelection={safeProgress?.dailyProgress[practice.day]?.fruitSelection?.fruits}
                            fruitGrowth={safeProgress?.fruitGrowth}
                          />
                        )}

                        {/* 7. Community Touchpoint - Interactive component */}
                        {plan.door === 'christian' && practice.communityPrompt && (
                          <CommunityShare
                            prompt={practice.communityPrompt}
                            day={practice.day}
                            onShare={(share) => onCommunityShare?.(practice.day, share)}
                            existingShare={safeProgress?.dailyProgress[practice.day]?.communityShare}
                            userReflection={safeProgress?.dailyProgress[practice.day]?.reflection?.content}
                          />
                        )}

                        {/* Commentary */}
                        {practice.commentary && (
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h4 className="font-serif font-medium text-navy-900 mb-3">Daily Commentary</h4>
                            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                              {practice.commentary.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* WHITEPAPER ALIGNMENT: Weekly Reflection (Kolb Cycle) - Days 7, 14, 21 */}
                        {(practice.day === 7 || practice.day === 14 || practice.day === 21) && (
                          <WeeklyReflection
                            day={practice.day}
                            week={practice.day === 7 ? 1 : practice.day === 14 ? 2 : 3}
                            onSave={(reflection) => onWeeklyReflection?.(practice.day, reflection)}
                            existingReflection={safeProgress?.dailyProgress[practice.day]?.weeklyReflection}
                          />
                        )}

                        {/* 8. Closing Prayer */}
                        {plan.door === 'christian' && practice.closingPrayer && (
                          <div className="bg-navy-50 rounded-lg p-4 border-l-4 border-gold-500">
                            <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center">
                              <HeartIcon className="w-4 h-4 mr-2" />
                              Closing Prayer
                            </h4>
                            <p className="text-sm text-navy-800 italic leading-relaxed">{practice.closingPrayer}</p>
                            <p className="text-xs text-slate-500 mt-2 italic">Short prayer asking God to guide the user to improve and to grow in courage tomorrow.</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Ring - Left Column */}
            <div className="lg:col-span-1">
              <ProgressRing
                currentDay={currentDay}
                completedDays={completedDays}
                totalDays={21}
                virtue={plan.virtue}
                weeklySharePrompt={`Share one win from your ${plan.virtue} practice this week!`}
                onWeeklyShare={(content) => {
                  const currentWeek = Math.ceil(currentDay / 7);
                  onWeeklyShare?.({
                    week: currentWeek,
                    content,
                    privacy: 'community',
                    highlights: [],
                    timestamp: new Date()
                  });
                }}
                lastSharedWeek={0} // TODO: Track from user progress
                streakCount={safeProgress?.currentStreak || 0}
              />
            </div>

            {/* Dashboard and Markers - Right Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Always-On Dashboard */}
              <AlwaysOnDashboard
                stats={{
                  currentStreak: safeProgress?.currentStreak || 0,
                  longestStreak: Math.max(safeProgress?.currentStreak || 0, completedDays.length),
                  totalDays: 21,
                  completedDays: completedDays.length,
                  currentDay: currentDay,
                  totalFruitGrowth: Object.values(safeProgress?.fruitGrowth || {}).reduce((sum, level) => sum + level, 0),
                  unlockedAchievements: safeProgress?.badges?.length || 0,
                  totalAchievements: 7, // Total possible achievements
                  todayCompleted: completedDays.includes(currentDay)
                }}
              />
            
            {/* Progress Markers */}
            <ProgressMarkers
              currentDay={currentDay}
              completedDays={completedDays}
              totalDays={21}
            />
            
            {/* Fruit Dashboard */}
            {plan.door === 'christian' && (
              <FruitDashboard
                fruitGrowth={safeProgress?.fruitGrowth || {}}
                currentStreak={safeProgress?.currentStreak || 0}
                totalDays={21}
                completedDays={completedDays.length}
              />
            )}
            
            {/* Achievement System */}
            <AchievementSystem />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="mt-6">
          <div className="space-y-6">
            {/* Weekly Share-Out */}
            {[7, 14, 21].includes(currentDay) && (
              <WeeklyShareOut
                week={Math.ceil(currentDay / 7)}
                virtue={plan.virtue}
                completedDays={completedDays}
                weekDays={currentDay <= 7 ? [1,2,3,4,5,6,7] : currentDay <= 14 ? [8,9,10,11,12,13,14] : [15,16,17,18,19,20,21]}
                onShare={(shareData) => onWeeklyShare?.(shareData)}
                isChristianPath={plan.door === 'christian'}
              />
            )}
            
            {/* Social Accountability Dashboard */}
            <SocialAccountabilityDashboard
              userProgress={{
                virtue: plan.virtue,
                currentDay: currentDay,
                completionRate: (completedDays.length / Math.min(currentDay, 21)) * 100,
                currentStreak: safeProgress?.currentStreak || 0,
                fruitLevel: safeProgress?.fruitLevel || 1,
                totalPoints: safeProgress?.totalPoints || Math.round((completedDays.length / Math.min(currentDay, 21)) * 100 * 10 + (safeProgress?.currentStreak || 0) * 20)
              }}
              onEncourage={onEncourageMember}
              onPrayFor={onPrayForMember}
              onViewProfile={(memberId) => {
                // TODO: Implement profile viewing
                console.log('View profile:', memberId);
              }}
              isChristianPath={plan.door === 'christian'}
            />
          </div>
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
              
              {/* Gratitude & Mindfulness Features */}
              <div className="space-y-4">
                <h4 className="font-medium text-navy-900">Optional Practices</h4>
                <p className="text-sm text-slate-600">
                  These evidence-based practices enhance well-being and strengthen virtue development.
                </p>
                
                <div className="space-y-4">
                  {/* Gratitude Log - Available from day 15+ or weekly */}
                  {(currentDay >= 15 || [7, 14, 21].includes(currentDay)) && (
                    <GratitudeLog
                      day={currentDay}
                      isChristianPath={plan.door === 'christian'}
                      existingEntries={safeProgress?.dailyProgress[currentDay]?.gratitudeEntries || []}
                      onSave={(entries) => onGratitudeSave?.(currentDay, entries)}
                      onComplete={() => {
                        // Mark gratitude practice as completed
                        console.log('Gratitude practice completed for day', currentDay);
                      }}
                      isCompleted={!!safeProgress?.dailyProgress[currentDay]?.gratitudeCompleted}
                    />
                  )}
                  
                  {/* Mindful Minute - Always available */}
                  <MindfulMinute
                    day={currentDay}
                    trigger="your next challenging task"
                    isChristianPath={plan.door === 'christian'}
                    onComplete={(duration, notes) => onMindfulMinuteComplete?.(currentDay, duration, notes)}
                    existingSession={safeProgress?.dailyProgress[currentDay]?.mindfulSession}
                  />
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
