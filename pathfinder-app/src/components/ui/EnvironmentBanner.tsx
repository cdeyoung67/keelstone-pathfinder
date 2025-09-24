'use client';

import { getEnvironmentBanner, config } from '@/lib/config';

export default function EnvironmentBanner() {
  const banner = getEnvironmentBanner();
  
  if (!banner.show) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium ${banner.className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          {banner.text}
          {config.debugMode && (
            <span className="ml-2">
              • Verbosity: {config.agentVerbosity.toUpperCase()}
              • API: {config.apiBaseUrl}
            </span>
          )}
        </div>
        
        {config.debugMode && (
          <button
            onClick={() => console.log('App Config:', config)}
            className="text-xs opacity-75 hover:opacity-100 underline"
          >
            Debug
          </button>
        )}
      </div>
    </div>
  );
}
