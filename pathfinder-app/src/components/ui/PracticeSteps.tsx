'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserIcon, 
  MapIcon, 
  LightBulbIcon, 
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CardinalVirtue } from '@/lib/types';
import { VIRTUE_DESCRIPTIONS } from '@/lib/content-library';

interface MicroHabitStep {
  virtue: CardinalVirtue;
  timeMinutes: number;
  action: string;
  steps: string[];
}

interface PracticeStepsProps {
  day: number;
  virtue: CardinalVirtue;
  microHabits: MicroHabitStep[];
  estimatedTime: number;
}

export default function PracticeSteps({ day, virtue, microHabits, estimatedTime }: PracticeStepsProps) {
  const primaryVirtue = VIRTUE_DESCRIPTIONS[virtue];

  return (
    <div className="space-y-6">
      {/* Identity Reminder */}
      <Card className="bg-gradient-to-r from-gold-50 to-olive-50 border-gold-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <UserIcon className="h-5 w-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">Identity Reminder</h4>
              <p className="text-sm text-muted-foreground font-medium">
                "I am a person who practices {primaryVirtue.title.toLowerCase()} by doing these small acts of growth every day."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Four Micro-Habits */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              Four Ways to Practice {virtue.charAt(0).toUpperCase() + virtue.slice(1)}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <ClockIcon className="h-3 w-3 mr-1" />
              {estimatedTime} min total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {microHabits.map((habit, index) => (
            <div key={`${habit.virtue}-${habit.approach || index}`}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                    {habit.approach || habit.virtue}
                  </h5>
                  <Badge variant="secondary" className="text-xs">
                    {habit.timeMinutes} min
                  </Badge>
                </div>
                <p className="font-medium text-sm text-foreground">{habit.action}</p>
                <ul className="space-y-2 pl-4">
                  {habit.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-gold-600 font-medium flex-shrink-0 mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips and Guidance */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <LightBulbIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-medium text-sm text-foreground">Tip</h5>
                <p className="text-xs text-muted-foreground">
                  Complete these in order, but adapt timing to your schedule.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DocumentTextIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-medium text-sm text-foreground">If-Then Planning</h5>
                <p className="text-xs text-muted-foreground">
                  "If I finish [cue], then I will do [next micro-habit]"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-center font-medium text-foreground">
            Remember: These tiny actions are building the person you want to become.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
