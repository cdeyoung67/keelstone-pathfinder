'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayIcon,
  PauseIcon,
  StopIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';

interface MindfulMinuteProps {
  day: number;
  trigger?: string; // What difficult task is coming up
  isChristianPath?: boolean;
  onComplete: (duration: number, notes?: string) => void;
  existingSession?: {
    duration: number;
    completedAt: Date;
    notes?: string;
  };
}

type SessionState = 'ready' | 'running' | 'paused' | 'completed';

const BREATHING_PATTERNS = {
  basic: { inhale: 4, hold: 4, exhale: 4, rest: 0 },
  extended: { inhale: 4, hold: 7, exhale: 8, rest: 0 },
  simple: { inhale: 3, hold: 0, exhale: 3, rest: 1 }
};

const MINDFUL_PROMPTS = {
  christian: [
    "Breathe in God's peace, breathe out anxiety",
    "Be still and know that I am God (Psalm 46:10)",
    "Cast all your anxiety on Him because He cares for you (1 Peter 5:7)",
    "The Lord will fight for you; you need only to be still (Exodus 14:14)",
    "In quietness and trust is your strength (Isaiah 30:15)"
  ],
  secular: [
    "Notice your breath without trying to change it",
    "Observe thoughts as clouds passing through the sky",
    "Feel your body's connection to the present moment",
    "Let tension release with each exhale",
    "Return gently to your breath when your mind wanders"
  ]
};

export default function MindfulMinute({ 
  day, 
  trigger,
  isChristianPath = false,
  onComplete,
  existingSession
}: MindfulMinuteProps) {
  const [sessionState, setSessionState] = useState<SessionState>(existingSession ? 'completed' : 'ready');
  const [duration, setDuration] = useState(60); // Default 1 minute
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<keyof typeof BREATHING_PATTERNS>('basic');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [notes, setNotes] = useState('');

  const prompts = isChristianPath ? MINDFUL_PROMPTS.christian : MINDFUL_PROMPTS.secular;
  const pattern = BREATHING_PATTERNS[selectedPattern];

  // Main session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionState === 'running' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionState, timeRemaining]);

  // Breathing pattern timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionState === 'running') {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const currentPhaseDuration = pattern[breathingPhase];
          if (prev >= currentPhaseDuration) {
            // Move to next phase
            const phases: Array<keyof typeof pattern> = ['inhale', 'hold', 'exhale', 'rest'];
            const currentIndex = phases.indexOf(breathingPhase);
            const nextPhase = phases[(currentIndex + 1) % phases.length];
            setBreathingPhase(nextPhase);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionState, breathingPhase, pattern]);

  // Change prompt every 20 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionState === 'running') {
      interval = setInterval(() => {
        setCurrentPrompt(prev => (prev + 1) % prompts.length);
      }, 20000);
    }

    return () => clearInterval(interval);
  }, [sessionState, prompts.length]);

  const handleStart = () => {
    setTimeRemaining(duration);
    setBreathingTimer(0);
    setBreathingPhase('inhale');
    setCurrentPrompt(0);
    setSessionState('running');
  };

  const handlePause = () => {
    setSessionState('paused');
  };

  const handleResume = () => {
    setSessionState('running');
  };

  const handleStop = () => {
    const completedDuration = duration - timeRemaining;
    setSessionState('completed');
    onComplete(completedDuration, notes);
  };

  const handleComplete = () => {
    onComplete(duration, notes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingInstruction = () => {
    const currentPhaseDuration = pattern[breathingPhase];
    const remaining = currentPhaseDuration - breathingTimer;
    
    switch (breathingPhase) {
      case 'inhale': return `Breathe in... ${remaining}`;
      case 'hold': return `Hold... ${remaining}`;
      case 'exhale': return `Breathe out... ${remaining}`;
      case 'rest': return `Rest... ${remaining}`;
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-purple-600';
      case 'exhale': return 'text-green-600';
      case 'rest': return 'text-slate-600';
    }
  };

  if (existingSession && sessionState === 'completed') {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircleIconSolid className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900 text-sm">Mindful Minute Complete</div>
              <div className="text-xs text-green-700">
                {formatTime(existingSession.duration)} of mindful breathing
                {existingSession.completedAt && ` • ${existingSession.completedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </div>
              {existingSession.notes && (
                <div className="text-xs text-green-600 italic mt-1">
                  "{existingSession.notes}"
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
          <HeartIcon className="w-4 h-4" />
          Mindful Minute
          <Badge variant="outline" className="text-xs">
            Optional • 1-2 minutes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Introduction */}
        <div className="text-sm text-blue-800">
          {trigger && (
            <div className="mb-2 p-2 bg-blue-100 rounded text-xs">
              <strong>Upcoming challenge:</strong> {trigger}
            </div>
          )}
          {isChristianPath 
            ? "Take a moment to center yourself in God's presence before your next task. Breathe in His peace."
            : "Research shows brief mindfulness reduces reactivity and improves focus. Take a moment to center yourself."
          }
        </div>

        {sessionState === 'ready' && (
          <>
            {/* Duration Selection */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-900">Duration:</div>
              <div className="flex gap-2">
                {[60, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`px-3 py-1 text-xs rounded border transition-all ${
                      duration === dur
                        ? 'bg-blue-100 border-blue-300 text-blue-900'
                        : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {formatTime(dur)}
                  </button>
                ))}
              </div>
            </div>

            {/* Breathing Pattern */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-900">Breathing Pattern:</div>
              <div className="space-y-1">
                {(Object.keys(BREATHING_PATTERNS) as Array<keyof typeof BREATHING_PATTERNS>).map((patternKey) => {
                  const p = BREATHING_PATTERNS[patternKey];
                  return (
                    <button
                      key={patternKey}
                      onClick={() => setSelectedPattern(patternKey)}
                      className={`w-full text-left px-3 py-2 text-xs rounded border transition-all ${
                        selectedPattern === patternKey
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <div className="font-medium capitalize">{patternKey}</div>
                      <div className="text-blue-600">
                        Inhale {p.inhale}s
                        {p.hold > 0 && ` • Hold ${p.hold}s`}
                        • Exhale {p.exhale}s
                        {p.rest > 0 && ` • Rest ${p.rest}s`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <PlayIcon className="w-4 h-4 mr-2" />
              Start Mindful Minute
            </Button>
          </>
        )}

        {(sessionState === 'running' || sessionState === 'paused') && (
          <>
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-900">Progress</span>
                <span className="text-blue-700">{formatTime(timeRemaining)} remaining</span>
              </div>
              <Progress value={((duration - timeRemaining) / duration) * 100} className="h-2" />
            </div>

            {/* Breathing Guide */}
            <div className="text-center space-y-3">
              <div className={`text-2xl font-medium ${getPhaseColor()}`}>
                {getBreathingInstruction()}
              </div>
              
              {/* Visual Breathing Circle */}
              <div className="flex justify-center">
                <div 
                  className={`w-20 h-20 rounded-full border-4 transition-all duration-1000 ${
                    breathingPhase === 'inhale' ? 'scale-110 border-blue-400 bg-blue-100' :
                    breathingPhase === 'hold' ? 'scale-110 border-purple-400 bg-purple-100' :
                    breathingPhase === 'exhale' ? 'scale-90 border-green-400 bg-green-100' :
                    'scale-100 border-slate-400 bg-slate-100'
                  }`}
                />
              </div>
              
              {/* Current Prompt */}
              <div className="text-sm text-blue-800 italic px-4 py-2 bg-blue-100 rounded">
                "{prompts[currentPrompt]}"
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {sessionState === 'running' ? (
                <Button onClick={handlePause} variant="outline" className="flex-1">
                  <PauseIcon className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={handleResume} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button onClick={handleStop} variant="outline" className="flex-1">
                <StopIcon className="w-4 h-4 mr-2" />
                Complete Early
              </Button>
            </div>
          </>
        )}

        {sessionState === 'completed' && !existingSession && (
          <>
            <div className="text-center space-y-3">
              <CheckCircleIconSolid className="w-12 h-12 text-green-600 mx-auto" />
              <div>
                <div className="font-medium text-green-900">Mindful Minute Complete!</div>
                <div className="text-sm text-green-700">
                  You practiced {formatTime(duration - timeRemaining)} of mindful breathing
                </div>
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-blue-900">How do you feel? (Optional)</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="More centered, calmer, ready for the challenge..."
                className="w-full p-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white resize-none"
                rows={2}
              />
            </div>

            <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Session
            </Button>
          </>
        )}

        {/* Research Note */}
        <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded text-center">
          <ClockIcon className="w-3 h-3 inline mr-1" />
          Brief mindfulness practice improves attention and reduces reactivity
        </div>
      </CardContent>
    </Card>
  );
}
