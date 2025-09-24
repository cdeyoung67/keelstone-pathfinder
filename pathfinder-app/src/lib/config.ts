// Environment Configuration for Multi-Mode Frontend
export interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  useMockData: boolean;
  demoMode: boolean;
  environment: 'demo' | 'development' | 'production';
  
  // Multi-Agent Display Configuration
  agentVerbosity: 'off' | 'low' | 'medium' | 'high';
  debugMode: boolean;
  showTechnicalDetails: boolean;
  
  // Development Features
  enableMultiAgentDisplay: boolean;
  showResponseTimes: boolean;
  showPlanVersions: boolean;
}

// Get configuration from environment variables
export const getAppConfig = (): AppConfig => {
  return {
    // API Configuration
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071/api',
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    environment: (process.env.NEXT_PUBLIC_ENVIRONMENT as any) || 'development',
    
    // Multi-Agent Display Configuration
    agentVerbosity: (process.env.NEXT_PUBLIC_AGENT_VERBOSITY as any) || 'high',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    showTechnicalDetails: process.env.NEXT_PUBLIC_SHOW_TECHNICAL_DETAILS === 'true',
    
    // Development Features
    enableMultiAgentDisplay: process.env.NEXT_PUBLIC_ENABLE_MULTI_AGENT_DISPLAY !== 'false',
    showResponseTimes: process.env.NEXT_PUBLIC_SHOW_RESPONSE_TIMES === 'true',
    showPlanVersions: process.env.NEXT_PUBLIC_SHOW_PLAN_VERSIONS === 'true'
  };
};

// Global config instance
export const config = getAppConfig();

// Helper functions
export const isDemoMode = () => config.demoMode;
export const isDebugMode = () => config.debugMode;
export const shouldUseMockData = () => config.useMockData;
export const getVerbosityLevel = () => config.agentVerbosity;

// Verbosity-aware messaging
export const getVerbosityMessages = () => {
  const level = getVerbosityLevel();
  
  return {
    planGeneration: {
      off: "Creating your personalized journey...",
      low: "AI is crafting your personalized 21-day plan...", 
      medium: "Multiple AI specialists are creating your plan...",
      high: "Multi-agent system generating your personalized plan..."
    },
    agentWork: {
      off: "",
      low: "Analyzing your needs...",
      medium: "Consulting specialized agents...",
      high: "Concierge Agent orchestrating your journey..."
    },
    completion: {
      off: "Your plan is ready!",
      low: "Your personalized journey is complete!",
      medium: "AI specialists have created your plan!",
      high: "Multi-agent system has generated your plan!"
    }
  }[level] || {};
};

// Environment-specific styling
export const getEnvironmentBanner = () => {
  if (config.demoMode) {
    return {
      show: true,
      text: "DEMO MODE - Using Mock Data",
      className: "bg-blue-500 text-white"
    };
  }
  
  if (config.environment === 'development' && config.debugMode) {
    return {
      show: true,
      text: `DEV MODE - ${config.useMockData ? 'Mock' : 'Real'} API`,
      className: "bg-yellow-500 text-black"
    };
  }
  
  return { show: false, text: "", className: "" };
};
