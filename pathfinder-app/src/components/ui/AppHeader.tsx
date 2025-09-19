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
      <div className="hidden md:flex w-32 bg-navy-900 flex-col">
        {/* Logo at top */}
        <div className="px-3 py-6 border-b border-navy-700 flex justify-center">
          <KeelStoneLogo size="md" priority />
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-3 py-6 flex justify-center">
          {showBackButton && onBackClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="text-caption text-sand-200 hover:text-sand-100 hover:bg-navy-800 focus-ring text-center flex flex-col items-center gap-1 h-auto py-2 px-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-xs leading-tight">{backButtonText}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900 py-3 px-4 z-50 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <KeelStoneLogo size="sm" priority />
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sand-200 hover:text-sand-100 hover:bg-navy-800">
                <Bars3Icon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-navy-900 border-navy-700">
              <div className="flex flex-col h-full">
                {/* Mobile Logo */}
                <div className="flex justify-center py-6">
                  <KeelStoneLogo size="md" />
                </div>
                
                <Separator className="bg-navy-700" />
                
                {/* Mobile Navigation */}
                <div className="flex-1 py-6 flex flex-col">
                  {showBackButton && onBackClick && (
                    <Button
                      variant="ghost"
                      onClick={onBackClick}
                      className="text-sand-200 hover:text-sand-100 hover:bg-navy-800 justify-start gap-2 mb-4"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      {backButtonText}
                    </Button>
                  )}
                  
                  {/* Future navigation items */}
                  <div className="text-sand-400 text-sm text-center mt-8">
                    Navigation items will appear here
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile content spacer */}
      <div className="md:hidden h-16" />
    </>
  );
}
