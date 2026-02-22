'use client';

import { ConvexProvider as ConvexReactProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Create Convex client if URL is available
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexProvider({ children }: { children: ReactNode }) {
  // If Convex is not configured, just render children
  if (!convexClient) {
    console.warn('Convex is not configured. Running in demo mode.');
    return <>{children}</>;
  }

  return (
    <ConvexReactProvider client={convexClient}>
      {children}
    </ConvexReactProvider>
  );
}
