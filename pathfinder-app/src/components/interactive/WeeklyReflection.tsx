'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowPathIcon, 
  LightBulbIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface WeeklyReflectionProps {
  day: number; // Should be 7, 14, or 21
  week: number; // 1, 2, or 3
  onSave?: (reflection: WeeklyReflectionData) => void;
  existingReflection?: WeeklyReflectionData;
}

export interface WeeklyReflectionData {
  week: number;
  whatWorked: string;
  whereCuesFailed: string;
  whatToTweak: string;
  nextWeekPlans: string;
  completedAt: Date;
}

export default function WeeklyReflection({ day, week, onSave, existingReflection }: WeeklyReflectionProps) {
  const [reflection, setReflection] = useState<Partial<WeeklyReflectionData>>(
    existingReflection || {
      whatWorked: '',
      whereCuesFailed: '',
      whatToTweak: '',
      nextWeekPlans: ''
    }
  );

  const [isCompleted, setIsCompleted] = useState(!!existingReflection);

  const handleSave = () => {
    if (reflection.whatWorked && reflection.whereCuesFailed && reflection.whatToTweak) {
      const completedReflection: WeeklyReflectionData = {
        week,
        whatWorked: reflection.whatWorked || '',
        whereCuesFailed: reflection.whereCuesFailed || '',
        whatToTweak: reflection.whatToTweak || '',
        nextWeekPlans: reflection.nextWeekPlans || '',
        completedAt: new Date()
      };
      
      onSave?.(completedReflection);
      setIsCompleted(true);
    }
  };

  const isValid = reflection.whatWorked && reflection.whereCuesFailed && reflection.whatToTweak;

  return (
    <Card className="bg-gradient-to-r from-olive-50 to-gold-50 border-olive-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowPathIcon className="w-5 h-5 text-olive-600" />
            <CardTitle className="text-lg font-serif text-navy-900">
              Week {week} Reflect & Reset
            </CardTitle>
          </div>
          {isCompleted && (
            <Badge className="bg-olive-500">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <CardDescription>
          <strong>Kolb Cycle:</strong> Take 10 minutes to reflect on your week and adjust your approach.
          {day === 21 && " This is your final reflection - celebrate your 21-day journey!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* What Worked Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <label className="font-medium text-navy-900 text-sm">
              What worked well this week?
            </label>
          </div>
          <Textarea
            value={reflection.whatWorked || ''}
            onChange={(e) => setReflection(prev => ({ ...prev, whatWorked: e.target.value }))}
            placeholder="Which habits felt natural? What cues were effective? What gave you energy?"
            className="bg-white border-olive-300 focus:border-olive-500 focus:ring-olive-500/20 text-sm"
            rows={3}
            disabled={isCompleted}
          />
        </div>

        {/* Where Cues Failed Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
            <label className="font-medium text-navy-900 text-sm">
              Where did your cues fail or feel difficult?
            </label>
          </div>
          <Textarea
            value={reflection.whereCuesFailed || ''}
            onChange={(e) => setReflection(prev => ({ ...prev, whereCuesFailed: e.target.value }))}
            placeholder="Which if-then plans didn't work? What got in the way? When did you forget or feel resistance?"
            className="bg-white border-olive-300 focus:border-olive-500 focus:ring-olive-500/20 text-sm"
            rows={3}
            disabled={isCompleted}
          />
        </div>

        {/* What to Tweak Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-blue-600" />
            <label className="font-medium text-navy-900 text-sm">
              What will you tweak for next week?
            </label>
          </div>
          <Textarea
            value={reflection.whatToTweak || ''}
            onChange={(e) => setReflection(prev => ({ ...prev, whatToTweak: e.target.value }))}
            placeholder="Adjust one element: time, location, or size of habit. What small change would help?"
            className="bg-white border-olive-300 focus:border-olive-500 focus:ring-olive-500/20 text-sm"
            rows={3}
            disabled={isCompleted}
          />
        </div>

        {/* Next Week Plans (Optional) */}
        {day !== 21 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LightBulbIcon className="w-4 h-4 text-gold-600" />
              <label className="font-medium text-navy-900 text-sm">
                Set your if-then plans for next week (optional)
              </label>
            </div>
            <Textarea
              value={reflection.nextWeekPlans || ''}
              onChange={(e) => setReflection(prev => ({ ...prev, nextWeekPlans: e.target.value }))}
              placeholder="Any specific adjustments to your if-then plans? New cues you want to try?"
              className="bg-white border-olive-300 focus:border-olive-500 focus:ring-olive-500/20 text-sm"
              rows={2}
              disabled={isCompleted}
            />
          </div>
        )}

        {/* Completion Message for Day 21 */}
        {day === 21 && (
          <div className="bg-gold-100 border border-gold-300 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-gold-600" />
              <h4 className="font-semibold text-gold-900 text-sm">Congratulations!</h4>
            </div>
            <p className="text-xs text-gold-800 leading-relaxed">
              You've completed your 21-day sprint! Remember, full automaticity typically grows across 8-10+ weeks. 
              Consider starting another 21-day cycle or expanding one habit from "tiny" to "small."
            </p>
          </div>
        )}

        {/* Action Button */}
        {!isCompleted && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="bg-olive-600 hover:bg-olive-700 text-white"
            >
              Complete Week {week} Reflection
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center gap-2 text-sm text-olive-700 font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Week {week} reflection completed on {existingReflection?.completedAt?.toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
