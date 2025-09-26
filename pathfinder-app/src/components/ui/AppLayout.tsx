import { ReactNode } from 'react';
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
  className?: string;
}

export default function AppLayout({ 
  children, 
  showBackButton = false, 
  onBackClick,
  backButtonText = "Start Over",
  className = ""
}: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppHeader 
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        backButtonText={backButtonText}
      />
      
      {/* Main Content Area */}
      <div className={`min-h-screen bg-hero md:ml-36 ${className}`}>
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-12 pt-20 md:pt-12">
          {children}
        </div>
      </div>
    </div>
  );
}
