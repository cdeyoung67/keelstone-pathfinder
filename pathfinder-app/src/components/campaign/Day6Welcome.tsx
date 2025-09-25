'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircleIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Day6WelcomeProps {
  firstName?: string;
  onContinue: () => void;
  onReflectionSave?: (reflection: string) => void;
}

export default function Day6Welcome({ 
  firstName = "Friend", 
  onContinue, 
  onReflectionSave 
}: Day6WelcomeProps) {
  const [reflection, setReflection] = useState('');
  const [hasSubmittedReflection, setHasSubmittedReflection] = useState(false);

  const handleReflectionSubmit = () => {
    if (reflection.trim()) {
      onReflectionSave?.(reflection);
      setHasSubmittedReflection(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand-light to-sand-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6 animate-gentle-fade">
        
        {/* Welcome Header */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-olive-100 text-olive-800 rounded-full text-sm font-medium mb-4 border border-olive-200">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            5-Day Journey Complete
          </div>
          
          <h1 className="text-hero mb-4 text-navy-900">
            Welcome to Day 6, {firstName}!
          </h1>
          
          <p className="text-subtitle text-slate-600 mb-6">
            The underground calls are behind you — now let's build something better together.
          </p>
        </div>

        {/* Journey Recap */}
        <Card className="bg-white border-gold-200">
          <CardHeader>
            <CardTitle className="flex items-center text-navy-800">
              <SparklesIcon className="w-6 h-6 mr-2 text-gold-600" />
              Your Journey So Far
            </CardTitle>
            <CardDescription>
              You've walked through the emotional arc from rebellion to hope
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { day: 1, theme: 'Underground', emotion: 'Curiosity & Recognition' },
                { day: 2, theme: 'Rebellion', emotion: 'Confrontation' },
                { day: 3, theme: 'Despair', emotion: 'Sobriety' },
                { day: 4, theme: 'Path Back', emotion: 'Hope' },
                { day: 5, theme: 'Big Question', emotion: 'Invitation' },
              ].map((item) => (
                <div key={item.day} className="text-center p-3 bg-sand-50 rounded-lg border border-sand-200">
                  <div className="text-sm font-semibold text-navy-800">Day {item.day}</div>
                  <div className="text-xs text-slate-600 mb-1">{item.theme}</div>
                  <div className="text-xs text-olive-600">{item.emotion}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day 6 Reflection */}
        <Card className="bg-white border-accent">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
              Your Day 6 Reflection
            </CardTitle>
            <CardDescription>
              Take a moment to capture where you are after this 5-day journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasSubmittedReflection ? (
              <>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="After 5 days exploring the underground, rebellion, despair, and the path back... where do you find yourself? What are you feeling? What do you want to build?"
                  className="w-full h-32 p-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    {reflection.length}/500 characters
                  </span>
                  <Button
                    onClick={handleReflectionSubmit}
                    disabled={!reflection.trim()}
                    variant="outline"
                    size="sm"
                  >
                    Save Reflection
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-olive-50 border border-olive-200 rounded-lg p-4">
                <div className="flex items-center text-olive-800 mb-2">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Reflection Saved
                </div>
                <p className="text-sm text-olive-700 italic">
                  "{reflection}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-accent to-olive-600 text-white">
          <CardContent className="p-6 text-center">
            <HeartIcon className="w-12 h-12 mx-auto mb-4 text-sand-100" />
            <h3 className="text-xl font-semibold mb-2">
              There <em>is</em> a place for you to start
            </h3>
            <p className="mb-6 text-sand-100">
              You've made it through the darkness. Now let's create your personalized path to inner steadiness — small, consistent, unhurried.
            </p>
            
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-white text-navy-800 hover:bg-sand-100 font-semibold"
            >
              Begin Your Pathfinder Journey
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Encouraging Note */}
        <div className="text-center">
          <Badge variant="outline" className="bg-white border-gold-300 text-gold-800">
            Day 6: Relief + Excitement — "There is a place for me to start"
          </Badge>
        </div>
      </div>
    </div>
  );
}
