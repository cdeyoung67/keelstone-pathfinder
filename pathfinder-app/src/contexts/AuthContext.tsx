'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType, LoginCredentials, SignupData } from '@/lib/types-auth';
import { mockAuthAPI, sessionStorage } from '@/lib/mock-data/auth';

// Auth reducer
type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for existing session
  error: null
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = sessionStorage.getToken();
        if (token) {
          const { user } = await mockAuthAPI.validateSession(token);
          dispatch({ type: 'SET_USER', payload: user });
        }
      } catch (error) {
        // Invalid or expired session
        sessionStorage.clearTokens();
        console.log('Session validation failed:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, session } = await mockAuthAPI.login(credentials);
      
      // Store tokens
      sessionStorage.setToken(session.token);
      sessionStorage.setRefreshToken(session.refreshToken);
      
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (data: SignupData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, session } = await mockAuthAPI.signup(data);
      
      // Store tokens
      sessionStorage.setToken(session.token);
      sessionStorage.setRefreshToken(session.refreshToken);
      
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      const token = sessionStorage.getToken();
      if (token) {
        // Find session ID from token (in a real app, this would be handled differently)
        await mockAuthAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in');
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedUser = await mockAuthAPI.updateProfile(state.user.id, updates);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Update failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, session } = await mockAuthAPI.loginWithGoogle();
      
      sessionStorage.setToken(session.token);
      sessionStorage.setRefreshToken(session.refreshToken);
      
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithApple = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, session } = await mockAuthAPI.loginWithApple();
      
      sessionStorage.setToken(session.token);
      sessionStorage.setRefreshToken(session.refreshToken);
      
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Apple login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, session } = await mockAuthAPI.loginWithMicrosoft();
      
      sessionStorage.setToken(session.token);
      sessionStorage.setRefreshToken(session.refreshToken);
      
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Microsoft login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    signup,
    logout,
    updateProfile,
    loginWithGoogle,
    loginWithApple,
    loginWithMicrosoft,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // In a real app, you might redirect to login or show auth modal
      console.log('Authentication required');
    }
  }, [auth.isAuthenticated, auth.isLoading]);
  
  return auth;
}
