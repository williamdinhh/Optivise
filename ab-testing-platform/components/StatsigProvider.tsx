'use client';

import { ReactNode, useEffect } from 'react';
import { StatsigProvider as StatsigReactProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { StatsigAutoCapturePlugin } from '@statsig/web-analytics';
import { StatsigSessionReplayPlugin } from '@statsig/session-replay';

interface StatsigProviderWrapperProps {
  children: ReactNode;
  userID?: string;
}

export default function StatsigProvider({ children, userID = 'anonymous-user' }: StatsigProviderWrapperProps) {
  const { client } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || '',
    { userID },
    { 
      plugins: [
        new StatsigAutoCapturePlugin(), 
        new StatsigSessionReplayPlugin()
      ] 
    }
  );

  useEffect(() => {
    if (client) {
      console.log('✅ Statsig Client Initialized:', {
        userID,
        sdkKey: process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY?.substring(0, 20) + '...'
      });
      
      // Log a test event to verify connection
      client.logEvent('statsig_initialized', 'test', {
        timestamp: Date.now(),
        userID,
      });
      console.log('📡 Test event sent to Statsig');
    }
  }, [client, userID]);

  return (
    <StatsigReactProvider client={client} loadingComponent={<div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading Statsig...</div></div>}>
      {children}
    </StatsigReactProvider>
  );
}

