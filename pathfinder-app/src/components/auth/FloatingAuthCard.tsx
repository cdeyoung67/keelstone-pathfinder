'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AuthModal from './AuthModal';
import { 
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BookOpenIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface FloatingAuthCardProps {
  className?: string;
}

export default function FloatingAuthCard({ className = '' }: FloatingAuthCardProps) {
  const { user, isAuthenticated, logout, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show the card after a brief delay to avoid layout shift
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-collapse when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isExpanded && !target.closest('.floating-auth-card')) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsExpanded(true);
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'microsoft') {
        await loginWithMicrosoft();
      }
      
      // Force a page reload to ensure the authentication state is properly updated
      window.location.reload();
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsExpanded(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  // Only hide the card when authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <div 
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 floating-auth-card ${
          isExpanded ? 'transform scale-105' : ''
        } ${className}`}
      >
        <Card className={`card-elevated shadow-2xl border-2 transition-all duration-300 ${
          isAuthenticated 
            ? 'border-gold-200 bg-gradient-to-br from-gold-50 to-sand-50' 
            : 'border-navy-200 bg-gradient-to-br from-navy-50 to-sand-50'
        } ${isMinimized ? 'w-auto' : 'w-auto'}`}>
          <CardContent className="p-0">
            {!isAuthenticated ? (
              // Unauthenticated State
              <div className={`${isMinimized ? 'p-3' : 'p-5'} ${isMinimized ? 'min-w-[80px]' : 'min-w-[320px]'}`}>
                <div className={`flex items-center justify-between ${isMinimized ? 'mb-0' : 'mb-4'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center p-1 shadow-sm">
                      <Image
                        src="/TheKeelStone-Txt-Logo-Grey-gradient-BG.png"
                        alt="Keel Stone Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {!isMinimized && (
                      <div>
                        <p className="text-sm font-semibold text-navy-900">Sign in or create an account</p>
                        <p className="text-xs text-slate-600">Access your personal dashboard</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => setIsMinimized(!isMinimized)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-navy-100 text-navy-600 hover:text-navy-700"
                  >
                    {isMinimized ? (
                      <PlusIcon className="w-4 h-4" />
                    ) : (
                      <MinusIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {!isMinimized && (
                  <>
                    {/* Quick Social Login Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleSocialLogin('google')}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-3 py-2.5 hover:bg-blue-50 border-slate-200"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                      
                      <Button
                        onClick={() => handleSocialLogin('microsoft')}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-3 py-2.5 hover:bg-blue-50 border-slate-200"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#F25022" d="M1 1h10v10H1z"/>
                          <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                          <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                          <path fill="#FFB900" d="M13 13h10v10H13z"/>
                        </svg>
                        Continue with Microsoft
                      </Button>
                    </div>
                    
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-slate-500">or</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      variant="ghost"
                      size="sm"
                      className="w-full text-navy-600 hover:text-navy-700 hover:bg-navy-50"
                    >
                      Sign in with email
                    </Button>
                  </>
                )}
              </div>
            ) : (
              // Authenticated State
              <div>
                {/* Collapsed Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gold-50/50 transition-colors duration-200"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-gold-200">
                        <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="bg-gradient-to-br from-gold-100 to-gold-200 text-gold-800 font-semibold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          {user.door === 'christian' ? (
                            <><HeartIcon className="w-3 h-3" /> Christian Path</>
                          ) : (
                            <><SparklesIcon className="w-3 h-3" /> Secular Path</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {user.totalQuotes} quotes
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.totalTestimonies} testimonies
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUpIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gold-200 bg-gradient-to-b from-gold-25 to-transparent">
                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-b border-gold-100">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-navy-900">{user.totalQuotes}</p>
                          <p className="text-xs text-slate-600">Life Verses</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-navy-900">{user.completedPrograms.length}</p>
                          <p className="text-xs text-slate-600">Completed</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-navy-900">{user.totalTestimonies}</p>
                          <p className="text-xs text-slate-600">Stories</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left hover:bg-gold-100/50"
                        onClick={() => {
                          // Navigate to dashboard
                          window.location.href = '/dashboard';
                        }}
                      >
                        <BookOpenIcon className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Personal Dashboard</p>
                          <p className="text-xs text-slate-500">Quotes, testimonies & progress</p>
                        </div>
                      </Button>

                      {user.currentProgram && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left hover:bg-gold-100/50"
                          onClick={() => {
                            // Navigate to current program
                            window.location.href = '/plan';
                          }}
                        >
                          <SparklesIcon className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Continue Journey</p>
                            <p className="text-xs text-slate-500">Current practice program</p>
                          </div>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left hover:bg-gold-100/50"
                      >
                        <Cog6ToothIcon className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm font-medium">Settings</p>
                          <p className="text-xs text-slate-500">Preferences & notifications</p>
                        </div>
                      </Button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gold-100 p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-left hover:bg-red-50 hover:text-red-700"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
