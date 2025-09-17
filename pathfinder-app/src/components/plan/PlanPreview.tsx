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
  CheckCircleIcon
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
          We've created a customized 14-day journey specifically designed to address your unique challenges and goals.
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
            This guiding principle will be woven throughout your 14-day journey
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
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Badge variant="outline" className="text-gold-700 border-gold-300">
              Day 1 • {dayOnePractice.estimatedTime} minutes
            </Badge>
          </div>

          {/* Practice Steps Preview */}
          <div>
            <h4 className="font-serif font-medium text-navy-900 mb-2">Today's Practice Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700 pl-2">
              {dayOnePractice.steps.slice(0, 3).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
              {dayOnePractice.steps.length > 3 && (
                <li className="text-gold-600 italic">+ {dayOnePractice.steps.length - 3} more steps...</li>
              )}
            </ol>
          </div>

          {/* Quote Preview */}
          <div className="bg-sand-100 rounded-lg p-4 border-l-4 border-gold-400">
            <blockquote className="text-sm text-navy-800 mb-2">
              "{dayOnePractice.quote.text}"
            </blockquote>
            <cite className="text-xs text-slate-600">
              — {dayOnePractice.quote.source}
              {dayOnePractice.quote.bibleVersion && (
                <span className="ml-1">({dayOnePractice.quote.bibleVersion.toUpperCase()})</span>
              )}
            </cite>
          </div>

          {/* Commentary - Connecting Quote to Practice via Fruit of the Spirit */}
          <div>
            <h4 className="font-serif font-medium text-navy-900 mb-3">
              Connecting {plan.virtue.charAt(0).toUpperCase() + plan.virtue.slice(1)} to Practice
              {assessment.door === 'christian' && (
                <span className="text-xs font-normal text-slate-600 ml-2">(through the Fruit of the Spirit)</span>
              )}
            </h4>
            <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
              {dayOnePractice.commentary.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Reflection Preview */}
          <div>
            <h4 className="font-serif font-medium text-navy-900 mb-1">Today's Reflection</h4>
            <p className="text-sm text-slate-700">{dayOnePractice.reflection}</p>
          </div>
        </CardContent>
      </Card>

      {/* Journey Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
          <CardDescription>
            Your complete 14-day journey will be delivered via email at your preferred time
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
                <span className="font-bold">14</span>
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
          Start My 14-Day Journey
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
