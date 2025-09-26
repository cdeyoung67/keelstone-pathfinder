import { ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import KeelStoneLogo from './KeelStoneLogo';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Separator } from './separator';

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
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-36 bg-gradient-to-b from-navy-900 to-navy-800 flex-col shadow-large border-r border-navy-700/50">
        {/* Logo at top */}
        <div className="px-3 py-8 border-b border-navy-700/50 flex justify-center bg-gradient-to-b from-navy-800/50 to-transparent">
          <div className="transform hover:scale-110 transition-all duration-300 hover:drop-shadow-lg">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sand-100/10 to-sand-200/5 hover:from-sand-100/20 hover:to-sand-200/10 transition-all duration-300">
              <div className="animate-logo-glow">
                <KeelStoneLogo size="lg" priority />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-3 py-8 flex justify-center">
          {showBackButton && onBackClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-caption text-sand-200 hover:text-sand-100 hover:bg-navy-800/50 hover:bg-gradient-to-r hover:from-navy-800/50 hover:to-navy-700/50 focus-ring text-center flex flex-col items-center gap-2 h-auto py-3 px-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-soft"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-xs leading-tight font-medium">{backButtonText}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-navy-900 to-navy-800 py-4 px-4 z-50 border-b border-navy-700/50 shadow-large backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div className="transform hover:scale-105 transition-all duration-300 hover:drop-shadow-md">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-sand-100/10 to-sand-200/5 hover:from-sand-100/20 hover:to-sand-200/10 transition-all duration-300">
              <KeelStoneLogo size="md" priority />
            </div>
          </div>
          
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
                    <div className="p-3 rounded-xl bg-gradient-to-br from-sand-100/10 to-sand-200/5 hover:from-sand-100/20 hover:to-sand-200/10 transition-all duration-300">
                      <KeelStoneLogo size="lg" />
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
                  
                  {/* Future navigation items */}
                  <div className="text-sand-400 text-sm text-center mt-12 p-4 bg-navy-800/30 rounded-xl border border-navy-700/30">
                    <p className="italic">Navigation items will appear here as features expand</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile content spacer */}
      <div className="md:hidden h-20" />
    </>
  );
}
