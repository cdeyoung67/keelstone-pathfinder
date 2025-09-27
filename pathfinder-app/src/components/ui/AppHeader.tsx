'use client';

import Image from 'next/image';
import { ArrowLeftIcon, Bars3Icon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, BookOpenIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import KeelStoneLogo from './KeelStoneLogo';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Separator } from './separator';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useAuth } from '@/contexts/AuthContext';

interface AppHeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
}

export default function AppHeader({ 
  showBackButton = false, 
  onBackClick,
  backButtonText = "Start Over"
}: AppHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-36 bg-card flex-col shadow-large border-r border-border z-40">
        {/* Logo at top */}
        <div className="px-3 py-8 border-b border-border flex justify-center">
          <div className="transform hover:scale-110 transition-all duration-300 hover:drop-shadow-lg">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300">
              <div className="animate-logo-glow">
                <Image
                  src="/TheKeelStone-Txt-Logo-Grey-gradient-BG.png"
                  alt="Keel Stone Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-3 py-8 flex flex-col justify-center">
          {showBackButton && onBackClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-caption text-primary/80 hover:text-primary hover:bg-primary/10 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 focus-ring text-center flex flex-col items-center gap-2 h-auto py-3 px-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-xs leading-tight font-medium">{backButtonText}</span>
            </Button>
          )}
        </div>
        
        {/* User Info Section - Desktop */}
        {isAuthenticated && user && (
          <div className="px-3 py-4 border-t border-border">
            <div className="flex flex-col items-center gap-3">
              {/* User Avatar & Info */}
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-10 h-10 ring-2 ring-selected/50">
                  <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-gradient-to-br from-selected-bg to-selected text-selected-foreground font-semibold text-xs">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xs font-semibold text-primary leading-tight">
                    {user.firstName}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {user.door === 'christian' ? (
                      <HeartIcon className="w-3 h-3 text-red-400" />
                    ) : (
                      <SparklesIcon className="w-3 h-3 text-blue-400" />
                    )}
                    <span className="text-xs text-primary/80 capitalize">{user.door}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col gap-1 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-xs text-sand-200 hover:text-sand-100 hover:bg-navy-800/50 w-full justify-center py-2 rounded-lg transition-all duration-200"
                >
                  <BookOpenIcon className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-sand-200 hover:text-sand-100 hover:bg-navy-800/50 w-full justify-center py-2 rounded-lg transition-all duration-200"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-1" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs text-red-300 hover:text-red-200 hover:bg-red-900/20 w-full justify-center py-2 rounded-lg transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-navy-900 to-navy-800 py-4 px-4 z-50 border-b border-navy-700/50 shadow-large backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="transform hover:scale-105 transition-all duration-300 hover:drop-shadow-md">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-slate-100/10 to-slate-200/5 hover:from-slate-100/20 hover:to-slate-200/10 transition-all duration-300">
              <Image
                src="/TheKeelStone-Txt-Logo-Grey-gradient-BG.png"
                alt="Keel Stone Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
                priority
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile User Info */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 ring-2 ring-gold-200/50">
                  <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="bg-gradient-to-br from-gold-100 to-gold-200 text-gold-800 font-semibold text-xs">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-sand-100 leading-tight">
                    {user.firstName}
                  </p>
                  <div className="flex items-center gap-1">
                    {user.door === 'christian' ? (
                      <HeartIcon className="w-3 h-3 text-red-400" />
                    ) : (
                      <SparklesIcon className="w-3 h-3 text-blue-400" />
                    )}
                    <span className="text-xs text-primary/80 capitalize">{user.door}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sand-200 hover:text-sand-100 hover:bg-navy-800/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft">
                <Bars3Icon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-gradient-to-b from-navy-900 to-navy-800 border-navy-700/50 shadow-2xl">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex justify-center py-8 bg-gradient-to-b from-navy-800/50 to-transparent rounded-b-2xl">
                  <div className="transform hover:scale-110 transition-all duration-300 hover:drop-shadow-lg">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100/10 to-slate-200/5 hover:from-slate-100/20 hover:to-slate-200/10 transition-all duration-300">
                      <Image
                        src="/TheKeelStone-Txt-Logo-Grey-gradient-BG.png"
                        alt="Keel Stone Logo"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-gradient-to-r from-transparent via-navy-600 to-transparent" />
                
                {/* Mobile Navigation */}
                <div className="flex-1 py-8 flex flex-col px-2">
                  {showBackButton && onBackClick && (
                    <Button
                      variant="ghost"
                      onClick={onBackClick}
                      className="text-sand-200 hover:text-sand-100 hover:bg-gradient-to-r hover:from-navy-800/50 hover:to-navy-700/50 justify-start gap-3 mb-6 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                      <span className="font-medium">{backButtonText}</span>
                    </Button>
                  )}
                  
                  {/* User Actions - Mobile */}
                  {isAuthenticated && user && (
                    <div className="space-y-3">
                      <div className="text-center mb-6">
                        <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-gold-200/50">
                          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-gradient-to-br from-gold-100 to-gold-200 text-gold-800 font-semibold">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold text-sand-100">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          {user.door === 'christian' ? (
                            <HeartIcon className="w-4 h-4 text-red-400" />
                          ) : (
                            <SparklesIcon className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-sm text-sand-300 capitalize">{user.door} Path</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/dashboard'}
                        className="text-sand-200 hover:text-sand-100 hover:bg-gradient-to-r hover:from-navy-800/50 hover:to-navy-700/50 justify-start gap-3 w-full py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
                      >
                        <BookOpenIcon className="w-5 h-5" />
                        <span className="font-medium">Dashboard</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="text-sand-200 hover:text-sand-100 hover:bg-gradient-to-r hover:from-navy-800/50 hover:to-navy-700/50 justify-start gap-3 w-full py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="text-red-300 hover:text-red-200 hover:bg-red-900/20 justify-start gap-3 w-full py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                      </Button>
                    </div>
                  )}
                  
                  {!isAuthenticated && (
                    <div className="text-sand-400 text-sm text-center mt-12 p-4 bg-navy-800/30 rounded-xl border border-navy-700/30">
                      <p className="italic">Sign in to access your dashboard</p>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile content spacer */}
      <div className="md:hidden h-20" />
    </>
  );
}
