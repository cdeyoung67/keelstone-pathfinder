'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModalState, User } from '@/lib/types-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import KeelStoneLogo from '@/components/ui/KeelStoneLogo';
import { 
  EyeIcon,
  EyeSlashIcon,
  HeartIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface AuthModalProps {
  isOpen: boolean;
  initialState?: AuthModalState;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}

export default function AuthModal({ 
  isOpen, 
  initialState = 'login', 
  onClose, 
  onSuccess 
}: AuthModalProps) {
  const { login, signup, error, isLoading, clearError, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const [modalState, setModalState] = useState<AuthModalState>(initialState);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    door: 'secular' as 'christian' | 'secular',
    agreeToTerms: false,
    subscribeToNewsletter: true
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(loginData);
      onSuccess?.(null as any); // User will be available in context
      onClose();
      
      // Reload the page to ensure authentication state is updated
      window.location.reload();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (signupData.password !== signupData.confirmPassword) {
      return; // Show error in UI
    }

    if (!signupData.agreeToTerms) {
      return; // Show error in UI
    }

    try {
      await signup({
        email: signupData.email,
        password: signupData.password,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        door: signupData.door,
        agreeToTerms: signupData.agreeToTerms,
        subscribeToNewsletter: signupData.subscribeToNewsletter
      });
      onSuccess?.(null as any); // User will be available in context
      onClose();
      
      // Reload the page to ensure authentication state is updated
      window.location.reload();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft') => {
    clearError();
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'microsoft') {
        await loginWithMicrosoft();
      }
      onSuccess?.(null as any);
      onClose();
      
      // Reload the page to ensure authentication state is updated
      window.location.reload();
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <KeelStoneLogo size="lg" />
          </div>
          <DialogTitle className="text-xl font-serif text-navy-900">
            {modalState === 'login' ? 'Welcome back' : 'Join Keel Stone'}
          </DialogTitle>
          <p className="text-sm text-slate-600">
            {modalState === 'login' 
              ? 'Access your personal dashboard and continue your journey'
              : 'Start your journey to inner steadiness'
            }
          </p>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        <Tabs value={modalState} onValueChange={(value) => setModalState(value as AuthModalState)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <Label htmlFor="login-password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20 pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setModalState('forgot-password')}
                  className="text-sm text-slate-600 hover:text-gold-600 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="signup-firstname" className="text-sm font-medium text-slate-700">
                    First Name
                  </Label>
                  <Input
                    id="signup-firstname"
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                    className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-lastname" className="text-sm font-medium text-slate-700">
                    Last Name
                  </Label>
                  <Input
                    id="signup-lastname"
                    type="text"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Path Selection */}
              <div>
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Choose Your Path
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignupData(prev => ({ ...prev, door: 'christian' }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      signupData.door === 'christian'
                        ? 'border-red-300 bg-red-50'
                        : 'border-sand-300 hover:border-sand-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <HeartIcon className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-sm">Christian</span>
                    </div>
                    <p className="text-xs text-slate-600">Scripture-based practices</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSignupData(prev => ({ ...prev, door: 'secular' }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      signupData.door === 'secular'
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-sand-300 hover:border-sand-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Secular</span>
                    </div>
                    <p className="text-xs text-slate-600">Philosophy & wisdom</p>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    className="bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20 pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
              </div>

              <div>
                <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-700">
                  Confirm Password
                </Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                  className="mt-1 bg-sand-50 border-sand-300 focus:border-gold-500 focus:ring-gold-500/20"
                  required
                  autoComplete="new-password"
                />
                {signupData.password && signupData.confirmPassword && signupData.password !== signupData.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords don't match</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="agree-terms"
                    checked={signupData.agreeToTerms}
                    onCheckedChange={(checked) => setSignupData(prev => ({ ...prev, agreeToTerms: !!checked }))}
                    className="mt-0.5"
                  />
                  <Label htmlFor="agree-terms" className="text-sm text-slate-700 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-gold-600 hover:text-gold-700 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-gold-600 hover:text-gold-700 underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="subscribe-newsletter"
                    checked={signupData.subscribeToNewsletter}
                    onCheckedChange={(checked) => setSignupData(prev => ({ ...prev, subscribeToNewsletter: !!checked }))}
                    className="mt-0.5"
                  />
                  <Label htmlFor="subscribe-newsletter" className="text-sm text-slate-700 leading-relaxed">
                    Send me weekly insights and practice reminders
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !signupData.agreeToTerms || signupData.password !== signupData.confirmPassword}
                className="w-full btn-primary"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Social Login Options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('microsoft')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Microsoft
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
