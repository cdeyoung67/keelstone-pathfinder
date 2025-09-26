'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PersonalizedPlan, UserProgress } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Program, CreateProgramRequest } from '@/lib/types-programs';
import { mockProgramAPI } from '@/lib/mock-data/programs';
import {
  BuildingLibraryIcon,
  HeartIcon,
  StarIcon,
  RocketLaunchIcon,
  BookmarkIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  PhotoIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ProgramPreviewProps {
  plan: PersonalizedPlan;
  progress?: UserProgress;
  onStartProgram?: (program: Program) => void;
  onSaveProgram?: (program: Program) => void;
  onClose?: () => void;
  showAuthPrompt?: boolean;
}

export default function ProgramPreview({ 
  plan, 
  progress, 
  onStartProgram, 
  onSaveProgram,
  onClose,
  showAuthPrompt = true
}: ProgramPreviewProps) {
  const { user, isAuthenticated, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const [isCreatingProgram, setIsCreatingProgram] = useState(false);
  const [hasAutoCreated, setHasAutoCreated] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const virtue = plan.virtue;
  const currentDay = (progress?.currentDay || 1);
  const completedDays = progress?.completedDays || [];

  // Auto-create program when user authenticates from campaign flow
  useEffect(() => {
    if (isAuthenticated && user && !hasAutoCreated && showAuthPrompt) {
      handleSaveAndStart();
      setHasAutoCreated(true);
    }
  }, [isAuthenticated, user, hasAutoCreated, showAuthPrompt]);

  const mockExport = (format: 'pdf' | 'png') => {
    alert(`Mock export as ${format.toUpperCase()} - In production, this would generate and download the file`);
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'microsoft') {
        await loginWithMicrosoft();
      }
      
      // The useEffect will handle auto-creating the program when authentication succeeds
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  const handleSaveAndStart = async () => {
    setIsCreatingProgram(true);
    try {
      const createRequest: CreateProgramRequest = {
        type: 'practice',
        title: `21-Day ${virtue.title} Practice`,
        description: virtue.subtitle,
        initialData: { plan }
      };

      const program = await mockProgramAPI.createProgram(createRequest, user?.id);
      
      // Set program to active status
      const startedProgram = await mockProgramAPI.performAction(program.id, 'start');
      
      if (startedProgram) {
        onStartProgram?.(startedProgram);
      }
    } catch (error) {
      console.error('Failed to create and start program:', error);
    } finally {
      setIsCreatingProgram(false);
    }
  };

  const handleSaveForLater = async () => {
    setIsCreatingProgram(true);
    try {
      const createRequest: CreateProgramRequest = {
        type: 'practice',
        title: `21-Day ${virtue.title} Practice`,
        description: virtue.subtitle,
        initialData: { plan }
      };

      const program = await mockProgramAPI.createProgram(createRequest, user?.id);
      onSaveProgram?.(program);
    } catch (error) {
      console.error('Failed to save program:', error);
    } finally {
      setIsCreatingProgram(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Compact Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 rounded-full text-sm font-medium mb-3">
          {plan.door === 'christian' ? (
            <><HeartIcon className="w-4 h-4 mr-1" /> Christian Path</>
          ) : (
            <><BuildingLibraryIcon className="w-4 h-4 mr-1" /> Secular Path</>
          )}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 mb-2">
          Your 21-Day {virtue.title} Practice is Ready!
        </h1>
        <p className="text-slate-600">{virtue.subtitle}</p>
      </div>

      {/* Non-Authenticated: Above-the-fold Account Creation Layout */}
      {!isAuthenticated && showAuthPrompt && (
        <>
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Left: Program Preview */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-navy-900 to-navy-800 border-navy-700 shadow-lg h-full">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <StarIcon className="w-5 h-5 text-gold-400 mr-1" />
                      <span className="text-sm font-medium text-white">Day 1 Preview</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-white leading-tight">
                      {plan.daily[0]?.quote.text.substring(0, 80)}...
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {plan.daily[0]?.quote.reference}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <p className="text-xs text-gray-300">
                        21 days of personalized practices, reflections, and growth
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Primary Account Creation CTA */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-gold-300 bg-gradient-to-br from-gold-50 via-orange-50 to-gold-50 shadow-xl h-full">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RocketLaunchIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gold-900 mb-3">
                      Start Your Journey Today!
                    </h2>
                    <p className="text-gold-800 mb-6">
                      Create your free account to unlock tracking, progress insights, and personalized features.
                    </p>

                    {/* Integrated Auth Buttons */}
                    <div className="space-y-3 mb-6">
                      <Button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 py-3"
                        disabled={isCreatingProgram}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                      <Button
                        onClick={() => handleSocialLogin('microsoft')}
                        className="w-full bg-[#0078d4] text-white hover:bg-[#106ebe] flex items-center justify-center gap-3 py-3"
                        disabled={isCreatingProgram}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                        </svg>
                        Continue with Microsoft
                      </Button>
                    </div>

                    {/* Quick Benefits */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-left">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gold-800">Track Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gold-800">Build Streaks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gold-800">Interactive Features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gold-800">Sync Devices</span>
                      </div>
                    </div>

                    <p className="text-xs text-gold-600">
                      No credit card required • We already have your email
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Secondary Options - Below the fold but still visible */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => mockExport('pdf')}
              className="border-slate-300 text-slate-600"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Just Export PDF
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-slate-500"
            >
              ← Back to Reconfigure
            </Button>
          </div>
        </>
      )}

      {/* Authenticated Actions */}
      {isAuthenticated && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left: Program Preview for authenticated users */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-navy-900 to-navy-800 border-navy-700 shadow-lg h-full">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <StarIcon className="w-5 h-5 text-gold-400 mr-1" />
                    <span className="text-sm font-medium text-white">Day 1 Preview</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-white leading-tight">
                    {plan.daily[0]?.quote.text.substring(0, 80)}...
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {plan.daily[0]?.quote.reference}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-xs text-gray-300">
                      21 days of personalized practices, reflections, and growth
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Action Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RocketLaunchIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 mb-2">Start Program Now</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Begin your 21-day journey immediately and track your daily progress.
                  </p>
                  <Button 
                    onClick={handleSaveAndStart}
                    disabled={isCreatingProgram}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isCreatingProgram ? 'Creating...' : 'Save & Start Day 1'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookmarkIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Save for Later</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Add to your program library and start when you're ready.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleSaveForLater}
                    disabled={isCreatingProgram}
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    {isCreatingProgram ? 'Saving...' : 'Save Program'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overview - Only show if user has actual progress */}
      {progress && completedDays.length > 0 && (
        <Card className="mb-8 bg-gradient-to-br from-white to-sand-50 border-sand-200 shadow-medium">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-serif text-navy-900 mb-2">Progress Overview</CardTitle>
            <CardDescription className="text-slate-600">
              {completedDays.length} of 21 days completed • Day {currentDay} is next
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Visual */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-600 font-medium">Progress</span>
                <span className="text-slate-600 font-medium">
                  {Math.round((completedDays.length / 21) * 100)}%
                </span>
              </div>
              <Progress value={(completedDays.length / 21) * 100} className="h-3 mb-4" />
              
              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 21 }, (_, i) => {
                  const day = i + 1;
                  const isCompleted = completedDays.includes(day);
                  const isCurrent = day === currentDay && !isCompleted;
                  
                  return (
                    <div
                      key={day}
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md ring-2 ring-green-300'
                          : isCurrent
                          ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-md ring-2 ring-gold-300 animate-gentle-pulse'
                          : 'bg-sand-200 text-slate-600 hover:bg-sand-300'
                      }`}
                    >
                      {isCompleted ? '✓' : day}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <div className="flex justify-center space-x-3 mb-8">
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowExportOptions(!showExportOptions)}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
          
          {showExportOptions && (
            <div className="absolute top-full mt-2 left-0 card border border-sand-300 shadow-medium z-10 min-w-max">
              <Button
                variant="ghost"
                onClick={() => mockExport('pdf')}
                className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-t-lg"
              >
                <DocumentArrowDownIcon className="w-4 h-4 inline mr-2" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                onClick={() => mockExport('png')}
                className="block w-full px-4 py-2 text-left text-body hover:bg-sand-200 rounded-b-lg"
              >
                <PhotoIcon className="w-4 h-4 inline mr-2" />
                Save as Image
              </Button>
            </div>
          )}
        </div>

        <Button variant="outline">
          <ShareIcon className="w-4 h-4 mr-2" />
          Share Plan
        </Button>
      </div>

      {/* Footer */}
      <Separator />
      <div className="text-center text-caption space-y-2 pt-6">
        <p>Generated with {plan.version} • Created {plan.createdAt.toLocaleDateString()}</p>
        <p className="text-slate-500 flex items-center justify-center">
          <LockClosedIcon className="w-4 h-4 mr-1" />
          Your data is secure and private
        </p>
      </div>
    </div>
  );
}