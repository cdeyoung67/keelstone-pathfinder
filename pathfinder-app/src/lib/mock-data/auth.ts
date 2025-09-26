import { User, LoginCredentials, SignupData, Session } from '@/lib/types-auth';

// Mock Users Database - with persistence
const USERS_KEY = 'keel-stone-mock-users';

// Initial mock users
const initialMockUsers: User[] = [
  {
    id: 'user-123',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    door: 'christian',
    dateJoined: new Date('2024-01-15'),
    lastActive: new Date('2024-02-05'),
    emailNotifications: true,
    weeklyDigest: true,
    communitySharing: true,
    plan: 'free',
    completedPrograms: ['pathfinder-21-day-temperance'],
    currentProgram: 'pathfinder-21-day-wisdom',
    totalQuotes: 10,
    totalTestimonies: 2
  },
  {
    id: 'user-456',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    door: 'secular',
    dateJoined: new Date('2024-01-20'),
    lastActive: new Date('2024-02-04'),
    emailNotifications: true,
    weeklyDigest: false,
    communitySharing: false,
    plan: 'premium',
    planExpires: new Date('2024-08-20'),
    completedPrograms: [],
    currentProgram: 'pathfinder-21-day-courage',
    totalQuotes: 5,
    totalTestimonies: 0
  }
];

// Helper functions for persistent user storage
const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') {
    console.log('getStoredUsers: window undefined, returning initial users');
    return [...initialMockUsers];
  }
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      console.log('getStoredUsers: no stored users, returning initial users');
      return [...initialMockUsers];
    }
    const users = JSON.parse(stored);
    console.log('getStoredUsers: found', users.length, 'stored users');
    return users;
  } catch (error) {
    console.error('getStoredUsers: error parsing users:', error);
    return [...initialMockUsers];
  }
};

const storeUser = (user: User) => {
  console.log('storeUser: storing user:', user.firstName, user.lastName, user.email);
  
  if (typeof window === 'undefined') {
    console.log('storeUser: window undefined, cannot store');
    return;
  }
  try {
    const users = getStoredUsers();
    console.log('storeUser: current users count before update:', users.length);
    
    const updatedUsers = users.filter(u => u.id !== user.id);
    const userToStore = {
      ...user,
      dateJoined: new Date(user.dateJoined),
      lastActive: new Date(user.lastActive),
      planExpires: user.planExpires ? new Date(user.planExpires) : undefined
    };
    updatedUsers.push(userToStore);
    
    console.log('storeUser: storing', updatedUsers.length, 'users');
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    console.log('storeUser: successfully stored user');
  } catch (error) {
    console.error('storeUser: Failed to store user:', error);
  }
};

export const mockUsers = getStoredUsers();

// Mock Sessions Database - stored in localStorage for persistence
const SESSIONS_KEY = 'keel-stone-mock-sessions';

export const mockSessions: Session[] = [];

// Helper functions for persistent session storage
const getStoredSessions = (): Session[] => {
  if (typeof window === 'undefined') {
    console.log('getStoredSessions: window undefined, returning empty array');
    return [];
  }
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    console.log('getStoredSessions: raw stored data:', stored ? stored.substring(0, 100) + '...' : 'null');
    const sessions = stored ? JSON.parse(stored) : [];
    console.log('getStoredSessions: parsed sessions count:', sessions.length);
    return sessions;
  } catch (error) {
    console.error('getStoredSessions: error parsing sessions:', error);
    return [];
  }
};

const storeSession = (session: Session) => {
  console.log('storeSession: storing session for user:', session.userId);
  console.log('storeSession: session token:', session.token.substring(0, 20) + '...');
  
  if (typeof window === 'undefined') {
    console.log('storeSession: window undefined, cannot store');
    return;
  }
  try {
    const sessions = getStoredSessions();
    console.log('storeSession: current sessions count before update:', sessions.length);
    
    const updatedSessions = sessions.filter(s => s.id !== session.id);
    console.log('storeSession: sessions after filtering:', updatedSessions.length);
    
    const sessionToStore = {
      ...session,
      expiresAt: new Date(session.expiresAt),
      createdAt: new Date(session.createdAt),
      lastUsed: new Date(session.lastUsed)
    };
    updatedSessions.push(sessionToStore);
    
    console.log('storeSession: storing', updatedSessions.length, 'sessions');
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    console.log('storeSession: successfully stored session');
  } catch (error) {
    console.error('storeSession: Failed to store session:', error);
  }
};

const removeStoredSession = (sessionId: string) => {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getStoredSessions();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
  } catch (error) {
    console.error('Failed to remove session:', error);
  }
};

// Mock Authentication API
export const mockAuthAPI = {
  async login(credentials: LoginCredentials): Promise<{ user: User; session: Session }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getStoredUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you'd verify the password here
    if (credentials.password.length < 6) {
      throw new Error('Invalid password');
    }
    
    // Create session
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: user.id,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
      lastUsed: new Date(),
      deviceInfo: navigator.userAgent,
      ipAddress: 'mock-ip'
    };
    
    storeSession(session);
    
    // Update last active
    const updatedUser = { ...user, lastActive: new Date() };
    storeUser(updatedUser);
    
    return { user, session };
  },

  async signup(data: SignupData): Promise<{ user: User; session: Session }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if user already exists
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Validate password
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      door: data.door,
      dateJoined: new Date(),
      lastActive: new Date(),
      emailNotifications: true,
      weeklyDigest: data.subscribeToNewsletter || false,
      communitySharing: false,
      plan: 'free',
      completedPrograms: [],
      totalQuotes: 0,
      totalTestimonies: 0
    };
    
    storeUser(newUser);
    
    // Create session
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: newUser.id,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
      lastUsed: new Date(),
      deviceInfo: navigator.userAgent,
      ipAddress: 'mock-ip'
    };
    
    storeSession(session);
    
    return { user: newUser, session };
  },

  async logout(sessionId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeStoredSession(sessionId);
  },

  async refreshToken(refreshToken: string): Promise<{ session: Session }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessions = getStoredSessions();
    const existingSession = sessions.find(s => s.refreshToken === refreshToken);
    if (!existingSession) {
      throw new Error('Invalid refresh token');
    }
    
    // Create new session
    const newSession: Session = {
      ...existingSession,
      id: `session-${Date.now()}`,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastUsed: new Date()
    };
    
    // Remove old session and store new one
    removeStoredSession(existingSession.id);
    storeSession(newSession);
    
    return { session: newSession };
  },

  async validateSession(token: string): Promise<{ user: User; session: Session }> {
    console.log('=== VALIDATE SESSION START ===');
    console.log('Validating token:', token?.substring(0, 20) + '...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const sessions = getStoredSessions();
    console.log('Found stored sessions:', sessions.length);
    console.log('Sessions:', sessions.map(s => ({ id: s.id, token: s.token.substring(0, 20) + '...', userId: s.userId })));
    
    const session = sessions.find(s => s.token === token);
    console.log('Session found for token:', !!session);
    
    if (!session) {
      console.log('ERROR: No session found for token');
      throw new Error('Invalid session token');
    }
    
    // Convert date strings back to Date objects
    const sessionWithDates = {
      ...session,
      expiresAt: new Date(session.expiresAt),
      createdAt: new Date(session.createdAt),
      lastUsed: new Date(session.lastUsed)
    };
    
    console.log('Session expires at:', sessionWithDates.expiresAt);
    console.log('Current time:', new Date());
    console.log('Session expired:', sessionWithDates.expiresAt < new Date());
    
    if (sessionWithDates.expiresAt < new Date()) {
      console.log('ERROR: Session expired');
      throw new Error('Session expired');
    }
    
    const users = getStoredUsers();
    const user = users.find(u => u.id === sessionWithDates.userId);
    console.log('User found for session:', !!user);
    console.log('User details:', user ? { id: user.id, name: user.firstName + ' ' + user.lastName, email: user.email } : 'None');
    
    if (!user) {
      console.log('ERROR: User not found');
      throw new Error('User not found');
    }
    
    // Update last used
    sessionWithDates.lastUsed = new Date();
    const updatedUser = { ...user, lastActive: new Date() };
    
    // Store the updated session and user
    storeSession(sessionWithDates);
    storeUser(updatedUser);
    console.log('Session validation successful');
    console.log('=== VALIDATE SESSION END ===');
    
    return { user, session: sessionWithDates };
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const users = getStoredUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    storeUser(updatedUser);
    return updatedUser;
  },

  async requestPasswordReset(email: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists for security
      console.log('Password reset requested for non-existent user:', email);
    }
    
    // In a real app, you'd send a password reset email
    console.log('Password reset email sent to:', email);
  },

  // Social authentication (mock implementations)
  async loginWithGoogle(): Promise<{ user: User; session: Session }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Google user
    const googleUser: User = {
      id: `google-user-${Date.now()}`,
      email: 'google.user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      door: 'secular',
      dateJoined: new Date(),
      lastActive: new Date(),
      emailNotifications: true,
      weeklyDigest: true,
      communitySharing: false,
      plan: 'free',
      completedPrograms: [],
      totalQuotes: 0,
      totalTestimonies: 0
    };
    
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: googleUser.id,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastUsed: new Date()
    };
    
    storeUser(googleUser);
    storeSession(session);
    
    return { user: googleUser, session };
  },

  async loginWithApple(): Promise<{ user: User; session: Session }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Apple user
    const appleUser: User = {
      id: `apple-user-${Date.now()}`,
      email: 'apple.user@icloud.com',
      firstName: 'Apple',
      lastName: 'User',
      door: 'christian',
      dateJoined: new Date(),
      lastActive: new Date(),
      emailNotifications: true,
      weeklyDigest: true,
      communitySharing: false,
      plan: 'free',
      completedPrograms: [],
      totalQuotes: 0,
      totalTestimonies: 0
    };
    
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: appleUser.id,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastUsed: new Date()
    };
    
    storeUser(appleUser);
    storeSession(session);
    
    return { user: appleUser, session };
  },

  async loginWithMicrosoft(): Promise<{ user: User; session: Session }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Microsoft user
    const microsoftUser: User = {
      id: `microsoft-user-${Date.now()}`,
      email: 'microsoft.user@outlook.com',
      firstName: 'Microsoft',
      lastName: 'User',
      door: 'secular',
      dateJoined: new Date(),
      lastActive: new Date(),
      emailNotifications: true,
      weeklyDigest: true,
      communitySharing: false,
      plan: 'free',
      completedPrograms: [],
      totalQuotes: 0,
      totalTestimonies: 0
    };
    
    const session: Session = {
      id: `session-${Date.now()}`,
      userId: microsoftUser.id,
      token: `token-${Date.now()}`,
      refreshToken: `refresh-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastUsed: new Date()
    };
    
    storeUser(microsoftUser);
    storeSession(session);
    
    return { user: microsoftUser, session };
  }
};

// Local storage helpers for session persistence
export const sessionStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('keel-stone-token');
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('keel-stone-token', token);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('keel-stone-refresh-token');
  },

  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('keel-stone-refresh-token', token);
  },

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('keel-stone-token');
    localStorage.removeItem('keel-stone-refresh-token');
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(USERS_KEY);
  }
};
