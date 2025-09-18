'use client';

import { PersonalizedPlan, Assessment, STRUGGLE_CATEGORIES } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HeartIcon, 
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface PlanPreviewProps {
  plan: PersonalizedPlan;
  onStartJourney: () => void;
  onReconfigure: () => void;
}

export default function PlanPreview({ plan, onStartJourney, onReconfigure }: PlanPreviewProps) {
  const assessment = plan.assessment!;
  const dayOnePractice = plan.daily[0];
  
  // Get struggle details for personalization
  const selectedStruggles = STRUGGLE_CATEGORIES
    .flatMap(category => category.struggles)
    .filter(struggle => assessment.struggles.includes(struggle.id));

  // Get the primary struggle category for messaging
  const primaryCategory = STRUGGLE_CATEGORIES.find(category => 
    category.virtue === assessment.primaryVirtue
  );

  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${time.split(':')[1]} ${period}`;
  };

  const getDaypartLabel = (daypart: string) => {
    switch (daypart) {
      case 'morning': return 'Morning';
      case 'midday': return 'Midday';
      case 'evening': return 'Evening';
      case 'flexible': return 'Flexible timing';
      default: return daypart;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SparklesIcon className="w-8 h-8 text-gold-500" />
          <h1 className="text-display">Your Personalized Pathfinder</h1>
        </div>
        <p className="text-body text-slate-600 max-w-2xl mx-auto">
          We've created a customized 21-day journey specifically designed to address your unique challenges and goals.
        </p>
      </div>

      {/* Personalized Summary */}
      <Card className="bg-gradient-to-br from-gold-50 to-sand-100 border-gold-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-gold-600" />
            How This Program Addresses Your Specific Concerns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-navy-900 mb-2">Your Primary Focus: {plan.virtue.charAt(0).toUpperCase() + plan.virtue.slice(1)}</h4>
              <p className="text-sm text-slate-700 mb-3">
                Based on your selections, we've identified <strong>{plan.virtue}</strong> as your primary growth area. 
                This journey will help you develop practical skills in this virtue.
              </p>
              
              <h5 className="font-medium text-navy-800 mb-1">Addressing Your Challenges:</h5>
              <ul className="text-sm text-slate-700 space-y-1">
                {selectedStruggles.slice(0, 3).map((struggle, index) => (
                  <li key={struggle.id} className="flex items-start gap-2">
                    <span className="text-gold-600 mt-0.5">•</span>
                    <span>{struggle.label}</span>
                  </li>
                ))}
                {selectedStruggles.length > 3 && (
                  <li className="text-gold-600 text-xs">+ {selectedStruggles.length - 3} more areas</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-navy-900 mb-2">Your Journey Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  {assessment.door === 'christian' ? <HeartIcon className="w-4 h-4 text-gold-600" /> : <BuildingLibraryIcon className="w-4 h-4 text-gold-600" />}
                  <span className="text-slate-700">
                    {assessment.door === 'christian' ? 'Christian Path' : 'Secular Path'} with {assessment.door === 'christian' ? 'biblical wisdom' : 'philosophical insights'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ClockIcon className="w-4 h-4 text-gold-600" />
                  <span className="text-slate-700">{assessment.timeBudget} minutes daily</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-gold-600" />
                  <span className="text-slate-700">
                    Delivered each {getDaypartLabel(assessment.daypart).toLowerCase()}
                  </span>
                </div>
              </div>

              {assessment.context && (
                <div className="mt-4 p-3 bg-sand-200 rounded-lg">
                  <h5 className="font-medium text-navy-800 text-xs mb-1">Personal Context Considered:</h5>
                  <p className="text-xs text-slate-700 italic">"{assessment.context}"</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Anchor */}
      <Card className="bg-navy-900 text-white">
        <CardContent className="p-6 text-center">
          <h3 className="font-serif text-lg font-medium mb-2">Your Daily Anchor</h3>
          <blockquote className="text-quote italic text-sand-200">
            "{plan.anchor}"
          </blockquote>
          <p className="text-xs text-sand-300 mt-2">
            This guiding principle will be woven throughout your 21-day journey
          </p>
        </CardContent>
      </Card>

      {/* Day 1 Preview */}
      <Card className="border-2 border-gold-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 text-white rounded-full flex items-center justify-center font-semibold">
              1
            </div>
            Preview: {dayOnePractice.title}
          </CardTitle>
          <CardDescription>
            Here's what your first day will look like. Each day will be similarly personalized.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Badge variant="outline" className="text-gold-700 border-gold-300">
              Day 1 • {dayOnePractice.estimatedTime} minutes
            </Badge>
          </div>

          {/* Opening Prayer - Christian Door Only */}
          {assessment.door === 'christian' && dayOnePractice.openingPrayer && (
            <div className="bg-navy-50 rounded-lg p-4 border-l-4 border-gold-500">
              <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center text-sm">
                <HeartIcon className="w-4 h-4 mr-2" />
                Opening Prayer
              </h4>
              <p className="text-sm text-navy-800 italic leading-relaxed">{dayOnePractice.openingPrayer}</p>
            </div>
          )}

          {/* 2. Scripture & Anchor - Daily Bible passage (KJV) + One clear thought framing Courage */}
          <div className="bg-sand-100 rounded-lg p-4 border-l-4 border-gold-400">
            <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center text-sm">
              <BookOpenIcon className="w-4 h-4 mr-2" />
              Scripture & Anchor
            </h4>
            
            <blockquote className="text-sm text-navy-800 mb-2">
              "{dayOnePractice.quote.text}"
            </blockquote>
            <cite className="text-xs text-slate-600 mb-3">
              — {dayOnePractice.quote.source}
              {dayOnePractice.quote.bibleVersion && (
                <span className="ml-1">({dayOnePractice.quote.bibleVersion.toUpperCase()})</span>
              )}
            </cite>
            
            {/* Scripture Anchor */}
            {assessment.door === 'christian' && dayOnePractice.scriptureAnchor && (
              <div className="mt-3 p-2 bg-gold-50 rounded border border-gold-200">
                <p className="text-xs font-medium text-navy-900 italic">"{dayOnePractice.scriptureAnchor}"</p>
              </div>
            )}
          </div>

          {/* Wisdom Bridge - Christian Door Only */}
          {assessment.door === 'christian' && dayOnePractice.wisdomBridge && (
            <div className="bg-olive-50 rounded-lg p-4 border border-olive-200">
              <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center text-sm">
                <AcademicCapIcon className="w-4 h-4 mr-2" />
                Wisdom Bridge
              </h4>
              <p className="text-sm text-olive-800 leading-relaxed">{dayOnePractice.wisdomBridge}</p>
            </div>
          )}

          {/* Practice Steps Preview */}
          <div>
            <h4 className="font-serif font-medium text-navy-900 mb-3">Practice Steps</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 pl-2">
              {dayOnePractice.steps.slice(0, 3).map((step, index) => (
                <li key={index} className="leading-relaxed">{step}</li>
              ))}
              {dayOnePractice.steps.length > 3 && (
                <li className="text-gold-600 italic">+ {dayOnePractice.steps.length - 3} more steps...</li>
              )}
            </ol>
          </div>

          {/* 4. Reflection Prompt (Preview) */}
          {assessment.door === 'christian' && dayOnePractice.reflectionPrompt && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-serif font-medium text-navy-900 mb-2 flex items-center text-sm">
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Reflection Prompt
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">{dayOnePractice.reflectionPrompt}</p>
              <p className="text-xs text-blue-600 mt-2 italic">Journaling or prayer reflection - captured in app for tracking.</p>
            </div>
          )}

          {/* 5. Practical Challenge (Gamified) */}
          {assessment.door === 'christian' && dayOnePractice.practicalChallenge && (
            <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg p-4 border border-gold-200">
              <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center text-sm">
                <StarIcon className="w-4 h-4 mr-2 text-gold-600" />
                Practical Challenge (Gamified)
              </h4>
              <p className="text-sm text-navy-800 leading-relaxed">{dayOnePractice.practicalChallenge}</p>
              <p className="text-xs text-gold-700 mt-2 italic">One small but tangible act of Courage - logged in app → tracked streaks, badges, or fruit icons as rewards.</p>
            </div>
          )}

          {/* 6. Fruit of the Spirit Check-In (Preview) */}
          {assessment.door === 'christian' && dayOnePractice.fruitCheckIn && dayOnePractice.fruitCheckIn.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-serif font-medium text-navy-900 mb-2 flex items-center text-sm">
                <SparklesIcon className="w-4 h-4 mr-2 text-green-600" />
                Fruit of the Spirit Check-In
              </h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {dayOnePractice.fruitCheckIn.map((fruit) => (
                  <Badge key={fruit} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {fruit}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-green-600 italic">Simple self-assessment - builds a "Fruit Dashboard"</p>
            </div>
          )}

          {/* 7. Community Touchpoint (Preview) */}
          {assessment.door === 'christian' && dayOnePractice.communityPrompt && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-serif font-medium text-navy-900 mb-2 flex items-center text-sm">
                <HeartIcon className="w-4 h-4 mr-2 text-purple-600" />
                Community Touchpoint
              </h4>
              <p className="text-sm text-purple-800 leading-relaxed">{dayOnePractice.communityPrompt}</p>
              <p className="text-xs text-purple-600 mt-2 italic">Encouragement to share reflection - prompts supportive replies with Fruits</p>
            </div>
          )}

          {/* Reflection Preview */}
          <div>
            <h4 className="font-serif font-medium text-navy-900 mb-3">Today's Reflection</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{dayOnePractice.reflection}</p>
          </div>

          {/* Commentary - Connecting Quote to Practice via Fruit of the Spirit */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="font-serif font-medium text-navy-900 mb-3">
              Daily Commentary: Connecting {plan.virtue.charAt(0).toUpperCase() + plan.virtue.slice(1)} to Practice
              {assessment.door === 'christian' && (
                <span className="text-xs font-normal text-slate-600 ml-2">(through the Fruit of the Spirit)</span>
              )}
            </h4>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              {dayOnePractice.commentary.split('\n\n').slice(0, 2).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {dayOnePractice.commentary.split('\n\n').length > 2 && (
                <p className="text-gold-600 italic text-xs">+ Additional commentary in full practice...</p>
              )}
            </div>
          </div>

          {/* Closing Prayer - Christian Door Only */}
          {assessment.door === 'christian' && dayOnePractice.closingPrayer && (
            <div className="bg-navy-50 rounded-lg p-4 border-l-4 border-gold-500">
              <h4 className="font-serif font-medium text-navy-900 mb-3 flex items-center text-sm">
                <HeartIcon className="w-4 h-4 mr-2" />
                Closing Prayer
              </h4>
              <p className="text-sm text-navy-800 italic leading-relaxed">{dayOnePractice.closingPrayer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Journey Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>
            Your complete 21-day journey will be delivered via email at your preferred time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-medium text-navy-900">Daily Emails</h4>
              <p className="text-xs text-slate-600">
                Receive your personalized practice each {getDaypartLabel(assessment.daypart).toLowerCase()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                <span className="font-bold">7</span>
              </div>
              <h4 className="font-medium text-navy-900">Weekly Check-in</h4>
              <p className="text-xs text-slate-600">
                Reflect on your progress and insights
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto">
                <span className="font-bold">21</span>
              </div>
              <h4 className="font-medium text-navy-900">Journey Complete</h4>
              <p className="text-xs text-slate-600">
                Celebrate your growth and continued practices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Decision Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
        <Button
          onClick={onReconfigure}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Reconfigure My Selections
        </Button>
        
        <Button
          onClick={onStartJourney}
          size="lg"
          className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8"
        >
          Start My 21-Day Journey
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="text-center text-xs text-slate-500 max-w-md mx-auto">
        <p>
          By starting your journey, we'll save your preferences and begin sending personalized practices to {assessment.email}. 
          You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
