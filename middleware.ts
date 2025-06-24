import { NextRequest, NextResponse } from 'next/server';
import { checkSubscriptionStatus } from './app/middleware/subscription-checker';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only check subscription status on login/connect endpoints
  // or when accessing the dashboard for the first time in a session
  if (path === '/connect' || 
      path === '/api/auth/email/connect' || 
      path === '/api/auth/google/callback' || 
      path === '/api/auth/linkedin/callback' ||
      path === '/dashboard') {
    
    // Check and update subscription status if needed
    await checkSubscriptionStatus(request);
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/connect',
    '/dashboard',
    '/api/auth/:path*',
  ],
}; 