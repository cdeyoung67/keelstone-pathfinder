'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import PersonalDashboard from '@/components/personal/shared/PersonalDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/ui/AppLayout';
import { 
  UserIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Show authentication required state
  if (!isAuthenticated || !user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-navy-100 to-navy-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-navy-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-navy-900 mb-2">
                Sign in Required
              </h2>
              <p className="text-slate-600 mb-6">
                Please sign in to access your personal dashboard and continue your journey.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Look for the sign-in card!</p>
                </div>
                <p className="text-sm text-blue-700">
                  Check the bottom-right corner of your screen for the floating authentication card to sign in or create an account.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                <ArrowRightIcon className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Show authenticated dashboard
  return (
    <AppLayout 
      showBackButton={true}
      onBackClick={() => window.location.href = '/'}
      backButtonText="Home"
    >
      <PersonalDashboard />
    </AppLayout>
  );
}
